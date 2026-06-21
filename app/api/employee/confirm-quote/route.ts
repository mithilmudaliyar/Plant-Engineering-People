import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOutbidEmail, sendConfirmedEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { quoteId } = await request.json();

    if (!quoteId) {
      return NextResponse.json({ success: false, message: "quoteId is required." }, { status: 400 });
    }

    // Get the winning quote with all related data
    const winningQuote = await prisma.supplierQuote.findUnique({
      where: { id: Number(quoteId) },
      include: {
        supplier: true,
        item: {
          include: {
            quotes: {
              include: { supplier: true },
            },
          },
        },
      },
    });

    if (!winningQuote) {
      return NextResponse.json({ success: false, message: "Quote not found." }, { status: 404 });
    }

    // Mark the winning quote as CONFIRMED
    await prisma.supplierQuote.update({
      where: { id: Number(quoteId) },
      data: { status: "CONFIRMED" },
    });

    // Mark all other quotes for the same item as OUTBID
    const losingQuotes = winningQuote.item.quotes.filter(q => q.id !== Number(quoteId));
    await prisma.supplierQuote.updateMany({
      where: { itemId: winningQuote.itemId, id: { not: Number(quoteId) } },
      data: { status: "OUTBID" },
    });

    // Send confirmation email to winner
    try {
      await sendConfirmedEmail(
        winningQuote.supplier.email,
        winningQuote.supplier.name,
        winningQuote.item.productName,
        winningQuote.pricePerUnit,
        winningQuote.item.unit,
      );
    } catch (e) { console.error("Confirm email failed:", e); }

    // Send outbid emails to losers
    for (const lq of losingQuotes) {
      try {
        await sendOutbidEmail(
          lq.supplier.email,
          lq.supplier.name,
          winningQuote.item.productName,
          winningQuote.pricePerUnit,
          winningQuote.item.unit,
        );
      } catch (e) { console.error("Outbid email failed:", e); }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Confirm quote error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
