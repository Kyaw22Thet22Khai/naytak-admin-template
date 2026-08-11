/**
 * Local mock data for the Analytics feature.
 * Swap this folder for a real API/data layer later.
 */

export const ANALYTICS_STATS = [
  {
    id: "visitors",
    label: "Visitors",
    value: "48,210",
    trend: 6.4,
    color: "primary",
  },
  {
    id: "sessions",
    label: "Sessions",
    value: "89,312",
    trend: 9.1,
    color: "info",
  },
  {
    id: "bounce",
    label: "Bounce Rate",
    value: "32.4%",
    trend: -2.3,
    color: "warning",
  },
  {
    id: "duration",
    label: "Avg. Session",
    value: "6 min",
    trend: 1.2,
    color: "success",
  },
];

export const VISITOR_SERIES = [
  { x: "Jan", y: 12000 },
  { x: "Feb", y: 13800 },
  { x: "Mar", y: 12400 },
  { x: "Apr", y: 15600 },
  { x: "May", y: 17100 },
  { x: "Jun", y: 16500 },
  { x: "Jul", y: 19300 },
  { x: "Aug", y: 18200 },
  { x: "Sep", y: 21400 },
  { x: "Oct", y: 23800 },
  { x: "Nov", y: 25100 },
  { x: "Dec", y: 27400 },
];

export const CONVERSION = { value: 68, max: 100 };

export const REGION_SALES = [
  {
    name: "North America",
    data: [
      { x: "Q1", y: 48 },
      { x: "Q2", y: 52 },
      { x: "Q3", y: 61 },
    ],
  },
  {
    name: "Europe",
    data: [
      { x: "Q1", y: 35 },
      { x: "Q2", y: 39 },
      { x: "Q3", y: 44 },
    ],
  },
  {
    name: "Asia Pacific",
    data: [
      { x: "Q1", y: 28 },
      { x: "Q2", y: 33 },
      { x: "Q3", y: 37 },
    ],
  },
];

export const LEAD_FUNNEL = [
  { label: "Visitors", value: 48210 },
  { label: "Sign-ups", value: 12840 },
  { label: "Trial", value: 4620 },
  { label: "Paid", value: 1890 },
];
