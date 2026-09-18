import {
  Button,
  IconCheck,
  Input,
  Modal,
  Select,
  Stack,
} from "naytak-react-ui";
import { FormField } from "../../../components/formField";
import { useForm, buildValidator, required } from "../../../hooks/useForm";
import { PRIORITY_OPTIONS, STATUS_OPTIONS, TASKS } from "../data/mock";

/** Form-only options (exclude the "All …" filter entries). */
const FORM_PRIORITY_OPTIONS = PRIORITY_OPTIONS.slice(1);
const FORM_STATUS_OPTIONS = STATUS_OPTIONS.slice(1);

/** Assignee pick-list derived from the seed task data. */
const ASSIGNEE_OPTIONS = [...new Set(TASKS.map((task) => task.assignee))].map(
  (name) => ({ label: name, value: name }),
);

const EMPTY_FORM = {
  title: "",
  assignee: ASSIGNEE_OPTIONS[0]?.value ?? "",
  priority: "medium",
  status: "todo",
  due: "",
};

const validate = buildValidator({
  title: [required("Task title")],
  assignee: [required("Assignee")],
  due: [required("Due date")],
});

/**
 * Modal form used to create or edit a task.
 * - `task` = null → "New task" mode (starts empty).
 * - `task` = object → "Edit task" mode (prefilled, saved by id).
 */
export function TaskFormModal({ open, task, onClose, onSave }) {
  const isEdit = Boolean(task);

  const form = useForm({
    // Mounted only while open, so this runs afresh on every open.
    initialValues: task
      ? {
          title: task.title,
          assignee: task.assignee,
          priority: task.priority,
          status: task.status,
          due: task.due,
        }
      : EMPTY_FORM,
    validate,
    onSubmit: (values) =>
      onSave({
        title: values.title.trim(),
        assignee: values.assignee,
        priority: values.priority,
        status: values.status,
        due: values.due,
      }),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit task" : "New task"}
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="task-form"
            loading={form.submitting}
            leftIcon={<IconCheck size={16} />}>
            {isEdit ? "Save changes" : "Create task"}
          </Button>
        </Stack>
      }>
      <form id="task-form" onSubmit={form.handleSubmit} noValidate>
        <Stack direction="column" spacing={12}>
          <FormField error={form.errors.title}>
            <Input
              id="title"
              name="title"
              label="Task title"
              placeholder="What needs to be done?"
              value={form.values.title}
              onChange={form.handleChange("title")}
              onBlur={form.handleBlur("title")}
            />
          </FormField>

          <Select
            label="Assignee"
            aria-label="Assignee"
            options={ASSIGNEE_OPTIONS}
            value={form.values.assignee}
            onChange={form.handleChange("assignee")}
          />

          <Stack direction="row" spacing={12} wrap>
            <div className="field-grow">
              <Select
                label="Priority"
                aria-label="Priority"
                options={FORM_PRIORITY_OPTIONS}
                value={form.values.priority}
                onChange={form.handleChange("priority")}
              />
            </div>
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

          <FormField error={form.errors.due}>
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
      </form>
    </Modal>
  );
}
