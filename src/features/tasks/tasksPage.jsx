import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Grid,
  GridItem,
  IconCheck,
  IconClipboardList,
  IconEdit,
  IconPlus,
  Stack,
  Table,
  TableBody,
  TableHead,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useListState } from "../../hooks/useListState";
import { useCollection } from "../../app/dataContext";
import { PageHeader } from "../../components/pageHeader";
import { ConfirmButton } from "../../components/confirmButton";
import { ListToolbar, SortableTh } from "../../components/listToolbar";
import {
  ListEmptyState,
  ListPagination,
  listTitle,
} from "../../components/listResults";
import { UndoBar, useUndoable } from "../../components/undoBar";
import { TaskFormModal } from "./components/taskFormModal";
import { capitalize, formatDate } from "../../utils/format";
import { withNote } from "../../components/titleNote";
import {
  PRIORITY_COLORS,
  PRIORITY_OPTIONS,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "./data/mock";

/** Stable list config — useListState memoizes on these identities. */
const SEARCH_KEYS = ["title", "assignee"];
const FILTERS = {
  priority: (task, value) => task.priority === value,
  status: (task, value) => task.status === value,
};

export function TasksPage() {
  useDocumentTitle("Tasks");
  const toast = useToast();

  const tasks = useCollection("tasks");
  const undo = useUndoable();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const list = useListState({
    items: tasks.items,
    searchKeys: SEARCH_KEYS,
    filters: FILTERS,
    defaultSort: "due",
    pageSize: 8,
  });

  const toggleDone = (task) => {
    const done = task.status === "done";
    tasks.update(task.id, { status: done ? "todo" : "done" });
    toast.success(done ? "Task reopened" : "Task completed");
  };

  const openForm = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleSave = (data) => {
    let saved;
    if (editingTask) {
      tasks.update(editingTask.id, data);
      saved = { ...editingTask, ...data };
      toast.success("Task updated");
    } else {
      saved = tasks.add(data);
      toast.success("Task created");
    }
    list.revealItem(saved);
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleDelete = (task) => {
    const index = tasks.items.findIndex((item) => item.id === task.id);
    tasks.remove(task.id);
    undo.offer(`“${task.title}” deleted`, () => tasks.restore(task, index));
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote("Tasks", "Track and manage your team's work")}
          actions={
            <Button
              size="sm"
              leftIcon={<IconPlus size={16} />}
              onClick={() => openForm(null)}>
              New task
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2}>
        <Card title={listTitle("All tasks", list)}>
          <div className="mb-3">
            <ListToolbar
              list={list}
              searchPlaceholder="Search task or assignee…"
              filters={[
                {
                  name: "priority",
                  label: "Priority",
                  options: PRIORITY_OPTIONS,
                },
                { name: "status", label: "Status", options: STATUS_OPTIONS },
              ]}
            />
          </div>

          {list.visible.length > 0 ? (
            <div className="table-scroll">
              <Table>
                <TableHead color="primary">
                  <tr>
                    <SortableTh list={list} field="title">
                      Task
                    </SortableTh>
                    <SortableTh list={list} field="assignee">
                      Assignee
                    </SortableTh>
                    <SortableTh list={list} field="priority">
                      Priority
                    </SortableTh>
                    <SortableTh list={list} field="due">
                      Due
                    </SortableTh>
                    <SortableTh list={list} field="status">
                      Status
                    </SortableTh>
                    <th scope="col" style={{ textAlign: "right" }}>
                      Actions
                    </th>
                  </tr>
                </TableHead>
                <TableBody>
                  {list.visible.map((task) => (
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
                            leftIcon={<IconEdit size={16} />}
                            onClick={() => openForm(task)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<IconCheck size={16} />}
                            onClick={() => toggleDone(task)}>
                            {task.status === "done" ? "Reopen" : "Complete"}
                          </Button>
                          <ConfirmButton
                            size="sm"
                            label="Delete"
                            title="Delete task?"
                            message={`"${task.title}" will be removed from the list.`}
                            onConfirm={() => handleDelete(task)}
                          />
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <ListEmptyState
              list={list}
              noun="task"
              icon={<IconClipboardList size={28} />}
              onCreate={() => openForm(null)}
              createLabel="New task"
            />
          )}

          <ListPagination list={list} noun="task" />
        </Card>
      </GridItem>

      {/* Rendered only while open so the form starts clean each time. */}
      {formOpen && (
        <TaskFormModal
          open
          task={editingTask}
          onClose={() => {
            setFormOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSave}
        />
      )}

      <UndoBar undo={undo} />
    </Grid>
  );
}
