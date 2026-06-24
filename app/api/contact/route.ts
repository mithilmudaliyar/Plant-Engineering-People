import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { name, company, email, message } = await request.json();

    if (!name || !String(name).trim()) {
      return NextResponse.json({ success: false, message: "Please enter your name." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
    }
    if (!message || !String(message).trim()) {
      return NextResponse.json({ success: false, message: "Please enter a message." }, { status: 400 });
    }

    await prisma.contactInquiry.create({
      data: {
        name: String(name).trim(),
        company: company ? String(company).trim() : null,
        email: String(email).trim().toLowerCase(),
        message: String(message).trim(),
      },
    });

    return NextResponse.json({ success: true, message: "Your inquiry has been received. We'll be in touch within one business day." });
  } catch (error) {
    console.error("Contact inquiry error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
