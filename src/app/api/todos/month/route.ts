import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/database";
import { startOfMonth, endOfMonth, format, isValid, parseISO } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month");

    if (!monthParam) {
      return NextResponse.json(
        { error: "Month parameter is required" },
        { status: 400 },
      );
    }

    // Parse month (YYYY-MM format)
    const monthDate = parseISO(monthParam + "-01"); // Add day 1 to make it a valid date
    if (!isValid(monthDate)) {
      return NextResponse.json(
        { error: "Invalid month format" },
        { status: 400 },
      );
    }

    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    // Get date range as strings
    const startDateStr = format(monthStart, "yyyy-MM-dd");
    const endDateStr = format(monthEnd, "yyyy-MM-dd");

    // Fetch all todos for the month using string comparison
    const todos = await db.todo.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDateStr,
          lte: endDateStr,
        },
      },
      select: {
        date: true,
        id: true,
      },
    });

    // Create a Set of dates that have todos (already stored as YYYY-MM-DD strings)
    const datesWithTodos = new Set(todos.map((todo) => todo.date));

    return NextResponse.json({ datesWithTodos: Array.from(datesWithTodos) });
  } catch (error) {
    console.error("Month todos fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch month todos" },
      { status: 500 },
    );
  }
}
