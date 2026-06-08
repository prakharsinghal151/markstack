import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/database";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, completed } = await request.json();

    // Verify user owns the todo
    const existingTodo = await db.todo.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Update todo
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;

    const todo = await db.todo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ todo });
  } catch (error) {
    console.error("Todo update error:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user owns the todo and delete it
    const deleteResult = await db.todo.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Todo delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
