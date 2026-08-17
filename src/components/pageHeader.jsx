import { Stack } from "naytak-react-ui";

/** Page title row with optional subtitle and action buttons. */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <Stack
      direction="row"
      justify="space-between"
      align="center"
      spacing={16}
      className="page-header">
      <div>
        <h2 className="page-header__title">{title}</h2>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && (
        <Stack direction="row" spacing={8}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}
