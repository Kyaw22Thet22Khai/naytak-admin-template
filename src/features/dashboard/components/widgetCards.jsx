import {
  Grid,
  GridItem,
  Card,
  IconDollarSign,
  IconShoppingCart,
  IconUsers,
  IconTrendingUp,
} from "naytak-react-ui";
import { Link } from "react-router-dom";
import { useCollection } from "../../../app/dataContext";
import { ROUTES } from "../../../app/routes";
import { WIDGETS } from "../data/mock";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../../../utils/format";
import "./widgets.css";

const ICONS = {
  dollar: IconDollarSign,
  cart: IconShoppingCart,
  users: IconUsers,
  trend: IconTrendingUp,
};

const FORMATTERS = {
  currency: formatCurrency,
  number: formatNumber,
  percent: formatPercent,
};

/**
 * Widget accents, taken from the theme palette so the cards follow the brand
 * colour and both colour modes rather than a frozen hex.
 */
const PALETTE = {
  primary: "var(--naytak-primary, #2563eb)",
  success: "var(--naytak-success)",
  warning: "var(--naytak-warning)",
  info: "var(--naytak-info)",
  danger: "var(--naytak-danger)",
};

/** Where each widget drills through to. */
const WIDGET_LINKS = {
  revenue: ROUTES.invoices,
  orders: ROUTES.orders,
  customers: ROUTES.customers,
  conversion: ROUTES.analytics,
};

export function WidgetCards() {
  // Read the live collections so the dashboard reflects edits made elsewhere,
  // instead of quoting numbers frozen into the mock file.
  const orders = useCollection("orders");
  const customers = useCollection("customers");
  const invoices = useCollection("invoices");

  const revenue = invoices.items
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const completedOrders = orders.items.filter(
    (order) => order.status === "completed",
  ).length;

  const conversion = orders.items.length
    ? (completedOrders / orders.items.length) * 100
    : 0;

  /** Live values keyed by widget id; anything unlisted keeps its seed value. */
  const liveValues = {
    revenue,
    orders: orders.items.length,
    customers: customers.items.filter((c) => c.status === "active").length,
    conversion,
  };

  return (
    <Grid container fluid>
      {WIDGETS.map((widget) => {
        const Icon = ICONS[widget.icon];
        const color = PALETTE[widget.color] ?? PALETTE.primary;
        const up = widget.trend >= 0;
        const value = liveValues[widget.id] ?? widget.value;
        const href = WIDGET_LINKS[widget.id];

        // Revenue is the number the dashboard is really about; giving it a
        // tint and a larger value stops the row reading as four equal tiles.
        const isPrimary = widget.id === "revenue";

        const card = (
          <Card
            className={`widget-card h-100 ${isPrimary ? "widget-card--primary" : ""}`}
            style={{ "--widget-accent": color }}>
            <div
              className="widget-card__icon"
              style={{
                backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
                color,
              }}>
              <Icon size={22} />
            </div>
            <div className="widget-card__body">
              <div className="widget-card__label">{widget.label}</div>
              <div className="widget-card__value">
                {FORMATTERS[widget.format](value)}
              </div>
              <div
                className="widget-card__trend"
                style={{ color: up ? PALETTE.success : PALETTE.danger }}>
                <span aria-hidden="true">{up ? "▲" : "▼"}</span>{" "}
                {Math.abs(widget.trend)}%<span>{widget.note}</span>
              </div>
            </div>
          </Card>
        );

        return (
          <GridItem key={widget.id} xs={12} sm={6} lg={3} spacing={2}>
            {href ? (
              // A metric that names a section should take you there.
              <Link
                to={href}
                className="widget-card__link"
                aria-label={`${widget.label}: view details`}>
                {card}
              </Link>
            ) : (
              card
            )}
          </GridItem>
        );
      })}
    </Grid>
  );
}
