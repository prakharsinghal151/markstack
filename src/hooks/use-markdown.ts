"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  applyMarkdownFormat,
  FormatType,
} from "@/lib/markdown/format-selection";
import { uploadImage, createImageMarkdown } from "@/lib/markdown/image-upload";
import type { SerializedMdx } from "@/lib/markdown/mdx-renderer";
import type { EditorInstance } from "@/types/editor";

async function fetchSerialized(
  markdown: string,
): Promise<SerializedMdx | null> {
  try {
    const res = await fetch("/api/serialize-mdx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown }),
    });

    if (!res.ok) {
      console.error("Serialize API error:", res.status, res.statusText);
      return null;
    }

    const { serialized } = (await res.json()) as {
      serialized: SerializedMdx | null;
    };
    return serialized;
  } catch (error) {
    console.error("Fetch serialized error:", error);
    return null;
  }
}

export function useMarkdown(initialContent: string = "") {
  const [content, setContent] = useState(initialContent);
  const [serializedContent, setSerializedContent] =
    useState<SerializedMdx | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const editorRef = useRef<EditorInstance | null>(null);
  const contentRef = useRef(initialContent);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef(0);

  const updateContent = useCallback(async (newContent: string) => {
    if (newContent === contentRef.current) return;
    contentRef.current = newContent;
    setContent(newContent);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      setIsLoading(true);

      try {
        const serialized = await fetchSerialized(newContent);
        if (requestId !== requestIdRef.current) return;
        setSerializedContent(serialized);
      } catch {
        if (requestId === requestIdRef.current) {
          setSerializedContent(null);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, 300);
  }, []);

  const insertSyntax = useCallback(
    async (syntaxKey: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      if (syntaxKey === "image") {
        const position = editor.getPosition();
        const model = editor.getModel();
        if (!position || !model) return;

        const offset = model.getOffsetAt(position);
        const current = contentRef.current;
        const newContent =
          current.slice(0, offset) +
          "\n![Alt text](url)\n" +
          current.slice(offset);
        editor.setValue(newContent);
        await updateContent(newContent);
        return;
      }

      applyMarkdownFormat(editor, syntaxKey as FormatType);
      await updateContent(editor.getValue());
      editor.focus();
    },
    [updateContent],
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        const image = await uploadImage(file);
        const imageMarkdown = createImageMarkdown(image);
        const editor = editorRef.current;
        if (!editor) return;

        const position = editor.getPosition();
        const model = editor.getModel();
        if (!position || !model) return;

        const offset = model.getOffsetAt(position);
        const current = contentRef.current;
        const newContent =
          current.slice(0, offset) +
          "\n" +
          imageMarkdown +
          "\n" +
          current.slice(offset);
        editor.setValue(newContent);
        await updateContent(newContent);
      } catch {
        toast.error("Failed to upload image");
      }
    },
    [updateContent],
  );

  const handleStructureMarkdown = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentContent = editor.getValue();
    if (!currentContent.trim()) {
      toast.warning("No content to structure");
      return;
    }

    const toastId = toast.loading("Structuring markdown...");

    try {
      const response = await fetch("/api/structure-markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: currentContent }),
      });

      if (!response.ok) {
        const { error } = await response
          .json()
          .catch(() => ({}) as { error?: string });
        throw new Error(error ?? "Failed to structure markdown");
      }

      const { markdown: structured } = (await response.json()) as {
        markdown?: string;
      };

      if (structured && structured !== currentContent) {
        editor.setValue(structured);
        await updateContent(structured);
        toast.success("Markdown structured successfully!", { id: toastId });
      } else {
        toast.info("No changes needed", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to structure markdown. Please try again.", {
        id: toastId,
      });
      throw error;
    }
  }, [updateContent]);

  const setEditorRef = useCallback((editor: EditorInstance) => {
    editorRef.current = editor;
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    content,
    setContent: updateContent,
    serializedContent,
    isLoading,
    editorRef,
    insertSyntax,
    handleImageUpload,
    handleStructureMarkdown,
    setEditorRef,
  };
}
