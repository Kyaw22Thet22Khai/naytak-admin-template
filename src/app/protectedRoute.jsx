import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./authContext";
import { ROUTES } from "./routes";

/**
 * Gate for the admin shell. Signed-out visitors are sent to the sign-in screen,
 * and the path they asked for rides along in location.state.from so LoginPage
 * can return them there instead of dumping everyone on the dashboard.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    );
  }
  return <Outlet />;
}

/**
 * Inverse of ProtectedRoute: keeps an already signed-in user off the sign-in
 * and register screens.
 */
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to={ROUTES.dashboard} replace />;
  return <Outlet />;
}
