import { useState } from "react";
import {
  Alert,
  Button,
  FileUpload,
  IconUpload,
  Modal,
  Select,
  Stack,
} from "naytak-react-ui";
import { toMediaRecord } from "../uploadHelpers";

/** Matches the hint shown to the user; rejected files report their own error. */
const MAX_SIZE_BYTES = 25 * 1024 * 1024;

export function UploadModal({ open, folders = [], onClose, onUpload }) {
  // The page mounts this only while it is open, so state starts clean on
  // every open without an effect to reset it.
  const [files, setFiles] = useState([]);
  const [folder, setFolder] = useState("");
  const [error, setError] = useState(null);

  const folderOptions = [
    { label: "No folder", value: "" },
    ...folders.map((name) => ({ label: name, value: name })),
  ];

  const handleSubmit = () => {
    if (files.length === 0) {
      setError("Choose at least one file to upload.");
      return;
    }
    onUpload(files.map((file) => toMediaRecord(file, folder || null)));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Upload files"
      footer={
        <Stack direction="row" spacing={8} justify="flex-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            leftIcon={<IconUpload size={16} />}
            disabled={files.length === 0}
            onClick={handleSubmit}>
            Upload {files.length > 0 ? `(${files.length})` : ""}
          </Button>
        </Stack>
      }>
      <Stack direction="column" spacing={14}>
        {error && (
          <Alert color="danger" variant="soft">
            {error}
          </Alert>
        )}

        <FileUpload
          multiple
          maxSize={MAX_SIZE_BYTES}
          files={files}
          onFilesChange={(next) => {
            setFiles(next);
            setError(null);
          }}
          onError={setError}
          label="Drop files here or browse"
          hint="Up to 25 MB per file"
        />

        {folders.length > 0 && (
          <Select
            label="Folder"
            aria-label="Folder"
            options={folderOptions}
            value={folder}
            onChange={(event) => setFolder(event.target.value)}
          />
        )}

        {/* Set expectations: this template has no storage backend. */}
        <Alert color="info" variant="soft">
          File details are saved locally. The files themselves stay in this
          browser tab only — wire this up to your own storage to persist them.
        </Alert>
      </Stack>
    </Modal>
  );
}
