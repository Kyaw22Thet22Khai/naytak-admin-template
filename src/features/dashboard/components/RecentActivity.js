import {
  Button,
  Card,
  Table,
  TableHead,
  TableBody,
  Badge,
  Avatar,
} from "naytak-react-ui";
import { useNavigate } from "react-router-dom";
import { RECENT_ORDERS } from "../data/mock";
import { formatCurrency, formatDate, capitalize } from "../../../utils/format";
import { ROUTES } from "../../../app/routes";

const STATUS_COLORS = {
  completed: "success",
  pending: "warning",
  cancelled: "danger",
};

export function RecentActivity() {
  const navigate = useNavigate();

  return (
    <Card
      title="Recent Orders"
      subtitle="Latest orders from your store"
      footer={
        <div style={{ textAlign: "right" }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.orders)}>
            View all orders
          </Button>
        </div>
      }>
      <div className="table-scroll">
        <Table>
          <TableHead color="primary">
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </TableHead>
          <TableBody>
            {RECENT_ORDERS.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <Avatar size="sm" text={order.customer} /> {order.customer}
                </td>
                <td>{formatDate(order.date)}</td>
                <td>{formatCurrency(order.amount)}</td>
                <td>
                  <Badge color={STATUS_COLORS[order.status]}>
                    {capitalize(order.status)}
                  </Badge>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
