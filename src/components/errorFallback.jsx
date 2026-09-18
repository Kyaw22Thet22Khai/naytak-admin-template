import {
  Button,
  EmptyState,
  IconAlertTriangle,
  IconRefreshCw,
  Stack,
} from "naytak-react-ui";

/**
 * What <ErrorBoundary> renders when a page below it throws. Offers a retry
 * (re-mounts the subtree) and a way out of the broken page.
 */
export function ErrorFallback({ error, retry, onGoBack }) {
  return (
    <div className="error-fallback">
      <EmptyState
        icon={<IconAlertTriangle size={28} />}
        title="Something went wrong on this page"
        description={
          error?.message
            ? `${error.message} — retrying usually clears it.`
            : "An unexpected error stopped this page from rendering."
        }
        action={
          <Stack direction="row" spacing={8} wrap justify="center">
            <Button
              size="sm"
              leftIcon={<IconRefreshCw size={16} />}
              onClick={retry}>
              Try again
            </Button>
            {onGoBack && (
              <Button size="sm" variant="ghost" onClick={onGoBack}>
                Back to dashboard
              </Button>
            )}
          </Stack>
        }
      />
    </div>
  );
}
