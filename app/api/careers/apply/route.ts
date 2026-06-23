import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentApplicant } from "@/lib/auth";

// Submit a job application. Requires an authenticated, verified applicant.
export async function POST(request: Request) {
  try {
    const applicant = await getCurrentApplicant();
    if (!applicant) {
      return NextResponse.json({ success: false, message: "Please sign in to apply.", needsAuth: true }, { status: 401 });
    }
    if (!applicant.emailVerified) {
      return NextResponse.json({ success: false, message: "Please verify your email before applying." }, { status: 403 });
    }

    const { jobId, coverLetter, resumeUrl } = await request.json();
    if (!jobId) {
      return NextResponse.json({ success: false, message: "Missing job." }, { status: 400 });
    }

    const job = await prisma.jobOpening.findUnique({ where: { id: Number(jobId) } });
    if (!job || job.status !== "OPEN") {
      return NextResponse.json({ success: false, message: "This position is no longer open." }, { status: 400 });
    }

    const existing = await prisma.jobApplication.findUnique({
      where: { jobId_applicantId: { jobId: Number(jobId), applicantId: applicant.id } },
    });
    if (existing) {
      return NextResponse.json({ success: false, message: "You have already applied to this position." }, { status: 409 });
    }

    await prisma.jobApplication.create({
      data: {
        jobId: Number(jobId),
        applicantId: applicant.id,
        coverLetter: coverLetter ? String(coverLetter) : null,
        resumeUrl: resumeUrl ? String(resumeUrl) : null,
      },
    });

    return NextResponse.json({ success: true, message: "Application submitted. We'll be in touch!" });
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

// Has the current applicant already applied? (used to toggle the apply button)
export async function GET(request: Request) {
  const applicant = await getCurrentApplicant();
  if (!applicant) return NextResponse.json({ authenticated: false, applied: false });

  const { searchParams } = new URL(request.url);
  const jobId = Number(searchParams.get("jobId"));
  if (!jobId) return NextResponse.json({ authenticated: true, applied: false });

  const existing = await prisma.jobApplication.findUnique({
    where: { jobId_applicantId: { jobId, applicantId: applicant.id } },
  });
  return NextResponse.json({ authenticated: true, applied: !!existing, name: applicant.name });
}
