import { Button, EmptyState, Pagination, Stack } from "naytak-react-ui";
import { withNote } from "./titleNote";

/**
 * Card heading for a list, with the count folded in: "All orders (12 of 20)".
 * Uses the same helper as every other title in the app, so the formatting
 * lives in exactly one place.
 */
export function listTitle(label, list) {
  return withNote(label, `${list.total} of ${list.totalAll}`);
}

/**
 * Page controls plus a "showing x–y of n" count.
 * Renders nothing when everything already fits on one page.
 */
export function ListPagination({ list, noun = "item" }) {
  if (list.total === 0) return null;

  const start = (list.page - 1) * list.pageSize + 1;
  const end = start + list.visible.length - 1;

  return (
    <Stack
      direction="row"
      justify="space-between"
      align="center"
      wrap
      spacing={12}
      className="list-pagination">
      <span className="list-meta" aria-live="polite">
        Showing {start}–{end} of {list.total} {noun}
        {list.total === 1 ? "" : "s"}
      </span>
      {list.pageCount > 1 && (
        <Pagination
          currentPage={list.page}
          totalPages={list.pageCount}
          onPageChange={list.setPage}
        />
      )}
    </Stack>
  );
}

/**
 * The empty state for a list.
 *
 * Distinguishes "your filters matched nothing" — which needs a way to clear
 * them — from "there is genuinely nothing here yet", which needs a create
 * action. Showing the same message for both is what makes a first run feel
 * broken rather than new.
 */
export function ListEmptyState({
  list,
  icon,
  noun = "item",
  onCreate,
  createLabel,
}) {
  if (list.hasActiveFilters) {
    return (
      <EmptyState
        icon={icon}
        title={`No ${noun}s match your filters`}
        description={
          list.query
            ? `Nothing matched “${list.query}”. Try a different term or clear the filters.`
            : "Try a different filter combination."
        }
        action={
          <Button size="sm" variant="ghost" onClick={list.clearAll}>
            Clear filters
          </Button>
        }
      />
    );
  }

  return (
    <EmptyState
      icon={icon}
      title={`No ${noun}s yet`}
      description={`Once you add your first ${noun}, it will show up here.`}
      action={
        onCreate && (
          <Button size="sm" onClick={onCreate}>
            {createLabel ?? `Add ${noun}`}
          </Button>
        )
      }
    />
  );
}
