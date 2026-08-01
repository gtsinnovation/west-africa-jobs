import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllUsers, toPublicUser } from "@/lib/users";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await getAllUsers();
  return NextResponse.json(users.map(toPublicUser));
}
