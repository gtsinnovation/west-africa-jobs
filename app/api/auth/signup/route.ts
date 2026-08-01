import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "@/lib/users";
import { sendEmail, verificationEmailTemplate } from "@/lib/mailer";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const limited = checkRateLimit(request, "auth-signup", RATE_LIMITS.authSignup);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }
  if (await findUserByEmail(email)) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(email, passwordHash);

  const origin = new URL(request.url).origin;
  const verifyUrl = `${origin}/verify-email?token=${user.verificationToken}`;
  const { html, text } = verificationEmailTemplate(verifyUrl);
  const { mode } = await sendEmail({
    to: user.email,
    subject: "Verify your email — West Africa Impact Jobs",
    html,
    text,
  });

  const messages: Record<string, string> = {
    ahasend: "Account created. Check your inbox for a verification link.",
    smtp: "Account created. Check your inbox for a verification link.",
    dev: "Account created. No email provider is configured yet, so the verification email was captured in the admin Dev Mailbox instead of a real inbox.",
  };

  return NextResponse.json({
    success: true,
    emailMode: mode,
    message: messages[mode],
  });
}
