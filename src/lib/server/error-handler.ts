import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export function handleDatabaseError(error: unknown): NextResponse {
  console.error("Database error:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          { error: "Resource already exists", details: error.meta },
          { status: 409 },
        );
      case "P2025":
        return NextResponse.json(
          { error: "Resource not found", details: error.meta },
          { status: 404 },
        );
      case "P2003":
        return NextResponse.json(
          { error: "Foreign key constraint violation", details: error.meta },
          { status: 400 },
        );
      case "P2014":
        return NextResponse.json(
          { error: "Invalid relation change", details: error.meta },
          { status: 400 },
        );
      default:
        return NextResponse.json(
          {
            error: "Database operation failed",
            code: error.code,
            details: error.meta,
          },
          { status: 500 },
        );
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return NextResponse.json(
      { error: "Unknown database error", message: error.message },
      { status: 500 },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { error: "Unknown error occurred" },
    { status: 500 },
  );
}

export function getErrorCode(error: unknown): string | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code;
  }
  return null;
}
