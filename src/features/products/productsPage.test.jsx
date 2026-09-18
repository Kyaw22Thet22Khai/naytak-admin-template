import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import App from "../../app";

/** Signs in and lands on the given page, the way a real visitor would. */
async function signInAndVisit(user, path) {
  window.history.pushState({}, "", path);
  render(<App />);

  await screen.findByText(/welcome back/i, {}, { timeout: 4000 });
  await user.click(
    screen.getByRole("button", { name: /fill demo credentials/i }),
  );
  await user.click(screen.getByRole("button", { name: /^sign in$/i }));
  await waitFor(() => expect(window.location.pathname).toBe(path), {
    timeout: 4000,
  });
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("products CRUD", () => {
  test("adds a product and shows it in the list", async () => {
    const user = userEvent.setup();
    await signInAndVisit(user, "/products");

    await screen.findByRole(
      "heading",
      { name: /^Products \(/ },
      { timeout: 4000 },
    );
    await user.click(screen.getByRole("button", { name: /add product/i }));

    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText(/^name$/i), "Test Widget");
    await user.type(within(dialog).getByLabelText(/^price$/i), "42");
    await user.type(within(dialog).getByLabelText(/^stock$/i), "7");
    await user.click(
      within(dialog).getByRole("button", { name: /add product/i }),
    );

    expect(await screen.findByText("Test Widget")).toBeInTheDocument();
    expect(screen.getByText("$42.00")).toBeInTheDocument();
  });

  test("blocks a product with an invalid price and says why", async () => {
    const user = userEvent.setup();
    await signInAndVisit(user, "/products");

    await screen.findByRole(
      "heading",
      { name: /^Products \(/ },
      { timeout: 4000 },
    );
    await user.click(screen.getByRole("button", { name: /add product/i }));

    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText(/^name$/i), "Bad Widget");
    await user.type(within(dialog).getByLabelText(/^price$/i), "-5");
    await user.type(within(dialog).getByLabelText(/^stock$/i), "1");
    await user.click(
      within(dialog).getByRole("button", { name: /add product/i }),
    );

    expect(
      await within(dialog).findByText(/cannot be negative/i),
    ).toBeInTheDocument();
    // The dialog stays open; nothing was created.
    expect(screen.queryByText("Bad Widget")).not.toBeInTheDocument();
  });

  test("typing alone does not filter — results wait for Search", async () => {
    const user = userEvent.setup();
    await signInAndVisit(user, "/products");

    await screen.findByRole(
      "heading",
      { name: /^Products \(/ },
      { timeout: 4000 },
    );
    const before = screen.getByText(/Showing 1/).textContent;

    await user.type(
      screen.getByLabelText(/search products/i),
      "zzzz-no-such-product",
    );

    // The list is untouched, and the toolbar says why.
    expect(screen.getByText(/press search to apply/i)).toBeInTheDocument();
    expect(screen.getByText(/Showing 1/).textContent).toBe(before);
    expect(
      screen.queryByText(/no products match your filters/i),
    ).not.toBeInTheDocument();
  });

  test("pressing Search applies the term", async () => {
    const user = userEvent.setup();
    await signInAndVisit(user, "/products");

    await screen.findByRole(
      "heading",
      { name: /^Products \(/ },
      { timeout: 4000 },
    );
    await user.type(
      screen.getByLabelText(/search products/i),
      "zzzz-no-such-product",
    );
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(
      await screen.findByText(
        /no products match your filters/i,
        {},
        { timeout: 4000 },
      ),
    ).toBeInTheDocument();
    // Applied, so the "unapplied changes" hint is gone.
    expect(
      screen.queryByText(/press search to apply/i),
    ).not.toBeInTheDocument();
  });

  test("Enter in the search box submits the form too", async () => {
    const user = userEvent.setup();
    await signInAndVisit(user, "/products");

    await screen.findByRole(
      "heading",
      { name: /^Products \(/ },
      { timeout: 4000 },
    );
    await user.type(
      screen.getByLabelText(/search products/i),
      "zzzz-no-such-product{Enter}",
    );

    expect(
      await screen.findByText(
        /no products match your filters/i,
        {},
        { timeout: 4000 },
      ),
    ).toBeInTheDocument();
  });

  test("Clear resets immediately, without needing Search", async () => {
    const user = userEvent.setup();
    await signInAndVisit(user, "/products");

    await screen.findByRole(
      "heading",
      { name: /^Products \(/ },
      { timeout: 4000 },
    );
    await user.type(
      screen.getByLabelText(/search products/i),
      "zzzz-no-such-product",
    );
    await user.click(screen.getByRole("button", { name: /^search$/i }));
    await screen.findByText(
      /no products match your filters/i,
      {},
      {
        timeout: 4000,
      },
    );

    await user.click(screen.getByRole("button", { name: /^clear$/i }));
    await waitFor(() =>
      expect(
        screen.queryByText(/no products match your filters/i),
      ).not.toBeInTheDocument(),
    );
  });
});
