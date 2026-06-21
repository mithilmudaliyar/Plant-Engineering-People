import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { itemId, supplierId, pricePerUnit, notes } = await request.json();

    if (!itemId || !supplierId || pricePerUnit == null) {
      return NextResponse.json({ success: false, message: "itemId, supplierId, and pricePerUnit are required." }, { status: 400 });
    }

    const quote = await prisma.supplierQuote.upsert({
      where: { itemId_supplierId: { itemId: Number(itemId), supplierId: Number(supplierId) } },
      create: {
        itemId: Number(itemId),
        supplierId: Number(supplierId),
        pricePerUnit: Number(pricePerUnit),
        notes: notes || null,
        status: "PENDING",
      },
      update: {
        pricePerUnit: Number(pricePerUnit),
        notes: notes || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    console.error("Quote submission error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get("supplierId");

    if (!supplierId) {
      return NextResponse.json({ success: false, message: "supplierId is required." }, { status: 400 });
    }

    const quotes = await prisma.supplierQuote.findMany({
      where: { supplierId: Number(supplierId) },
      orderBy: { createdAt: "desc" },
      include: {
        item: {
          include: {
            sheet: { select: { title: true } },
            quotes: {
              orderBy: { pricePerUnit: "asc" },
              take: 1,
              select: { pricePerUnit: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, quotes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
