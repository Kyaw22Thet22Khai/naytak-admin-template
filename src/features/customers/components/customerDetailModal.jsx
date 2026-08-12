import { Avatar, Badge, Button, Divider, Modal, Stack } from "naytak-react-ui";
import { formatCurrency, formatDate } from "../../../utils/format";
import {
  SEGMENT_COLORS,
  SEGMENT_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from "../data/mock";
import "../customers.css";

/** Modal showing the full details of a selected customer. */
export function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null;

  const segment = SEGMENT_LABELS[customer.segment] ?? customer.segment;
  const status = STATUS_LABELS[customer.status] ?? customer.status;

  return (
    <Modal
      open
      onClose={onClose}
      title="Customer details"
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="secondary" outlined onClick={onClose}>
            Close
          </Button>
        </Stack>
      }>
      <Stack direction="row" spacing={12} align="center" className="mb-3">
        <Avatar size="lg" text={customer.name} />
        <div>
          <div className="customer-detail__name">{customer.name}</div>
          <div className="list-meta">{customer.email}</div>
          <Stack direction="row" spacing={8} className="mt-1">
            <Badge color={SEGMENT_COLORS[customer.segment] ?? "info"}>
              {segment}
            </Badge>
            <Badge color={STATUS_COLORS[customer.status] ?? "secondary"}>
              {status}
            </Badge>
          </Stack>
        </div>
      </Stack>

      <Divider spacing={4} />

      <div className="customer-detail__rows">
        <div className="customer-detail__row">
          <span>Orders</span>
          <strong>{customer.orders}</strong>
        </div>
        <div className="customer-detail__row">
          <span>Total spent</span>
          <strong>{formatCurrency(customer.spent)}</strong>
        </div>
        <div className="customer-detail__row">
          <span>Last order</span>
          <strong>
            {customer.lastOrder ? formatDate(customer.lastOrder) : "—"}
          </strong>
        </div>
      </div>
    </Modal>
  );
}
