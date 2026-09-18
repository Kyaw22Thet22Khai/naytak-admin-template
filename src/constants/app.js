export const APP_NAME = "Naytak Admin";
export const APP_VERSION = "0.1.0";

/** Prefix for every localStorage key this app writes. */
export const APP_STORAGE_PREFIX = "naytak-admin:";

/**
 * Demo account shown on the sign-in screen. This template has no backend, so
 * the sign-in form accepts these credentials (and, in demo mode, any other
 * well-formed pair) and stores the session in localStorage.
 */
export const DEMO_CREDENTIALS = {
  email: "alice@naytak.io",
  password: "naytak123",
};

/** Profile used for a session created by the demo sign-in. */
export const CURRENT_USER = {
  name: "Alice Johnson",
  email: DEMO_CREDENTIALS.email,
  role: "Administrator",
};

/**
 * Shared responsive breakpoints (px) — the single source of truth for both
 * CSS and JS. Every `@media (max-width: …)` in this project uses one of these
 * values minus 1; JS reads them through hooks/useMediaQuery, so the two can
 * no longer drift the way they did when the drawer CSS said 768 and the
 * sidebar logic said 600.
 */
export const BREAKPOINTS = {
  xs: 420,
  sm: 600,
  md: 768,
  lg: 900,
  xl: 1080,
};

/** Width below which the sidebar becomes an off-canvas drawer. */
export const MOBILE_NAV_BREAKPOINT = BREAKPOINTS.md;
