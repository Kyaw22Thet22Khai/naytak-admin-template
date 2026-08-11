import { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Grid,
  GridItem,
  IconCheck,
  IconClipboardList,
  IconPlus,
  Pagination,
  SearchInput,
  Select,
  Stack,
  Table,
  TableBody,
  TableHead,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/PageHeader";
import { capitalize, formatDate } from "../../utils/format";
import {
  PRIORITY_COLORS,
  PRIORITY_OPTIONS,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  TASKS,
} from "./data/mock";

const PAGE_SIZE = 8;

export function TasksPage() {
  useDocumentTitle("Tasks");
  const toast = useToast();

  const [tasks, setTasks] = useState(TASKS);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesQuery =
        !q ||
        task.title.toLowerCase().includes(q) ||
        task.assignee.toLowerCase().includes(q);
      const matchesPriority = priority === "all" || task.priority === priority;
      const matchesStatus = status === "all" || task.status === status;
      return matchesQuery && matchesPriority && matchesStatus;
    });
  }, [tasks, query, priority, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleTasks = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "done" ? "todo" : "done" }
          : task,
      ),
    );
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Tasks"
          subtitle="Track and manage your team's work"
          actions={
            <Button size="sm" leftIcon={<IconPlus size={16} />}>
              New task
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Card
          title="All tasks"
          subtitle={`${filtered.length} task${filtered.length === 1 ? "" : "s"}`}>
          <Stack direction="row" spacing={8} wrap className="mb-3 list-toolbar">
            <SearchInput
              placeholder="Search task or assignee…"
              clearable
              value={query}
              onChange={setQuery}
            />
            <Select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
              options={PRIORITY_OPTIONS}
            />
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              options={STATUS_OPTIONS}
            />
          </Stack>

          {visibleTasks.length > 0 ? (
            <div className="table-scroll">
              <Table>
                <TableHead color="primary">
                  <tr>
                    <th>Task</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {visibleTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>
                        <Stack direction="row" spacing={8} align="center">
                          <Avatar size="sm" text={task.assignee} />
                          <span>{task.assignee}</span>
                        </Stack>
                      </td>
                      <td>
                        <Badge color={PRIORITY_COLORS[task.priority] ?? "info"}>
                          {capitalize(task.priority)}
                        </Badge>
                      </td>
                      <td>{formatDate(task.due)}</td>
                      <td>
                        <Badge
                          color={STATUS_COLORS[task.status] ?? "secondary"}>
                          {STATUS_LABELS[task.status] ?? task.status}
                        </Badge>
                      </td>
                      <td>
                        <Stack direction="row" spacing={4} justify="flex-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<IconCheck size={16} />}
                            onClick={() => {
                              toggleDone(task.id);
                              toast.success(
                                task.status === "done"
                                  ? "Task reopened"
                                  : "Task completed",
                              );
                            }}>
                            {task.status === "done" ? "Reopen" : "Complete"}
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={<IconClipboardList size={28} />}
              title="No tasks found"
              description="Try a different search term or filter."
            />
          )}

          {pageCount > 1 && (
            <div className="list-pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={pageCount}
                onPageChange={setPage}
              />
            </div>
          )}
        </Card>
      </GridItem>
    </Grid>
  );
}
