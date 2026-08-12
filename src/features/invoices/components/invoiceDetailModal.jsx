import { Avatar, Badge, Button, Divider, Modal, Stack } from "naytak-react-ui";
import { capitalize, formatCurrency, formatDate } from "../../../utils/format";
import { STATUS_COLORS } from "../data/mock";
import "../invoices.css";

/** Modal showing the full details of a selected invoice. */
export function InvoiceDetailModal({ invoice, onClose }) {
  if (!invoice) return null;

  return (
    <Modal
      open
      onClose={onClose}
      title="Invoice details"
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="secondary" outlined onClick={onClose}>
            Close
          </Button>
        </Stack>
      }>
      <Stack direction="row" spacing={12} align="center" className="mb-3">
        <Avatar size="lg" text={invoice.customer} />
        <div>
          <div className="invoice-detail__title">{invoice.id}</div>
          <div className="list-meta">{invoice.customer}</div>
          <Stack direction="row" spacing={8} className="mt-1">
            <Badge color={STATUS_COLORS[invoice.status] ?? "secondary"}>
              {capitalize(invoice.status)}
            </Badge>
          </Stack>
        </div>
      </Stack>

      <Divider spacing={4} />

      <div className="invoice-detail__rows">
        <div className="invoice-detail__row">
          <span>Issued</span>
          <strong>{formatDate(invoice.issued)}</strong>
        </div>
        <div className="invoice-detail__row">
          <span>Due</span>
          <strong>{formatDate(invoice.due)}</strong>
        </div>
        <div className="invoice-detail__row">
          <span>Amount</span>
          <strong>{formatCurrency(invoice.amount)}</strong>
        </div>
      </div>
    </Modal>
  );
}
