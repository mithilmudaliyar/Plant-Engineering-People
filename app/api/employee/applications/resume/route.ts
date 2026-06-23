import { NextResponse } from "next/server";
import { requireContentManagerSession } from "@/lib/employeeAuth";
import { signedResumeUrl } from "@/lib/storage";

// Staff-only: exchange a stored resume path for a short-lived signed URL and redirect.
export async function GET(request: Request) {
  const guard = await requireContentManagerSession();
  if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  if (!path) return NextResponse.json({ success: false, message: "Missing path." }, { status: 400 });

  const url = await signedResumeUrl(path);
  if (!url) return NextResponse.json({ success: false, message: "Could not access this file." }, { status: 404 });

  return NextResponse.redirect(url);
}
