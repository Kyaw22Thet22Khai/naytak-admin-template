import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { withNote } from "./titleNote";

describe("withNote", () => {
  test("keeps title and note on one line but visually distinct", () => {
    render(<h2>{withNote("Analytics", "Traffic and revenue insights")}</h2>);

    const heading = screen.getByRole("heading");
    // One line, read as a whole.
    expect(heading).toHaveTextContent(
      "Analytics (Traffic and revenue insights)",
    );

    // The note is its own element, so it can be styled down.
    const note = heading.querySelector(".title-note");
    expect(note).toBeTruthy();
    expect(note).toHaveTextContent("(Traffic and revenue insights)");

    // The title itself is NOT inside the muted span.
    expect(note.textContent).not.toContain("Analytics");
  });

  test("returns the title alone when there is no note", () => {
    // Lets callers pass a conditional without guarding it, which the
    // forgot-password screen relies on.
    for (const empty of [null, undefined, ""]) {
      const { container, unmount } = render(
        <h2>{withNote("Check your inbox", empty)}</h2>,
      );
      expect(container.querySelector(".title-note")).toBeNull();
      expect(container.textContent).toBe("Check your inbox");
      unmount();
    }
  });

  test("works for a count note too", () => {
    render(<h3>{withNote("All orders", "20 of 20")}</h3>);
    expect(screen.getByRole("heading")).toHaveTextContent(
      "All orders (20 of 20)",
    );
  });
});
