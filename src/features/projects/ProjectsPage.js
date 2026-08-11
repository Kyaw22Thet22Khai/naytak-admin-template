import { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Grid,
  GridItem,
  IconFolder,
  IconPlus,
  Progress,
  SearchInput,
  Select,
  Stack,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/PageHeader";
import { formatDate } from "../../utils/format";
import { PROJECTS, STATUS_COLORS, STATUS_OPTIONS } from "./data/mock";
import "./projects.css";

export function ProjectsPage() {
  useDocumentTitle("Projects");

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((project) => {
      const matchesQuery = !q || project.name.toLowerCase().includes(q);
      const matchesStatus = status === "all" || project.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Projects"
          subtitle="Track progress across your team's work"
          actions={
            <Button size="sm" leftIcon={<IconPlus size={16} />}>
              New project
            </Button>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2} className="mb-3">
        <Stack direction="row" spacing={8} wrap className="list-toolbar">
          <SearchInput
            placeholder="Search projects…"
            clearable
            value={query}
            onChange={setQuery}
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={STATUS_OPTIONS}
          />
        </Stack>
      </GridItem>

      {filtered.length > 0 ? (
        <Grid container fluid>
          {filtered.map((project) => (
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
                  <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                    <h4 className="project-card__name">{project.name}</h4>
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
                        {project.status}
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
                  <Progress value={project.progress} />
                </div>

                <div className="project-card__team">
                  {project.team.slice(0, 4).map((member) => (
                    <Avatar key={member} size="sm" text={member} />
                  ))}
                  {project.team.length > 4 && (
                    <Avatar size="sm" text={`+${project.team.length - 4}`} />
                  )}
                </div>
              </Card>
            </GridItem>
          ))}
        </Grid>
      ) : (
        <GridItem xs={12} spacing={2}>
          <EmptyState
            icon={<IconFolder size={28} />}
            title="No projects found"
            description="Try a different search term or status filter."
          />
        </GridItem>
      )}
    </Grid>
  );
}
