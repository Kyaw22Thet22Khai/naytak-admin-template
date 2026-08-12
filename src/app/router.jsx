import { HashRouter, Routes, Route } from "react-router-dom";
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

export function AppRouter() {
  return (
    <HashRouter>
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
        </Route>
      </Routes>
    </HashRouter>
  );
}
