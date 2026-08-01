import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/user-session";
import { findUserById, toPublicUser } from "@/lib/users";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserById(userId);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(toPublicUser(user));
}
