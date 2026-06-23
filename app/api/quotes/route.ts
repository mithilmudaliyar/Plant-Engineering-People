import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentApplicant } from "@/lib/auth";

// Submit/update a quote as the signed-in account. Identity from session cookie.
export async function POST(request: Request) {
  try {
    const account = await getCurrentApplicant();
    if (!account) {
      return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });
    }

    const { itemId, pricePerUnit, notes } = await request.json();
    if (!itemId || pricePerUnit == null) {
      return NextResponse.json({ success: false, message: "itemId and pricePerUnit are required." }, { status: 400 });
    }

    const quote = await prisma.supplierQuote.upsert({
      where: { itemId_supplierId: { itemId: Number(itemId), supplierId: account.id } },
      create: {
        itemId: Number(itemId),
        supplierId: account.id,
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
  } catch (error: unknown) {
    console.error("Quote submission error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const account = await getCurrentApplicant();
    if (!account) {
      return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });
    }

    const quotes = await prisma.supplierQuote.findMany({
      where: { supplierId: account.id },
      orderBy: { createdAt: "desc" },
      include: {
        item: {
          include: {
            sheet: { select: { title: true } },
            quotes: { orderBy: { pricePerUnit: "asc" }, take: 1, select: { pricePerUnit: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, quotes });
  } catch (error: unknown) {
    console.error("Fetch quotes error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
