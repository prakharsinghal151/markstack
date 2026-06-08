import { NextRequest, NextResponse } from "next/server";
import { requireBlogExportAccess } from "@/lib/blog-export/blog-export-auth";
import { buildExportFilename } from "@/lib/blog-export/filename";
import { generateBlogPdfBuffer } from "@/lib/blog-export/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const accessResult = await requireBlogExportAccess(id, "pdf");

    if (accessResult instanceof NextResponse) {
      return accessResult;
    }

    const pdfBuffer = await generateBlogPdfBuffer(
      accessResult.blog,
      request.nextUrl.origin,
    );
    const filename = buildExportFilename(accessResult.blog.slug, "pdf");

    return new Response(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
        Pragma: "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Failed to export PDF" },
      { status: 500 },
    );
  }
}
