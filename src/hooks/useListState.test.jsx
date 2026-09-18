import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { useListState } from "./useListState";

const ITEMS = [
  { id: 1, name: "Zeta", status: "active", price: 30 },
  { id: 2, name: "alpha", status: "archived", price: 10 },
  { id: 3, name: "Mid", status: "active", price: 20 },
];

const SEARCH_KEYS = ["name"];
const FILTERS = { status: (item, value) => item.status === value };

function setup(initialEntries = ["/"], overrides = {}) {
  return renderHook(
    () =>
      useListState({
        items: ITEMS,
        searchKeys: SEARCH_KEYS,
        filters: FILTERS,
        pageSize: 2,
        ...overrides,
      }),
    {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      ),
    },
  );
}

describe("useListState", () => {
  test("sorts case-insensitively and numerically", () => {
    const { result } = setup(["/?sort=name"]);
    expect(result.current.results.map((i) => i.name)).toEqual([
      "alpha",
      "Mid",
      "Zeta",
    ]);

    const { result: byPrice } = setup(["/?sort=price&dir=desc"]);
    expect(byPrice.current.results.map((i) => i.price)).toEqual([30, 20, 10]);
  });

  test("reads search and filters from the URL, so a link restores the view", () => {
    // "Zeta" matches "a" case-insensitively; "alpha" is filtered out by status.
    const { result } = setup(["/?q=a&status=active"]);
    expect(result.current.results.map((i) => i.id)).toEqual([1]);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  test("paginates and reports the page count", () => {
    const { result } = setup(["/?sort=id"]);
    expect(result.current.pageCount).toBe(2);
    expect(result.current.visible).toHaveLength(2);

    act(() => result.current.setPage(2));
    expect(result.current.visible).toHaveLength(1);
  });

  test("clamps a page number left stranded past the end", () => {
    const { result } = setup(["/?page=99"]);
    expect(result.current.page).toBe(2);
    expect(result.current.visible.length).toBeGreaterThan(0);
  });

  test("toggleSort flips direction on the active column only", () => {
    const { result } = setup(["/?sort=name&dir=asc"]);

    act(() => result.current.toggleSort("name"));
    expect(result.current.sortDir).toBe("desc");

    act(() => result.current.toggleSort("price"));
    expect(result.current.sortKey).toBe("price");
    expect(result.current.sortDir).toBe("asc");
  });

  test("apply commits query and filters together and returns to page 1", () => {
    const { result } = setup(["/?page=2"]);

    act(() => result.current.apply({ q: "a", status: "active" }));

    expect(result.current.query).toBe("a");
    expect(result.current.filterValues.status).toBe("active");
    expect(result.current.page).toBe(1);
    expect(result.current.results.map((i) => i.id)).toEqual([1]);
  });

  test("apply with 'all' clears a filter rather than matching on it", () => {
    const { result } = setup(["/?status=archived"]);
    expect(result.current.total).toBe(1);

    act(() => result.current.apply({ q: "", status: "all" }));

    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.total).toBe(ITEMS.length);
  });

  test("clearAll drops every filter", () => {
    const { result } = setup(["/?q=a&status=active&page=2"]);
    act(() => result.current.clearAll());
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.total).toBe(ITEMS.length);
  });
});
