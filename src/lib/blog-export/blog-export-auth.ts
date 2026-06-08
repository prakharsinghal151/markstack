import "server-only";

import { NextResponse } from "next/server";
import db from "@/lib/database";
import { requireApiAuth } from "@/lib/auth-utils";
import { checkBlogExportRateLimit } from "./rate-limit";
import type { ExportableBlog, ExportKind } from "./types";

export async function requireBlogExportAccess(
  blogId: string,
  kind: ExportKind,
): Promise<
  | { user: { id: string; name: string; email: string }; blog: ExportableBlog }
  | NextResponse
> {
  const user = await requireApiAuth();

  if (user instanceof NextResponse) {
    return user;
  }

  const rateLimitResult = checkBlogExportRateLimit(user.id, kind);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: `Too many ${kind} export requests. Please try again later.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.retryAfterSeconds),
        },
      },
    );
  }

  const blog = await db.blog.findFirst({
    where: {
      id: blogId,
      authorId: user.id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      coverImage: true,
      readTime: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    blog,
  };
}
