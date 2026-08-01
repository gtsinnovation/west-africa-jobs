import { NextResponse } from "next/server";
import { findUserByEmail, regenerateVerificationToken } from "@/lib/users";
import { sendEmail, verificationEmailTemplate } from "@/lib/mailer";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = checkRateLimit(request, "auth-resend", RATE_LIMITS.authVerifyResend);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many resend requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const { email } = (await request.json()) as { email?: string };
  const user = email ? await findUserByEmail(email) : undefined;

  // Always respond generically to avoid leaking which emails are registered.
  const generic = NextResponse.json({
    success: true,
    message: "If an account exists for that email, a new verification link has been sent.",
  });

  if (!user || user.verified) return generic;

  const updated = await regenerateVerificationToken(user);
  const origin = new URL(request.url).origin;
  const verifyUrl = `${origin}/verify-email?token=${updated.verificationToken}`;
  const { html, text } = verificationEmailTemplate(verifyUrl);
  await sendEmail({
    to: updated.email,
    subject: "Verify your email — West Africa Impact Jobs",
    html,
    text,
  });

  return generic;
}
