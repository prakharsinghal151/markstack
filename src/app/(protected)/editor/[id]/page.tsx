import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import db from "@/lib/database";
import { EditorWrapper } from "@/components/editor/editor-wrapper";
import type { Blog } from "@/types/blog";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth(`/editor/${id}`);

  const blog = await db.blog.findFirst({
    where: {
      id,
      authorId: user.id,
    },
  });

  if (!blog) {
    notFound();
  }

  const typedBlog: Blog = {
    ...blog,
    status: blog.status as "draft" | "published",
  };

  return <EditorWrapper blog={typedBlog} />;
}
