import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, clientIp } from "@/lib/auth";
import { normalizeEmail } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { email: rawEmail, code } = await request.json();
    const email = normalizeEmail(rawEmail);

    if (!email || !code) {
      return NextResponse.json({ success: false, message: "Email and code are required." }, { status: 400 });
    }

    const otp = await prisma.otpCode.findFirst({
      where: { email, code: String(code).trim(), expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return NextResponse.json({ success: false, message: "Invalid or expired verification code." }, { status: 400 });
    }

    const applicant = await prisma.applicant.findUnique({ where: { email } });
    if (!applicant) {
      return NextResponse.json({ success: false, message: "Account not found." }, { status: 404 });
    }

    await prisma.applicant.update({ where: { id: applicant.id }, data: { emailVerified: true } });
    await prisma.otpCode.deleteMany({ where: { email } });

    // Verification succeeds -> log them in (session-only by default).
    await createSession(applicant.id, false, {
      userAgent: request.headers.get("user-agent"),
      ip: clientIp(request),
    });

    return NextResponse.json({
      success: true,
      message: "Email verified.",
      applicant: { id: applicant.id, name: applicant.name, email: applicant.email },
    });
  } catch (error: unknown) {
    console.error("Careers verify-email error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
