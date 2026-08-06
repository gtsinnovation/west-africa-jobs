import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ADMIN_COOKIE, createAdminSessionToken } from "@/lib/auth";
import { findAdminByUsername } from "@/lib/admins";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = checkRateLimit(request, "auth-admin-login", RATE_LIMITS.authLogin);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const body = await request.json();
  const { username, password } = body as { username?: string; password?: string };

  const admin = username ? await findAdminByUsername(username) : undefined;

  if (!admin || !(await bcrypt.compare(password ?? "", admin.passwordHash))) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSessionToken(admin.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ADMIN_COOKIE, createAdminSessionToken } from "@/lib/auth";
import { findAdminByUsername } from "@/lib/admins";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = checkRateLimit(request, "auth-admin-login", RATE_LIMITS.authLogin);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const body = await request.json();
  const { username, password } = body as { username?: string; password?: string };

  const admin = username ? await findAdminByUsername(username) : undefined;

  if (!admin || !admin.passwordHash || !password || !(await bcrypt.compare(password, admin.passwordHash))) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSessionToken(admin.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}