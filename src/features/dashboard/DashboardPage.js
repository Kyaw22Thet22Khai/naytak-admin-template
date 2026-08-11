import { Grid, GridItem } from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { WidgetCards } from "./components/WidgetCards";
import { SalesChart } from "./components/SalesChart";
import { CategoryChart } from "./components/CategoryChart";
import { TrafficSources } from "./components/TrafficSources";
import { ActivityFeed } from "./components/ActivityFeed";
import { RecentActivity } from "./components/RecentActivity";

export function DashboardPage() {
  useDocumentTitle("Dashboard");

  return (
    <Grid container fluid>
      <GridItem xs={12} className="mb-2">
        <WidgetCards />
      </GridItem>
      <GridItem xs={12} md={8} spacing={2} className="mb-2">
        <SalesChart />
      </GridItem>
      <GridItem xs={12} md={4} spacing={2} className="mb-2">
        <CategoryChart />
      </GridItem>
      <GridItem xs={12} md={6} spacing={2} className="mb-2">
        <TrafficSources />
      </GridItem>
      <GridItem xs={12} md={6} spacing={2} className="mb-2">
        <ActivityFeed />
      </GridItem>
      <GridItem xs={12} spacing={2}>
        <RecentActivity />
      </GridItem>
    </Grid>
  );
}
