import { serializeMDX } from "@/lib/markdown/mdx-renderer";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { markdown } = (await req.json()) as { markdown: string };

    if (typeof markdown !== "string") {
      return NextResponse.json(
        { error: "markdown must be a string" },
        { status: 400 },
      );
    }

    const serialized = await serializeMDX(markdown);
    return NextResponse.json({ serialized });
  } catch (error) {
    console.error("Serialize MDX API error:", error);
    return NextResponse.json({ error: "Failed to serialize" }, { status: 500 });
  }
}
