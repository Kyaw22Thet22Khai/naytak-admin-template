import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Grid,
  GridItem,
  IconMail,
  IconMailCheck,
  IconPen,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useListState } from "../../hooks/useListState";
import { useCollection } from "../../app/dataContext";
import { PageHeader } from "../../components/pageHeader";
import { ListToolbar } from "../../components/listToolbar";
import {
  ListEmptyState,
  ListPagination,
  listTitle,
} from "../../components/listResults";
import { formatDate } from "../../utils/format";
import { withNote } from "../../components/titleNote";
import { ComposeMessageModal } from "./components/composeMessageModal";
import { FOLDER_OPTIONS } from "./data/mock";
import "./messages.css";

/** Folder filter is a view over `unread`, not a stored field. */
const matchesFolder = (message, value) =>
  (value === "unread" && message.unread) ||
  (value === "read" && !message.unread);

/** Stable list config — useListState memoizes on these identities. */
const SEARCH_KEYS = ["sender", "subject", "snippet"];
const FILTERS = { folder: matchesFolder };

export function MessagesPage() {
  useDocumentTitle("Messages");
  const toast = useToast();
  const messages = useCollection("messages");
  const [composeOpen, setComposeOpen] = useState(false);

  const list = useListState({
    items: messages.items,
    searchKeys: SEARCH_KEYS,
    filters: FILTERS,
    defaultSort: "time",
    pageSize: 10,
  });

  const unreadCount = messages.items.filter((m) => m.unread).length;

  const toggleRead = (message) => {
    messages.update(message.id, { unread: !message.unread });
    toast.success(message.unread ? "Marked as read" : "Marked as unread");
  };

  const markAllRead = () => {
    messages.items
      .filter((message) => message.unread)
      .forEach((message) => messages.update(message.id, { unread: false }));
    toast.success("All messages marked as read");
  };

  const handleSend = ({ to, subject, body }) => {
    const sent = messages.add({
      sender: to,
      email: to,
      subject,
      snippet: body,
      time: new Date().toISOString(),
      unread: false,
    });
    list.revealItem(sent);
    setComposeOpen(false);
    toast.success("Message sent");
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote(
            "Messages",
            `${unreadCount} unread of ${messages.items.length}`,
          )}
          actions={
            <>
              <Button
                size="sm"
                variant="ghost"
                disabled={unreadCount === 0}
                leftIcon={<IconMailCheck size={16} />}
                onClick={markAllRead}>
                Mark all read
              </Button>
              <Button
                size="sm"
                leftIcon={<IconPen size={16} />}
                onClick={() => setComposeOpen(true)}>
                Compose
              </Button>
            </>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Card title={listTitle("Inbox", list)}>
          <div className="mb-3">
            <ListToolbar
              list={list}
              searchPlaceholder="Search sender or subject…"
              filters={[
                { name: "folder", label: "Folder", options: FOLDER_OPTIONS },
              ]}
            />
          </div>

          {list.visible.length > 0 ? (
            <ul className="message-list">
              {list.visible.map((message) => (
                <li
                  key={message.id}
                  className={
                    message.unread
                      ? "message-row message-row--unread"
                      : "message-row"
                  }>
                  <span
                    className="message-row__indicator"
                    aria-hidden="true"
                    style={{
                      visibility: message.unread ? "visible" : "hidden",
                    }}
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
                        {message.unread && (
                          <span className="sr-only"> (unread)</span>
                        )}
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
                    <div className="message-row__snippet">
                      {message.snippet}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleRead(message)}>
                    {message.unread ? "Mark read" : "Mark unread"}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <ListEmptyState
              list={list}
              noun="message"
              icon={<IconMail size={28} />}
              onCreate={() => setComposeOpen(true)}
              createLabel="Compose"
            />
          )}

          <ListPagination list={list} noun="message" />
        </Card>
      </GridItem>

      {composeOpen && (
        <ComposeMessageModal
          open
          onClose={() => setComposeOpen(false)}
          onSend={handleSend}
        />
      )}
    </Grid>
  );
}
