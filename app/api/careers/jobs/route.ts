import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public: list open job openings.
export async function GET() {
  try {
    const jobs = await prisma.jobOpening.findMany({
      where: { status: "OPEN" },
      orderBy: { postedAt: "desc" },
      select: {
        id: true, title: true, department: true, location: true,
        employmentType: true, experience: true, postedAt: true,
      },
    });
    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error("Jobs GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
