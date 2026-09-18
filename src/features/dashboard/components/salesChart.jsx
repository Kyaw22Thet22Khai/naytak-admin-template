import { Card, GroupedBarChart } from "naytak-react-ui";
import { REVENUE_SERIES } from "../data/mock";
import { CHART_HEIGHT } from "../../../constants/charts";
import { withNote } from "../../../components/titleNote";

/**
 * Monthly revenue against expenses.
 *
 * Deliberately NOT naytak-react-ui's AreaChart: that component stacks by
 * accumulating over the x-axis rather than across series, so a 12-month series
 * is drawn as a running total and shoots past the top of its own viewBox. A
 * grouped bar chart is also the more honest form here — revenue and expenses
 * are two quantities being compared, not parts that sum to a whole.
 */
export function SalesChart() {
  return (
    <Card
      className="h-100 chart-card"
      title={withNote("Sales Overview", "Monthly revenue vs. expenses")}>
      <GroupedBarChart
        series={REVENUE_SERIES}
        height={CHART_HEIGHT}
        ariaLabel="Monthly revenue compared with expenses"
      />
    </Card>
  );
}
