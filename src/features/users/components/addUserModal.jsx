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
} from "../../../hooks/useForm";
import { ADD_USER_ROLE_OPTIONS } from "../data/mock";

const EMPTY_FORM = { name: "", email: "", role: "viewer" };

const validate = buildValidator({
  name: [required("Full name")],
  email: [required("Email"), email],
});

/**
 * Modal form used to create or edit a user.
 * - `user` = null → "Add user" mode (starts empty).
 * - `user` = object → "Edit user" mode (prefilled, saved by id).
 */
export function AddUserModal({ open, user, onClose, onSave }) {
  const isEdit = Boolean(user);

  const form = useForm({
    // Mounted only while open, so this runs afresh on every open.
    initialValues: user
      ? { name: user.name, email: user.email, role: user.role }
      : EMPTY_FORM,
    validate,
    onSubmit: (values) =>
      onSave({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        role: values.role,
        status: user ? user.status : "active",
      }),
  });

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
            loading={form.submitting}
            leftIcon={<IconCheck size={16} />}>
            {isEdit ? "Save changes" : "Save user"}
          </Button>
        </Stack>
      }>
      <form id="add-user-form" onSubmit={form.handleSubmit} noValidate>
        <Stack direction="column" spacing={12}>
          <FormField error={form.errors.name}>
            <Input
              id="name"
              name="name"
              label="Full name"
              placeholder="Jane Doe"
              value={form.values.name}
              onChange={form.handleChange("name")}
              onBlur={form.handleBlur("name")}
            />
          </FormField>
          <FormField error={form.errors.email}>
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="jane@naytak.io"
              value={form.values.email}
              onChange={form.handleChange("email")}
              onBlur={form.handleBlur("email")}
            />
          </FormField>
          <Select
            label="Role"
            aria-label="Role"
            options={ADD_USER_ROLE_OPTIONS}
            value={form.values.role}
            onChange={form.handleChange("role")}
          />
        </Stack>
      </form>
    </Modal>
  );
}
