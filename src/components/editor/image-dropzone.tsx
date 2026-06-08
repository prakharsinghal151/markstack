"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageDropzoneProps {
  onImageUpload: (file: File) => void;
  className?: string;
}

export function ImageDropzone({
  onImageUpload,
  className,
}: ImageDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("image/"),
      );
      imageFiles.forEach((file) => {
        onImageUpload(file);
      });
    },
    [onImageUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
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
            <ImageIcon className="h-12 w-12 text-primary" />
            <p className="text-lg font-medium">Drop image here</p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
