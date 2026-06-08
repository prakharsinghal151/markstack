import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-utils";
import db from "@/lib/database";
import { serializeMDX } from "@/lib/markdown/mdx-renderer";
import { calculateReadTime } from "@/lib/markdown/read-time";
import { handleDatabaseError } from "@/lib/server/error-handler";
import type { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const user = await requireApiAuth();
    if (user instanceof NextResponse) {
      return user;
    }

    const blogs = await db.blog.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    });

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    if (user instanceof NextResponse) {
      return user;
    }

    const body = await request.json();
    const { title, content, slug, description, status = "draft" } = body;

    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Title, content, and slug are required" },
        { status: 400 },
      );
    }

    const normalizedContent = String(content).trim();
    const htmlContent = (await serializeMDX(
      normalizedContent,
    )) as Prisma.InputJsonValue;
    const readTime = calculateReadTime(normalizedContent);

    const blog = await db.blog.create({
      data: {
        title,
        content: normalizedContent,
        slug,
        description: description || null,
        htmlContent,
        readTime,
        status,
        authorId: user.id,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating blog:", error);
    return handleDatabaseError(error);
  }
}
