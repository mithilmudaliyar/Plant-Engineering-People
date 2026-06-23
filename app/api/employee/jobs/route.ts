import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireContentManagerSession } from "@/lib/employeeAuth";

// List all jobs (incl. closed) with application counts — staff only.
export async function GET() {
  try {
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    const jobs = await prisma.jobOpening.findMany({
      orderBy: { postedAt: "desc" },
      include: { _count: { select: { applications: true } } },
    });
    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error("Employee jobs GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    const { title, department, location, employmentType, experience, description, responsibilities, requirements } = body;
    if (!title || !department || !location || !description) {
      return NextResponse.json({ success: false, message: "Title, department, location and description are required." }, { status: 400 });
    }

    const job = await prisma.jobOpening.create({
      data: {
        title: String(title).trim(),
        department: String(department).trim(),
        location: String(location).trim(),
        employmentType: employmentType ? String(employmentType) : "Full-time",
        experience: experience ? String(experience) : null,
        description: String(description),
        responsibilities: responsibilities ? String(responsibilities) : null,
        requirements: requirements ? String(requirements) : null,
      },
    });
    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Employee jobs POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ success: false, message: "Job id required." }, { status: 400 });

    const data: Record<string, unknown> = {};
    for (const k of ["title", "department", "location", "employmentType", "experience", "description", "responsibilities", "requirements", "status"]) {
      if (rest[k] !== undefined) data[k] = rest[k];
    }

    const job = await prisma.jobOpening.update({ where: { id: Number(id) }, data });
    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Employee jobs PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    if (!body.id) return NextResponse.json({ success: false, message: "Job id required." }, { status: 400 });
    await prisma.jobOpening.delete({ where: { id: Number(body.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Employee jobs DELETE error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
