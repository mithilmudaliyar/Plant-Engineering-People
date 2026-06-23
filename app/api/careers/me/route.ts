import { NextResponse } from "next/server";
import { getCurrentApplicant } from "@/lib/auth";

export async function GET() {
  const applicant = await getCurrentApplicant();
  if (!applicant) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  return NextResponse.json({ authenticated: true, applicant });
}
