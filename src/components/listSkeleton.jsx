import { Card, Grid, GridItem, Skeleton, Stack } from "naytak-react-ui";

/**
 * Placeholder shapes shown while a list is loading.
 *
 * This template's data is local, so nothing is slow enough to need them today.
 * They exist because the moment someone swaps `DataProvider` for a real API,
 * every list page needs a loading state — and a template that skips it teaches
 * the wrong pattern. Render them from `collection.isLoading` once you have one.
 */
export function TableSkeleton({ rows = 6, columns = 5 }) {
  return (
    <div className="skeleton-table" aria-hidden="true">
      <div className="skeleton-table__row skeleton-table__row--head">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} height={12} width={i === 0 ? "60%" : "45%"} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div className="skeleton-table__row" key={row}>
          {Array.from({ length: columns }, (_, col) => (
            <Skeleton
              key={col}
              height={14}
              // Varying widths stop the block reading as a solid grey slab.
              width={col === 0 ? "80%" : `${50 + ((row + col) % 4) * 10}%`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Card-grid equivalent, for pages like Products and Projects. */
export function CardGridSkeleton({ count = 6 }) {
  return (
    <Grid container fluid aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <GridItem key={i} xs={12} sm={6} lg={4} spacing={2} className="mb-2">
          <Card className="h-100">
            <Stack direction="row" spacing={12}>
              <Skeleton variant="rectangular" width={48} height={48} />
              <Stack direction="column" spacing={8} style={{ flex: 1 }}>
                <Skeleton height={14} width="70%" />
                <Skeleton height={12} width="40%" />
                <Skeleton height={20} width="55%" />
              </Stack>
            </Stack>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );
}

/** Stat-card row for the dashboard. */
export function StatsSkeleton({ count = 4 }) {
  return (
    <Grid container fluid aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <GridItem key={i} xs={12} sm={6} lg={3} spacing={2}>
          <Card className="h-100">
            <Stack direction="row" spacing={12} align="center">
              <Skeleton variant="rectangular" width={40} height={40} />
              <Stack direction="column" spacing={8} style={{ flex: 1 }}>
                <Skeleton height={10} width="50%" />
                <Skeleton height={22} width="70%" />
              </Stack>
            </Stack>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );
}

/**
 * Fallback for a lazily loaded page, shown inside the admin shell.
 *
 * Because the Suspense boundary lives around the <Outlet /> rather than above
 * AdminLayout, the sidebar, navbar and breadcrumb stay put while the next
 * page's chunk arrives — only the content area fills in. A boundary above the
 * shell made the whole frame blink out on every navigation.
 */
export function PageSkeleton() {
  return (
    <div className="page-skeleton">
      <LoadingAnnouncer label="Loading page" />
      <div aria-hidden="true">
        <Stack direction="column" spacing={8} className="mb-3">
          <Skeleton height={24} width={180} />
          <Skeleton height={12} width={260} />
        </Stack>
        <Card>
          <Stack direction="row" spacing={8} wrap className="mb-3">
            <Skeleton height={36} width={220} />
            <Skeleton height={36} width={140} />
          </Stack>
          <TableSkeleton rows={6} columns={5} />
        </Card>
      </div>
    </div>
  );
}

/**
 * Announces loading to assistive tech. The shapes above are decorative, so
 * they are hidden from the accessibility tree and this carries the message.
 */
export function LoadingAnnouncer({ label = "Loading" }) {
  return (
    <span className="sr-only" role="status" aria-live="polite">
      {label}
    </span>
  );
}
