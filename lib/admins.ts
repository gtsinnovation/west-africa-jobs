import crypto from "crypto";
import bcrypt from "bcryptjs";

export interface Admin {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

const admins: Admin[] = [];

function seedDefaultAdmin() {
  if (admins.length > 0) return;
  // Default seeded credentials — hashed at rest, same as user accounts.
  // Change this via createAdmin/updateAdminPassword before going to
  // production; this seed exists purely so the app has a working staff
  // login out of the box.
  const passwordHash = bcrypt.hashSync("ImpactJobs2026!", 10);
  admins.push({
    id: crypto.randomUUID(),
    username: "admin",
    passwordHash,
    createdAt: new Date().toISOString(),
  });
}
seedDefaultAdmin();

export function findAdminByUsername(username: string): Admin | undefined {
  return admins.find((a) => a.username.toLowerCase() === username.toLowerCase());
}

export function findAdminById(id: string): Admin | undefined {
  return admins.find((a) => a.id === id);
}

export function createAdmin(username: string, passwordHash: string): Admin {
  const admin: Admin = {
    id: crypto.randomUUID(),
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  admins.push(admin);
  return admin;
}

export function updateAdminPassword(admin: Admin, passwordHash: string): Admin {
  admin.passwordHash = passwordHash;
  return admin;
}

export function getAllAdmins(): Admin[] {
  return [...admins];
}
