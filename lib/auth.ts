import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/session-constants";
import { createSignedToken, verifySignedToken } from "@/lib/session-crypto";
import { findAdminById } from "@/lib/admins";

export { ADMIN_COOKIE };

export function createAdminSessionToken(adminId: string): string {
  return createSignedToken({ aid: adminId });
}

export function verifyAdminSessionToken(token: string): string | null {
  const data = verifySignedToken<{ aid?: string }>(token);
  return data?.aid ?? null;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const adminId = verifyAdminSessionToken(token);
  if (!adminId) return false;
  return !!findAdminById(adminId);
}

export async function getSessionAdminId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}
