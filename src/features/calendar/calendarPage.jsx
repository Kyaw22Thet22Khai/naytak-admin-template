import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Grid,
  GridItem,
  IconCalendar,
  IconClock,
  IconEdit,
  IconMapPin,
  IconPlus,
  Stack,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useCollection } from "../../app/dataContext";
import { PageHeader } from "../../components/pageHeader";
import { ConfirmButton } from "../../components/confirmButton";
import { UndoBar, useUndoable } from "../../components/undoBar";
import { EventFormModal } from "./components/eventFormModal";
import { WEEK } from "./data/mock";
import "./calendar.css";
import { withNote } from "../../components/titleNote";

/**
 * Rotating accent palette for event cards. Uses the theme's own palette
 * variables so the accents follow the brand colour and the dark theme.
 */
const EVENT_COLORS = [
  "var(--naytak-primary, #2563eb)",
  "var(--naytak-accent-violet)",
  "var(--naytak-info)",
  "var(--naytak-warning)",
  "var(--naytak-success)",
  "var(--naytak-danger)",
  "var(--naytak-accent-teal)",
];

export function CalendarPage() {
  useDocumentTitle("Calendar");
  const toast = useToast();

  const events = useCollection("events");
  const undo = useUndoable();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const totalEvents = WEEK.reduce((sum, day) => sum + day.events, 0);

  const openForm = (event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingEvent(null);
  };

  const handleSave = (data) => {
    if (editingEvent) {
      events.update(editingEvent.id, data);
      toast.success("Event updated");
    } else {
      events.add(data);
      toast.success("Event created");
    }
    closeForm();
  };

  const handleDelete = (event) => {
    const index = events.items.findIndex((item) => item.id === event.id);
    events.remove(event.id);
    undo.offer(`“${event.title}” deleted`, () => events.restore(event, index));
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote("Calendar", "Team schedule and upcoming events")}
          actions={
            <Button
              size="sm"
              leftIcon={<IconPlus size={16} />}
              onClick={() => openForm(null)}>
              New event
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} md={8} spacing={2} className="mb-2">
        <Card
          className="h-100"
          title={withNote(
            "Upcoming Events",
            `${events.items.length} events this month`,
          )}>
          {events.items.length === 0 && (
            <EmptyState
              icon={<IconCalendar size={28} />}
              title="No events scheduled"
              description="Add your first event to see it on the calendar."
              action={
                <Button size="sm" onClick={() => openForm(null)}>
                  New event
                </Button>
              }
            />
          )}
          {events.items.map((event, index) => {
            const accent = EVENT_COLORS[index % EVENT_COLORS.length];
            return (
              <div
                key={event.id}
                className="calendar-event"
                style={{ "--event-accent": accent }}>
                <div className="calendar-event__date">
                  <div className="calendar-event__day">{event.day}</div>
                  <div className="calendar-event__month">{event.month}</div>
                </div>
                <div className="calendar-event__body">
                  <h3 className="calendar-event__title">{event.title}</h3>
                  <Stack
                    direction="row"
                    spacing={16}
                    className="calendar-event__meta">
                    <span>
                      <IconClock size={14} /> {event.time}
                    </span>
                    <span>
                      <IconMapPin size={14} /> {event.location}
                    </span>
                  </Stack>
                </div>
                <div className="calendar-event__actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<IconEdit size={16} />}
                    onClick={() => openForm(event)}>
                    Edit
                  </Button>
                  <ConfirmButton
                    size="sm"
                    label="Delete"
                    title="Delete event?"
                    message={`"${event.title}" will be removed from the calendar.`}
                    onConfirm={() => handleDelete(event)}
                  />
                </div>
              </div>
            );
          })}
        </Card>
      </GridItem>

      <GridItem xs={12} md={4} spacing={2}>
        <Card
          className="h-100"
          title={withNote(
            "Week at a Glance",
            `${totalEvents} events this week`,
          )}>
          {WEEK.map((day) => (
            <div key={day.day} className="calendar-week">
              <span className="calendar-week__day">{day.day}</span>
              <Badge color={day.color}>
                {day.events} {day.events === 1 ? "event" : "events"}
              </Badge>
            </div>
          ))}
        </Card>
      </GridItem>

      {/* Rendered only while open so the form starts clean each time. */}
      {formOpen && (
        <EventFormModal
          open
          event={editingEvent}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}

      <UndoBar undo={undo} />
    </Grid>
  );
}
