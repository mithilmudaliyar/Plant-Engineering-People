import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManagerSession } from "@/lib/employeeAuth";

// View applications for a job — staff only (authorized via secure session cookie).
export async function GET(request: Request) {
  try {
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    const { searchParams } = new URL(request.url);
    const jobId = Number(searchParams.get("jobId"));
    if (!jobId) return NextResponse.json({ success: false, message: "jobId required." }, { status: 400 });

    const applications = await prisma.jobApplication.findMany({
      where: { jobId },
      orderBy: { createdAt: "desc" },
      include: { applicant: { select: { name: true, email: true, phone: true } } },
    });
    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error("Applications GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
