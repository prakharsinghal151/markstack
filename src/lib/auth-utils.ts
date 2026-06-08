import "server-only";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

function buildAuthRedirectUrl(callbackUrl: string) {
  return `/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

async function resolveCallbackUrl(callbackUrl?: string) {
  if (callbackUrl && callbackUrl.startsWith("/")) {
    return callbackUrl;
  }

  const requestHeaders = await headers();
  const nextUrl =
    requestHeaders.get("next-url") || requestHeaders.get("x-pathname");

  if (!nextUrl) {
    return "/";
  }

  if (nextUrl.startsWith("http://") || nextUrl.startsWith("https://")) {
    try {
      const parsedUrl = new URL(nextUrl);
      return `${parsedUrl.pathname}${parsedUrl.search}`;
    } catch {
      return "/";
    }
  }

  return nextUrl.startsWith("/") ? nextUrl : "/";
}

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth(callbackUrl?: string) {
  const user = await getCurrentUser();
  if (!user) {
    const resolvedCallbackUrl = await resolveCallbackUrl(callbackUrl);
    redirect(buildAuthRedirectUrl(resolvedCallbackUrl));
  }
  return user;
}

export async function requireApiAuth() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return user;
}
