import { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  Grid,
  GridItem,
  IconMail,
  IconPen,
  SearchInput,
  Select,
  Stack,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";
import { formatDate } from "../../utils/format";
import { ComposeMessageModal } from "./components/composeMessageModal";
import { FOLDER_OPTIONS, MESSAGES } from "./data/mock";
import "./messages.css";

export function MessagesPage() {
  useDocumentTitle("Messages");
  const toast = useToast();

  const [messages, setMessages] = useState(MESSAGES);
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("all");
  const [composeOpen, setComposeOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((message) => {
      const matchesQuery =
        !q ||
        message.sender.toLowerCase().includes(q) ||
        message.subject.toLowerCase().includes(q);
      const matchesFolder =
        folder === "all" ||
        (folder === "unread" && message.unread) ||
        (folder === "read" && !message.unread);
      return matchesQuery && matchesFolder;
    });
  }, [messages, query, folder]);

  const unreadCount = messages.filter((m) => m.unread).length;

  const toggleRead = (id) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, unread: !message.unread } : message,
      ),
    );
    const message = messages.find((m) => m.id === id);
    toast.success(message?.unread ? "Marked as read" : "Marked as unread");
  };

  const handleSend = ({ to, subject, body }) => {
    setMessages((prev) => [
      {
        id: Date.now(),
        sender: to,
        email: "",
        subject,
        snippet: body,
        time: new Date().toISOString(),
        unread: true,
      },
      ...prev,
    ]);
    setFolder("all");
    setComposeOpen(false);
    toast.success("Message sent");
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Messages"
          subtitle={`${unreadCount} unread of ${messages.length}`}
          actions={
            <Button
              size="sm"
              leftIcon={<IconPen size={16} />}
              onClick={() => setComposeOpen(true)}>
              Compose
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Card title="Inbox" subtitle={`${filtered.length} message(s)`}>
          <Stack direction="row" spacing={8} wrap className="mb-3 list-toolbar">
            <SearchInput
              placeholder="Search sender or subject…"
              clearable
              value={query}
              onChange={setQuery}
            />
            <Select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              options={FOLDER_OPTIONS}
            />
          </Stack>

          {filtered.length > 0 ? (
            filtered.map((message) => (
              <div
                key={message.id}
                className={
                  message.unread
                    ? "message-row message-row--unread"
                    : "message-row"
                }>
                <span
                  className="message-row__indicator"
                  style={{ visibility: message.unread ? "visible" : "hidden" }}
                />
                <Avatar size="sm" text={message.sender} />
                <div className="message-row__body">
                  <div className="message-row__head">
                    <span
                      className={
                        message.unread
                          ? "message-row__sender message-row__sender--unread"
                          : "message-row__sender"
                      }>
                      {message.sender}
                    </span>
                    <span className="message-row__time">
                      {formatDate(message.time, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div
                    className={
                      message.unread
                        ? "message-row__subject message-row__subject--unread"
                        : "message-row__subject"
                    }>
                    {message.subject}
                  </div>
                  <div className="message-row__snippet">{message.snippet}</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleRead(message.id)}>
                  {message.unread ? "Mark read" : "Mark unread"}
                </Button>
              </div>
            ))
          ) : (
            <EmptyState
              icon={<IconMail size={28} />}
              title="No messages found"
              description="Try a different search term or folder."
            />
          )}
        </Card>
      </GridItem>

      <ComposeMessageModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSend={handleSend}
      />
    </Grid>
  );
}
