import { Button, IconCheck, Input, Modal, Stack } from "naytak-react-ui";
import { FormField } from "../../../components/formField";
import { useForm, buildValidator, required } from "../../../hooks/useForm";

export function NewFolderModal({ open, existing = [], onClose, onCreate }) {
  const validate = buildValidator({
    name: [
      required("Folder name"),
      (value) =>
        existing.some(
          (name) => name.toLowerCase() === String(value).trim().toLowerCase(),
        )
          ? "A folder with that name already exists."
          : undefined,
    ],
  });

  const form = useForm({
    initialValues: { name: "" },
    validate,
    onSubmit: (values) => onCreate(values.name.trim()),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New folder"
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="folder-form"
            leftIcon={<IconCheck size={16} />}>
            Create folder
          </Button>
        </Stack>
      }>
      <form id="folder-form" onSubmit={form.handleSubmit} noValidate>
        <FormField error={form.errors.name}>
          <Input
            id="name"
            name="name"
            label="Folder name"
            placeholder="Campaign assets"
            value={form.values.name}
            onChange={form.handleChange("name")}
            onBlur={form.handleBlur("name")}
          />
        </FormField>
      </form>
    </Modal>
  );
}
