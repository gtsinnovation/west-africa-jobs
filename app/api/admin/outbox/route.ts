import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getOutbox } from "@/lib/mailer";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(getOutbox());
}
