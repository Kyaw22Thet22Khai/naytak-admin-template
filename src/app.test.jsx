import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import App from "./app";
import { DEMO_CREDENTIALS } from "./constants/app";

/** Renders the app at a given path (routes read window.location). */
function renderAt(path) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("routing", () => {
  test("shows the landing page at the root", async () => {
    renderAt("/");
    expect(
      await screen.findByRole("heading", { name: /complete/i }),
    ).toBeInTheDocument();
  });

  test("redirects a signed-out visitor away from a guarded page", async () => {
    renderAt("/customers");
    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.queryByText(/manage your customer/i)).not.toBeInTheDocument();
  });

  test("renders a 404 page for an unknown path", async () => {
    renderAt("/does-not-exist");
    expect(await screen.findByText(/404/)).toBeInTheDocument();
    expect(screen.getByText(/\/does-not-exist/)).toBeInTheDocument();
  });
});

describe("sign in", () => {
  test("rejects a malformed email without submitting", async () => {
    const user = userEvent.setup();
    renderAt("/login");

    await screen.findByText(/welcome back/i);
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
    // Still on the sign-in screen.
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  test("signs in with the demo account and reaches the dashboard", async () => {
    const user = userEvent.setup();
    renderAt("/login");

    await screen.findByText(/welcome back/i);
    await user.type(screen.getByLabelText(/email/i), DEMO_CREDENTIALS.email);
    await user.type(
      screen.getByLabelText(/^password$/i),
      DEMO_CREDENTIALS.password,
    );
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => expect(window.location.pathname).toBe("/dashboard"), {
      timeout: 4000,
    });
  });

  test("returns the visitor to the page the guard bounced them from", async () => {
    const user = userEvent.setup();
    renderAt("/products");

    await screen.findByText(/welcome back/i, {}, { timeout: 4000 });
    await user.click(
      screen.getByRole("button", { name: /fill demo credentials/i }),
    );
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => expect(window.location.pathname).toBe("/products"), {
      timeout: 4000,
    });
  });
});
