"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Blog, BlogSummary } from "@/types/blog";

export function useBlogs() {
  const [blogs, setBlogs] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/blogs");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to view your blogs");
        }
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs((data.blogs || []) as BlogSummary[]);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch blogs";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBlog = useCallback(async (id: string): Promise<Blog | null> => {
    try {
      const response = await fetch(`/api/blogs/${id}`);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to view this blog");
        }
        if (response.status === 404) {
          throw new Error("Blog not found");
        }
        throw new Error("Failed to fetch blog");
      }

      const blog = await response.json();
      return blog;
    } catch (error) {
      console.error("Error fetching blog:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch blog";
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const deleteBlog = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to delete this blog");
        }
        if (response.status === 404) {
          throw new Error("Blog not found");
        }
        throw new Error("Failed to delete blog");
      }

      // Remove from local state
      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      toast.success("Blog deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting blog:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete blog";
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const updateBlogStatus = useCallback(
    async (id: string, status: "draft" | "published"): Promise<boolean> => {
      try {
        const response = await fetch(`/api/blogs/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Please sign in to update this blog");
          }
          if (response.status === 404) {
            throw new Error("Blog not found");
          }
          throw new Error("Failed to update blog status");
        }

        // Update local state
        setBlogs((prev) =>
          prev.map((blog) => (blog.id === id ? { ...blog, status } : blog)),
        );

        const action = status === "published" ? "published" : "unpublished";
        toast.success(`Blog ${action} successfully`);
        return true;
      } catch (error) {
        console.error("Error updating blog status:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update blog status";
        toast.error(errorMessage);
        return false;
      }
    },
    [],
  );

  const publishBlog = useCallback(
    async (id: string): Promise<boolean> => {
      return updateBlogStatus(id, "published");
    },
    [updateBlogStatus],
  );

  const unpublishBlog = useCallback(
    async (id: string): Promise<boolean> => {
      return updateBlogStatus(id, "draft");
    },
    [updateBlogStatus],
  );

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    fetchBlogs,
    fetchBlog,
    deleteBlog,
    publishBlog,
    unpublishBlog,
    refetch: fetchBlogs,
  };
}
