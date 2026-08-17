import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Vite plugin — writes `dist/404.html` as a copy of the built `index.html`.
 *
 * GitHub Pages serves `404.html` for any unmatched path, so with BrowserRouter
 * (no "#") a deep link like `/customers` — or a refresh on it — still loads the
 * app instead of a 404. This is the standard SPA fallback for GitHub Pages.
 */
export function ghPagesSpaFallback() {
  let root;
  let outDir;
  return {
    name: "gh-pages-spa-fallback",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
    },
    closeBundle() {
      try {
        const buildDir = resolve(root, outDir);
        copyFileSync(resolve(buildDir, "index.html"), resolve(buildDir, "404.html"));
      } catch (error) {
        console.warn("[ghPagesSpaFallback] failed to write 404.html:", error);
      }
    },
  };
}
