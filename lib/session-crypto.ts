import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET ?? "waij-dev-session-secret-change-me";

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createSignedToken(data: Record<string, unknown>): string {
  const payload = Buffer.from(JSON.stringify({ ...data, iat: Date.now() })).toString(
    "base64url"
  );
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySignedToken<T = Record<string, unknown>>(token: string): T | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (sign(payload) !== signature) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as T;
  } catch {
    return null;
  }
}
