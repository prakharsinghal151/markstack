import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/settings", "/editor"];
const authRoutes = ["/auth"];

// Better Auth uses __Secure- prefix on HTTPS (production), plain name on HTTP (dev)
const SESSION_COOKIES = [
  "__Secure-better-auth.session_token",
  "better-auth.session_token",
];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    matchesRoute(path, route),
  );
  const isAuthRoute = authRoutes.some((route) => matchesRoute(path, route));

  const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));

  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/auth", req.nextUrl);
    loginUrl.searchParams.set(
      "callbackUrl",
      `${path}${req.nextUrl.search}` || path,
    );
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasSession) {
    // Don't force redirect to dashboard - let users stay where they are
    // or redirect to homepage if they specifically visit /auth
    if (path === "/auth") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
