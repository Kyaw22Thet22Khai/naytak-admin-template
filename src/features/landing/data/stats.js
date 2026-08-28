import {
  IconBarChart,
  IconCalendar,
  IconClipboardList,
  IconComponent,
  IconDatabase,
  IconFileText,
  IconFolder,
  IconGrid,
  IconImage,
  IconLayoutDashboard,
  IconMail,
  IconMoon,
  IconPackage,
  IconSettings,
  IconShoppingCart,
  IconUserRound,
  IconUsers,
} from "naytak-react-ui";
import { ROUTES } from "../../../app/routes";

/**
 * Template analysis data shown on the landing page.
 * These figures were derived by scanning the codebase:
 *  - module/page counts come from app routes + the features folder
 *  - sample-record counts come from each module's data mock file
 *  - icon / component counts come from the naytak-react-ui package
 */

/** Headline numbers for the stats band. */
export const TEMPLATE_STATS = [
  {
    id: "modules",
    label: "Ready-made modules",
    value: 14,
    note: "dashboard, orders, users…",
    icon: IconLayoutDashboard,
    color: "primary",
  },
  {
    id: "records",
    label: "Sample records",
    value: 153,
    note: "mock data across modules",
    icon: IconDatabase,
    color: "success",
  },
  {
    id: "icons",
    label: "UI icons",
    value: 640,
    note: "thin-stroke outline set",
    icon: IconGrid,
    color: "info",
  },
  {
    id: "components",
    label: "UI components",
    value: 85,
    note: "buttons, tables, charts…",
    icon: IconComponent,
    color: "warning",
  },
  {
    id: "charts",
    label: "Chart types",
    value: 10,
    note: "line, bar, pie, funnel…",
    icon: IconBarChart,
    color: "danger",
  },
  {
    id: "themes",
    label: "Color themes",
    value: 2,
    note: "light & dark mode",
    icon: IconMoon,
    color: "primary",
  },
];

/** Every admin module, linking straight into the app. */
export const MODULES = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: ROUTES.dashboard,
    icon: IconLayoutDashboard,
    description: "Live KPIs, revenue chart, traffic and activity feed.",
  },
  {
    key: "analytics",
    label: "Analytics",
    path: ROUTES.analytics,
    icon: IconBarChart,
    description: "Visitors, sessions, funnels and regional sales.",
  },
  {
    key: "customers",
    label: "Customers",
    path: ROUTES.customers,
    icon: IconUserRound,
    description: "Searchable customer list with segments & spending.",
  },
  {
    key: "orders",
    label: "Orders",
    path: ROUTES.orders,
    icon: IconShoppingCart,
    description: "Full order table with status filters & details.",
  },
  {
    key: "products",
    label: "Products",
    path: ROUTES.products,
    icon: IconPackage,
    description: "Catalogue with stock levels and pricing.",
  },
  {
    key: "invoices",
    label: "Invoices",
    path: ROUTES.invoices,
    icon: IconFileText,
    description: "Invoice registry with statuses and amounts.",
  },
  {
    key: "calendar",
    label: "Calendar",
    path: ROUTES.calendar,
    icon: IconCalendar,
    description: "Schedulable events with a reusable event form.",
  },
  {
    key: "messages",
    label: "Messages",
    path: ROUTES.messages,
    icon: IconMail,
    description: "Inbox with folders and message previews.",
  },
  {
    key: "tasks",
    label: "Tasks",
    path: ROUTES.tasks,
    icon: IconClipboardList,
    description: "Kanban-style task board with priorities.",
  },
  {
    key: "projects",
    label: "Projects",
    path: ROUTES.projects,
    icon: IconFolder,
    description: "Project cards with progress tracking.",
  },
  {
    key: "media",
    label: "Media",
    path: ROUTES.media,
    icon: IconImage,
    description: "Asset library with type filtering.",
  },
  {
    key: "users",
    label: "Users",
    path: ROUTES.users,
    icon: IconUsers,
    description: "Team management with roles and statuses.",
  },
  {
    key: "settings",
    label: "Settings",
    path: ROUTES.settings,
    icon: IconSettings,
    description: "Profile, preferences and app configuration.",
  },
  {
    key: "components",
    label: "Components",
    path: ROUTES.components,
    icon: IconComponent,
    description: "Interactive showcase of every UI kit component.",
  },
];

/** Technology stack behind the template. */
export const TECH_STACK = [
  {
    name: "React 19",
    role: "UI runtime",
    note: "Hooks + functional components",
  },
  {
    name: "Vite 7",
    role: "Build tool",
    note: "Fast dev server & bundling",
  },
  {
    name: "React Router 6",
    role: "Routing",
    note: "Lazy routes + guards ready",
  },
  {
    name: "naytak-react-ui",
    role: "Design system",
    note: "85+ themeable components",
  },
  {
    name: "Vitest 4",
    role: "Testing",
    note: "Unit tests included",
  },
  {
    name: "GitHub Pages",
    role: "Deploy",
    note: "One-command gh-pages deploy",
  },
];
