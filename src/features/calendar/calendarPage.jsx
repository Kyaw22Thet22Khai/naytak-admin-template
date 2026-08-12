import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Grid,
  GridItem,
  IconClock,
  IconEdit,
  IconMapPin,
  IconPlus,
  Stack,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";
import { ConfirmButton } from "../../components/confirmButton";
import { EventFormModal } from "./components/eventFormModal";
import { EVENTS, WEEK } from "./data/mock";
import "./calendar.css";

// Rotating accent palette for event cards (matches the app's brand palette).
const EVENT_COLORS = [
  "#2563eb",
  "#8b5cf6",
  "#0ea5e9",
  "#f59e0b",
  "#22c55e",
  "#ef4444",
  "#14b8a6",
];

export function CalendarPage() {
  useDocumentTitle("Calendar");
  const toast = useToast();

  const [events, setEvents] = useState(EVENTS);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const totalEvents = WEEK.reduce((sum, day) => sum + day.events, 0);

  const openForm = (event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleSave = (data) => {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingEvent.id ? { ...ev, ...data } : ev)),
      );
      toast.success("Event updated");
    } else {
      setEvents((prev) => [...prev, { ...data, id: Date.now() }]);
      toast.success("Event created");
    }
    setFormOpen(false);
  };

  const handleDelete = (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    toast.success("Event deleted");
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Calendar"
          subtitle="Team schedule and upcoming events"
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
          title="Upcoming Events"
          subtitle={`${events.length} events this month`}>
          {events.map((event, index) => {
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
                  <h4 className="calendar-event__title">{event.title}</h4>
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
                    onConfirm={() => handleDelete(event.id)}
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
          title="Week at a Glance"
          subtitle={`${totalEvents} events this week`}>
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

      <EventFormModal
        open={formOpen}
        event={editingEvent}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </Grid>
  );
}
