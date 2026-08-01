import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Admin as AdminRow } from "@prisma/client";

export interface Admin {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

function toAdmin(row: AdminRow): Admin {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.passwordHash,
    createdAt: row.createdAt.toISOString(),
  };
}

// Ensures a working staff login exists out of the box, the same guarantee
// the old in-memory store gave. Memoized so it only runs once per server
// process regardless of how many requests come in concurrently.
let seedPromise: Promise<void> | null = null;

function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const count = await prisma.admin.count();
      if (count > 0) return;
      const passwordHash = bcrypt.hashSync("ImpactJobs2026!", 10);
      await prisma.admin
        .create({ data: { username: "admin", passwordHash } })
        .catch(() => {
          // Another concurrent request already seeded it — ignore the
          // unique-constraint race.
        });
    })();
  }
  return seedPromise;
}

export async function findAdminByUsername(username: string): Promise<Admin | undefined> {
  await ensureSeeded();
  const row = await prisma.admin.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });
  return row ? toAdmin(row) : undefined;
}

export async function findAdminById(id: string): Promise<Admin | undefined> {
  await ensureSeeded();
  const row = await prisma.admin.findUnique({ where: { id } });
  return row ? toAdmin(row) : undefined;
}

export async function createAdmin(username: string, passwordHash: string): Promise<Admin> {
  await ensureSeeded();
  const row = await prisma.admin.create({ data: { username, passwordHash } });
  return toAdmin(row);
}

export async function updateAdminPassword(
  admin: Admin,
  passwordHash: string
): Promise<Admin> {
  const row = await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash },
  });
  return toAdmin(row);
}

export async function getAllAdmins(): Promise<Admin[]> {
  await ensureSeeded();
  const rows = await prisma.admin.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toAdmin);
}
