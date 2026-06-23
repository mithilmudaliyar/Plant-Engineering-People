import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, clientIp } from "@/lib/auth";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendVerificationEmail } from "@/lib/email";
import { isValidEmail, passwordIssue, normalizeEmail, generateNumericCode } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { name, email: rawEmail, phone, password, acceptedTerms, turnstileToken } =
      await request.json();
    const email = normalizeEmail(rawEmail);

    // --- validation ---
    if (!name || !String(name).trim()) {
      return NextResponse.json({ success: false, message: "Please enter your full name." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
    }
    const pwIssue = passwordIssue(password);
    if (pwIssue) {
      return NextResponse.json({ success: false, message: pwIssue }, { status: 400 });
    }
    if (acceptedTerms !== true) {
      return NextResponse.json({ success: false, message: "You must accept the Terms & Conditions." }, { status: 400 });
    }

    // --- captcha ---
    const captcha = await verifyTurnstile(turnstileToken, clientIp(request));
    if (!captcha.ok) {
      return NextResponse.json({ success: false, message: captcha.error }, { status: 400 });
    }

    // --- existing account handling ---
    const existing = await prisma.applicant.findUnique({ where: { email } });
    if (existing && existing.emailVerified) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    const { hash, salt } = await hashPassword(password);

    if (existing && !existing.emailVerified) {
      // Account exists but was never verified — update details and re-send code.
      await prisma.applicant.update({
        where: { id: existing.id },
        data: { name: String(name).trim(), phone: phone ? String(phone).trim() : null, passwordHash: hash, passwordSalt: salt },
      });
    } else {
      await prisma.applicant.create({
        data: {
          name: String(name).trim(),
          email,
          phone: phone ? String(phone).trim() : null,
          passwordHash: hash,
          passwordSalt: salt,
          emailVerified: false,
        },
      });
    }

    // --- one-time verification code ---
    const code = generateNumericCode(6);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.otpCode.deleteMany({ where: { email } });
    await prisma.otpCode.create({ data: { email, code, expiresAt } });
    await sendVerificationEmail(email, code);

    return NextResponse.json({
      success: true,
      message: "Account created. We've sent a verification code to your email.",
      email,
    });
  } catch (error: unknown) {
    console.error("Careers register error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
