import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Grid,
  GridItem,
  IconDownload,
  IconFileArchive,
  IconFileSpreadsheet,
  IconFileText,
  IconFolderPlus,
  IconImage,
  IconUpload,
  IconVideo,
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
import { UploadModal } from "./components/uploadModal";
import { NewFolderModal } from "./components/newFolderModal";
import { formatDate } from "../../utils/format";
import { withNote } from "../../components/titleNote";
import { TYPE_OPTIONS } from "./data/mock";
import "./media.css";

const ICONS = {
  pdf: IconFileText,
  image: IconImage,
  video: IconVideo,
  sheet: IconFileSpreadsheet,
  archive: IconFileArchive,
  doc: IconFileText,
};

/**
 * Per-type accent for the file icon tile, taken from the theme palette so the
 * tiles follow light/dark mode instead of being pinned to a literal hex.
 */
const TYPE_ACCENTS = {
  pdf: "var(--naytak-danger)",
  image: "var(--naytak-info)",
  video: "var(--naytak-accent-violet)",
  sheet: "var(--naytak-success)",
  archive: "var(--naytak-warning)",
  doc: "var(--naytak-primary, #2563eb)",
};

/** Stable list config — useListState memoizes on these identities. */
const SEARCH_KEYS = ["name", "type"];
const FILTERS = {
  type: (file, value) => file.icon === value,
  folder: (file, value) => file.folder === value,
};

export function MediaPage() {
  useDocumentTitle("Media");
  const toast = useToast();
  const media = useCollection("media");
  const undo = useUndoable();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  // Folders exist only as a label on each record, which is enough for a
  // template; a real app would model them as their own collection.
  const [folders, setFolders] = useState([]);

  const folderOptions = [
    { label: "All folders", value: "all" },
    ...folders.map((name) => ({ label: name, value: name })),
  ];

  const list = useListState({
    items: media.items,
    searchKeys: SEARCH_KEYS,
    filters: FILTERS,
    defaultSort: "date",
    pageSize: 12,
  });

  const handleUpload = (records) => {
    const added = records.map((record) => media.add(record));
    // Jump to the last file added so the user sees the upload land.
    if (added.length > 0) list.revealItem(added[added.length - 1]);
    setUploadOpen(false);
    toast.success(
      `Uploaded ${records.length} file${records.length === 1 ? "" : "s"}`,
    );
  };

  const handleCreateFolder = (name) => {
    setFolders((prev) => [...prev, name]);
    setFolderOpen(false);
    toast.success(`Folder “${name}” created`);
  };

  const handleDelete = (file) => {
    const index = media.items.findIndex((item) => item.id === file.id);
    media.remove(file.id);
    undo.offer(`“${file.name}” deleted`, () => media.restore(file, index));
  };

  // Only files uploaded in this session carry a usable object URL; the seeded
  // records are metadata with no bytes behind them.
  const handleDownload = (file) => {
    if (!file.url) {
      toast.info(`${file.name} is sample data — there is no file to download.`);
      return;
    }
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Grid container fluid>
      <GridItem xs={12} spacing={2} className="mb-3">
        <PageHeader
          title={withNote("Media", "Manage uploaded files and assets")}
          actions={
            <>
              <Button
                size="sm"
                leftIcon={<IconUpload size={16} />}
                onClick={() => setUploadOpen(true)}>
                Upload
              </Button>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<IconFolderPlus size={16} />}
                onClick={() => setFolderOpen(true)}>
                New folder
              </Button>
            </>
          }
        />
      </GridItem>

      <GridItem xs={12} spacing={2} className="mb-3">
        <Card title={listTitle("All files", list)}>
          <ListToolbar
            list={list}
            searchPlaceholder="Search files…"
            filters={[
              { name: "type", label: "File type", options: TYPE_OPTIONS },
              ...(folders.length > 0
                ? [{ name: "folder", label: "Folder", options: folderOptions }]
                : []),
            ]}
          />
        </Card>
      </GridItem>

      {list.visible.length > 0 ? (
        <>
          <Grid container fluid>
            {list.visible.map((file) => {
              const Icon = ICONS[file.icon] ?? IconFileText;
              const accent =
                TYPE_ACCENTS[file.icon] ?? "var(--naytak-primary, #2563eb)";
              return (
                <GridItem
                  key={file.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  spacing={2}
                  className="mb-2">
                  <Card className="h-100 file-card">
                    <Stack direction="row" spacing={12} align="center">
                      <div
                        className="file-card__icon"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
                          color: accent,
                        }}>
                        <Icon size={22} />
                      </div>
                      <div className="file-card__body">
                        <h3 className="file-card__name" title={file.name}>
                          {file.name}
                        </h3>
                        <div className="file-card__meta">
                          {file.type} · {file.size} · {formatDate(file.date)}
                        </div>
                        {file.folder && (
                          <Badge size="sm" variant="soft" color="secondary">
                            {file.folder}
                          </Badge>
                        )}
                      </div>
                      <Stack direction="column" spacing={2}>
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label={`Download ${file.name}`}
                          leftIcon={<IconDownload size={16} />}
                          onClick={() => handleDownload(file)}
                        />
                        <ConfirmButton
                          size="sm"
                          variant="ghost"
                          label=""
                          aria-label={`Delete ${file.name}`}
                          title="Delete file?"
                          message={`"${file.name}" will be removed from the library.`}
                          onConfirm={() => handleDelete(file)}
                        />
                      </Stack>
                    </Stack>
                  </Card>
                </GridItem>
              );
            })}
          </Grid>

          <GridItem xs={12} spacing={2}>
            <ListPagination list={list} noun="file" />
          </GridItem>
        </>
      ) : (
        <GridItem xs={12} spacing={2}>
          <ListEmptyState
            list={list}
            noun="file"
            icon={<IconImage size={28} />}
            onCreate={() => setUploadOpen(true)}
            createLabel="Upload files"
          />
        </GridItem>
      )}

      {uploadOpen && (
        <UploadModal
          open
          folders={folders}
          onClose={() => setUploadOpen(false)}
          onUpload={handleUpload}
        />
      )}

      {folderOpen && (
        <NewFolderModal
          open
          existing={folders}
          onClose={() => setFolderOpen(false)}
          onCreate={handleCreateFolder}
        />
      )}

      <UndoBar undo={undo} />
    </Grid>
  );
}
