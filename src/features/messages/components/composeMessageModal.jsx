import {
  Button,
  IconSend,
  Input,
  Modal,
  Stack,
  Textarea,
} from "naytak-react-ui";
import { FormField } from "../../../components/formField";
import {
  useForm,
  buildValidator,
  required,
  email,
} from "../../../hooks/useForm";

const EMPTY_FORM = { to: "", subject: "", body: "" };

const validate = buildValidator({
  to: [required("Recipient"), email],
  subject: [required("Subject")],
  body: [required("Message")],
});

/**
 * Modal form used to compose a new message.
 * `to` / `subject` / `body` are collected and passed to `onSend`.
 */
export function ComposeMessageModal({ open, onClose, onSend }) {
  const form = useForm({
    initialValues: EMPTY_FORM,
    validate,
    onSubmit: (values) =>
      onSend({
        to: values.to.trim(),
        subject: values.subject.trim(),
        body: values.body.trim(),
      }),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Compose message"
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="compose-message-form"
            loading={form.submitting}
            leftIcon={<IconSend size={16} />}>
            Send message
          </Button>
        </Stack>
      }>
      <form id="compose-message-form" onSubmit={form.handleSubmit} noValidate>
        <Stack direction="column" spacing={12}>
          <FormField error={form.errors.to}>
            <Input
              id="to"
              name="to"
              label="To"
              type="email"
              placeholder="name@naytak.io"
              value={form.values.to}
              onChange={form.handleChange("to")}
              onBlur={form.handleBlur("to")}
            />
          </FormField>
          <FormField error={form.errors.subject}>
            <Input
              id="subject"
              name="subject"
              label="Subject"
              placeholder="What's this about?"
              value={form.values.subject}
              onChange={form.handleChange("subject")}
              onBlur={form.handleBlur("subject")}
            />
          </FormField>
          <FormField error={form.errors.body}>
            <Textarea
              id="body"
              name="body"
              label="Message"
              aria-label="Message"
              placeholder="Write your message…"
              value={form.values.body}
              onChange={form.handleChange("body")}
              onBlur={form.handleBlur("body")}
              rows={5}
              autoResize
              characterCount
            />
          </FormField>
        </Stack>
      </form>
    </Modal>
  );
}
