import { readFileSync } from "node:fs";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { projectZipPlugin } from "./plugins/projectZipPlugin";
import { ghPagesSpaFallback } from "./plugins/ghPagesSpaFallback";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);

/**
 * Sub-path the built app is served from.
 *
 * GitHub Pages project sites live at https://<user>.github.io/<repo>/, and the
 * app needs that prefix for BOTH its asset URLs and BrowserRouter's basename
 * (which reads import.meta.env.BASE_URL).
 *
 * Resolution order:
 *   1. VITE_BASE_PATH — set by the deploy workflow to the real repository name,
 *      which is authoritative and makes any fork work unchanged.
 *   2. the package name — the right answer for a local `npm run deploy`, where
 *      no CI variable exists. A relative "./" base is NOT usable here: it makes
 *      BASE_URL "./", the router basename "/", and then every route 404s
 *      because the real path starts with "/<repo>/".
 */
const BASE_PATH = process.env.VITE_BASE_PATH || `/${pkg.name}/`;

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // The dev server is served from the root, so the sub-path applies to builds
  // only — otherwise `npm run dev` would 404 at http://127.0.0.1:3000/.
  base: command === "serve" ? "/" : BASE_PATH,
  // Generates public/project-source.zip (whole project, no node_modules)
  // so the navbar Download button can offer the runnable project source.
  // ghPagesSpaFallback writes dist/404.html so BrowserRouter deep links
  // (e.g. /customers) work on GitHub Pages without a "#".
  plugins: [react(), projectZipPlugin(), ghPagesSpaFallback()],
  server: {
    // Bind to IPv4 explicitly. Vite's default "localhost" resolves to the
    // IPv6 loopback (::1), which fails with EACCES on some Windows setups.
    host: "127.0.0.1",
    // Vite's default port 5173 falls inside a Windows-excluded TCP range
    // (Hyper-V/WinNAT reserves 5126-5225), so binding there errors with
    // "EACCES: permission denied". 3000 is outside all excluded ranges;
    // strictPort:false lets Vite auto-increment if 3000 is ever busy.
    port: 3000,
    strictPort: false,
  },
  build: {
    outDir: "dist",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    css: false,
    // Several suites render the whole app: a sign-in with a simulated network
    // delay, then a lazily loaded route chunk, then user interaction. That is
    // comfortably past the 5s default without anything being wrong.
    testTimeout: 20000,
    hookTimeout: 20000,
  },
}));
