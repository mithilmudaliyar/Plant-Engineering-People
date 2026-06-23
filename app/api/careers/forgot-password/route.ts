import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken, hashToken, clientIp } from "@/lib/auth";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendPasswordResetEmail } from "@/lib/email";
import { normalizeEmail, isValidEmail } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { email: rawEmail, turnstileToken } = await request.json();
    const email = normalizeEmail(rawEmail);

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
    }

    const captcha = await verifyTurnstile(turnstileToken, clientIp(request));
    if (!captcha.ok) {
      return NextResponse.json({ success: false, message: captcha.error }, { status: 400 });
    }

    const applicant = await prisma.applicant.findUnique({ where: { email } });

    // Only send if the account exists and is verified — but always return the
    // same response so attackers can't enumerate registered emails.
    if (applicant && applicant.emailVerified) {
      const token = generateToken();
      const tokenHash = hashToken(token);
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      // Invalidate prior unused tokens for this user.
      await prisma.passwordResetToken.deleteMany({ where: { applicantId: applicant.id, usedAt: null } });
      await prisma.passwordResetToken.create({ data: { tokenHash, applicantId: applicant.id, expiresAt } });

      const base = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
      const resetUrl = `${base}/reset-password?token=${token}`;
      await sendPasswordResetEmail(email, resetUrl);
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists for that email, we've sent a password reset link.",
    });
  } catch (error: unknown) {
    console.error("Careers forgot-password error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
