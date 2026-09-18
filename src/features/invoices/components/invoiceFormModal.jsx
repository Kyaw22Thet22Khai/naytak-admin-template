import {
  Button,
  IconCheck,
  Input,
  Modal,
  Select,
  Stack,
} from "naytak-react-ui";
import { FormField } from "../../../components/formField";
import {
  useForm,
  buildValidator,
  required,
  positiveNumber,
} from "../../../hooks/useForm";
import { STATUS_OPTIONS } from "../data/mock";

const FORM_STATUS_OPTIONS = STATUS_OPTIONS.filter(
  (option) => option.value !== "all",
);

const validate = buildValidator({
  customer: [required("Customer")],
  amount: [required("Amount"), positiveNumber("Amount")],
  issued: [required("Issue date")],
  due: [
    required("Due date"),
    (value, values) =>
      values.issued && value < values.issued
        ? "The due date cannot be before the issue date."
        : undefined,
  ],
});

/** Defaults to a 30-day payment term, counted from today. */
const emptyForm = () => {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 30);
  return {
    customer: "",
    amount: "",
    issued: today.toISOString().slice(0, 10),
    due: due.toISOString().slice(0, 10),
    status: "pending",
  };
};

export function InvoiceFormModal({ open, onClose, onSave }) {
  const form = useForm({
    initialValues: emptyForm(),
    validate,
    onSubmit: (values) =>
      onSave({
        customer: values.customer.trim(),
        amount: Number(values.amount),
        issued: values.issued,
        due: values.due,
        status: values.status,
      }),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New invoice"
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="invoice-form"
            loading={form.submitting}
            leftIcon={<IconCheck size={16} />}>
            Create invoice
          </Button>
        </Stack>
      }>
      <form id="invoice-form" onSubmit={form.handleSubmit} noValidate>
        <Stack direction="column" spacing={12}>
          <FormField error={form.errors.customer}>
            <Input
              id="customer"
              name="customer"
              label="Customer"
              placeholder="Jane Doe"
              value={form.values.customer}
              onChange={form.handleChange("customer")}
              onBlur={form.handleBlur("customer")}
            />
          </FormField>

          <FormField error={form.errors.amount}>
            <Input
              id="amount"
              name="amount"
              label="Amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.values.amount}
              onChange={form.handleChange("amount")}
              onBlur={form.handleBlur("amount")}
            />
          </FormField>

          <Stack direction="row" spacing={12} wrap>
            <FormField error={form.errors.issued} className="field-grow">
              <Input
                id="issued"
                name="issued"
                label="Issued"
                type="date"
                value={form.values.issued}
                onChange={form.handleChange("issued")}
                onBlur={form.handleBlur("issued")}
              />
            </FormField>
            <FormField error={form.errors.due} className="field-grow">
              <Input
                id="due"
                name="due"
                label="Due"
                type="date"
                value={form.values.due}
                onChange={form.handleChange("due")}
                onBlur={form.handleBlur("due")}
              />
            </FormField>
          </Stack>

          <Select
            label="Status"
            aria-label="Status"
            options={FORM_STATUS_OPTIONS}
            value={form.values.status}
            onChange={form.handleChange("status")}
          />
        </Stack>
      </form>
    </Modal>
  );
}
