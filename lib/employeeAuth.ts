import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateToken, hashToken } from "@/lib/auth";

const STAFF_COOKIE = "peppl_staff_session";
const SESSION_HOURS = 12;

export type StaffSession = {
  id: number;
  name: string;
  email: string;
  role: string;
  canManageContent: boolean;
};

export async function createEmployeeSession(
  employeeId: number,
  meta?: { userAgent?: string | null; ip?: string | null }
): Promise<void> {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);

  await prisma.employeeSession.create({
    data: { tokenHash, employeeId, expiresAt, userAgent: meta?.userAgent ?? null, ip: meta?.ip ?? null },
  });

  const cookieStore = await cookies();
  cookieStore.set(STAFF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // session cookie (cleared when browser closes); server enforces expiry too
  });
}

export async function getCurrentEmployee(): Promise<StaffSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(STAFF_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.employeeSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { employee: true },
  });

  if (!session || session.expiresAt < new Date() || session.employee.status !== "active") {
    if (session) await prisma.employeeSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return {
    id: session.employee.id,
    name: session.employee.name,
    email: session.employee.email,
    role: session.employee.role,
    canManageContent: session.employee.canManageContent,
  };
}

export async function destroyEmployeeSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(STAFF_COOKIE)?.value;
  if (token) {
    await prisma.employeeSession.deleteMany({ where: { tokenHash: hashToken(token) } }).catch(() => {});
  }
  cookieStore.set(STAFF_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Authorize a content-management action. Reads the secure staff session cookie
 * (NOT client-supplied identity) and enforces the canManageContent permission.
 */
export async function requireContentManagerSession():
  Promise<{ ok: true; employee: StaffSession } | { ok: false; status: number; message: string }> {
  const employee = await getCurrentEmployee();
  if (!employee) return { ok: false, status: 401, message: "Please sign in to the staff portal." };
  if (!employee.canManageContent) {
    return { ok: false, status: 403, message: "You don't have permission to manage content." };
  }
  return { ok: true, employee };
}
