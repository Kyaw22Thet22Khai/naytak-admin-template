import { useEffect, useState } from "react";
import {
  Button,
  IconCheck,
  Input,
  Modal,
  Select,
  Stack,
  Textarea,
} from "naytak-react-ui";
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

/**
 * Modal form used to create or edit a project.
 * - `project` = null → "New project" mode (starts empty).
 * - `project` = object → "Edit project" mode (prefilled, saved by id).
 */
export function ProjectFormModal({ open, project, onClose, onSave }) {
  const isEdit = Boolean(project);
  const [form, setForm] = useState(EMPTY_FORM);

  // Reset the form whenever the modal opens (fresh or prefilled from `project`).
  useEffect(() => {
    if (!open) return;
    setForm(
      project
        ? {
            name: project.name,
            description: project.description,
            status: project.status,
            progress: String(project.progress),
            due: project.due,
            team: project.team.join(", "),
          }
        : EMPTY_FORM,
    );
  }, [open, project]);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      progress: Number(form.progress),
      due: form.due,
      team: form.team
        .split(",")
        .map((member) => member.trim())
        .filter(Boolean),
    });
  };

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
            leftIcon={<IconCheck size={16} />}>
            {isEdit ? "Save changes" : "Create project"}
          </Button>
        </Stack>
      }>
      <form id="project-form" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={12}>
          <Input
            label="Project name"
            placeholder="Website Redesign"
            value={form.name}
            onChange={setField("name")}
            required
          />
          <Textarea
            label="Description"
            placeholder="What is this project about?"
            value={form.description}
            onChange={setField("description")}
            rows={3}
            autoResize
          />
          <Stack direction="row" spacing={12} wrap>
            <div style={{ flex: "1 1 150px" }}>
              <Select
                label="Status"
                options={FORM_STATUS_OPTIONS}
                value={form.status}
                onChange={setField("status")}
              />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <Input
                label="Progress (%)"
                type="number"
                min={0}
                max={100}
                value={form.progress}
                onChange={setField("progress")}
              />
            </div>
            <div style={{ flex: "1 1 160px" }}>
              <Input
                label="Due date"
                type="date"
                value={form.due}
                onChange={setField("due")}
              />
            </div>
          </Stack>
          <Input
            label="Team members"
            placeholder="Alice Johnson, Bob Smith"
            value={form.team}
            onChange={setField("team")}
          />
        </Stack>
      </form>
    </Modal>
  );
}
