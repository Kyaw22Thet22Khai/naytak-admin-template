/** Maps a MIME type onto the icon/type keys the media records already use. */
const MIME_GROUPS = [
  [/^image\//, { icon: "image", type: "Image" }],
  [/^video\//, { icon: "video", type: "Video" }],
  [/pdf$/, { icon: "pdf", type: "PDF" }],
  [/(sheet|excel|csv)/, { icon: "sheet", type: "Sheet" }],
  [/(zip|tar|rar|compressed)/, { icon: "archive", type: "Archive" }],
];

export function classifyFile(file) {
  const mime = file.type || "";
  for (const [pattern, group] of MIME_GROUPS) {
    if (pattern.test(mime)) return group;
  }
  // Fall back to the extension when the browser reports no MIME type.
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension))
    return { icon: "image", type: "Image" };
  if (["mp4", "mov", "webm", "avi"].includes(extension))
    return { icon: "video", type: "Video" };
  if (extension === "pdf") return { icon: "pdf", type: "PDF" };
  if (["csv", "xls", "xlsx"].includes(extension))
    return { icon: "sheet", type: "Sheet" };
  if (["zip", "rar", "tar", "gz", "7z"].includes(extension))
    return { icon: "archive", type: "Archive" };
  return { icon: "doc", type: "Document" };
}

/** Human-readable byte size, matching the "2.4 MB" style of the seed records. */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

/**
 * Turns a picked File into a media record.
 *
 * The bytes themselves stay in an object URL that lives only for this page
 * session — localStorage could not hold them, and a template should not
 * pretend to have a storage backend it does not have. The metadata persists;
 * the download link works until reload.
 */
export function toMediaRecord(file, folder = null) {
  const { icon, type } = classifyFile(file);
  return {
    name: file.name,
    type,
    icon,
    folder,
    size: formatBytes(file.size),
    date: new Date().toISOString().slice(0, 10),
    url: URL.createObjectURL(file),
  };
}
