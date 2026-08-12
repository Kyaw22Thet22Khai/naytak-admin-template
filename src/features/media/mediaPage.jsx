import { useMemo, useState } from "react";
import {
  Button,
  Card,
  EmptyState,
  Grid,
  GridItem,
  IconDownload,
  IconFileArchive,
  IconFileSpreadsheet,
  IconFileText,
  IconImage,
  IconPlus,
  IconUpload,
  IconVideo,
  SearchInput,
  Select,
  Stack,
  useToast,
} from "naytak-react-ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { PageHeader } from "../../components/pageHeader";
import { formatDate } from "../../utils/format";
import { FILES, TYPE_OPTIONS } from "./data/mock";
import "./media.css";

const ICONS = {
  pdf: IconFileText,
  image: IconImage,
  video: IconVideo,
  sheet: IconFileSpreadsheet,
  archive: IconFileArchive,
  doc: IconFileText,
};

// Per-type accent colors for the file icon tile.
const TYPE_COLORS = {
  pdf: "#ef4444",
  image: "#0ea5e9",
  video: "#8b5cf6",
  sheet: "#22c55e",
  archive: "#f59e0b",
  doc: "#2563eb",
};

export function MediaPage() {
  useDocumentTitle("Media");
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FILES.filter((file) => {
      const matchesQuery = !q || file.name.toLowerCase().includes(q);
      const matchesType = type === "all" || file.icon === type;
      return matchesQuery && matchesType;
    });
  }, [query, type]);

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title="Media"
          subtitle="Manage uploaded files and assets"
          actions={
            <>
              <Button
                size="sm"
                leftIcon={<IconUpload size={16} />}
                onClick={() => toast.info("Upload coming soon")}>
                Upload
              </Button>
              <Button
                size="sm"
                leftIcon={<IconPlus size={16} />}
                onClick={() => toast.info("New folder coming soon")}>
                New folder
              </Button>
            </>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2} className="mb-3">
        <Stack direction="row" spacing={8} wrap className="list-toolbar">
          <SearchInput
            placeholder="Search files…"
            clearable
            value={query}
            onChange={setQuery}
          />
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={TYPE_OPTIONS}
          />
        </Stack>
      </GridItem>

      {filtered.length > 0 ? (
        <Grid container fluid>
          {filtered.map((file) => {
            const Icon = ICONS[file.icon] ?? IconFileText;
            return (
              <GridItem
                key={file.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                spacing={2}
                className="mb-2">
                <Card className="h-100 file-card card-lift">
                  <Stack direction="row" spacing={12} align="center">
                    <div
                      className="file-card__icon"
                      style={{
                        backgroundColor: `${TYPE_COLORS[file.icon] ?? "#2563eb"}1a`,
                        color: TYPE_COLORS[file.icon] ?? "#2563eb",
                      }}>
                      <Icon size={22} />
                    </div>
                    <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                      <h4 className="file-card__name">{file.name}</h4>
                      <div className="file-card__meta">
                        {file.type} · {file.size} · {formatDate(file.date)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="file-card__download"
                      aria-label={`Download ${file.name}`}
                      leftIcon={<IconDownload size={16} />}
                      onClick={() => toast.success(`Downloading ${file.name}`)}
                    />
                  </Stack>
                </Card>
              </GridItem>
            );
          })}
        </Grid>
      ) : (
        <GridItem xs={12} spacing={2}>
          <EmptyState
            icon={<IconImage size={28} />}
            title="No files found"
            description="Try a different search term or file type."
          />
        </GridItem>
      )}
    </Grid>
  );
}
