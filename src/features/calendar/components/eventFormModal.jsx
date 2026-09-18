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

/** A new event defaults to today rather than a fixed date in the past. */
const emptyForm = () => {
  const today = new Date();
  return {
    title: "",
    day: String(today.getDate()),
    month: MONTH_OPTIONS[today.getMonth()].value,
    time: "09:00",
    location: "",
  };
};

const validate = buildValidator({
  title: [required("Event title")],
  time: [required("Time")],
  location: [required("Location")],
});

/**
 * Modal form used to create or edit a calendar event.
 * - `event` = null → "New event" mode (starts empty).
 * - `event` = object → "Edit event" mode (prefilled, saved by id).
 */
export function EventFormModal({ open, event, onClose, onSave }) {
  const isEdit = Boolean(event);

  const form = useForm({
    // The page mounts this only while open, so these run afresh every time.
    initialValues: event
      ? {
          title: event.title,
          day: String(event.day),
          month: event.month,
          time: event.time,
          location: event.location,
        }
      : emptyForm(),
    validate,
    onSubmit: (values) =>
      onSave({
        title: values.title.trim(),
        day: Number(values.day),
        month: values.month,
        time: values.time,
        location: values.location.trim(),
      }),
  });

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
            loading={form.submitting}
            leftIcon={<IconCheck size={16} />}>
            {isEdit ? "Save changes" : "Create event"}
          </Button>
        </Stack>
      }>
      <form id="event-form" onSubmit={form.handleSubmit} noValidate>
        <Stack direction="column" spacing={12}>
          <FormField error={form.errors.title}>
            <Input
              id="title"
              name="title"
              label="Event title"
              placeholder="Product roadmap review"
              value={form.values.title}
              onChange={form.handleChange("title")}
              onBlur={form.handleBlur("title")}
            />
          </FormField>

          <Stack direction="row" spacing={12} wrap>
            <div className="field-grow">
              <Select
                label="Day"
                aria-label="Day"
                options={DAY_OPTIONS}
                value={form.values.day}
                onChange={form.handleChange("day")}
              />
            </div>
            <div className="field-grow">
              <Select
                label="Month"
                aria-label="Month"
                options={MONTH_OPTIONS}
                value={form.values.month}
                onChange={form.handleChange("month")}
              />
            </div>
            <FormField error={form.errors.time} className="field-grow">
              <Input
                id="time"
                name="time"
                label="Time"
                type="time"
                value={form.values.time}
                onChange={form.handleChange("time")}
                onBlur={form.handleBlur("time")}
              />
            </FormField>
          </Stack>

          <FormField error={form.errors.location}>
            <Input
              id="location"
              name="location"
              label="Location"
              placeholder="Meeting Room A, Zoom, …"
              value={form.values.location}
              onChange={form.handleChange("location")}
              onBlur={form.handleBlur("location")}
            />
          </FormField>
        </Stack>
      </form>
    </Modal>
  );
}
