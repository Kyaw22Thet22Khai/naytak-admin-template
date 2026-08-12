import { useEffect, useState } from "react";
import {
  Button,
  IconSend,
  Input,
  Modal,
  Stack,
  Textarea,
} from "naytak-react-ui";

const EMPTY_FORM = { to: "", subject: "", body: "" };

/**
 * Modal form used to compose a new message.
 * - `to` / `subject` / `body` are collected and passed to `onSend`.
 */
export function ComposeMessageModal({ open, onClose, onSend }) {
  const [form, setForm] = useState(EMPTY_FORM);

  // Reset the form whenever the modal opens.
  useEffect(() => {
    if (open) setForm(EMPTY_FORM);
  }, [open]);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend({
      to: form.to.trim(),
      subject: form.subject.trim(),
      body: form.body.trim(),
    });
  };

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
            leftIcon={<IconSend size={16} />}>
            Send message
          </Button>
        </Stack>
      }>
      <form id="compose-message-form" onSubmit={handleSubmit}>
        <Stack direction="column" spacing={12}>
          <Input
            label="To"
            type="email"
            placeholder="name@naytak.io"
            value={form.to}
            onChange={setField("to")}
            required
          />
          <Input
            label="Subject"
            placeholder="What's this about?"
            value={form.subject}
            onChange={setField("subject")}
            required
          />
          <Textarea
            label="Message"
            placeholder="Write your message…"
            value={form.body}
            onChange={setField("body")}
            rows={5}
            autoResize
            characterCount
            required
          />
        </Stack>
      </form>
    </Modal>
  );
}
