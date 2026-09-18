import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import App from "../../app";

/**
 * The entry flow the template promises: land on the marketing page, click
 * through to the dashboard, get asked to sign in, then arrive.
 */
beforeEach(() => {
  window.localStorage.clear();
});

describe("landing entry flow", () => {
  test("a fresh visitor sees the landing page, not the sign-in screen", async () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    expect(
      await screen.findByRole("heading", { name: /complete/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/welcome back/i)).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/");
  });

  test("Enter Dashboard asks a signed-out visitor to sign in first", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/");
    render(<App />);

    await screen.findByRole("heading", { name: /complete/i });
    await user.click(screen.getByRole("link", { name: /enter dashboard/i }));

    expect(
      await screen.findByText(/welcome back/i, {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/login");
  });

  test("signing in from that prompt lands on the dashboard", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/");
    render(<App />);

    await screen.findByRole("heading", { name: /complete/i });
    await user.click(screen.getByRole("link", { name: /enter dashboard/i }));

    await screen.findByText(/welcome back/i, {}, { timeout: 4000 });
    await user.click(
      screen.getByRole("button", { name: /fill demo credentials/i }),
    );
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => expect(window.location.pathname).toBe("/dashboard"), {
      timeout: 4000,
    });
  });

  test.each([
    ["/landing", "/"],
    ["/home", "/"],
    ["/index", "/"],
  ])("%s redirects to %s instead of 404ing", async (alias, target) => {
    window.history.pushState({}, "", alias);
    render(<App />);

    expect(
      await screen.findByRole(
        "heading",
        { name: /complete/i },
        { timeout: 4000 },
      ),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe(target);
    expect(screen.queryByText(/page not found/i)).not.toBeInTheDocument();
  });

  test.each([["/sign-in"], ["/signin"]])(
    "%s redirects to the sign-in screen",
    async (alias) => {
      window.history.pushState({}, "", alias);
      render(<App />);

      expect(
        await screen.findByText(/welcome back/i, {}, { timeout: 4000 }),
      ).toBeInTheDocument();
      expect(window.location.pathname).toBe("/login");
    },
  );

  test("a genuinely unknown path still shows the 404", async () => {
    window.history.pushState({}, "", "/no-such-page");
    render(<App />);

    expect(
      await screen.findByText(/page not found/i, {}, { timeout: 4000 }),
    ).toBeInTheDocument();
  });

  test("an already signed-in visitor still lands on the landing page", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/login");
    render(<App />);

    await screen.findByText(/welcome back/i, {}, { timeout: 4000 });
    await user.click(
      screen.getByRole("button", { name: /fill demo credentials/i }),
    );
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));
    await waitFor(() => expect(window.location.pathname).toBe("/dashboard"), {
      timeout: 4000,
    });

    // Reopening the site at the root: landing, not a redirect into the app.
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(
      await screen.findAllByRole("heading", { name: /complete/i }),
    ).not.toHaveLength(0);
  });
});
