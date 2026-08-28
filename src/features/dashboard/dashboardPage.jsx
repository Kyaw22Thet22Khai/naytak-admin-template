import {
  Badge,
  Button,
  Grid,
  GridItem,
  IconArrowRight,
  IconPulse,
} from "naytak-react-ui";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";
import { ROUTES } from "../../app/routes";
import { WidgetCards } from "./components/widgetCards";
import { SalesChart } from "./components/salesChart";
import { CategoryChart } from "./components/categoryChart";
import { TrafficSources } from "./components/trafficSources";
import { ActivityFeed } from "./components/activityFeed";
import { RecentActivity } from "./components/recentActivity";

export function DashboardPage() {
  useDocumentTitle("Dashboard");

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Dashboard"
          subtitle="A live overview of your store's performance"
          actions={
            <>
              <Badge
                color="success"
                variant="soft"
                leftIcon={<IconPulse size={14} />}>
                Live · Last 30 days
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                as={Link}
                to={ROUTES.analytics}
                rightIcon={<IconArrowRight size={15} />}>
                View analytics
              </Button>
            </>
          }
        />
      </GridItem>
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
