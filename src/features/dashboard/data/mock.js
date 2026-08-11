/**
 * Local mock data for the Dashboard feature.
 * Swap this folder for a real API/data layer later.
 */

export const WIDGETS = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: 128430,
    icon: "dollar",
    trend: 12.5,
    color: "primary",
    format: "currency",
    note: "vs last week",
  },
  {
    id: "orders",
    label: "Orders",
    value: 1240,
    icon: "cart",
    trend: 8.2,
    color: "success",
    format: "number",
    note: "vs last week",
  },
  {
    id: "customers",
    label: "New Customers",
    value: 348,
    icon: "users",
    trend: -3.1,
    color: "warning",
    format: "number",
    note: "vs last week",
  },
  {
    id: "conversion",
    label: "Conversion Rate",
    value: 4.6,
    icon: "trend",
    trend: 1.8,
    color: "info",
    format: "percent",
    note: "vs last week",
  },
];

export const REVENUE_SERIES = [
  {
    name: "Revenue",
    data: [
      { x: "Jan", y: 4200 },
      { x: "Feb", y: 5100 },
      { x: "Mar", y: 4800 },
      { x: "Apr", y: 6200 },
      { x: "May", y: 5900 },
      { x: "Jun", y: 7400 },
      { x: "Jul", y: 8100 },
      { x: "Aug", y: 7600 },
      { x: "Sep", y: 9200 },
      { x: "Oct", y: 8800 },
      { x: "Nov", y: 10300 },
      { x: "Dec", y: 11200 },
    ],
  },
  {
    name: "Expenses",
    data: [
      { x: "Jan", y: 3100 },
      { x: "Feb", y: 3400 },
      { x: "Mar", y: 3300 },
      { x: "Apr", y: 4100 },
      { x: "May", y: 3900 },
      { x: "Jun", y: 4600 },
      { x: "Jul", y: 5000 },
      { x: "Aug", y: 4700 },
      { x: "Sep", y: 5400 },
      { x: "Oct", y: 5200 },
      { x: "Nov", y: 6100 },
      { x: "Dec", y: 6600 },
    ],
  },
];

export const CATEGORY_SALES = [
  { label: "Electronics", value: 46, color: "primary" },
  { label: "Clothing", value: 24, color: "success" },
  { label: "Books", value: 18, color: "warning" },
  { label: "Other", value: 12, color: "info" },
];

export const TRAFFIC = [
  { label: "Direct", value: 42, color: "primary", visits: 9821 },
  { label: "Organic Search", value: 26, color: "success", visits: 6085 },
  { label: "Referral", value: 18, color: "warning", visits: 4210 },
  { label: "Social", value: 14, color: "danger", visits: 3276 },
];

export const RECENT_ACTIVITY = [
  {
    id: 1,
    title: "New order placed",
    time: "10 min ago",
    content: "Alice Johnson ordered 2 × Pro Plan",
    color: "success",
    icon: "check",
  },
  {
    id: 2,
    title: "New user registered",
    time: "32 min ago",
    content: "Bob Smith signed up via Organic Search",
    color: "primary",
    icon: "user",
  },
  {
    id: 3,
    title: "Payment received",
    time: "1 hr ago",
    content: "$512.00 payment received for ORD-1040",
    color: "info",
    icon: "dollar",
  },
  {
    id: 4,
    title: "Order cancelled",
    time: "3 hrs ago",
    content: "ORD-1039 cancelled by customer",
    color: "danger",
    icon: "x",
  },
  {
    id: 5,
    title: "Inventory updated",
    time: "5 hrs ago",
    content: "Restocked 120 units of Item #204",
    color: "warning",
    icon: "refresh",
  },
];

export const RECENT_ORDERS = [
  {
    id: "ORD-1042",
    customer: "Alice Johnson",
    amount: 249.0,
    status: "completed",
    date: "2026-08-10",
  },
  {
    id: "ORD-1041",
    customer: "Bob Smith",
    amount: 89.5,
    status: "pending",
    date: "2026-08-09",
  },
  {
    id: "ORD-1040",
    customer: "Carol Nguyen",
    amount: 512.0,
    status: "completed",
    date: "2026-08-09",
  },
  {
    id: "ORD-1039",
    customer: "David Lee",
    amount: 34.99,
    status: "cancelled",
    date: "2026-08-08",
  },
  {
    id: "ORD-1038",
    customer: "Emma Wilson",
    amount: 1245.0,
    status: "pending",
    date: "2026-08-08",
  },
];
