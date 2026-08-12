import { ThemeProvider, ToastProvider } from "naytak-react-ui";
import { THEME_CONFIG } from "./theme";

/**
 * App-wide providers.
 * - ThemeProvider enables light/dark theming + design tokens for the whole tree.
 * - ToastProvider renders imperative toasts (toast.success(...)) and must live
 *   inside ThemeProvider so portal overlays stay themed.
 */
export function AppProviders({ children }) {
  return (
    <ThemeProvider
      defaultMode={THEME_CONFIG.defaultMode}
      primaryColor={THEME_CONFIG.primaryColor}>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
