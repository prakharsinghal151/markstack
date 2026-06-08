import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Get the current user session using better-auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all canvases for the user
    const canvases = await db.canvas.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ canvases });
  } catch (error) {
    console.error("Canvases fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch canvases" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { canvasId } = await request.json();

    if (!canvasId) {
      return NextResponse.json(
        { error: "Canvas ID is required" },
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

    // Delete the canvas
    const deleteResult = await db.canvas.deleteMany({
      where: {
        id: canvasId,
        userId: session.user.id, // Ensure user owns the canvas
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json({ error: "Canvas not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Canvas deleted successfully",
    });
  } catch (error) {
    console.error("Canvas delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete canvas" },
      { status: 500 },
    );
  }
}
