import { useState } from "react";
import {
  Button,
  IconArrowDown,
  IconArrowUp,
  IconArrowUpDown,
  IconClose,
  IconSearch,
  SearchInput,
  Select,
  Stack,
} from "naytak-react-ui";

/** The draft a fresh form starts from: whatever is currently applied. */
function draftFrom(list) {
  return { q: list.query, ...list.filterValues };
}

/**
 * Search box + filter selects + a Search button for a list page.
 *
 * Filtering is **submitted, not live**: typing or picking a filter only edits
 * a local draft, and nothing is re-filtered until the user presses Search or
 * hits Enter in the box. That keeps the results still while a query is being
 * composed — with two or three filters, live updating means the list churns
 * under you between each choice — and it makes one clear moment where the URL,
 * the results and the page number all change together.
 *
 * Sorting (passed in as `children`) stays immediate: it re-orders what you are
 * already looking at rather than changing what you asked for.
 */
export function ListToolbar({
  list,
  searchPlaceholder,
  filters = [],
  children,
}) {
  const [draft, setDraft] = useState(() => draftFrom(list));

  // Resync when the applied values change from outside this form — Back and
  // Forward, the Clear button, or revealItem() after a save. Adjusting during
  // render (rather than in an effect) is React's documented way to derive state
  // from props: https://react.dev/learn/you-might-not-need-an-effect
  const appliedKey = JSON.stringify(draftFrom(list));
  const [syncedTo, setSyncedTo] = useState(appliedKey);
  if (syncedTo !== appliedKey) {
    setSyncedTo(appliedKey);
    setDraft(draftFrom(list));
  }

  // True while the form shows something the results do not yet reflect.
  const isDirty = JSON.stringify(draft) !== appliedKey;

  const setField = (name, value) =>
    setDraft((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    list.apply(draft);
  };

  const handleClear = () => {
    // Clearing is itself an explicit action, so it applies straight away.
    setDraft({
      q: "",
      ...Object.fromEntries(filters.map((filter) => [filter.name, "all"])),
    });
    list.clearAll();
  };

  return (
    <form
      className="list-toolbar"
      role="search"
      // Distinct from the input's own label: the landmark and the field
      // should not answer to the same name.
      aria-label="Search and filter"
      onSubmit={handleSubmit}>
      <Stack direction="row" spacing={8} wrap align="center">
        <SearchInput
          placeholder={searchPlaceholder}
          clearable
          value={draft.q}
          onChange={(value) => setField("q", value)}
          aria-label={searchPlaceholder}
        />

        {filters.map((filter) => (
          <Select
            key={filter.name}
            aria-label={filter.label}
            value={draft[filter.name] ?? "all"}
            onChange={(event) => setField(filter.name, event.target.value)}
            options={filter.options}
          />
        ))}

        <Button type="submit" size="md" leftIcon={<IconSearch size={16} />}>
          Search
        </Button>

        {(list.hasActiveFilters || isDirty) && (
          <Button
            type="button"
            size="md"
            variant="ghost"
            leftIcon={<IconClose size={16} />}
            onClick={handleClear}>
            Clear
          </Button>
        )}

        {/* Sort controls and anything else the page adds. */}
        {children}

        {isDirty && (
          <span className="list-toolbar__hint" role="status" aria-live="polite">
            Press Search to apply
          </span>
        )}
      </Stack>
    </form>
  );
}

/**
 * Table header cell that sorts the list on click.
 * Renders a real <button> so it is reachable by keyboard, and exposes
 * aria-sort so screen readers announce the current order.
 */
export function SortableTh({ list, field, children, align = "left" }) {
  const active = list.sortKey === field;
  const ariaSort = active
    ? list.sortDir === "asc"
      ? "ascending"
      : "descending"
    : "none";

  const Icon = !active
    ? IconArrowUpDown
    : list.sortDir === "asc"
      ? IconArrowUp
      : IconArrowDown;

  return (
    <th scope="col" aria-sort={ariaSort} style={{ textAlign: align }}>
      <button
        type="button"
        className={`sort-th ${active ? "sort-th--active" : ""}`}
        onClick={() => list.toggleSort(field)}>
        <span>{children}</span>
        <Icon size={14} aria-hidden="true" />
      </button>
    </th>
  );
}
