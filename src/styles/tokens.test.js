import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const SRC = join(process.cwd(), "src");
const tokens = readFileSync(join(SRC, "styles", "tokens.css"), "utf8");
const globals = readFileSync(join(SRC, "index.css"), "utf8");

/** Every .css file under src/, so the checks cover feature stylesheets too. */
function allStylesheets(dir = SRC, found = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) allStylesheets(full, found);
    else if (entry.endsWith(".css"))
      found.push([full, readFileSync(full, "utf8")]);
  }
  return found;
}

/** Every token name declared in the :root block. */
function declaredTokens(css) {
  return new Set(css.match(/--[a-z0-9-]+(?=\s*:)/g) ?? []);
}

describe("design tokens", () => {
  test("every semantic colour is declared for both themes", () => {
    const [light, dark] = tokens.split(':root[data-naytak-theme="dark"]');
    expect(dark).toBeDefined();

    const themed = [
      "--naytak-success",
      "--naytak-danger",
      "--naytak-warning",
      "--naytak-info",
      "--naytak-inverse-surface",
      "--naytak-inverse-text",
    ];
    for (const name of themed) {
      expect(light, `${name} missing from light`).toContain(`${name}:`);
      expect(dark, `${name} missing from dark`).toContain(`${name}:`);
    }
  });

  test("the undo bar never borrows --naytak-text for its background", () => {
    // Regression: it used `background: var(--naytak-text)` with white text,
    // which the dark theme flipped to near-white on near-white.
    const rule = globals.match(/\.undo-bar\s*\{[^}]*\}/)?.[0] ?? "";
    expect(rule).toContain("var(--naytak-inverse-surface)");
    expect(rule).not.toContain("var(--naytak-text");
    expect(rule).not.toMatch(/color:\s*#fff/);
  });

  test("no stylesheet references a token that is never declared", () => {
    // Guards against the original bug: `var(--naytak-success, #10b981)` looked
    // themed but silently fell back, because the token did not exist.
    const declared = new Set([
      ...declaredTokens(tokens),
      // Shipped by naytak-react-ui's ThemeProvider at runtime.
      "--naytak-primary",
      "--naytak-primary-light",
      "--naytak-primary-dark",
      "--naytak-primary-soft",
      "--naytak-primary-glow",
      "--naytak-primary-contrast",
      "--naytak-bg",
      "--naytak-surface",
      "--naytak-surface-2",
      "--naytak-text",
      "--naytak-text-muted",
      "--naytak-border",
      "--naytak-border-strong",
      "--naytak-shadow-card",
      "--naytak-shadow-lg",
      "--naytak-navbar-bg",
      // Set by the library's own components.
      "--widget-accent",
      "--event-accent",
      "--breadcrumb-padding-left",
      "--navbar-height",
      "--sidebar-width",
    ]);

    const unknown = [];
    for (const [file, css] of allStylesheets()) {
      for (const ref of css.match(/var\(\s*(--[a-z0-9-]+)/g) ?? []) {
        const name = ref.replace(/var\(\s*/, "");
        if (!declared.has(name)) {
          unknown.push(`${file.replace(SRC, "src")}: ${name}`);
        }
      }
    }

    expect([...new Set(unknown)]).toEqual([]);
  });
});
