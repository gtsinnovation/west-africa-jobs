import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import type { User as UserRow } from "@prisma/client";

export interface ResumeFile {
  filename: string;
  url: string;
  uploadedAt: string;
  sizeBytes: number;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  verified: boolean;
  verificationToken: string | null;
  verificationExpiresAt: number | null;
  resume: ResumeFile | null;
  createdAt: string;
}

function toUser(row: UserRow): User {
  const resume: ResumeFile | null =
    row.resumeUrl && row.resumeFilename && row.resumeUploadedAt
      ? {
          filename: row.resumeFilename,
          url: row.resumeUrl,
          uploadedAt: row.resumeUploadedAt.toISOString(),
          sizeBytes: row.resumeSizeBytes ?? 0,
        }
      : null;

  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    verified: row.verified,
    verificationToken: row.verificationToken,
    verificationExpiresAt: row.verificationExpiresAt
      ? row.verificationExpiresAt.getTime()
      : null,
    resume,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const row = await prisma.user.findFirst({
    where: { email: { equals: email.toLowerCase(), mode: "insensitive" } },
  });
  return row ? toUser(row) : undefined;
}

export async function findUserById(id: string): Promise<User | undefined> {
  const row = await prisma.user.findUnique({ where: { id } });
  return row ? toUser(row) : undefined;
}

export async function findUserByVerificationToken(token: string): Promise<User | undefined> {
  const row = await prisma.user.findFirst({ where: { verificationToken: token } });
  return row ? toUser(row) : undefined;
}

export async function createUser(email: string, passwordHash: string): Promise<User> {
  const row = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      verified: false,
      verificationToken: crypto.randomBytes(24).toString("hex"),
      verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  return toUser(row);
}

export async function regenerateVerificationToken(user: User): Promise<User> {
  const row = await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken: crypto.randomBytes(24).toString("hex"),
      verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  return toUser(row);
}

export async function markVerified(user: User): Promise<User> {
  const row = await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verificationToken: null, verificationExpiresAt: null },
  });
  return toUser(row);
}

export async function setResume(user: User, resume: ResumeFile): Promise<User> {
  const row = await prisma.user.update({
    where: { id: user.id },
    data: {
      resumeFilename: resume.filename,
      resumeUrl: resume.url,
      resumeUploadedAt: new Date(resume.uploadedAt),
      resumeSizeBytes: resume.sizeBytes,
    },
  });
  return toUser(row);
}

export async function getAllUsers(): Promise<User[]> {
  const rows = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toUser);
}

export function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    verified: user.verified,
    resume: user.resume,
    createdAt: user.createdAt,
  };
}
