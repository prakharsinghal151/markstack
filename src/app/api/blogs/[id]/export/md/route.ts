import { NextRequest, NextResponse } from "next/server";
import { requireBlogExportAccess } from "@/lib/blog-export/blog-export-auth";
import { createMarkdownExportResponse } from "@/lib/blog-export/markdown-export";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const accessResult = await requireBlogExportAccess(id, "markdown");

    if (accessResult instanceof NextResponse) {
      return accessResult;
    }

    return createMarkdownExportResponse(accessResult.blog);
  } catch (error) {
    console.error("Markdown export error:", error);
    return NextResponse.json(
      { error: "Failed to export markdown" },
      { status: 500 },
    );
  }
}
