import { useEffect, useState } from "react";
import {
  Button,
  IconCheck,
  Input,
  Modal,
  Select,
  Stack,
} from "naytak-react-ui";
import { PRIORITY_OPTIONS, STATUS_OPTIONS, TASKS } from "../data/mock";

/** Form-only options (exclude the "All …" filter entries). */
const FORM_PRIORITY_OPTIONS = PRIORITY_OPTIONS.slice(1);
const FORM_STATUS_OPTIONS = STATUS_OPTIONS.slice(1);

/** Assignee pick-list derived from the mock task data. */
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

/**
 * Modal form used to create or edit a task.
 * - `task` = null → "New task" mode (starts empty).
 * - `task` = object → "Edit task" mode (prefilled, saved by id).
 */
export function TaskFormModal({ open, task, onClose, onSave }) {
  const isEdit = Boolean(task);
  const [form, setForm] = useState(EMPTY_FORM);

  // Reset the form whenever the modal opens (fresh or prefilled from `task`).
  useEffect(() => {
    if (!open) return;
    setForm(
      task
        ? {
            title: task.title,
            assignee: task.assignee,
            priority: task.priority,
            status: task.status,
            due: task.due,
          }
        : EMPTY_FORM,
    );
  }, [open, task]);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title: form.title.trim(),
      assignee: form.assignee,
      priority: form.priority,
      status: form.status,
      due: form.due,
    });
  };

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
            leftIcon={<IconCheck size={16} />}>
            {isEdit ? "Save changes" : "Create task"}
          </Button>
        </Stack>
      }>
      <form id="task-form" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={12}>
          <Input
            label="Task title"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={setField("title")}
            required
          />
          <Select
            label="Assignee"
            options={ASSIGNEE_OPTIONS}
            value={form.assignee}
            onChange={setField("assignee")}
          />
          <Stack direction="row" spacing={12} wrap>
            <div style={{ flex: "1 1 150px" }}>
              <Select
                label="Priority"
                options={FORM_PRIORITY_OPTIONS}
                value={form.priority}
                onChange={setField("priority")}
              />
            </div>
            <div style={{ flex: "1 1 160px" }}>
              <Select
                label="Status"
                options={FORM_STATUS_OPTIONS}
                value={form.status}
                onChange={setField("status")}
              />
            </div>
          </Stack>
          <Input
            label="Due date"
            type="date"
            value={form.due}
            onChange={setField("due")}
            required
          />
        </Stack>
      </form>
    </Modal>
  );
}
