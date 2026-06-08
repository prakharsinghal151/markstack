import "server-only";

import { buildExportFilename } from "./filename";
import type { ExportableBlog } from "./types";

function buildDownloadHeaders(filename: string) {
  const headers = new Headers();
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  headers.set("Pragma", "no-cache");
  return headers;
}

export function createMarkdownExportResponse(blog: ExportableBlog) {
  const filename = buildExportFilename(blog.slug, "md");
  return new Response(blog.content, {
    headers: buildDownloadHeaders(filename),
  });
}
