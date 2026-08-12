import {
  Card,
  Timeline,
  IconCheckCircle,
  IconUser,
  IconDollarSign,
  IconXCircle,
  IconRefresh,
} from "naytak-react-ui";
import { RECENT_ACTIVITY } from "../data/mock";

const ICONS = {
  check: IconCheckCircle,
  user: IconUser,
  dollar: IconDollarSign,
  x: IconXCircle,
  refresh: IconRefresh,
};

export function ActivityFeed() {
  return (
    <Card className="h-100" title="Recent Activity">
      <Timeline
        items={RECENT_ACTIVITY.map((item) => {
          const Icon = ICONS[item.icon] ?? IconCheckCircle;
          return {
            title: item.title,
            time: item.time,
            content: item.content,
            color: item.color,
            icon: <Icon size={14} />,
          };
        })}
      />
    </Card>
  );
}
