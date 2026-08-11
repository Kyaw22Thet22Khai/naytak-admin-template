import { Card, Progress } from "naytak-react-ui";
import { TRAFFIC } from "../data/mock";
import { formatNumber } from "../../../utils/format";
import "./widgets.css";

export function TrafficSources() {
  return (
    <Card className="h-100" title="Traffic Sources" subtitle="Last 30 days">
      {TRAFFIC.map((item) => (
        <div key={item.label} className="traffic-item">
          <div className="traffic-item__head">
            <span className="traffic-item__label">{item.label}</span>
            <span className="traffic-item__visits">
              {formatNumber(item.visits)} visits
            </span>
          </div>
          <Progress value={item.value} color={item.color} />
        </div>
      ))}
    </Card>
  );
}
