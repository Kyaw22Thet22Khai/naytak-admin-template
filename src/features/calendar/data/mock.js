/**
 * Local mock data for the Calendar feature.
 * Swap this folder for a real API/data layer later.
 */

export const EVENTS = [
  {
    id: 1,
    title: "Product roadmap review",
    day: 12,
    month: "Aug",
    time: "09:00",
    location: "Meeting Room A",
  },
  {
    id: 2,
    title: "Q3 sales sync",
    day: 12,
    month: "Aug",
    time: "14:30",
    location: "Zoom",
  },
  {
    id: 3,
    title: "Design review — new landing",
    day: 14,
    month: "Aug",
    time: "11:00",
    location: "Design Studio",
  },
  {
    id: 4,
    title: "Vendor call — Aurelia",
    day: 15,
    month: "Aug",
    time: "10:00",
    location: "Google Meet",
  },
  {
    id: 5,
    title: "Team retro",
    day: 18,
    month: "Aug",
    time: "16:00",
    location: "Meeting Room B",
  },
  {
    id: 6,
    title: "Release 2.4 go/no-go",
    day: 21,
    month: "Aug",
    time: "09:30",
    location: "War Room",
  },
  {
    id: 7,
    title: "Customer onboarding walkthrough",
    day: 26,
    month: "Aug",
    time: "13:00",
    location: "Huddle Room 3",
  },
];

export const WEEK = [
  { day: "Mon", events: 1, color: "primary" },
  { day: "Tue", events: 2, color: "info" },
  { day: "Wed", events: 0, color: "secondary" },
  { day: "Thu", events: 1, color: "warning" },
  { day: "Fri", events: 3, color: "success" },
];
