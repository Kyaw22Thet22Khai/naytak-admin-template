import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { NaytakLoader } from "../components/naytakLoader";
import { ErrorBoundary } from "../components/errorBoundary";
import { ErrorFallback } from "../components/errorFallback";
import { AdminLayout } from "../layouts/adminLayout";
import { ProtectedRoute, PublicOnlyRoute } from "./protectedRoute";
import { ROUTE_ALIASES } from "./routes";

/**
 * Wraps a feature barrel's named export as a lazy default export.
 * Every page is code-split, so the initial bundle carries only the shell.
 */
const page = (loader, name) =>
  lazy(() => loader().then((module) => ({ default: module[name] })));

const LandingPage = page(() => import("../features/landing"), "LandingPage");
const LoginPage = page(() => import("../features/auth"), "LoginPage");
const RegisterPage = page(() => import("../features/auth"), "RegisterPage");
const ForgotPasswordPage = page(
  () => import("../features/auth"),
  "ForgotPasswordPage",
);
const NotFoundPage = page(() => import("../features/errors"), "NotFoundPage");

const DashboardPage = page(
  () => import("../features/dashboard"),
  "DashboardPage",
);
const AnalyticsPage = page(
  () => import("../features/analytics"),
  "AnalyticsPage",
);
const CustomersPage = page(
  () => import("../features/customers"),
  "CustomersPage",
);
const OrdersPage = page(() => import("../features/orders"), "OrdersPage");
const ProductsPage = page(() => import("../features/products"), "ProductsPage");
const InvoicesPage = page(() => import("../features/invoices"), "InvoicesPage");
const CalendarPage = page(() => import("../features/calendar"), "CalendarPage");
const MessagesPage = page(() => import("../features/messages"), "MessagesPage");
const TasksPage = page(() => import("../features/tasks"), "TasksPage");
const ProjectsPage = page(() => import("../features/projects"), "ProjectsPage");
const MediaPage = page(() => import("../features/media"), "MediaPage");
const UsersPage = page(() => import("../features/users"), "UsersPage");
const SettingsPage = page(() => import("../features/settings"), "SettingsPage");
const ProfilePage = page(() => import("../features/profile"), "ProfilePage");
const ComponentsPage = page(
  () => import("../features/components"),
  "ComponentsPage",
);

/**
 * The app uses browser (history) routing without a "#". Vite's BASE_URL is the
 * `base` from vite.config plus the deploy sub-path, so this works unchanged for
 * anyone who forks the template and deploys under a different name.
 */
const ROUTER_BASENAME =
  import.meta.env.BASE_URL === "./" ? "/" : import.meta.env.BASE_URL;

/**
 * Error boundary + Suspense that reset whenever the path changes, so a page
 * that failed or was mid-load does not stay stuck after the user navigates.
 */
function RouteFrame({ children }) {
  const location = useLocation();
  return (
    <ErrorBoundary
      resetKey={location.pathname}
      fallback={({ error, retry }) => (
        <ErrorFallback error={error} retry={retry} />
      )}>
      <Suspense fallback={<NaytakLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <RouteFrame>
        <Routes>
          {/* Landing renders standalone — the entry point before the shell. */}
          <Route index element={<LandingPage />} />

          {/* Auth screens redirect away if a session already exists. */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Everything below requires a session. AdminLayout provides the
              sidebar/navbar shell; pages render into its <Outlet />. */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="components" element={<ComponentsPage />} />
            </Route>
          </Route>

          {/* Guessable spellings redirect to the canonical path, so a URL
              like /landing reaches the page instead of the 404. */}
          {Object.entries(ROUTE_ALIASES).map(([alias, target]) => (
            <Route
              key={alias}
              path={alias}
              element={<Navigate to={target} replace />}
            />
          ))}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </RouteFrame>
    </BrowserRouter>
  );
}
