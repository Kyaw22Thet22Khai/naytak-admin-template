/**
 * Vite plugin — generates a runnable ZIP of the whole project source into
 * `public/project-source.zip`.
 *
 * The archive is built from the real project files on every dev-server start
 * and on every build, EXCLUDING node_modules / dist / .git / itself. Because
 * it lands in `public/`, Vite serves it during development and ships it with
 * the build, so the navbar "Download" button can fetch `./project-source.zip`
 * and the user can unzip it → `npm install` → `npm start` to run the full
 * admin template locally.
 */
import {
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { join, relative } from "node:path";
import JSZip from "jszip";

const ARCHIVE_NAME = "project-source.zip";

const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  ".vite",
  ".idea",
  ".vscode",
  "coverage",
]);

const EXCLUDED_FILES = new Set([ARCHIVE_NAME, ".DS_Store", "npm-debug.log"]);

/** Recursively collect every file under `dir`, skipping excluded dirs/files. */
function collectFiles(dir) {
  const files = [];
  const walk = (current) => {
    for (const entry of readdirSync(current)) {
      if (EXCLUDED_DIRS.has(entry)) continue;
      const full = join(current, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (!EXCLUDED_FILES.has(entry)) {
        files.push(full);
      }
    }
  };
  walk(dir);
  return files;
}

async function buildProjectZip(root) {
  try {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const folder = pkg.name || "project";
    const files = collectFiles(root);

    const zip = new JSZip();
    for (const file of files) {
      const rel = relative(root, file).replace(/\\/g, "/");
      zip.file(`${folder}/${rel}`, readFileSync(file));
    }

    const buffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const outDir = join(root, "public");
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, ARCHIVE_NAME), buffer);
  } catch (error) {
    console.warn("[projectZipPlugin] failed to generate project zip:", error);
  }
}

export function projectZipPlugin() {
  let root = process.cwd();
  return {
    name: "naytak-project-zip",
    configResolved(config) {
      root = config.root;
    },
    async buildStart() {
      await buildProjectZip(root);
    },
  };
}
