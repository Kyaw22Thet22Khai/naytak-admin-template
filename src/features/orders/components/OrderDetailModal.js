import { Avatar, Badge, Button, Divider, Modal, Stack } from "naytak-react-ui";
import { capitalize, formatCurrency, formatDate } from "../../../utils/format";
import { STATUS_COLORS } from "../data/mock";
import "../orders.css";

/** Modal showing the full details of a selected order. */
export function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <Modal
      open
      onClose={onClose}
      title="Order details"
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="secondary" outlined onClick={onClose}>
            Close
          </Button>
        </Stack>
      }>
      <Stack direction="row" spacing={12} align="center" className="mb-3">
        <Avatar size="lg" text={order.customer} />
        <div>
          <div className="order-detail__title">{order.id}</div>
          <div className="list-meta">
            {order.customer} · {order.email}
          </div>
          <Stack direction="row" spacing={8} className="mt-1">
            <Badge color={STATUS_COLORS[order.status] ?? "secondary"}>
              {capitalize(order.status)}
            </Badge>
          </Stack>
        </div>
      </Stack>

      <Divider spacing={4} />

      <div className="order-detail__rows">
        <div className="order-detail__row">
          <span>Order date</span>
          <strong>{formatDate(order.date)}</strong>
        </div>
        <div className="order-detail__row">
          <span>Items</span>
          <strong>{order.items}</strong>
        </div>
        <div className="order-detail__row">
          <span>Total</span>
          <strong>{formatCurrency(order.total)}</strong>
        </div>
      </div>
    </Modal>
  );
}
