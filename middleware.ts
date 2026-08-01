import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, USER_SESSION_COOKIE } from "@/lib/session-constants";

// Note: middleware runs on the Edge Runtime, which can't use the Node
// `crypto`-based signature verification (see lib/session-crypto.ts). This
// layer only checks that a session cookie is present and redirects
// unauthenticated visitors away from protected routes. The actual signed
// token is verified server-side on every sensitive API call via
// isAdminAuthenticated() / getSessionUserId(), so a forged/garbage cookie
// value still can't grant real access — it just wouldn't be redirected
// away from the page shell itself.
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const session = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!session) {
      const loginUrl = new URL("/admin", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (request.nextUrl.pathname.startsWith("/account")) {
    const session = request.cookies.get(USER_SESSION_COOKIE)?.value;
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/account/:path*"],
};
