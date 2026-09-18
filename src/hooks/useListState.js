import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Orders rows by one field. Numbers compare numerically; everything else uses
 * a locale compare that is case-insensitive and handles embedded digits, so
 * "item 2" sorts before "item 10". Missing values sink to the bottom.
 */
function sortRows(rows, sortKey, sortDir) {
  if (!sortKey) return rows;
  const direction = sortDir === "desc" ? -1 : 1;
  // Copy first: Array.prototype.sort mutates, and callers pass memoized arrays.
  return [...rows].sort((a, b) => {
    const left = a[sortKey];
    const right = b[sortKey];
    if (left === right) return 0;
    if (left === undefined || left === null) return 1;
    if (right === undefined || right === null) return -1;
    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * direction;
    }
    return (
      String(left).localeCompare(String(right), undefined, {
        numeric: true,
        sensitivity: "base",
      }) * direction
    );
  });
}

/**
 * Everything a list page needs: search, filters, sorting and pagination —
 * all mirrored into the URL.
 *
 * Putting the state in the query string is what makes a filtered view
 * shareable, restores it when the user presses Back, and keeps it alive across
 * navigation (the page unmounts, the URL does not).
 *
 * Search and filters are **submitted**, not live: this hook only ever exposes
 * the values currently applied, and `apply()` commits a whole draft at once.
 * ListToolbar holds the in-progress draft and calls `apply` on submit. Sorting
 * and paging are deliberately immediate — they are view controls rather than
 * part of the query being asked.
 *
 * `searchKeys` and `filters` must be stable references — declare them as
 * module-level constants in the page, not inline object literals, or the
 * memoized filtering below re-runs on every render.
 *
 * @param items      the full collection to display
 * @param searchKeys record fields the search box matches against
 * @param filters    `{ paramName: (item, value) => boolean }` predicates
 * @param sortKeys   sortable fields; the first is the default column
 * @param pageSize   rows per page
 */
export function useListState({
  items,
  searchKeys = [],
  filters = {},
  sortKeys = [],
  pageSize = 8,
  defaultSort = null,
}) {
  const [params, setParams] = useSearchParams();

  // One primitive that changes whenever any search/filter/sort/page value does.
  const paramsKey = params.toString();

  const query = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("page") ?? 1) || 1);
  const sortKey = params.get("sort") ?? defaultSort ?? sortKeys[0] ?? null;
  const sortDir = params.get("dir") === "desc" ? "desc" : "asc";

  /**
   * Writes params without stacking history entries for every keystroke, so
   * one Back press leaves the page instead of replaying each letter typed.
   */
  const patchParams = useCallback(
    (changes, { resetPage = true, replace = true } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === undefined || value === "") {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          }
          if (resetPage) next.delete("page");
          return next;
        },
        { replace },
      );
    },
    [setParams],
  );

  /* ---- filters ---- */

  const filterValues = useMemo(() => {
    const search = new URLSearchParams(paramsKey);
    const values = {};
    for (const name of Object.keys(filters)) {
      values[name] = search.get(name) ?? "all";
    }
    return values;
  }, [paramsKey, filters]);

  /**
   * Commits a draft of the search term and filter values in one go, and
   * returns to page 1 — the page you were on rarely exists in the new result
   * set. Called by ListToolbar when the user presses Search.
   *
   * `draft` is `{ q, <filterName>: value, … }`; "all" clears a filter.
   */
  const apply = useCallback(
    (draft) => {
      const changes = { q: draft.q ?? "" };
      for (const name of Object.keys(filters)) {
        const value = draft[name];
        changes[name] = !value || value === "all" ? null : value;
      }
      patchParams(changes);
    },
    [filters, patchParams],
  );

  /* ---- sorting ---- */

  /** Sets column and direction outright (used by a sort dropdown). */
  const setSort = useCallback(
    (key, direction = "asc") => patchParams({ sort: key, dir: direction }),
    [patchParams],
  );

  /** Sorts by a column, flipping direction when it is already the active one. */
  const toggleSort = useCallback(
    (key) =>
      setSort(key, sortKey === key && sortDir === "asc" ? "desc" : "asc"),
    [setSort, sortKey, sortDir],
  );

  const setPage = useCallback(
    (value) => patchParams({ page: value }, { resetPage: false }),
    [patchParams],
  );

  const clearAll = useCallback(
    () => setParams(new URLSearchParams(), { replace: true }),
    [setParams],
  );

  /**
   * Brings one record into view after it is created or edited.
   *
   * Without this, a new record silently lands wherever the active sort puts
   * it — often on another page, behind a filter that excludes it — and the
   * user is left wondering whether the save worked. Clearing the search and
   * filters guarantees the record is in the list; the page is then set to
   * wherever the current sort puts it.
   */
  const revealItem = useCallback(
    (record) => {
      // `items` is still the pre-save array on this tick, so fold the record
      // in (replacing it if this was an edit) to find where it will land.
      const withRecord = [
        ...items.filter((item) => item.id !== record.id),
        record,
      ];
      const index = sortRows(withRecord, sortKey, sortDir).findIndex(
        (item) => item.id === record.id,
      );

      // Keep the sort, drop everything that could hide the record.
      const next = new URLSearchParams();
      if (sortKey) next.set("sort", sortKey);
      if (sortDir === "desc") next.set("dir", "desc");
      const targetPage = index >= 0 ? Math.floor(index / pageSize) + 1 : 1;
      if (targetPage > 1) next.set("page", String(targetPage));

      setParams(next, { replace: true });
    },
    [items, pageSize, setParams, sortDir, sortKey],
  );

  /* ---- derive the visible rows ---- */

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !needle ||
        searchKeys.some((key) =>
          String(item[key] ?? "")
            .toLowerCase()
            .includes(needle),
        );
      if (!matchesQuery) return false;

      return Object.entries(filters).every(([name, predicate]) => {
        const value = filterValues[name];
        return value === "all" || predicate(item, value);
      });
    });
  }, [items, query, filterValues, searchKeys, filters]);

  const sorted = useMemo(
    () => sortRows(filtered, sortKey, sortDir),
    [filtered, sortKey, sortDir],
  );

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  // A deletion or a new filter can strand the user past the last page.
  const currentPage = Math.min(page, pageCount);
  const visible = useMemo(
    () => sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sorted, currentPage, pageSize],
  );

  const hasActiveFilters =
    query !== "" ||
    Object.values(filterValues).some((value) => value !== "all");

  return {
    /** The search term currently applied (not what is typed in the box). */
    query,
    /** Filter values currently applied, keyed by filter name. */
    filterValues,
    /** Commits a draft of query + filters. See the note above. */
    apply,
    sortKey,
    sortDir,
    setSort,
    toggleSort,
    page: currentPage,
    pageCount,
    pageSize,
    setPage,
    /** How many rows match the current search and filters. */
    total: sorted.length,
    /** How many rows exist in total, before any filtering. */
    totalAll: items.length,
    results: sorted,
    visible,
    hasActiveFilters,
    clearAll,
    revealItem,
  };
}
