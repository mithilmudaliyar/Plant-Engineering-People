import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";
import { requireContentManagerSession } from "@/lib/employeeAuth";

export async function POST(request: Request) {
  try {
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const uploadedBy = formData.get("uploadedBy") as string;

    if (!file || !title || !uploadedBy) {
      return NextResponse.json({ success: false, message: "File, title, and uploader name are required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return NextResponse.json({ success: false, message: "The Excel file appears to be empty." }, { status: 400 });
    }

    const items = rows.map((row: any) => ({
      productName: String(row["Product Name"] || row["product_name"] || row["Name"] || "").trim(),
      quantity: parseFloat(row["Quantity"] || row["quantity"] || 0),
      unit: String(row["Unit"] || row["unit"] || "pcs").trim(),
      specification: String(row["Specification"] || row["specification"] || "").trim() || null,
    })).filter(item => item.productName);

    if (!items.length) {
      return NextResponse.json({ success: false, message: "No valid rows found. Check column names: 'Product Name', 'Quantity', 'Unit', 'Specification'." }, { status: 400 });
    }

    const sheet_record = await prisma.buyOrderSheet.create({
      data: {
        title,
        description: description || null,
        uploadedBy,
        items: { create: items },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, sheet: sheet_record });
  } catch (error: any) {
    console.error("Buy order upload error:", error);
    return NextResponse.json({ success: false, message: "Failed to process file: " + error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const guard = await requireContentManagerSession();
    if (!guard.ok) return NextResponse.json({ success: false, message: guard.message }, { status: guard.status });

    const sheets = await prisma.buyOrderSheet.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            quotes: {
              include: { supplier: { select: { id: true, name: true, email: true } } },
              orderBy: { pricePerUnit: "asc" },
            },
          },
        },
      },
    });
    return NextResponse.json({ success: true, sheets });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
