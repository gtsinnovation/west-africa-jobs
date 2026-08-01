import { cookies } from "next/headers";
import { USER_SESSION_COOKIE } from "@/lib/session-constants";
import { createSignedToken, verifySignedToken } from "@/lib/session-crypto";

export { USER_SESSION_COOKIE };

export function createSessionToken(userId: string): string {
  return createSignedToken({ uid: userId });
}

export function verifySessionToken(token: string): string | null {
  const data = verifySignedToken<{ uid?: string }>(token);
  return data?.uid ?? null;
}

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
