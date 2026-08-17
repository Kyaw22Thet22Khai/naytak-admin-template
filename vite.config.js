import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { projectZipPlugin } from "./plugins/projectZipPlugin";

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base so the built app works when deployed to GitHub Pages
  // under a sub-path (e.g. https://<user>.github.io/naytak-admin-template/).
  base: "./",
  // Generates public/project-source.zip (whole project, no node_modules)
  // so the navbar Download button can offer the runnable project source.
  plugins: [react(), projectZipPlugin()],
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
  },
});
