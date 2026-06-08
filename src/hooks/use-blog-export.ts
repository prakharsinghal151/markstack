"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

type ExportFormat = "markdown" | "pdf";

function getExportPath(format: ExportFormat) {
  return format === "markdown" ? "md" : "pdf";
}

function getFileExtension(format: ExportFormat) {
  return format === "pdf" ? "pdf" : "md";
}

function getContentDispositionFilename(
  response: Response,
  fallbackName: string,
) {
  const contentDisposition = response.headers.get("content-disposition") ?? "";
  const match = contentDisposition.match(/filename="?([^";]+)"?/i);
  return match?.[1] ?? fallbackName;
}

async function readErrorMessage(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as { error?: string };
    return payload.error || "Export failed";
  }

  const text = await response.text();
  return text || "Export failed";
}

async function downloadResponseBlob(
  response: Response,
  fallbackFileName: string,
) {
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = getContentDispositionFilename(response, fallbackFileName);
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

async function downloadMarkdownResponseText(
  response: Response,
  fallbackFileName: string,
) {
  const markdownText = await response.text();
  const blob = new Blob([markdownText], {
    type: "text/markdown;charset=utf-8",
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = getContentDispositionFilename(response, fallbackFileName);
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export function useBlogExport(blogId: string, slug: string) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat | null>(null);

  const runExport = useCallback(
    async (format: ExportFormat) => {
      const label = format === "pdf" ? "PDF" : "Markdown";
      const fallbackFileName = `${slug}.${getFileExtension(format)}`;
      const loadingToast = toast.loading(`Preparing ${label} export...`);

      setActiveFormat(format);

      try {
        const response = await fetch(
          `/api/blogs/${blogId}/export/${getExportPath(format)}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          const errorMessage = await readErrorMessage(response);
          throw new Error(errorMessage);
        }

        if (format === "markdown") {
          await downloadMarkdownResponseText(response, fallbackFileName);
        } else {
          await downloadResponseBlob(response, fallbackFileName);
        }

        toast.success(`${label} downloaded`, { id: loadingToast });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : `Failed to export ${label}`;
        toast.error(errorMessage, { id: loadingToast });
      } finally {
        setActiveFormat(null);
      }
    },
    [blogId, slug],
  );

  return {
    exportMarkdown: useCallback(() => runExport("markdown"), [runExport]),
    exportPdf: useCallback(() => runExport("pdf"), [runExport]),
    isExportingMarkdown: activeFormat === "markdown",
    isExportingPdf: activeFormat === "pdf",
    isExporting: activeFormat !== null,
  };
}
