import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, clientIp } from "@/lib/auth";
import { createEmployeeSession } from "@/lib/employeeAuth";
import { normalizeEmail } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { email: rawEmail, password } = await request.json();
    const email = normalizeEmail(rawEmail);

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({ where: { email } });

    const invalid = NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );

    if (!employee || employee.status !== "active") return invalid;

    const ok = await verifyPassword(password, employee.passwordHash, employee.passwordSalt);
    if (!ok) return invalid;

    await createEmployeeSession(employee.id, {
      userAgent: request.headers.get("user-agent"),
      ip: clientIp(request),
    });

    return NextResponse.json({
      success: true,
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        canManageContent: employee.canManageContent,
        mustChangePassword: employee.mustChangePassword,
      },
    });
  } catch (error) {
    console.error("Employee login error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
