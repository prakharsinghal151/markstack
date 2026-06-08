"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarkdownDropzoneProps {
  onMarkdownUpload: (content: string) => void;
  className?: string;
}

export function MarkdownDropzone({
  onMarkdownUpload,
  className,
}: MarkdownDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const markdownFiles = acceptedFiles.filter((file) =>
        file.type === "text/markdown" || 
        file.name.endsWith(".md") ||
        file.name.endsWith(".markdown") ||
        file.name.endsWith(".txt")
      );
      
      markdownFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onMarkdownUpload(content);
        };
        reader.readAsText(file);
      });
    },
    [onMarkdownUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/markdown": [".md", ".markdown"],
      "text/plain": [".txt"],
    },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "absolute inset-0 pointer-events-none",
        isDragActive && "pointer-events-auto",
      )}
    >
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="flex h-full items-center justify-center bg-background/85 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-primary/70 bg-card/90 p-8 shadow-sm">
            <FileIcon className="h-12 w-12 text-primary" />
            <p className="text-lg font-medium">Drop Markdown File</p>
            <p className="text-sm text-muted-foreground">
              .md, .markdown files
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
