import { scrypt, randomBytes, timingSafeEqual, createHash } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const scryptAsync = promisify(scrypt);

const SESSION_COOKIE = "peppl_careers_session";
const KEYLEN = 64;

// Session lifetimes
const REMEMBER_DAYS = 30;
const SESSION_HOURS = 12; // when "remember me" is off

// ===== PASSWORD HASHING (scrypt, built into Node — no native deps) =====

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  return { hash: derived.toString("hex"), salt };
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const derived = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  const stored = Buffer.from(hash, "hex");
  // Guard against length mismatch (timingSafeEqual throws on unequal lengths)
  if (stored.length !== derived.length) return false;
  return timingSafeEqual(stored, derived);
}

// ===== TOKENS =====

// Opaque random token for the cookie; only its hash is persisted.
export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ===== SESSIONS (server-side, httpOnly cookie holds opaque token) =====

export async function createSession(
  applicantId: number,
  rememberMe: boolean,
  meta?: { userAgent?: string | null; ip?: string | null }
): Promise<void> {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const ms = rememberMe
    ? REMEMBER_DAYS * 24 * 60 * 60 * 1000
    : SESSION_HOURS * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + ms);

  await prisma.session.create({
    data: {
      tokenHash,
      applicantId,
      expiresAt,
      userAgent: meta?.userAgent ?? null,
      ip: meta?.ip ?? null,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: rememberMe ? expiresAt : undefined, // undefined = session cookie
  });
}

export type SessionApplicant = {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
};

export async function getCurrentApplicant(): Promise<SessionApplicant | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { applicant: true },
  });

  if (!session || session.expiresAt < new Date()) {
    // Expired or unknown — clean up if it exists
    if (session) await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return {
    id: session.applicant.id,
    name: session.applicant.name,
    email: session.applicant.email,
    emailVerified: session.applicant.emailVerified,
  };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } }).catch(() => {});
  }
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// Request-meta helpers for audit fields on sessions
export function clientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}
