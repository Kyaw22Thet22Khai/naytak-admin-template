import { useEffect, useState } from "react";
import {
  Button,
  IconCheck,
  Input,
  Modal,
  Select,
  Stack,
} from "naytak-react-ui";
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

/**
 * Modal form for creating or editing a product.
 * - `product` = null → "Add product" mode (starts empty).
 * - `product` = object → "Edit product" mode (prefilled, saved by id).
 */
export function ProductFormModal({ open, product, onClose, onSave }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState(EMPTY_FORM);

  // Reset the form whenever the modal opens (fresh or prefilled from `product`).
  useEffect(() => {
    if (!open) return;
    setForm(
      product
        ? {
            ...product,
            price: String(product.price),
            stock: String(product.stock),
          }
        : EMPTY_FORM,
    );
  }, [open, product]);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      status: form.status,
      icon: form.icon,
    });
  };

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
            leftIcon={<IconCheck size={16} />}>
            {isEdit ? "Save changes" : "Add product"}
          </Button>
        </Stack>
      }>
      <form id="product-form" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={12}>
          <Input
            label="Name"
            placeholder="Product name"
            value={form.name}
            onChange={setField("name")}
            required
          />
          <Stack direction="row" spacing={12} wrap>
            <div style={{ flex: "1 1 200px" }}>
              <Select
                label="Category"
                options={FORM_CATEGORY_OPTIONS}
                value={form.category}
                onChange={setField("category")}
              />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <Select
                label="Icon"
                options={ICON_OPTIONS}
                value={form.icon}
                onChange={setField("icon")}
              />
            </div>
          </Stack>
          <Stack direction="row" spacing={12} wrap>
            <div style={{ flex: "1 1 200px" }}>
              <Input
                label="Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={setField("price")}
                required
              />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <Input
                label="Stock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={form.stock}
                onChange={setField("stock")}
                required
              />
            </div>
          </Stack>
          <Select
            label="Stock status"
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={setField("status")}
          />
        </Stack>
      </form>
    </Modal>
  );
}
