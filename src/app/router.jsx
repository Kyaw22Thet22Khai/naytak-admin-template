import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NaytakLoader } from "../components/naytakLoader";
import { AdminLayout } from "../layouts/adminLayout";
import { DashboardPage } from "../features/dashboard";
import { AnalyticsPage } from "../features/analytics";
import { CustomersPage } from "../features/customers";
import { OrdersPage } from "../features/orders";
import { ProductsPage } from "../features/products";
import { InvoicesPage } from "../features/invoices";
import { CalendarPage } from "../features/calendar";
import { UsersPage } from "../features/users";
import { SettingsPage } from "../features/settings";
import { MessagesPage } from "../features/messages";
import { TasksPage } from "../features/tasks";
import { ProjectsPage } from "../features/projects";
import { MediaPage } from "../features/media";
import { LoginPage } from "../features/auth";
import { RegisterPage } from "../features/auth";

// The Components showcase imports many chart components, so it is lazy-loaded
// to keep the initial bundle lean (it loads only when visited).
const ComponentsPage = lazy(() =>
  import("../features/components").then((module) => ({
    default: module.ComponentsPage,
  })),
);

// The app uses browser (history) routing without a "#". On GitHub Pages the
// site is hosted under /naytak-admin-template/, so the router needs that
// basename there; in dev / local preview it runs at the root.
const ROUTER_BASENAME =
  import.meta.env.PROD &&
  typeof window !== "undefined" &&
  window.location.hostname === "kyaw22thet22khai.github.io"
    ? "/naytak-admin-template/"
    : "/";

export function AppRouter() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <Suspense fallback={<NaytakLoader />}>
        <Routes>
          {/* Auth pages render standalone (no sidebar/navbar). */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* AdminLayout renders the sidebar/navbar shell; pages render via <Outlet /> */}
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
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
            <Route path="components" element={<ComponentsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
