import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base so the built app works when deployed to GitHub Pages
  // under a sub-path (e.g. https://<user>.github.io/naytak-admin-template/).
  base: "./",
  plugins: [react()],
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
