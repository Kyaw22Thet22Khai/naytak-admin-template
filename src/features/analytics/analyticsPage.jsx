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
import {
  ANALYTICS_STATS,
  CONVERSION,
  LEAD_FUNNEL,
  REGION_SALES,
  VISITOR_SERIES,
} from "./data/mock";

// Professional muted palette — matches the Dashboard widget cards.
const PALETTE = {
  primary: "#2563eb",
  info: "#0ea5e9",
  warning: "#f59e0b",
  success: "#10b981",
  danger: "#ef4444",
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

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Analytics"
          subtitle="Traffic, conversion and revenue insights"
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
                onClick={() => toast.success("Report export coming soon")}>
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

      <GridItem xs={12} md={8} spacing={2} className="mb-2">
        <Card
          className="h-100"
          title="Visitors"
          subtitle="Unique visitors per month">
          <LineChart
            data={VISITOR_SERIES}
            height={300}
            color="primary"
            fill
            showPoints
          />
        </Card>
      </GridItem>

      <GridItem xs={12} md={4} spacing={2} className="mb-2">
        <Card
          className="h-100"
          title="Conversion Rate"
          subtitle="Overall visitor → customer">
          <div style={{ textAlign: "center" }}>
            <GaugeChart
              value={CONVERSION.value}
              max={CONVERSION.max}
              color="success"
              size={220}
            />
          </div>
        </Card>
      </GridItem>

      <GridItem xs={12} md={6} spacing={2} className="mb-2">
        <Card
          className="h-100"
          title="Sales by Region"
          subtitle="Monthly revenue index, Q3">
          <GroupedBarChart series={REGION_SALES} height={280} showValues />
        </Card>
      </GridItem>

      <GridItem xs={12} md={6} spacing={2}>
        <Card
          className="h-100"
          title="Lead Funnel"
          subtitle="Visitor → paid customer">
          <FunnelChart data={LEAD_FUNNEL} height={280} showValues />
        </Card>
      </GridItem>
    </Grid>
  );
}
