import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { projectZipPlugin } from "./plugins/projectZipPlugin";
import { ghPagesSpaFallback } from "./plugins/ghPagesSpaFallback";

// https://vitejs.dev/config/
export default defineConfig({
  // Deploy sub-path. CI sets VITE_BASE_PATH to "/<repo-name>/" so the app —
  // and BrowserRouter's basename, which reads import.meta.env.BASE_URL —
  // work under any fork's GitHub Pages URL without hardcoding a username.
  // Unset (local dev, `npm run preview`) falls back to a relative base.
  base: process.env.VITE_BASE_PATH || "./",
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
});
