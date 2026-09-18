import {
  Badge,
  Button,
  Card,
  FunnelChart,
  GaugeChart,
  Grid,
  GridItem,
  GroupedBarChart,
  IconActivity,
  IconClock,
  IconDownload,
  IconPulse,
  IconTrendingDown,
  IconUsers,
  LineChart,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";
import { downloadCsv } from "../../utils/exportCsv";
import {
  CHART_HEIGHT,
  FUNNEL_CHART_HEIGHT,
  SQUARE_CHART_MAX,
} from "../../constants/charts";
import {
  ANALYTICS_STATS,
  CONVERSION,
  LEAD_FUNNEL,
  REGION_SALES,
  VISITOR_SERIES,
} from "./data/mock";
import { withNote } from "../../components/titleNote";

/**
 * Chart palette, matching the Dashboard widget cards. Pulled from the theme
 * variables so charts follow the brand colour and both colour modes.
 */
const PALETTE = {
  primary: "var(--naytak-primary, #2563eb)",
  info: "var(--naytak-info)",
  warning: "var(--naytak-warning)",
  success: "var(--naytak-success)",
  danger: "var(--naytak-danger)",
};

const ICONS = {
  visitors: IconUsers,
  sessions: IconActivity,
  bounce: IconTrendingDown,
  duration: IconClock,
};

export function AnalyticsPage() {
  useDocumentTitle("Analytics");
  const toast = useToast();

  // Flattens the page's figures into one CSV, so "Export report" hands over
  // the numbers on screen rather than an apology.
  const handleExport = () => {
    const rows = [
      ...ANALYTICS_STATS.map((stat) => ({
        section: "Overview",
        label: stat.label,
        value: stat.value,
        change: `${stat.trend > 0 ? "+" : ""}${stat.trend}%`,
      })),
      ...VISITOR_SERIES.map((point) => ({
        section: "Visitors",
        label: point.x,
        value: point.y,
        change: "",
      })),
      ...LEAD_FUNNEL.map((step) => ({
        section: "Lead funnel",
        label: step.label,
        value: step.value,
        change: "",
      })),
      ...REGION_SALES.flatMap((region) =>
        region.data.map((point) => ({
          section: `Sales · ${region.name}`,
          label: point.x,
          value: point.y,
          change: "",
        })),
      ),
      {
        section: "Conversion",
        label: "Conversion rate",
        value: `${CONVERSION.value}%`,
        change: "",
      },
    ];
    downloadCsv(
      `analytics-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        { key: "section", label: "Section" },
        { key: "label", label: "Metric" },
        { key: "value", label: "Value" },
        { key: "change", label: "Change" },
      ],
      rows,
    );
    toast.success("Analytics report exported");
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote(
            "Analytics",
            "Traffic, conversion and revenue insights",
          )}
          actions={
            <>
              <Badge
                color="info"
                variant="soft"
                leftIcon={<IconPulse size={14} />}>
                Live · Last 90 days
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<IconDownload size={15} />}
                onClick={handleExport}>
                Export report
              </Button>
            </>
          }
        />
      </GridItem>

      <GridItem xs={12} className="mb-2">
        <Grid container fluid>
          {ANALYTICS_STATS.map((stat) => {
            const Icon = ICONS[stat.id] ?? IconUsers;
            const color = PALETTE[stat.color] ?? PALETTE.primary;
            const up = stat.trend >= 0;
            return (
              <GridItem key={stat.id} xs={12} sm={6} lg={3} spacing={2}>
                <Card
                  className="widget-card h-100"
                  style={{ "--widget-accent": color }}>
                  <div
                    className="widget-card__icon"
                    style={{ backgroundColor: `${color}1a`, color }}>
                    <Icon size={22} />
                  </div>
                  <div className="widget-card__body">
                    <div className="widget-card__label">{stat.label}</div>
                    <div className="widget-card__value">{stat.value}</div>
                    <div
                      className="widget-card__trend"
                      style={{
                        color: up ? PALETTE.success : PALETTE.danger,
                      }}>
                      {up ? "▲" : "▼"} {Math.abs(stat.trend)}%
                      <span>vs last period</span>
                    </div>
                  </div>
                </Card>
              </GridItem>
            );
          })}
        </Grid>
      </GridItem>

      {/* Equal halves across both chart rows, so the page reads as a grid
          rather than four panels of arbitrary width. */}
      <GridItem xs={12} md={6} spacing={2} className="mb-2">
        <Card
          className="h-100 chart-card"
          title={withNote("Visitors", "Unique visitors per month")}>
          <LineChart
            data={VISITOR_SERIES}
            height={CHART_HEIGHT}
            color="primary"
            fill
            showPoints
            ariaLabel="Unique visitors per month"
          />
        </Card>
      </GridItem>

      <GridItem xs={12} md={6} spacing={2} className="mb-2">
        <Card
          className="h-100 chart-card"
          title={withNote("Conversion Rate", "Overall visitor → customer")}>
          {/* A gauge has a square viewBox and stretches to its container, so
              in a half-width card it would render several hundred pixels tall
              and dwarf the line chart beside it. */}
          <div className="chart-card__square">
            <GaugeChart
              value={CONVERSION.value}
              max={CONVERSION.max}
              color="success"
              size={SQUARE_CHART_MAX}
              ariaLabel={`Conversion rate ${CONVERSION.value} percent`}
            />
          </div>
        </Card>
      </GridItem>

      <GridItem xs={12} md={6} spacing={2} className="mb-2">
        <Card
          className="h-100 chart-card"
          title={withNote("Sales by Region", "Monthly revenue index, Q3")}>
          <GroupedBarChart
            series={REGION_SALES}
            height={CHART_HEIGHT}
            showValues
            ariaLabel="Monthly revenue index by region"
          />
        </Card>
      </GridItem>

      <GridItem xs={12} md={6} spacing={2}>
        <Card
          className="h-100 chart-card"
          title={withNote("Lead Funnel", "Visitor → paid customer")}>
          <FunnelChart
            data={LEAD_FUNNEL}
            height={FUNNEL_CHART_HEIGHT}
            showValues
            ariaLabel="Lead funnel from visitor to paid customer"
          />
        </Card>
      </GridItem>
    </Grid>
  );
}
