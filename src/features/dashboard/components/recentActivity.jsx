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
import { useCollection } from "../../../app/dataContext";
import { formatCurrency, formatDate, capitalize } from "../../../utils/format";
import { withNote } from "../../../components/titleNote";
import { ROUTES } from "../../../app/routes";

/** How many of the newest orders the dashboard shows. */
const RECENT_LIMIT = 5;

const STATUS_COLORS = {
  completed: "success",
  pending: "warning",
  cancelled: "danger",
};

export function RecentActivity() {
  const navigate = useNavigate();
  const orders = useCollection("orders");

  // Reads the live orders collection, so an order created on the Orders page
  // shows up here immediately.
  const recent = [...orders.items]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, RECENT_LIMIT);

  return (
    <Card
      title={withNote("Recent Orders", "Latest orders from your store")}
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
              <th scope="col">Order</th>
              <th scope="col">Customer</th>
              <th scope="col">Date</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </TableHead>
          <TableBody>
            {recent.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <Avatar size="sm" text={order.customer} /> {order.customer}
                </td>
                <td>{formatDate(order.date)}</td>
                <td>{formatCurrency(order.total ?? order.amount)}</td>
                <td>
                  <Badge color={STATUS_COLORS[order.status] ?? "secondary"}>
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
