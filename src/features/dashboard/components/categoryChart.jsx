import { Card, PieChart } from "naytak-react-ui";
import { CATEGORY_SALES } from "../data/mock";

export function CategoryChart() {
  return (
    <Card className="h-100" title="Sales by Category">
      <PieChart data={CATEGORY_SALES} innerRadius={0.6} showLegend />
    </Card>
  );
}
