import crypto from "crypto";

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

const users: User[] = [];

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function findUserByVerificationToken(token: string): User | undefined {
  return users.find((u) => u.verificationToken === token);
}

export function createUser(email: string, passwordHash: string): User {
  const user: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    passwordHash,
    verified: false,
    verificationToken: crypto.randomBytes(24).toString("hex"),
    verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
    resume: null,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

export function regenerateVerificationToken(user: User): User {
  user.verificationToken = crypto.randomBytes(24).toString("hex");
  user.verificationExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  return user;
}

export function markVerified(user: User): User {
  user.verified = true;
  user.verificationToken = null;
  user.verificationExpiresAt = null;
  return user;
}

export function setResume(user: User, resume: ResumeFile): User {
  user.resume = resume;
  return user;
}

export function getAllUsers(): User[] {
  return [...users].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
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
