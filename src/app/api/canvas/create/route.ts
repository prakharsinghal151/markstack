import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/database";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    // Get the current user session using better-auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Create new canvas with unique ID
    const canvasId = nanoid();
    const canvas = await db.canvas.create({
      data: {
        id: canvasId,
        title: title || "Untitled Canvas",
        data: { elements: [], appState: {}, files: {} },
        userId: session.user.id,
      },
    });

    return NextResponse.json({ canvas });
  } catch (error) {
    console.error("Canvas creation error:", error);
    return NextResponse.json(
      { error: "Failed to create canvas" },
      { status: 500 }
    );
  }
}
