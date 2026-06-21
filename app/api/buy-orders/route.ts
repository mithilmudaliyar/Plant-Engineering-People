import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sheets = await prisma.buyOrderSheet.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            quotes: {
              orderBy: { pricePerUnit: "asc" },
              take: 1, // Only return best (lowest) quote per item for transparency
              select: { pricePerUnit: true, status: true },
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
