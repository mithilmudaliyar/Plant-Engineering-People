import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManagerSession } from "@/lib/employeeAuth";

export async function GET() {
  try {
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error("Fetch inquiries error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    const { id, read } = await request.json();
    if (!id) return NextResponse.json({ success: false, message: "ID required." }, { status: 400 });

    const inquiry = await prisma.contactInquiry.update({
      where: { id: Number(id) },
      data: { read: Boolean(read) },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("Update inquiry error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
