import type { Dirent } from "fs";

export function include(dirent: Dirent): boolean {
  // Ignore anything starting with "_", "." or "ignore-"
  if (
    dirent.name.startsWith("_") ||
    dirent.name.startsWith(".") ||
    dirent.name.startsWith("ignore-")
  ) {
    return false;
  }

  // Ignore dirs
  if (!dirent.isFile()) {
    return false;
  }

  // Accept *.md, *.html
  const res = dirent.name.endsWith(".md") || dirent.name.endsWith(".html");
  return res;
}
