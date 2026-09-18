import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Grid,
  GridItem,
  IconEdit,
  IconFolder,
  IconPlus,
  Progress,
  Select,
  Stack,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useListState } from "../../hooks/useListState";
import { useCollection } from "../../app/dataContext";
import { PageHeader } from "../../components/pageHeader";
import { ConfirmButton } from "../../components/confirmButton";
import { ListToolbar } from "../../components/listToolbar";
import {
  ListEmptyState,
  ListPagination,
  listTitle,
} from "../../components/listResults";
import { UndoBar, useUndoable } from "../../components/undoBar";
import { ProjectFormModal } from "./components/projectFormModal";
import { capitalize, formatDate } from "../../utils/format";
import { withNote } from "../../components/titleNote";
import { STATUS_COLORS, STATUS_OPTIONS } from "./data/mock";
import "./projects.css";

const SORT_OPTIONS = [
  { label: "Due date (soonest)", value: "due:asc" },
  { label: "Due date (latest)", value: "due:desc" },
  { label: "Name (A–Z)", value: "name:asc" },
  { label: "Progress (low to high)", value: "progress:asc" },
  { label: "Progress (high to low)", value: "progress:desc" },
];

/** Stable list config — useListState memoizes on these identities. */
const SEARCH_KEYS = ["name", "description"];
const FILTERS = { status: (project, value) => project.status === value };

export function ProjectsPage() {
  useDocumentTitle("Projects");
  const toast = useToast();
  const projects = useCollection("projects");
  const undo = useUndoable();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const list = useListState({
    items: projects.items,
    searchKeys: SEARCH_KEYS,
    filters: FILTERS,
    defaultSort: "due",
    pageSize: 9,
  });

  const openForm = (project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingProject(null);
  };

  const handleSave = (data) => {
    let saved;
    if (editingProject) {
      projects.update(editingProject.id, data);
      saved = { ...editingProject, ...data };
      toast.success("Project updated");
    } else {
      saved = projects.add(data);
      toast.success("Project created");
    }
    list.revealItem(saved);
    closeForm();
  };

  const handleDelete = (project) => {
    const index = projects.items.findIndex((item) => item.id === project.id);
    projects.remove(project.id);
    undo.offer(`“${project.name}” deleted`, () =>
      projects.restore(project, index),
    );
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote("Projects", "Track progress across your team's work")}
          actions={
            <Button
              size="sm"
              leftIcon={<IconPlus size={16} />}
              onClick={() => openForm(null)}>
              New project
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2} className="mb-3">
        <Card title={listTitle("All projects", list)}>
          <ListToolbar
            list={list}
            searchPlaceholder="Search projects…"
            filters={[
              { name: "status", label: "Status", options: STATUS_OPTIONS },
            ]}>
            <Select
              aria-label="Sort projects"
              options={SORT_OPTIONS}
              value={`${list.sortKey}:${list.sortDir}`}
              onChange={(event) => {
                const [field, direction] = event.target.value.split(":");
                list.setSort(field, direction);
              }}
            />
          </ListToolbar>
        </Card>
      </GridItem>

      {list.visible.length > 0 ? (
        <>
          <Grid container fluid>
            {list.visible.map((project) => (
              <GridItem
                key={project.id}
                xs={12}
                sm={6}
                lg={4}
                spacing={2}
                className="mb-2">
                <Card className="h-100 project-card">
                  <div className="project-card__head">
                    <div className="project-card__icon">
                      <IconFolder size={22} />
                    </div>
                    <div className="project-card__headbody">
                      <h3 className="project-card__name">{project.name}</h3>
                      <p className="project-card__description">
                        {project.description}
                      </p>
                      <Stack
                        direction="row"
                        spacing={8}
                        align="center"
                        className="mt-2">
                        <Badge
                          color={STATUS_COLORS[project.status] ?? "secondary"}>
                          {capitalize(project.status)}
                        </Badge>
                      </Stack>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Stack
                      direction="row"
                      justify="space-between"
                      className="project-card__meta mb-1">
                      <span>{project.progress}% complete</span>
                      <span>Due {formatDate(project.due)}</span>
                    </Stack>
                    <Progress
                      value={project.progress}
                      aria-label={`${project.name} is ${project.progress}% complete`}
                      color={STATUS_COLORS[project.status] ?? "primary"}
                    />
                  </div>

                  <div className="project-card__team">
                    {project.team.slice(0, 4).map((member) => (
                      <Avatar key={member} size="sm" text={member} />
                    ))}
                    {project.team.length > 4 && (
                      <Avatar size="sm" text={`+${project.team.length - 4}`} />
                    )}
                  </div>

                  <Stack
                    direction="row"
                    spacing={4}
                    className="project-card__footer">
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<IconEdit size={16} />}
                      onClick={() => openForm(project)}>
                      Edit
                    </Button>
                    <ConfirmButton
                      size="sm"
                      label="Delete"
                      title="Delete project?"
                      message={`"${project.name}" will be removed from the list.`}
                      onConfirm={() => handleDelete(project)}
                    />
                  </Stack>
                </Card>
              </GridItem>
            ))}
          </Grid>

          <GridItem xs={12} spacing={2}>
            <ListPagination list={list} noun="project" />
          </GridItem>
        </>
      ) : (
        <GridItem xs={12} spacing={2}>
          <ListEmptyState
            list={list}
            noun="project"
            icon={<IconFolder size={28} />}
            onCreate={() => openForm(null)}
            createLabel="New project"
          />
        </GridItem>
      )}

      {/* Rendered only while open so the form starts clean each time. */}
      {formOpen && (
        <ProjectFormModal
          open
          project={editingProject}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}

      <UndoBar undo={undo} />
    </Grid>
  );
}
