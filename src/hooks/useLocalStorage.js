import { useCallback, useEffect, useState } from "react";
import { APP_STORAGE_PREFIX } from "../constants/app";

/** Namespaced key so two Naytak apps on the same origin never collide. */
const storageKey = (key) => `${APP_STORAGE_PREFIX}${key}`;

/** Reads and parses a stored value, falling back when absent or corrupt. */
export function readStored(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    // Private mode, blocked site data, or a value written by an older
    // version that no longer parses — treat all of them as "not set".
    return fallback;
  }
}

/** Writes a value, ignoring quota/permission failures. */
export function writeStored(key, value) {
  if (typeof window === "undefined") return;
  try {
    if (value === undefined) window.localStorage.removeItem(storageKey(key));
    else window.localStorage.setItem(storageKey(key), JSON.stringify(value));
  } catch {
    // Storage unavailable — the app still works, it just will not remember.
  }
}

/**
 * useState that survives a reload.
 * Same signature as useState, including the updater-function form.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStored(key, initialValue));

  const set = useCallback(
    (next) =>
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        writeStored(key, resolved);
        return resolved;
      }),
    [key],
  );

  // Keep other tabs of the same app in sync.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== storageKey(key)) return;
      try {
        setValue(
          event.newValue === null ? initialValue : JSON.parse(event.newValue),
        );
      } catch {
        setValue(initialValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // initialValue is only read on an external clear; it is intentionally
    // not a dependency so callers can pass an inline object literal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, set];
}
