import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSessionUserId } from "@/lib/user-session";
import { findUserById, setResume, toPublicUser } from "@/lib/users";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_EXT = new Set([".pdf", ".doc", ".docx"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limited = checkRateLimit(request, "resume-upload", RATE_LIMITS.resumeUpload);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const user = await findUserById(userId);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("resume");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // Sanitize filename to prevent directory traversal attacks
  const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = path.extname(originalName).toLowerCase();
  
  if (!ALLOWED_TYPES.has(file.type) && !ALLOWED_EXT.has(ext)) {
    return NextResponse.json(
      { error: "Only PDF, DOC, and DOCX files are accepted." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File must be 5MB or smaller." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "resumes");
  await mkdir(uploadsDir, { recursive: true });

  const safeExt = ext || ".pdf";
  const filename = `${userId}-${Date.now()}${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  const updated = await setResume(user, {
    filename: file.name,
    url: `/uploads/resumes/${filename}`,
    uploadedAt: new Date().toISOString(),
    sizeBytes: file.size,
  });

  return NextResponse.json(toPublicUser(updated));
}
