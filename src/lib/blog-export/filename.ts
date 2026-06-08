import "server-only";

export function sanitizeDownloadName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120);
}

export function buildExportFilename(slug: string, extension: "md" | "pdf") {
  const baseName = sanitizeDownloadName(slug) || "blog-export";
  return `${baseName}.${extension}`;
}
