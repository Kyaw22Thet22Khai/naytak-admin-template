import {
  Badge,
  Button,
  Card,
  Grid,
  GridItem,
  IconClock,
  IconMapPin,
  IconPlus,
  Stack,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/PageHeader";
import { EVENTS, WEEK } from "./data/mock";
import "./calendar.css";

export function CalendarPage() {
  useDocumentTitle("Calendar");
  const toast = useToast();

  const totalEvents = WEEK.reduce((sum, day) => sum + day.events, 0);

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
              onClick={() => toast.info("New event form coming soon")}>
              New event
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} md={8} spacing={2} className="mb-2">
        <Card
          className="h-100"
          title="Upcoming Events"
          subtitle={`${EVENTS.length} events this month`}>
          {EVENTS.map((event) => (
            <div key={event.id} className="calendar-event">
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
            </div>
          ))}
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
    </Grid>
  );
}
