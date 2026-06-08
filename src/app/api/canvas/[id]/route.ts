import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/database";

// Helper function to sanitize canvas data
function sanitizeCanvasData(data: any) {
  if (!data) return { elements: [], appState: {}, files: {} };

  return {
    elements: data.elements || [],
    appState: {
      collaborators: Array.isArray(data.appState?.collaborators)
        ? data.appState.collaborators
        : [],
      viewBackgroundColor: data.appState?.viewBackgroundColor || "#ffffff",
      currentItemStrokeColor:
        data.appState?.currentItemStrokeColor || "#1e1e1e",
      currentItemBackgroundColor:
        data.appState?.currentItemBackgroundColor || "transparent",
      currentItemFillStyle: data.appState?.currentItemFillStyle || "solid",
      currentItemStrokeWidth: data.appState?.currentItemStrokeWidth || 1,
      currentItemStrokeStyle: data.appState?.currentItemStrokeStyle || "solid",
      currentItemRoughness: data.appState?.currentItemRoughness || 1,
      currentItemOpacity: data.appState?.currentItemOpacity || 100,
      currentFontFamily: data.appState?.currentFontFamily || 1,
      currentFontSize: data.appState?.currentFontSize || 20,
      currentTextAlign: data.appState?.currentTextAlign || "left",
      currentTextVerticalAlign:
        data.appState?.currentTextVerticalAlign || "top",
      currentItemStartArrowhead:
        data.appState?.currentItemStartArrowhead || null,
      currentItemEndArrowhead: data.appState?.currentItemEndArrowhead || null,
      scrollX: data.appState?.scrollX || 0,
      scrollY: data.appState?.scrollY || 0,
      zoom: data.appState?.zoom || { value: 1 },
      viewModeEnabled: data.appState?.viewModeEnabled || false,
      zenModeEnabled: data.appState?.zenModeEnabled || false,
      gridModeEnabled: data.appState?.gridModeEnabled || false,
      ...data.appState, // Merge any other properties
    },
    files: data.files || {},
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: canvasId } = await params;

    // Get the current user session using better-auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Find canvas - user must own it
    const canvas = await db.canvas.findFirst({
      where: {
        id: canvasId,
        userId: session?.user?.id || "",
      },
    });

    if (!canvas) {
      return NextResponse.json({ error: "Canvas not found" }, { status: 404 });
    }

    // Sanitize canvas data to ensure proper structure
    const sanitizedCanvas = {
      ...canvas,
      data: sanitizeCanvasData(canvas.data),
    };

    return NextResponse.json({ canvas: sanitizedCanvas });
  } catch (error) {
    console.error("Canvas fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch canvas" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: canvasId } = await params;
    const { title } = await request.json();

    // Get the current user session using better-auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create new canvas
    const canvas = await db.canvas.create({
      data: {
        id: canvasId,
        title: title || "Untitled Canvas",
        data: {
          elements: [],
          appState: {
            collaborators: [],
            viewBackgroundColor: "#ffffff",
            currentItemStrokeColor: "#1e1e1e",
            currentItemBackgroundColor: "transparent",
            currentItemFillStyle: "solid",
            currentItemStrokeWidth: 1,
            currentItemStrokeStyle: "solid",
            currentItemRoughness: 1,
            currentItemOpacity: 100,
            currentFontFamily: 1,
            currentFontSize: 20,
            currentTextAlign: "left",
            currentTextVerticalAlign: "top",
            currentItemStartArrowhead: null,
            currentItemEndArrowhead: null,
            scrollX: 0,
            scrollY: 0,
            zoom: { value: 1 },
            viewModeEnabled: false,
            zenModeEnabled: false,
            gridModeEnabled: false,
          },
          files: {},
        },
        userId: session.user.id,
      },
    });

    return NextResponse.json({ canvas });
  } catch (error) {
    console.error("Canvas creation error:", error);
    return NextResponse.json(
      { error: "Failed to create canvas" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: canvasId } = await params;

    // Get the current user session using better-auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find canvas to verify ownership
    const canvas = await db.canvas.findFirst({
      where: {
        id: canvasId,
        userId: session.user.id,
      },
    });

    if (!canvas) {
      return NextResponse.json({ error: "Canvas not found" }, { status: 404 });
    }

    // Delete the canvas
    await db.canvas.delete({
      where: {
        id: canvasId,
      },
    });

    return NextResponse.json({ message: "Canvas deleted successfully" });
  } catch (error) {
    console.error("Canvas deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete canvas" },
      { status: 500 },
    );
  }
}
