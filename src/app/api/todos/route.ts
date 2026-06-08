import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/database";
import { format, isValid, parseISO } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 },
      );
    }

    // Validate date format (YYYY-MM-DD)
    const parsedDate = parseISO(dateParam);
    if (!isValid(parsedDate)) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 },
      );
    }

    // Ensure date is in YYYY-MM-DD format
    const formattedDate = format(parsedDate, "yyyy-MM-dd");
    if (formattedDate !== dateParam) {
      return NextResponse.json(
        { error: "Date must be in YYYY-MM-DD format" },
        { status: 400 },
      );
    }

    // Fetch todos for the specific date
    const todos = await db.todo.findMany({
      where: {
        userId: session.user.id,
        date: dateParam, // Direct string comparison
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ todos });
  } catch (error) {
    console.error("Todos fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, date } = await request.json();

    if (!title || !date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 },
      );
    }

    // Validate date format (YYYY-MM-DD)
    const parsedDate = parseISO(date);
    if (!isValid(parsedDate)) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 },
      );
    }

    // Ensure date is in YYYY-MM-DD format
    const formattedDate = format(parsedDate, "yyyy-MM-dd");
    if (formattedDate !== date) {
      return NextResponse.json(
        { error: "Date must be in YYYY-MM-DD format" },
        { status: 400 },
      );
    }

    // Create todo
    const todo = await db.todo.create({
      data: {
        title,
        description: description || null,
        date: date, // Store as string
        userId: session.user.id,
      },
    });

    return NextResponse.json({ todo });
  } catch (error) {
    console.error("Todo creation error:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 },
    );
  }
}
