import {
  IconLayoutDashboard,
  IconBarChart,
  IconUserRound,
  IconShoppingCart,
  IconPackage,
  IconFileText,
  IconCalendar,
  IconMail,
  IconClipboardList,
  IconFolder,
  IconImage,
  IconUsers,
  IconSettings,
  IconComponent,
} from "naytak-react-ui";

/**
 * Central route registry.
 * Add new paths here and register the page in app/router.js.
 */
export const ROUTES = {
  /** Public landing page — the entry point shown before the admin shell. */
  landing: "/",
  dashboard: "/dashboard",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  profile: "/profile",
  analytics: "/analytics",
  customers: "/customers",
  orders: "/orders",
  products: "/products",
  invoices: "/invoices",
  calendar: "/calendar",
  messages: "/messages",
  tasks: "/tasks",
  projects: "/projects",
  media: "/media",
  users: "/users",
  settings: "/settings",
  components: "/components",
};

/**
 * Paths people reasonably guess at, mapped to the real route.
 *
 * The landing page lives at "/" and has no name of its own, so "/landing" —
 * the obvious guess, and the name of its feature folder — used to 404. These
 * redirect rather than render a second copy, so each page keeps one canonical
 * URL that is safe to share.
 */
export const ROUTE_ALIASES = {
  "/landing": ROUTES.landing,
  "/home": ROUTES.landing,
  "/index": ROUTES.landing,
  "/sign-in": ROUTES.login,
  "/signin": ROUTES.login,
  "/sign-up": ROUTES.register,
  "/signup": ROUTES.register,
};

/**
 * Sidebar navigation items — the AdminLayout sidebar is generated from this.
 * `icon` is a naytak-react-ui icon component.
 *
 * To add a new section:
 *   1. add a route above, e.g. users: '/users'
 *   2. add a nav item here, e.g. { key: 'users', label: 'Users', path: ROUTES.users, icon: IconUsers }
 *   3. create src/features/users/UsersPage.js and register it in app/router.js
 */
export const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: ROUTES.dashboard,
    icon: IconLayoutDashboard,
  },
  {
    key: "analytics",
    label: "Analytics",
    path: ROUTES.analytics,
    icon: IconBarChart,
  },
  {
    key: "customers",
    label: "Customers",
    path: ROUTES.customers,
    icon: IconUserRound,
  },
  {
    key: "orders",
    label: "Orders",
    path: ROUTES.orders,
    icon: IconShoppingCart,
  },
  {
    key: "products",
    label: "Products",
    path: ROUTES.products,
    icon: IconPackage,
  },
  {
    key: "invoices",
    label: "Invoices",
    path: ROUTES.invoices,
    icon: IconFileText,
  },
  {
    key: "calendar",
    label: "Calendar",
    path: ROUTES.calendar,
    icon: IconCalendar,
  },
  {
    key: "messages",
    label: "Messages",
    path: ROUTES.messages,
    icon: IconMail,
  },
  {
    key: "tasks",
    label: "Tasks",
    path: ROUTES.tasks,
    icon: IconClipboardList,
  },
  {
    key: "projects",
    label: "Projects",
    path: ROUTES.projects,
    icon: IconFolder,
  },
  {
    key: "media",
    label: "Media",
    path: ROUTES.media,
    icon: IconImage,
  },
  {
    key: "users",
    label: "Users",
    path: ROUTES.users,
    icon: IconUsers,
  },
  {
    key: "components",
    label: "Components",
    path: ROUTES.components,
    icon: IconComponent,
  },
  {
    key: "settings",
    label: "Settings",
    path: ROUTES.settings,
    icon: IconSettings,
  },
];
