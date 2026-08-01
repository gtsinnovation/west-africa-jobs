import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/users";
import { createSessionToken, USER_SESSION_COOKIE } from "@/lib/user-session";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = checkRateLimit(request, "auth-user-login", RATE_LIMITS.authLogin);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const { email, password } = (await request.json()) as { email?: string; password?: string };
  const user = email ? await findUserByEmail(email) : undefined;

  if (!user || !(await bcrypt.compare(password ?? "", user.passwordHash))) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  if (!user.verified) {
    return NextResponse.json(
      { error: "Please verify your email address before logging in.", unverified: true },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(USER_SESSION_COOKIE, createSessionToken(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}
