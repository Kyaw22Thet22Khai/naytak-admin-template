import { ThemeProvider, ToastProvider } from "naytak-react-ui";
import { THEME_CONFIG, readStoredThemeMode } from "./theme";
import { AuthProvider } from "./authContext";
import { DataProvider } from "./dataContext";

/**
 * App-wide providers.
 * - ThemeProvider enables light/dark theming + design tokens for the whole tree.
 * - ToastProvider renders imperative toasts (toast.success(...)) and must live
 *   inside ThemeProvider so portal overlays stay themed.
 * - AuthProvider holds the session that guards the admin routes.
 * - DataProvider owns the mock records every page reads and writes.
 */
export function AppProviders({ children }) {
  return (
    <ThemeProvider
      defaultMode={readStoredThemeMode() ?? THEME_CONFIG.defaultMode}
      primaryColor={THEME_CONFIG.primaryColor}>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
