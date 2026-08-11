/**
 * Local mock data for the Tasks feature.
 * Swap this folder for a real API/data layer later.
 */

export const TASKS = [
  {
    id: 1,
    title: "Update onboarding documentation",
    assignee: "Alice Johnson",
    priority: "high",
    status: "in_progress",
    due: "2026-08-14",
  },
  {
    id: 2,
    title: "Refactor API error handling",
    assignee: "Bob Smith",
    priority: "high",
    status: "todo",
    due: "2026-08-18",
  },
  {
    id: 3,
    title: "Design new dashboard widgets",
    assignee: "Carol Nguyen",
    priority: "medium",
    status: "done",
    due: "2026-08-11",
  },
  {
    id: 4,
    title: "Migrate database to new schema",
    assignee: "David Lee",
    priority: "high",
    status: "in_progress",
    due: "2026-08-20",
  },
  {
    id: 5,
    title: "Write release notes for v2.4",
    assignee: "Emma Wilson",
    priority: "low",
    status: "todo",
    due: "2026-08-22",
  },
  {
    id: 6,
    title: "Fix checkout currency bug",
    assignee: "Frank Miller",
    priority: "high",
    status: "done",
    due: "2026-08-09",
  },
  {
    id: 7,
    title: "Improve table accessibility",
    assignee: "Grace Brown",
    priority: "medium",
    status: "in_progress",
    due: "2026-08-16",
  },
  {
    id: 8,
    title: "Set up CI for staging deploys",
    assignee: "Henry Davis",
    priority: "medium",
    status: "todo",
    due: "2026-08-25",
  },
  {
    id: 9,
    title: "Draft Q3 marketing email",
    assignee: "Isabella Garcia",
    priority: "low",
    status: "done",
    due: "2026-08-08",
  },
  {
    id: 10,
    title: "Review third-party SDK contract",
    assignee: "Jack Martinez",
    priority: "medium",
    status: "todo",
    due: "2026-08-28",
  },
  {
    id: 11,
    title: "Add bulk export to orders",
    assignee: "Katie Anderson",
    priority: "high",
    status: "in_progress",
    due: "2026-08-19",
  },
  {
    id: 12,
    title: "Update privacy policy page",
    assignee: "Liam Thomas",
    priority: "low",
    status: "todo",
    due: "2026-08-30",
  },
  {
    id: 13,
    title: "Benchmark report generation",
    assignee: "Mia Jackson",
    priority: "medium",
    status: "done",
    due: "2026-08-10",
  },
  {
    id: 14,
    title: "Create empty-state illustrations",
    assignee: "Noah White",
    priority: "low",
    status: "in_progress",
    due: "2026-08-21",
  },
  {
    id: 15,
    title: "Monitor server after maintenance",
    assignee: "Olivia Harris",
    priority: "high",
    status: "todo",
    due: "2026-08-13",
  },
];

export const PRIORITY_OPTIONS = [
  { label: "All priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export const STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "To do", value: "todo" },
  { label: "In progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

export const PRIORITY_COLORS = {
  high: "danger",
  medium: "warning",
  low: "info",
};

export const STATUS_COLORS = {
  todo: "secondary",
  in_progress: "primary",
  done: "success",
};

export const STATUS_LABELS = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};
