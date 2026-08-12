import { useEffect, useState } from "react";
import {
  Button,
  IconCheck,
  Input,
  Modal,
  Select,
  Stack,
} from "naytak-react-ui";
import { ADD_USER_ROLE_OPTIONS } from "../data/mock";

const EMPTY_FORM = { name: "", email: "", role: "viewer" };

/**
 * Modal form used to create or edit a user.
 * - `user` = null → "Add user" mode (starts empty).
 * - `user` = object → "Edit user" mode (prefilled, saved by id).
 */
export function AddUserModal({ open, user, onClose, onSave }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState(EMPTY_FORM);

  // Reset the form whenever the modal opens (fresh or prefilled from `user`).
  useEffect(() => {
    if (!open) return;
    setForm(
      user
        ? { name: user.name, email: user.email, role: user.role }
        : EMPTY_FORM,
    );
  }, [open, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      status: user ? user.status : "active",
    });
  };

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit user" : "Add user"}
      footer={
        <Stack direction="row" spacing={8} justify="center">
          <Button variant="secondary" outlined onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-user-form"
            outlined
            leftIcon={<IconCheck size={16} />}>
            {isEdit ? "Save changes" : "Save user"}
          </Button>
        </Stack>
      }>
      <form id="add-user-form" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={12}>
          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={setField("name")}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane@naytak.io"
            value={form.email}
            onChange={setField("email")}
            required
          />
          <Select
            label="Role"
            options={ADD_USER_ROLE_OPTIONS}
            value={form.role}
            onChange={setField("role")}
          />
        </Stack>
      </form>
    </Modal>
  );
}
