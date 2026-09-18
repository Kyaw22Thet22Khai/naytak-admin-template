import { useCallback, useSyncExternalStore } from "react";
import { BREAKPOINTS, MOBILE_NAV_BREAKPOINT } from "../constants/app";

/**
 * Subscribes to a media query so layout logic re-renders on resize.
 *
 * useSyncExternalStore is the right tool here: matchMedia is an external
 * store, so React reads it during render rather than syncing it into state
 * inside an effect (which flashes the wrong layout on first paint).
 *
 * The old code called `window.matchMedia(...).matches` at click time only,
 * which left the sidebar in a stale mode after a resize.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const list = window.matchMedia?.(query);
      if (!list) return () => {};
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  // A viewport query is a layout nicety; where matchMedia is unavailable
  // (older embedded webviews, some test environments) the page should fall
  // back to the desktop layout rather than fail to render at all.
  const getSnapshot = useCallback(
    () => window.matchMedia?.(query).matches ?? false,
    [query],
  );

  // On the server there is no viewport; assume the desktop layout.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True at the width where the sidebar becomes an off-canvas drawer. */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_NAV_BREAKPOINT - 1}px)`);
}

/** True on phone-sized viewports (below the `sm` token). */
export function useIsSmallScreen() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.sm - 1}px)`);
}
