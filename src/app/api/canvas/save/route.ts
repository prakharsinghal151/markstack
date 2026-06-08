import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { canvasId, data } = await request.json();

    if (!canvasId || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get the current user session using better-auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the canvas with new data
    const canvas = await db.canvas.update({
      where: {
        id: canvasId,
        userId: session.user.id, // Ensure user owns the canvas
      },
      data: {
        data: data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, canvas });
  } catch (error) {
    console.error("Canvas save error:", error);
    return NextResponse.json(
      { error: "Failed to save canvas" },
      { status: 500 },
    );
  }
}
