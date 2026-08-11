/**
 * Local mock data for the Projects feature.
 * Swap this folder for a real API/data layer later.
 */

export const PROJECTS = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Refresh the marketing site with the new design system.",
    status: "active",
    progress: 65,
    due: "2026-09-30",
    team: ["Alice Johnson", "Bob Smith", "Carol Nguyen"],
  },
  {
    id: 2,
    name: "Mobile App v2",
    description: "Rebuild the customer app with offline support.",
    status: "active",
    progress: 42,
    due: "2026-12-15",
    team: ["David Lee", "Emma Wilson"],
  },
  {
    id: 3,
    name: "Billing Migration",
    description: "Move billing to the new payments provider.",
    status: "planning",
    progress: 10,
    due: "2026-11-01",
    team: ["Frank Miller", "Grace Brown"],
  },
  {
    id: 4,
    name: "Analytics Dashboard",
    description: "Ship the new analytics dashboard to all users.",
    status: "active",
    progress: 78,
    due: "2026-09-10",
    team: ["Henry Davis", "Isabella Garcia", "Jack Martinez"],
  },
  {
    id: 5,
    name: "Security Hardening",
    description: "Audit and harden auth, sessions and permissions.",
    status: "active",
    progress: 30,
    due: "2026-10-20",
    team: ["Katie Anderson", "Liam Thomas"],
  },
  {
    id: 6,
    name: "Docs Refresh",
    description: "Rewrite onboarding and API documentation.",
    status: "done",
    progress: 100,
    due: "2026-08-05",
    team: ["Mia Jackson"],
  },
  {
    id: 7,
    name: "Partner Portal",
    description: "Self-service portal for reseller partners.",
    status: "planning",
    progress: 5,
    due: "2027-01-20",
    team: ["Noah White", "Olivia Harris"],
  },
  {
    id: 8,
    name: "Performance Sprint",
    description: "Reduce p95 latency and bundle size.",
    status: "active",
    progress: 55,
    due: "2026-10-05",
    team: ["Peter Clark", "Quinn Lewis", "Rachel Walker"],
  },
  {
    id: 9,
    name: "Localization",
    description: "Add i18n for Spanish, French and German.",
    status: "planning",
    progress: 15,
    due: "2026-12-01",
    team: ["Samuel Hall"],
  },
];

export const STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Planning", value: "planning" },
  { label: "Done", value: "done" },
];

export const STATUS_COLORS = {
  active: "success",
  planning: "warning",
  done: "primary",
};
