import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET;

// Validate that SESSION_SECRET is set in non-development environments
if (!SECRET && process.env.NODE_ENV === "production") {
  throw new Error(
    "SESSION_SECRET environment variable is required in production. " +
    "Set a long, random value (e.g., openssl rand -hex 32)"
  );
}

// Fallback for development only - never use this in production
const DEV_SECRET = "waij-dev-session-secret-change-me-in-production";
const EFFECTIVE_SECRET = SECRET ?? DEV_SECRET;

if (!SECRET && process.env.NODE_ENV !== "production") {
  console.warn(
    "⚠️  WARNING: Using default SESSION_SECRET. This is insecure for production. " +
    "Set SESSION_SECRET environment variable to a long random string."
  );
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", EFFECTIVE_SECRET).update(payload).digest("hex");
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
