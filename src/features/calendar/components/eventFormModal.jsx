import { useEffect, useState } from "react";
import {
  Button,
  IconCheck,
  Input,
  Modal,
  Select,
  Stack,
} from "naytak-react-ui";

const MONTH_OPTIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
].map((month) => ({ label: month, value: month }));

const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => {
  const value = String(i + 1);
  return { label: value, value };
});

const EMPTY_FORM = {
  title: "",
  day: "12",
  month: "Aug",
  time: "09:00",
  location: "",
};

/**
 * Modal form used to create or edit a calendar event.
 * - `event` = null → "New event" mode (starts empty).
 * - `event` = object → "Edit event" mode (prefilled, saved by id).
 */
export function EventFormModal({ open, event, onClose, onSave }) {
  const isEdit = Boolean(event);
  const [form, setForm] = useState(EMPTY_FORM);

  // Reset the form whenever the modal opens (fresh or prefilled from `event`).
  useEffect(() => {
    if (!open) return;
    setForm(
      event
        ? {
            title: event.title,
            day: String(event.day),
            month: event.month,
            time: event.time,
            location: event.location,
          }
        : EMPTY_FORM,
    );
  }, [open, event]);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title: form.title.trim(),
      day: Number(form.day),
      month: form.month,
      time: form.time,
      location: form.location.trim(),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit event" : "New event"}
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="event-form"
            leftIcon={<IconCheck size={16} />}>
            {isEdit ? "Save changes" : "Create event"}
          </Button>
        </Stack>
      }>
      <form id="event-form" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={12}>
          <Input
            label="Event title"
            placeholder="Product roadmap review"
            value={form.title}
            onChange={setField("title")}
            required
          />
          <Stack direction="row" spacing={12} wrap>
            <div style={{ flex: "1 1 90px" }}>
              <Select
                label="Day"
                options={DAY_OPTIONS}
                value={form.day}
                onChange={setField("day")}
              />
            </div>
            <div style={{ flex: "1 1 120px" }}>
              <Select
                label="Month"
                options={MONTH_OPTIONS}
                value={form.month}
                onChange={setField("month")}
              />
            </div>
            <div style={{ flex: "1 1 110px" }}>
              <Input
                label="Time"
                type="time"
                value={form.time}
                onChange={setField("time")}
                required
              />
            </div>
          </Stack>
          <Input
            label="Location"
            placeholder="Meeting Room A, Zoom, …"
            value={form.location}
            onChange={setField("location")}
            required
          />
        </Stack>
      </form>
    </Modal>
  );
}
