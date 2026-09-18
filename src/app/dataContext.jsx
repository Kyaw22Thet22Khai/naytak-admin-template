import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CUSTOMERS } from "../features/customers/data/mock";
import { ORDERS } from "../features/orders/data/mock";
import { PRODUCTS } from "../features/products/data/mock";
import { INVOICES } from "../features/invoices/data/mock";
import { TASKS } from "../features/tasks/data/mock";
import { PROJECTS } from "../features/projects/data/mock";
import { USERS } from "../features/users/data/mock";
import { MESSAGES } from "../features/messages/data/mock";
import { FILES } from "../features/media/data/mock";
import { EVENTS } from "../features/calendar/data/mock";

const DataContext = createContext(null);

/** Storage key holding every collection as one object. */
const DATA_KEY = "collections";

/**
 * Seed records, keyed by collection name. Swapping this template onto a real
 * backend means replacing DataProvider's body with fetches — the `useCollection`
 * API the pages consume stays the same.
 */
const SEED = {
  customers: CUSTOMERS,
  orders: ORDERS,
  products: PRODUCTS,
  invoices: INVOICES,
  tasks: TASKS,
  projects: PROJECTS,
  users: USERS,
  messages: MESSAGES,
  media: FILES,
  events: EVENTS,
};

/**
 * Id generators for collections whose ids are formatted strings rather than
 * plain numbers. Each keeps the shape the seed records already use, so a new
 * record is indistinguishable from an existing one.
 */
const ID_FORMATTERS = {
  // ORD-1042 → ORD-1043
  orders: (items) => {
    const used = items
      .map((item) => Number(String(item.id).match(/(\d+)$/)?.[1]))
      .filter((n) => Number.isFinite(n));
    return `ORD-${(used.length ? Math.max(...used) : 1000) + 1}`;
  },
  // INV-2026-018 → INV-2026-019, numbered per year and zero-padded.
  invoices: (items) => {
    const year = new Date().getFullYear();
    const used = items
      .map((item) => String(item.id).match(/^INV-(\d{4})-(\d+)$/))
      .filter((match) => match && Number(match[1]) === year)
      .map((match) => Number(match[2]));
    const next = (used.length ? Math.max(...used) : 0) + 1;
    return `INV-${year}-${String(next).padStart(3, "0")}`;
  },
};

/** Next id for a collection, matching the shape its seed records already use. */
function nextId(name, items) {
  const formatter = ID_FORMATTERS[name];
  if (formatter) return formatter(items);
  const used = items.map((item) => Number(item.id)).filter(Number.isFinite);
  return (used.length ? Math.max(...used) : 0) + 1;
}

export function DataProvider({ children }) {
  const [collections, setCollections] = useLocalStorage(DATA_KEY, SEED);

  // A collection added in a later version of the template will be missing from
  // a visitor's stored copy, so fall back to the seed per key rather than
  // discarding everything they have changed.
  const resolved = useMemo(() => {
    const merged = {};
    for (const name of Object.keys(SEED)) {
      merged[name] = Array.isArray(collections?.[name])
        ? collections[name]
        : SEED[name];
    }
    return merged;
  }, [collections]);

  const setCollection = useCallback(
    (name, updater) =>
      setCollections((prev) => {
        const current = Array.isArray(prev?.[name]) ? prev[name] : SEED[name];
        return { ...prev, [name]: updater(current) };
      }),
    [setCollections],
  );

  const resetAll = useCallback(() => setCollections(SEED), [setCollections]);

  const value = useMemo(
    () => ({ collections: resolved, setCollection, resetAll }),
    [resolved, setCollection, resetAll],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/**
 * CRUD access to one shared collection.
 *
 * Every page reads through this, so an edit made on Products is visible on the
 * Dashboard, survives navigation, and survives a reload.
 */
export function useCollection(name) {
  const context = useContext(DataContext);
  if (!context)
    throw new Error("useCollection must be used inside <DataProvider>");
  const { collections, setCollection } = context;

  if (!(name in SEED)) {
    throw new Error(
      `Unknown collection "${name}". Add it to SEED in app/dataContext.jsx.`,
    );
  }

  const items = collections[name];

  const add = useCallback(
    (record) => {
      const created = { ...record, id: record.id ?? nextId(name, items) };
      setCollection(name, (prev) => [created, ...prev]);
      return created;
    },
    [name, items, setCollection],
  );

  const update = useCallback(
    (id, changes) =>
      setCollection(name, (prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...(typeof changes === "function" ? changes(item) : changes),
              }
            : item,
        ),
      ),
    [name, setCollection],
  );

  const remove = useCallback(
    (id) =>
      setCollection(name, (prev) => prev.filter((item) => item.id !== id)),
    [name, setCollection],
  );

  /** Puts a removed record back at its original position (undo for delete). */
  const restore = useCallback(
    (record, index) =>
      setCollection(name, (prev) => {
        const next = [...prev];
        next.splice(Math.min(index, next.length), 0, record);
        return next;
      }),
    [name, setCollection],
  );

  const reset = useCallback(
    () => setCollection(name, () => SEED[name]),
    [name, setCollection],
  );

  return useMemo(
    () => ({ items, add, update, remove, restore, reset }),
    [items, add, update, remove, restore, reset],
  );
}

/** Restores every collection to its seed data. Used by Settings. */
export function useResetDemoData() {
  const context = useContext(DataContext);
  if (!context)
    throw new Error("useResetDemoData must be used inside <DataProvider>");
  return context.resetAll;
}
