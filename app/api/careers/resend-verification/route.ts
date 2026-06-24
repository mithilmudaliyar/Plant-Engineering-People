import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { normalizeEmail, generateNumericCode } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { email: rawEmail } = await request.json();
    const email = normalizeEmail(rawEmail);

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    const applicant = await prisma.applicant.findUnique({ where: { email } });

    if (!applicant) {
      return NextResponse.json({ success: false, message: "No account found for this email." }, { status: 404 });
    }

    if (applicant.emailVerified) {
      return NextResponse.json({ success: false, message: "This email is already verified. Please sign in." }, { status: 400 });
    }

    const code = generateNumericCode(6);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.otpCode.deleteMany({ where: { email } });
    await prisma.otpCode.create({ data: { email, code, expiresAt } });
    await sendVerificationEmail(email, code);

    return NextResponse.json({ success: true, message: "A new verification code has been sent to your email." });
  } catch (error: unknown) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
