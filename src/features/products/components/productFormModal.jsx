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
import { CATEGORY_OPTIONS } from "../data/mock";

/** Categories shown in the form (excludes the "All categories" filter entry). */
const FORM_CATEGORY_OPTIONS = CATEGORY_OPTIONS.slice(1);

const STATUS_OPTIONS = [
  { label: "In stock", value: "in_stock" },
  { label: "Low stock", value: "low_stock" },
  { label: "Out of stock", value: "out_of_stock" },
];

const ICON_OPTIONS = [
  { label: "Laptop", value: "laptop" },
  { label: "Headphones", value: "headphones" },
  { label: "Smartphone", value: "smartphone" },
  { label: "TV", value: "tv" },
  { label: "Speaker", value: "speaker" },
  { label: "Tablet", value: "tablet" },
  { label: "Camera", value: "camera" },
  { label: "Keyboard", value: "keyboard" },
  { label: "Battery", value: "battery" },
  { label: "Zap", value: "zap" },
];

const EMPTY_FORM = {
  name: "",
  category: "Electronics",
  price: "",
  stock: "",
  status: "in_stock",
  icon: "laptop",
};

const validate = buildValidator({
  name: [required("Name")],
  price: [required("Price"), positiveNumber("Price")],
  stock: [
    required("Stock"),
    positiveNumber("Stock"),
    (value) =>
      value !== "" && !Number.isInteger(Number(value))
        ? "Stock must be a whole number."
        : undefined,
  ],
});

/**
 * Modal form for creating or editing a product.
 * - `product` = null → "Add product" mode (starts empty).
 * - `product` = object → "Edit product" mode (prefilled, saved by id).
 */
export function ProductFormModal({ open, product, onClose, onSave }) {
  const isEdit = Boolean(product);

  const form = useForm({
    // Mounted only while open, so this runs afresh on every open — which is
    // what the old reset effect was for.
    initialValues: product
      ? {
          ...product,
          price: String(product.price),
          stock: String(product.stock),
        }
      : EMPTY_FORM,
    validate,
    onSubmit: (values) =>
      onSave({
        name: values.name.trim(),
        category: values.category,
        price: Number(values.price),
        stock: Number(values.stock),
        status: values.status,
        icon: values.icon,
      }),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit product" : "Add product"}
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="product-form"
            loading={form.submitting}
            leftIcon={<IconCheck size={16} />}>
            {isEdit ? "Save changes" : "Add product"}
          </Button>
        </Stack>
      }>
      <form id="product-form" onSubmit={form.handleSubmit} noValidate>
        <Stack direction="column" spacing={12}>
          <FormField error={form.errors.name}>
            <Input
              id="name"
              name="name"
              label="Name"
              placeholder="Product name"
              value={form.values.name}
              onChange={form.handleChange("name")}
              onBlur={form.handleBlur("name")}
            />
          </FormField>

          <Stack direction="row" spacing={12} wrap>
            <div className="field-grow">
              <Select
                label="Category"
                aria-label="Category"
                options={FORM_CATEGORY_OPTIONS}
                value={form.values.category}
                onChange={form.handleChange("category")}
              />
            </div>
            <div className="field-grow">
              <Select
                label="Icon"
                aria-label="Icon"
                options={ICON_OPTIONS}
                value={form.values.icon}
                onChange={form.handleChange("icon")}
              />
            </div>
          </Stack>

          <Stack direction="row" spacing={12} wrap>
            <FormField error={form.errors.price} className="field-grow">
              <Input
                id="price"
                name="price"
                label="Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.values.price}
                onChange={form.handleChange("price")}
                onBlur={form.handleBlur("price")}
              />
            </FormField>
            <FormField error={form.errors.stock} className="field-grow">
              <Input
                id="stock"
                name="stock"
                label="Stock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={form.values.stock}
                onChange={form.handleChange("stock")}
                onBlur={form.handleBlur("stock")}
              />
            </FormField>
          </Stack>

          <Select
            label="Stock status"
            aria-label="Stock status"
            options={STATUS_OPTIONS}
            value={form.values.status}
            onChange={form.handleChange("status")}
          />
        </Stack>
      </form>
    </Modal>
  );
}
