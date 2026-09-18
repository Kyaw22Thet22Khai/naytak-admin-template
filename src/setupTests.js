// jest-dom adds custom matchers for asserting on DOM nodes, e.g.
// expect(element).toHaveTextContent(/react/i)
// https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/vitest";

/**
 * jsdom implements no CSSOM view module, so `window.matchMedia` is missing.
 * Components that adapt to viewport width would otherwise throw in tests.
 * This stub reports "does not match", i.e. the desktop layout.
 */
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

/** jsdom has no layout engine, so scrollTo is absent on elements and window. */
if (!window.scrollTo) window.scrollTo = () => {};
