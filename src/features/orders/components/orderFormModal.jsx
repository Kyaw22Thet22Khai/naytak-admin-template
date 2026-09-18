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
  email,
  positiveNumber,
} from "../../../hooks/useForm";
import { STATUS_OPTIONS } from "../data/mock";

/** Filter options include an "All statuses" entry the form must not offer. */
const FORM_STATUS_OPTIONS = STATUS_OPTIONS.filter(
  (option) => option.value !== "all",
);

const validate = buildValidator({
  customer: [required("Customer name")],
  email: [required("Email"), email],
  items: [
    required("Item count"),
    positiveNumber("Item count"),
    (value) =>
      Number(value) < 1 ? "An order needs at least one item." : undefined,
  ],
  total: [required("Total"), positiveNumber("Total")],
  date: [required("Order date")],
});

const emptyForm = () => ({
  customer: "",
  email: "",
  items: "1",
  total: "",
  status: "pending",
  date: new Date().toISOString().slice(0, 10),
});

/** Create form for a new order. The id is assigned by the data layer. */
export function OrderFormModal({ open, onClose, onSave }) {
  const form = useForm({
    initialValues: emptyForm(),
    validate,
    onSubmit: (values) =>
      onSave({
        customer: values.customer.trim(),
        email: values.email.trim().toLowerCase(),
        items: Number(values.items),
        total: Number(values.total),
        status: values.status,
        date: values.date,
      }),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New order"
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="order-form"
            loading={form.submitting}
            leftIcon={<IconCheck size={16} />}>
            Create order
          </Button>
        </Stack>
      }>
      <form id="order-form" onSubmit={form.handleSubmit} noValidate>
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

          <FormField error={form.errors.email}>
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="jane@example.com"
              value={form.values.email}
              onChange={form.handleChange("email")}
              onBlur={form.handleBlur("email")}
            />
          </FormField>

          <Stack direction="row" spacing={12} wrap>
            <FormField error={form.errors.items} className="field-grow">
              <Input
                id="items"
                name="items"
                label="Items"
                type="number"
                min="1"
                step="1"
                value={form.values.items}
                onChange={form.handleChange("items")}
                onBlur={form.handleBlur("items")}
              />
            </FormField>
            <FormField error={form.errors.total} className="field-grow">
              <Input
                id="total"
                name="total"
                label="Total"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.values.total}
                onChange={form.handleChange("total")}
                onBlur={form.handleBlur("total")}
              />
            </FormField>
          </Stack>

          <Stack direction="row" spacing={12} wrap>
            <FormField error={form.errors.date} className="field-grow">
              <Input
                id="date"
                name="date"
                label="Order date"
                type="date"
                value={form.values.date}
                onChange={form.handleChange("date")}
                onBlur={form.handleBlur("date")}
              />
            </FormField>
            <div className="field-grow">
              <Select
                label="Status"
                aria-label="Status"
                options={FORM_STATUS_OPTIONS}
                value={form.values.status}
                onChange={form.handleChange("status")}
              />
            </div>
          </Stack>
        </Stack>
      </form>
    </Modal>
  );
}
