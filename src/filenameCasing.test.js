import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

/**
 * Guards against a bug that is invisible on Windows and macOS.
 *
 * Both have case-insensitive filesystems, so renaming `AdminLayout.css` to
 * `adminLayout.css` leaves Git still tracking the OLD spelling while the disk
 * shows the new one. Everything builds locally. Then Linux CI checks out
 * `AdminLayout.css`, the import says `./adminLayout.css`, and the build dies
 * with "Could not resolve" — which is exactly how this project's deploy
 * workflow failed silently for a month.
 */

const root = process.cwd();

function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files"], {
      cwd: root,
      encoding: "utf8",
    })
      .split("\n")
      .filter(Boolean);
  } catch {
    // Not a git checkout (e.g. an extracted source zip) — nothing to compare.
    return null;
  }
}

/** The on-disk spelling of a tracked path, or null if it is missing. */
function diskSpelling(trackedPath) {
  let current = root;
  const real = [];
  for (const segment of trackedPath.split("/")) {
    let entries;
    try {
      entries = readdirSync(current);
    } catch {
      return null;
    }
    const match = entries.find(
      (entry) => entry.toLowerCase() === segment.toLowerCase(),
    );
    if (!match) return null;
    real.push(match);
    current = join(current, match);
  }
  return real.join("/");
}

describe("tracked filenames match the filesystem exactly", () => {
  test("no file is committed under different casing than it has on disk", () => {
    const tracked = trackedFiles();
    if (tracked === null) return;

    const mismatches = tracked
      .map((path) => ({ git: path, disk: diskSpelling(path) }))
      .filter(({ git, disk }) => disk !== null && disk !== git)
      .map(({ git, disk }) => `git has "${git}" but disk has "${disk}"`);

    expect(mismatches).toEqual([]);
  });
});
