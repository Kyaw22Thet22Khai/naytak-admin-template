import { readStored, writeStored } from "../hooks/useLocalStorage";

/** localStorage key holding the user's chosen color mode. */
export const THEME_MODE_KEY = "theme-mode";

/**
 * Theme configuration for the admin panel.
 * Consumed by the ThemeProvider in app/providers.jsx.
 */
export const THEME_CONFIG = {
  /** Initial color mode when the user has not chosen one: "light" | "dark". */
  defaultMode: "light",
  /** Brand color used to derive component gradients. */
  primaryColor: "#2563eb",
};

/** The persisted color mode, or null when the user has never toggled it. */
export function readStoredThemeMode() {
  const mode = readStored(THEME_MODE_KEY, null);
  return mode === "light" || mode === "dark" ? mode : null;
}

/** Remembers the color mode so it survives a reload. */
export function storeThemeMode(mode) {
  writeStored(THEME_MODE_KEY, mode);
}
