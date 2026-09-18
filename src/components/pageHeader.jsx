import { Stack } from "naytak-react-ui";

/**
 * Page title row with action buttons.
 *
 * A title and its description are combined by the caller with `withNote`
 * ("Products (Manage your product catalog)"), which is the same helper the
 * Card call sites use — so there is one mechanism for it across the app
 * rather than a special case for whichever component owns the markup.
 */
export function PageHeader({ title, actions }) {
  return (
    <Stack
      direction="row"
      justify="space-between"
      align="center"
      spacing={16}
      className="page-header">
      <h2 className="page-header__title">{title}</h2>
      {actions && (
        <Stack direction="row" spacing={8}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}
