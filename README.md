# Naytak Admin

A React admin dashboard template built on [naytak-react-ui](https://www.npmjs.com/package/naytak-react-ui), with 15 ready-made modules, a guarded auth flow, and sample data you can edit.

React 19 · Vite 7 · React Router 6 · Vitest

## Quick start

```bash
npm install
npm run dev        # http://127.0.0.1:3000
```

Sign in with the demo account (the sign-in screen also has a "Fill demo credentials" button):

```
alice@naytak.io / naytak123
```

## Scripts

| Command           | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload (`npm start` is an alias) |
| `npm run build`   | Production build into `dist/`                        |
| `npm run preview` | Serve the built `dist/` locally                      |
| `npm test`        | Run the test suite (`test:watch` for watch mode)     |
| `npm run lint`    | ESLint (`lint:fix` to auto-fix)                      |
| `npm run format`  | Prettier (`format:check` to verify only)             |
| `npm run deploy`  | Build and publish `dist/` to GitHub Pages            |

## How it is put together

```
src/
  app/          providers, router, routes, auth + data contexts
  components/   shared UI (list toolbar, form field, undo bar, …)
  features/     one folder per module: page, components, mock data
  hooks/        useListState, useForm, useLocalStorage, useMediaQuery
  layouts/      the admin shell (sidebar, navbar, breadcrumb)
  utils/        formatting, CSV export, project ZIP export
```

### Data

There is no backend. `app/dataContext.jsx` seeds every collection from the
`features/*/data/mock.js` files and stores changes in `localStorage`, so records
you add, edit or delete survive a reload and are shared across pages — a product
you add shows up in the dashboard totals.

Pages read and write through `useCollection`:

```jsx
const products = useCollection("products");

products.add({ name: "Widget", price: 20 });
products.update(id, { price: 25 });
products.remove(id);
products.restore(record, index); // used by the undo bar
```

**To point this at a real API**, replace the body of `DataProvider` with your
fetches. Every page consumes the same `useCollection` shape, so nothing else has
to change. Settings → Data has a button that restores the original sample data.

### Auth

`app/authContext.jsx` holds the session. `ProtectedRoute` guards the admin shell
and remembers where a signed-out visitor was heading, so sign-in returns them
there. Swap the body of `signIn` for a call to your own endpoint.

### List pages

Search, filters, sorting and pagination all live in `hooks/useListState.js`, and
all of it is mirrored into the URL — so a filtered view can be bookmarked and
shared, and the Back button restores it.

```jsx
// Declare these at module level: the hook memoizes on their identity.
const SEARCH_KEYS = ["name", "email"];
const FILTERS = { status: (row, value) => row.status === value };

const list = useListState({
  items: users.items,
  searchKeys: SEARCH_KEYS,
  filters: FILTERS,
  defaultSort: "name",
  pageSize: 8,
});
```

Pair it with `<ListToolbar>`, `<SortableTh>`, `<ListPagination>` and
`<ListEmptyState>`. After saving a record, call `list.revealItem(saved)` so the
user actually sees it, whatever the active sort and filters are.

### Forms

`hooks/useForm.js` gives you values, per-field errors and submit handling.
Errors appear on blur once a field is touched, and on submit for every field.
Wrap each control in `<FormField error={…}>` so the message renders with the
right `aria-invalid` / `aria-describedby` wiring.

```jsx
const validate = buildValidator({
  email: [required("Email"), email],
  password: [required("Password"), minLength(6, "Password")],
});
```

Form modals are rendered only while open (`{formOpen && <Modal … />}`), which is
what resets them between uses.

### Adding a module

1. Add the path to `ROUTES` and an entry to `NAV_ITEMS` in `app/routes.js`.
2. Create `features/<name>/` with a page and an `index.js` barrel export.
3. Register a lazy route in `app/router.jsx`.
4. If it has records, add them to `SEED` in `app/dataContext.jsx`.

### Theming and breakpoints

`app/theme.js` sets the initial color mode and brand color; the user's choice is
remembered. Custom CSS uses the `--naytak-*` variables (with literal fallbacks)
so it follows both the brand color and the dark theme.

Breakpoints live in `constants/app.js` and are the single source of truth for CSS
and JS alike — every `@media (max-width: …)` uses one of those values minus 1,
and JS reads them through `hooks/useMediaQuery.js`.

## Deploying

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds and
publishes `dist/` to the `gh-pages` branch. The workflow passes the repository
name as `VITE_BASE_PATH`, which sets both the asset base and the router
basename — so a fork deploys correctly with no code changes.

Routing uses the History API (no `#`). A Vite plugin writes `dist/404.html` as a
copy of `index.html` so deep links survive a refresh on GitHub Pages.
