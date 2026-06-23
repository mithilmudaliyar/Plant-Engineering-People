import { NextResponse } from "next/server";
import { getCurrentApplicant } from "@/lib/auth";
import { uploadResume, storageConfigured } from "@/lib/storage";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(request: Request) {
  try {
    const applicant = await getCurrentApplicant();
    if (!applicant) {
      return NextResponse.json({ success: false, message: "Please sign in to upload a resume." }, { status: 401 });
    }
    if (!storageConfigured()) {
      return NextResponse.json(
        { success: false, message: "File uploads aren't configured yet. Please paste a resume link instead.", notConfigured: true },
        { status: 501 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "No file provided." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, message: "File is too large (max 5 MB)." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ success: false, message: "Only PDF or Word documents are allowed." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const { path } = await uploadResume(applicant.id, { name: file.name, type: file.type, bytes });

    return NextResponse.json({ success: true, path });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json({ success: false, message: "Upload failed. Please try again or paste a link." }, { status: 500 });
  }
}
