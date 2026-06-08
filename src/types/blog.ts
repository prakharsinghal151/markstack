export interface Blog {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  content: string;
  htmlContent?: unknown | null;
  readTime?: number | null;
  status: "draft" | "published";
  createdAt: string | Date;
  updatedAt: string | Date;
  author?: {
    name: string;
    email: string;
    image?: string;
  };
}

export type BlogSummary = Omit<Blog, "content" | "htmlContent" | "readTime">;

export interface BlogMutationPayload {
  title: string;
  slug: string;
  content: string;
  description?: string;
  status?: "draft" | "published";
}

export interface BlogDraft {
  title: string;
  description: string;
  content: string;
  savedAt: string;
}
