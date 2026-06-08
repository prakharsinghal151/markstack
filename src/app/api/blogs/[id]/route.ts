import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-utils";
import db from "@/lib/database";
import { serializeMDX } from "@/lib/markdown/mdx-renderer";
import { calculateReadTime } from "@/lib/markdown/read-time";
import { getErrorCode } from "@/lib/server/error-utils";
import type { Prisma } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const user = await requireApiAuth();
    if (user instanceof NextResponse) {
      return user;
    }

    const blog = await db.blog.findFirst({
      where: {
        id,
        authorId: user.id,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const user = await requireApiAuth();
    if (user instanceof NextResponse) {
      return user;
    }

    const body = await request.json();
    const { title, content, slug, description, status } = body;

    const updateData: Prisma.BlogUpdateManyMutationInput = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) {
      const normalizedContent = String(content).trim();
      updateData.content = normalizedContent;
      updateData.htmlContent = (await serializeMDX(
        normalizedContent,
      )) as Prisma.InputJsonValue;
      updateData.readTime = calculateReadTime(normalizedContent);
    }
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description || null;
    if (status !== undefined) updateData.status = status;

    const updateResult = await db.blog.updateMany({
      where: {
        id,
        authorId: user.id,
      },
      data: updateData,
    });

    if (updateResult.count === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const blog = await db.blog.findFirst({
      where: {
        id,
        authorId: user.id,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: unknown) {
    console.error("Error updating blog:", error);

    const errorCode = getErrorCode(error);

    if (errorCode === "P2002") {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 409 },
      );
    }

    if (errorCode === "P2025") {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const user = await requireApiAuth();
    if (user instanceof NextResponse) {
      return user;
    }

    const deleteResult = await db.blog.deleteMany({
      where: {
        id,
        authorId: user.id,
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error deleting blog:", error);

    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
