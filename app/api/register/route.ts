import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ success: false, message: "Name and email are required." }, { status: 400 });
    }

    // Check if supplier already exists
    const existing = await prisma.supplier.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "A supplier with this email already exists. Please login." },
        { status: 400 }
      );
    }

    // Create supplier. We use dummy password hash since we are using OTP.
    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        passwordHash: "otp-auth",
        passwordSalt: "otp-auth",
        emailVerified: false,
      },
    });

    // Generate 6-digit OTP
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.deleteMany({ where: { email } });
    await prisma.otpCode.create({
      data: { email, code, expiresAt },
    });

    // Send email
    await sendOtpEmail(email, code);

    return NextResponse.json({
      success: true,
      message: "Account created. OTP sent to your email.",
    });

  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error: " + (error?.message || String(error)) },
      { status: 500 }
    );
  }
}
