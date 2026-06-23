import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, hashToken } from "@/lib/auth";
import { passwordIssue } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "Invalid or missing reset token." }, { status: 400 });
    }
    const pwIssue = passwordIssue(password);
    if (pwIssue) {
      return NextResponse.json({ success: false, message: pwIssue }, { status: 400 });
    }

    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(String(token)) },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, message: "This reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const { hash, salt } = await hashPassword(password);

    // Update password, consume token, and revoke all existing sessions for safety.
    await prisma.$transaction([
      prisma.applicant.update({
        where: { id: record.applicantId },
        data: { passwordHash: hash, passwordSalt: salt },
      }),
      prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
      prisma.session.deleteMany({ where: { applicantId: record.applicantId } }),
    ]);

    return NextResponse.json({ success: true, message: "Your password has been reset. You can now sign in." });
  } catch (error: unknown) {
    console.error("Careers reset-password error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
