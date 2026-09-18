import {
  Button,
  IconCheck,
  Input,
  Modal,
  Select,
  Stack,
  Textarea,
} from "naytak-react-ui";
import { FormField } from "../../../components/formField";
import { useForm, buildValidator, required } from "../../../hooks/useForm";
import { STATUS_OPTIONS } from "../data/mock";

/** Form-only status options (exclude the "All statuses" filter entry). */
const FORM_STATUS_OPTIONS = STATUS_OPTIONS.slice(1);

const EMPTY_FORM = {
  name: "",
  description: "",
  status: "active",
  progress: "0",
  due: "",
  team: "",
};

const validate = buildValidator({
  name: [required("Project name")],
  due: [required("Due date")],
  progress: [
    required("Progress"),
    (value) => {
      const parsed = Number(value);
      if (Number.isNaN(parsed)) return "Progress must be a number.";
      if (parsed < 0 || parsed > 100)
        return "Progress must be between 0 and 100.";
      return undefined;
    },
  ],
  team: [
    (value) =>
      String(value).trim() === "" ? "Add at least one team member." : undefined,
  ],
});

/**
 * Modal form used to create or edit a project.
 * - `project` = null → "New project" mode (starts empty).
 * - `project` = object → "Edit project" mode (prefilled, saved by id).
 */
export function ProjectFormModal({ open, project, onClose, onSave }) {
  const isEdit = Boolean(project);

  const form = useForm({
    // Mounted only while open, so this runs afresh on every open.
    initialValues: project
      ? {
          name: project.name,
          description: project.description,
          status: project.status,
          progress: String(project.progress),
          due: project.due,
          team: project.team.join(", "),
        }
      : EMPTY_FORM,
    validate,
    onSubmit: (values) =>
      onSave({
        name: values.name.trim(),
        description: values.description.trim(),
        status: values.status,
        progress: Number(values.progress),
        due: values.due,
        team: values.team
          .split(",")
          .map((member) => member.trim())
          .filter(Boolean),
      }),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit project" : "New project"}
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="project-form"
            loading={form.submitting}
            leftIcon={<IconCheck size={16} />}>
            {isEdit ? "Save changes" : "Create project"}
          </Button>
        </Stack>
      }>
      <form id="project-form" onSubmit={form.handleSubmit} noValidate>
        <Stack direction="column" spacing={12}>
          <FormField error={form.errors.name}>
            <Input
              id="name"
              name="name"
              label="Project name"
              placeholder="Website Redesign"
              value={form.values.name}
              onChange={form.handleChange("name")}
              onBlur={form.handleBlur("name")}
            />
          </FormField>

          <Textarea
            label="Description"
            aria-label="Description"
            placeholder="What is this project about?"
            value={form.values.description}
            onChange={form.handleChange("description")}
            rows={3}
            autoResize
          />

          <Stack direction="row" spacing={12} wrap>
            <div className="field-grow">
              <Select
                label="Status"
                aria-label="Status"
                options={FORM_STATUS_OPTIONS}
                value={form.values.status}
                onChange={form.handleChange("status")}
              />
            </div>
            <FormField error={form.errors.progress} className="field-grow">
              <Input
                id="progress"
                name="progress"
                label="Progress (%)"
                type="number"
                min={0}
                max={100}
                value={form.values.progress}
                onChange={form.handleChange("progress")}
                onBlur={form.handleBlur("progress")}
              />
            </FormField>
            <FormField error={form.errors.due} className="field-grow">
              <Input
                id="due"
                name="due"
                label="Due date"
                type="date"
                value={form.values.due}
                onChange={form.handleChange("due")}
                onBlur={form.handleBlur("due")}
              />
            </FormField>
          </Stack>

          <FormField error={form.errors.team}>
            <Input
              id="team"
              name="team"
              label="Team members"
              placeholder="Alice Johnson, Bob Smith"
              helperText="Separate names with commas."
              value={form.values.team}
              onChange={form.handleChange("team")}
              onBlur={form.handleBlur("team")}
            />
          </FormField>
        </Stack>
      </form>
    </Modal>
  );
}
