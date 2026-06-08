"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { BlogDraft, BlogMutationPayload } from "@/types/blog";
import { generateSlug } from "@/lib/utils";

export function useBlogSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Auto-save draft to localStorage
  const saveDraft = useCallback(
    (content: string) => {
      try {
        const draft: BlogDraft = {
          title,
          description,
          content,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem("blog-draft", JSON.stringify(draft));
      } catch (error) {
        console.error("Failed to save draft:", error);
      }
    },
    [title, description],
  );

  // Load draft from localStorage
  const loadDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem("blog-draft");
      if (draft) {
        const parsedDraft = JSON.parse(draft) as Partial<BlogDraft>;
        setTitle(parsedDraft.title || "");
        setDescription(parsedDraft.description || "");
        return parsedDraft.content || "";
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
    return "";
  }, []);

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem("blog-draft");
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  }, []);

  const saveBlog = useCallback(
    async (content: string, blogId?: string) => {
      if (!title.trim()) {
        toast.error("Title is required");
        return false;
      }

      if (!content.trim()) {
        toast.error("Content is required");
        return false;
      }

      setIsSaving(true);
      let toastId: string | number | undefined;

      try {
        toastId = toast.loading("Saving blog...");

        const slug = generateSlug(title);

        const url = blogId ? `/api/blogs/${blogId}` : "/api/blogs";
        const method = blogId ? "PATCH" : "POST";
        const payload: BlogMutationPayload = {
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          slug,
        };

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to save blog");
        }

        const data = await response.json();

        toast.success("Blog saved successfully!", { id: toastId });
        clearDraft(); // Clear draft after successful save

        // Reset form only for new blogs
        if (!blogId) {
          setTitle("");
          setDescription("");
        }

        return data.slug;
      } catch (error) {
        console.error("Error saving blog:", error);
        if (toastId) {
          toast.error("Failed to save blog. Please try again.", {
            id: toastId,
          });
        } else {
          toast.error("Failed to save blog. Please try again.");
        }
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [title, description, clearDraft],
  );

  return {
    title,
    setTitle,
    description,
    setDescription,
    isSaving,
    saveBlog,
    saveDraft,
    loadDraft,
    clearDraft,
  };
}
