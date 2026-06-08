import { NextRequest, NextResponse } from "next/server";
import { structureMarkdown } from "@/lib/ai/structureMarkdown";
import { requireApiAuth } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    if (user instanceof NextResponse) {
      return user;
    }

    const body = await request.json();
    const { markdown } = body;

    if (!markdown || typeof markdown !== "string") {
      return NextResponse.json(
        { error: "Markdown content is required" },
        { status: 400 },
      );
    }

    if (markdown.trim().length === 0) {
      return NextResponse.json(
        { error: "Markdown content cannot be empty" },
        { status: 400 },
      );
    }

    const structuredMarkdown = await structureMarkdown(markdown);

    return NextResponse.json({
      markdown: structuredMarkdown,
    });
  } catch (error) {
    console.error("Error structuring markdown:", error);

    // Handle Google AI specific errors
    let errorMessage = "Failed to structure markdown. Please try again.";

    if (error instanceof Error) {
      if (error.message.includes("GOOGLE_GENERATIVE_AI_API_KEY")) {
        errorMessage =
          "Google AI API key is not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY environment variable.";
      } else if (
        error.message.includes("quota") ||
        error.message.includes("rate limit")
      ) {
        errorMessage = "Google AI quota exceeded. Please try again later.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
