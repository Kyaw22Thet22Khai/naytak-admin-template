import {
  Grid,
  GridItem,
  Card,
  IconDollarSign,
  IconShoppingCart,
  IconUsers,
  IconTrendingUp,
} from "naytak-react-ui";
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

// CoreUI-inspired palette (falls back to primary)
const COLORS = {
  primary: "#2563eb",
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#0ea5e9",
  danger: "#ef4444",
};

export function WidgetCards() {
  return (
    <Grid container>
      {WIDGETS.map((widget) => {
        const Icon = ICONS[widget.icon];
        const color = COLORS[widget.color] ?? COLORS.primary;
        const up = widget.trend >= 0;
        return (
          <GridItem key={widget.id} xs={12} sm={6} lg={3} spacing={2}>
            <Card className="widget-card h-100">
              <div
                className="widget-card__icon"
                style={{ backgroundColor: `${color}1a`, color }}>
                <Icon size={22} />
              </div>
              <div className="widget-card__body">
                <div className="widget-card__label">{widget.label}</div>
                <div className="widget-card__value">
                  {FORMATTERS[widget.format](widget.value)}
                </div>
                <div
                  className="widget-card__trend"
                  style={{ color: up ? COLORS.success : COLORS.danger }}>
                  {up ? "▲" : "▼"} {Math.abs(widget.trend)}%
                  <span>{widget.note}</span>
                </div>
              </div>
            </Card>
          </GridItem>
        );
      })}
    </Grid>
  );
}
