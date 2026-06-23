import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession, clientIp } from "@/lib/auth";
import { verifyTurnstile } from "@/lib/turnstile";
import { normalizeEmail } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { email: rawEmail, password, rememberMe, turnstileToken } = await request.json();
    const email = normalizeEmail(rawEmail);

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
    }

    const captcha = await verifyTurnstile(turnstileToken, clientIp(request));
    if (!captcha.ok) {
      return NextResponse.json({ success: false, message: captcha.error }, { status: 400 });
    }

    const applicant = await prisma.applicant.findUnique({ where: { email } });

    // Generic error to avoid leaking which emails exist.
    const invalid = NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );

    if (!applicant) return invalid;

    const ok = await verifyPassword(password, applicant.passwordHash, applicant.passwordSalt);
    if (!ok) return invalid;

    if (!applicant.emailVerified) {
      return NextResponse.json(
        { success: false, message: "Please verify your email before signing in.", needsVerification: true, email },
        { status: 403 }
      );
    }

    await createSession(applicant.id, rememberMe === true, {
      userAgent: request.headers.get("user-agent"),
      ip: clientIp(request),
    });

    return NextResponse.json({
      success: true,
      applicant: { id: applicant.id, name: applicant.name, email: applicant.email },
    });
  } catch (error: unknown) {
    console.error("Careers login error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
