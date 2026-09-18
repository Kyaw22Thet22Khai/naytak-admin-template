/**
 * Escapes one CSV cell: wrap in quotes when it contains a delimiter, quote or
 * newline, and double any embedded quotes.
 */
function escapeCell(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Turns rows into CSV text using the given `{ key, label }` columns. */
export function toCsv(columns, rows) {
  const header = columns.map((column) => escapeCell(column.label)).join(",");
  const body = rows.map((row) =>
    columns.map((column) => escapeCell(row[column.key])).join(","),
  );
  return [header, ...body].join("\r\n");
}

/**
 * Triggers a browser download of the rows as a CSV file.
 *
 * The BOM makes Excel open UTF-8 correctly instead of mangling accented names.
 */
export function downloadCsv(filename, columns, rows) {
  const blob = new Blob(["﻿", toCsv(columns, rows)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
