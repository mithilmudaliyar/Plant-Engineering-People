import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ success: false, message: "Email and code are required." }, { status: 400 });
    }

    // Find the latest valid OTP for this email
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() }, // ensure not expired
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP." }, { status: 400 });
    }

    // Valid OTP. Delete it so it can't be reused.
    await prisma.otpCode.deleteMany({
      where: { email },
    });

    // Get the supplier data
    const supplier = await prisma.supplier.findUnique({
      where: { email },
    });

    if (!supplier) {
      return NextResponse.json({ success: false, message: "Supplier not found." }, { status: 404 });
    }

    // Mark email as verified if it wasn't
    if (!supplier.emailVerified) {
      await prisma.supplier.update({
        where: { id: supplier.id },
        data: { emailVerified: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      supplier: {
        id: supplier.id,
        email: supplier.email,
        name: supplier.name,
      },
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
