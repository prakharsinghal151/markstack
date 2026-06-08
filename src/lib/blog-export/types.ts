import "server-only";

export interface ExportableBlog {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  coverImage: string | null;
  readTime: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    name: string;
    email: string;
    image: string | null;
  };
}

export type ExportKind = "markdown" | "pdf";
