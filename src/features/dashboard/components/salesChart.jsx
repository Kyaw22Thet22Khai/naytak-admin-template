import { Card, AreaChart } from "naytak-react-ui";
import { REVENUE_SERIES } from "../data/mock";

export function SalesChart() {
  return (
    <Card
      className="h-100"
      title="Sales Overview"
      subtitle="Monthly revenue vs. expenses">
      <AreaChart series={REVENUE_SERIES} height={300} />
    </Card>
  );
}
