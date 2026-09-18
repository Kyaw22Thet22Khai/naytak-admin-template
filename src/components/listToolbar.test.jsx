import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { listTitle } from "./listResults";

const globals = readFileSync(join(process.cwd(), "src", "index.css"), "utf8");
const tokens = readFileSync(
  join(process.cwd(), "src", "styles", "tokens.css"),
  "utf8",
);

/**
 * jsdom has no layout engine, so it cannot measure rendered heights. These
 * assert the rule that guarantees them instead: one declaration covering all
 * three control types, keyed to a single token.
 */
describe("toolbar control sizing", () => {
  const rule =
    globals.match(
      /\.list-toolbar \.search-input-field,[\s\S]*?\.list-toolbar \.btn\s*\{[^}]*\}/,
    )?.[0] ?? "";

  test("input, select and button share one height rule", () => {
    expect(rule).toBeTruthy();
    for (const selector of [
      ".list-toolbar .search-input-field",
      ".list-toolbar .select",
      ".list-toolbar .btn",
    ]) {
      expect(rule).toContain(selector);
    }
  });

  test("the height comes from the token, not a literal", () => {
    expect(rule).toMatch(/height:\s*var\(--control-height\)/);
    expect(rule).toMatch(/min-height:\s*var\(--control-height\)/);
    expect(tokens).toMatch(/--control-height:\s*[\d.]+rem/);
  });

  test("all three share one font size, so equal boxes also read as equal", () => {
    expect(rule).toMatch(/font-size:\s*var\(--text-base\)/);
  });
});

describe("listTitle", () => {
  // Returns markup now, not a string, so the count can be styled down —
  // rendered text is what these assert.
  const text = (list) =>
    render(<h3>{listTitle("All orders", list)}</h3>).container.textContent;

  test("folds the count into the heading", () => {
    expect(text({ total: 20, totalAll: 20 })).toBe("All orders (20 of 20)");
  });

  test("shows the filtered count against the full one", () => {
    expect(text({ total: 3, totalAll: 30 })).toBe("All orders (3 of 30)");
  });

  test("handles an empty collection without reading as broken", () => {
    expect(text({ total: 0, totalAll: 0 })).toBe("All orders (0 of 0)");
  });

  test("puts the count in its own element so it can be muted", () => {
    const { container } = render(
      <h3>{listTitle("All orders", { total: 3, totalAll: 30 })}</h3>,
    );
    expect(container.querySelector(".title-note")).toHaveTextContent(
      "(3 of 30)",
    );
  });
});
