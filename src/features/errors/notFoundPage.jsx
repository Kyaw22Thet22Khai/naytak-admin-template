import { Link, useLocation } from "react-router-dom";
import {
  Button,
  EmptyState,
  IconArrowLeft,
  IconCompass,
  Stack,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useAuth } from "../../app/authContext";
import { ROUTES } from "../../app/routes";

/**
 * Catch-all route. Renders standalone (outside the admin shell) so it also
 * covers unknown public paths, and points signed-in users back at the
 * dashboard while sending everyone else to the landing page.
 */
export function NotFoundPage() {
  useDocumentTitle("Page not found");
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const homeRoute = isAuthenticated ? ROUTES.dashboard : ROUTES.landing;
  const homeLabel = isAuthenticated ? "Back to dashboard" : "Back to home";

  return (
    <div className="route-error">
      <EmptyState
        size="lg"
        icon={<IconCompass size={32} />}
        title="404 — page not found"
        description={`No page is registered at "${location.pathname}".`}
        action={
          <Stack direction="row" spacing={8} wrap justify="center">
            <Button
              as={Link}
              to={homeRoute}
              leftIcon={<IconArrowLeft size={16} />}>
              {homeLabel}
            </Button>
            {/* A signed-out visitor who mistyped an admin URL needs a way in,
                not just a way back. */}
            {!isAuthenticated && (
              <Button as={Link} to={ROUTES.login} variant="ghost">
                Sign in
              </Button>
            )}
          </Stack>
        }
      />
    </div>
  );
}
