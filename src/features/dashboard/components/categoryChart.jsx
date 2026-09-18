import { Card, PieChart } from "naytak-react-ui";
import { CATEGORY_SALES } from "../data/mock";
import { SQUARE_CHART_MAX } from "../../../constants/charts";

export function CategoryChart() {
  return (
    <Card className="h-100 chart-card" title="Sales by Category">
      <PieChart
        data={CATEGORY_SALES}
        size={SQUARE_CHART_MAX}
        innerRadius={0.6}
        showLegend
        ariaLabel="Share of sales by product category"
      />
    </Card>
  );
}
