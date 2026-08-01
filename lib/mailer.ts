import crypto from "crypto";
import nodemailer from "nodemailer";

export interface OutboxEmail {
  id: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  sentAt: string;
  mode: "smtp" | "dev";
}

const outbox: OutboxEmail[] = [];

export function getOutbox(): OutboxEmail[] {
  return outbox;
}

function smtpConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

/**
 * Sends transactional email. If SMTP_* env vars are configured, sends real
 * mail via nodemailer. Otherwise, falls back to a "dev outbox" — the email
 * is stored in memory and viewable by an admin at /admin/dashboard so the
 * full signup → verify → login flow can be exercised end-to-end without a
 * real mail provider. Swap in real SMTP credentials (or a provider like
 * Postmark/SendGrid/Resend) via env vars to go live with zero code changes.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ mode: "smtp" | "dev" }> {
  const useSmtp = smtpConfigured();

  if (useSmtp) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? "West Africa Impact Jobs <no-reply@example.org>",
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
  }

  outbox.unshift({
    id: crypto.randomUUID(),
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
    sentAt: new Date().toISOString(),
    mode: useSmtp ? "smtp" : "dev",
  });
  if (outbox.length > 50) outbox.length = 50;

  return { mode: useSmtp ? "smtp" : "dev" };
}

export function verificationEmailTemplate(verifyUrl: string) {
  const text = `Welcome to West Africa Impact Jobs!\n\nPlease verify your email address by visiting:\n${verifyUrl}\n\nThis link expires in 24 hours. If you didn't create this account, you can ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #334155;">
      <div style="background:#0f766e; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color:white; font-size:18px; margin:0;">West Africa Impact Jobs</h1>
      </div>
      <div style="border:1px solid #e2e8f0; border-top:0; padding:24px; border-radius:0 0 8px 8px;">
        <p>Welcome! Please confirm your email address to activate your account.</p>
        <p style="text-align:center; margin: 28px 0;">
          <a href="${verifyUrl}" style="background:#059669;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Verify Email Address</a>
        </p>
        <p style="font-size:13px;color:#64748b;">This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.</p>
      </div>
    </div>`;
  return { html, text };
}
