import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, test } from "vitest";
import App from "../app";
import { ROUTES } from "./routes";

/**
 * Renders every page and every form modal, and asserts the structural things
 * that are easy to break and invisible until someone uses a screen reader or
 * a keyboard.
 *
 * It caught, on its first run: five pages whose card titles jumped from h2 to
 * h4, every table header missing `scope`, and — because naytak-react-ui renders
 * Select/Textarea labels with no `htmlFor` and no id on the control — form
 * controls with no accessible name at all.
 */

const PAGES = [
  ["Dashboard", ROUTES.dashboard],
  ["Analytics", ROUTES.analytics],
  ["Customers", ROUTES.customers],
  ["Orders", ROUTES.orders],
  ["Products", ROUTES.products],
  ["Invoices", ROUTES.invoices],
  ["Calendar", ROUTES.calendar],
  ["Messages", ROUTES.messages],
  ["Tasks", ROUTES.tasks],
  ["Projects", ROUTES.projects],
  ["Media", ROUTES.media],
  ["Users", ROUTES.users],
  ["Settings", ROUTES.settings],
  ["Profile", ROUTES.profile],
];

const MODALS = [
  ["Products", ROUTES.products, /add product/i],
  ["Tasks", ROUTES.tasks, /new task/i],
  ["Projects", ROUTES.projects, /new project/i],
  ["Users", ROUTES.users, /add user/i],
  ["Orders", ROUTES.orders, /new order/i],
  ["Invoices", ROUTES.invoices, /new invoice/i],
  ["Calendar", ROUTES.calendar, /new event/i],
  ["Messages", ROUTES.messages, /compose/i],
];

/** Structural defects inside one subtree. Empty array means clean. */
function defects(root) {
  const found = [];

  for (const el of root.querySelectorAll("button, a")) {
    const name = (
      el.getAttribute("aria-label") ||
      el.textContent ||
      el.getAttribute("title") ||
      ""
    ).trim();
    if (!name)
      found.push(`<${el.tagName.toLowerCase()}> has no accessible name`);
  }

  for (const img of root.querySelectorAll("img")) {
    if (img.getAttribute("alt") === null) found.push("<img> has no alt");
  }

  // Heading levels must not skip — h2 straight to h4 leaves a hole.
  let previous = null;
  for (const h of root.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    const level = Number(h.tagName[1]);
    if (!h.textContent.trim()) found.push("empty heading");
    if (previous !== null && level > previous + 1) {
      found.push(`heading jumps from h${previous} to h${level}`);
    }
    previous = level;
  }

  const seen = new Set();
  for (const el of root.querySelectorAll("[id]")) {
    const id = el.getAttribute("id");
    if (seen.has(id)) found.push(`duplicate id "${id}"`);
    seen.add(id);
  }

  for (const table of root.querySelectorAll("table")) {
    if (!table.querySelector("th")) found.push("<table> has no <th>");
  }

  // scope tells a screen reader the cell heads a column, so row cells get
  // announced together with their column name.
  for (const th of root.querySelectorAll("th")) {
    if (!th.getAttribute("scope")) {
      found.push(`<th>${th.textContent.trim().slice(0, 16)}</th> has no scope`);
    }
  }

  for (const el of root.querySelectorAll("input, select, textarea")) {
    if (el.type === "hidden") continue;
    const id = el.getAttribute("id");
    const labelled =
      el.getAttribute("aria-label") ||
      el.getAttribute("aria-labelledby") ||
      (id && root.querySelector(`label[for="${id}"]`));
    if (!labelled) {
      found.push(
        `<${el.tagName.toLowerCase()} type="${el.type}"> has no label`,
      );
    }
  }

  return found;
}

/** Renders the app at a path and waits for the page past its loading skeleton. */
async function openPage(path) {
  window.history.pushState({}, "", path);
  const { container } = render(<App />);
  await waitFor(() => expect(container.querySelector("main h2")).toBeTruthy(), {
    timeout: 6000,
  });
  return container;
}

beforeAll(async () => {
  // Sign in once; the session persists in localStorage for every render below.
  const user = userEvent.setup();
  window.history.pushState({}, "", ROUTES.login);
  render(<App />);
  await screen.findByText(/welcome back/i, {}, { timeout: 4000 });
  await user.click(
    screen.getByRole("button", { name: /fill demo credentials/i }),
  );
  await user.click(screen.getByRole("button", { name: /^sign in$/i }));
  await waitFor(() => expect(window.location.pathname).toBe(ROUTES.dashboard), {
    timeout: 4000,
  });
  cleanup();
});

afterEach(cleanup);

describe("every page is structurally sound", () => {
  for (const [name, path] of PAGES) {
    test(name, async () => {
      const container = await openPage(path);
      expect(defects(container), `${name} page`).toEqual([]);
      // Exactly one page-level heading, so the page has a single subject.
      expect(container.querySelectorAll("main h2")).toHaveLength(1);
    });
  }
});

describe("every form modal is structurally sound", () => {
  for (const [name, path, opener] of MODALS) {
    test(`${name} modal`, async () => {
      const user = userEvent.setup();
      await openPage(path);
      await user.click(screen.getAllByRole("button", { name: opener })[0]);
      const dialog = await screen.findByRole("dialog", {}, { timeout: 4000 });
      expect(defects(dialog), `${name} modal`).toEqual([]);
    });
  }
});
