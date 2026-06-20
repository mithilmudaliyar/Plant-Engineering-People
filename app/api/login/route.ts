import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    const supplier = await prisma.supplier.findUnique({
      where: { email },
    });

    if (!supplier) {
      return NextResponse.json(
        { success: false, message: "Supplier account not found." },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete existing OTPs for this email to prevent spam/confusion
    await prisma.otpCode.deleteMany({
      where: { email },
    });

    // Save new OTP
    await prisma.otpCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // Send email
    await sendOtpEmail(email, code);

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email.",
    });

  } catch (error) {
    console.error("Login OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
