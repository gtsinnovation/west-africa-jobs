import crypto from "crypto";
import nodemailer from "nodemailer";

export interface OutboxEmail {
  id: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  sentAt: string;
  mode: "ahasend" | "smtp" | "dev";
}

const outbox: OutboxEmail[] = [];

export function getOutbox(): OutboxEmail[] {
  return outbox;
}

function ahaSendConfigured(): boolean {
  return !!(
    process.env.AHASEND_API_KEY &&
    process.env.AHASEND_ACCOUNT_ID &&
    process.env.AHASEND_FROM_EMAIL
  );
}

function smtpConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function sendViaAhaSend(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const accountId = process.env.AHASEND_ACCOUNT_ID;
  const apiKey = process.env.AHASEND_API_KEY;
  const fromEmail = process.env.AHASEND_FROM_EMAIL!;
  const fromName = process.env.AHASEND_FROM_NAME ?? "West Africa Impact Jobs";

  const res = await fetch(`https://api.ahasend.com/v2/accounts/${accountId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: { email: fromEmail, name: fromName },
      recipients: [{ email: params.to }],
      subject: params.subject,
      html_content: params.html,
      text_content: params.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AhaSend send failed (HTTP ${res.status}): ${body}`);
  }
}

/**
 * Sends transactional email. Priority order:
 *  1. AhaSend (AHASEND_API_KEY + AHASEND_ACCOUNT_ID + AHASEND_FROM_EMAIL) — real
 *     provider send via their REST API v2 create-message endpoint.
 *  2. Generic SMTP (SMTP_HOST/USER/PASS) via nodemailer.
 *  3. Dev outbox fallback — captured in memory and viewable by an admin at
 *     /admin/dashboard so the full signup → verify → login flow can be
 *     exercised end-to-end without a real mail provider.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ mode: "ahasend" | "smtp" | "dev" }> {
  let mode: "ahasend" | "smtp" | "dev" = "dev";

  if (ahaSendConfigured()) {
    await sendViaAhaSend(params);
    mode = "ahasend";
  } else if (smtpConfigured()) {
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
    mode = "smtp";
  }

  outbox.unshift({
    id: crypto.randomUUID(),
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
    sentAt: new Date().toISOString(),
    mode,
  });
  if (outbox.length > 50) outbox.length = 50;

  return { mode };
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
