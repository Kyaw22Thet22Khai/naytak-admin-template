import { Button, IconMoon, IconSun, useTheme } from "naytak-react-ui";
import { storeThemeMode } from "../app/theme";

/**
 * Light/dark switch, shared by the admin navbar and the public pages.
 *
 * The toggle used to live only inside AdminLayout, which left the landing and
 * auth screens stuck in light mode — a dark-mode visitor's first impression
 * was a flash of white.
 */
export function ThemeToggle({ size = "sm", variant = "ghost", className }) {
  const { mode, toggleMode } = useTheme();
  const dark = mode === "dark";

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      leftIcon={dark ? <IconSun size={18} /> : <IconMoon size={18} />}
      onClick={() => {
        storeThemeMode(dark ? "light" : "dark");
        toggleMode();
      }}
    />
  );
}
