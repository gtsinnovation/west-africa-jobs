import { NextResponse } from "next/server";
import { findUserByVerificationToken, markVerified } from "@/lib/users";

export async function POST(request: Request) {
  const { token } = (await request.json()) as { token?: string };
  if (!token) {
    return NextResponse.json({ error: "Missing verification token." }, { status: 400 });
  }

  const user = await findUserByVerificationToken(token);
  if (!user) {
    return NextResponse.json(
      { error: "This verification link is invalid or has already been used." },
      { status: 400 }
    );
  }

  if (user.verificationExpiresAt && user.verificationExpiresAt < Date.now()) {
    return NextResponse.json(
      { error: "This verification link has expired. Please request a new one." },
      { status: 400 }
    );
  }

  await markVerified(user);
  return NextResponse.json({ success: true, email: user.email });
}
