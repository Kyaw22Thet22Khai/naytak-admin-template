import {
  Card,
  FunnelChart,
  GaugeChart,
  Grid,
  GridItem,
  GroupedBarChart,
  LineChart,
  Stat,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/PageHeader";
import {
  ANALYTICS_STATS,
  CONVERSION,
  LEAD_FUNNEL,
  REGION_SALES,
  VISITOR_SERIES,
} from "./data/mock";

export function AnalyticsPage() {
  useDocumentTitle("Analytics");

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Analytics"
          subtitle="Traffic, conversion and revenue insights"
        />
      </GridItem>

      <GridItem xs={12} spacing={2} className="mb-2">
        <Grid container>
          {ANALYTICS_STATS.map((stat) => (
            <GridItem key={stat.id} xs={12} sm={6} lg={3} spacing={2}>
              <Card className="h-100">
                <Stat
                  label={stat.label}
                  value={stat.value}
                  trend={stat.trend}
                  color={stat.color}
                  size="md"
                />
              </Card>
            </GridItem>
          ))}
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
