import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentApplicant } from "@/lib/auth";
import { sendOrderCreatedEmail } from "@/lib/email";

// List the signed-in account's orders. Identity comes from the secure session
// cookie — never a client-supplied id.
export async function GET() {
  const account = await getCurrentApplicant();
  if (!account) {
    return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });
  }

  try {
    const orders = await prisma.contractOrder.findMany({
      where: { supplierId: account.id },
      include: { photos: { orderBy: { uploadedAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const account = await getCurrentApplicant();
  if (!account) {
    return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const { whatNeeded, dimensions, blueprintAvailable, briefDetails, isTicket } = body;
  if (!whatNeeded) {
    return NextResponse.json({ success: false, message: "Requirements are required." }, { status: 400 });
  }

  try {
    const newOrder = await prisma.contractOrder.create({
      data: {
        supplierId: account.id,
        whatNeeded,
        dimensions: dimensions || null,
        blueprintAvailable: Boolean(blueprintAvailable),
        briefDetails: briefDetails || null,
        isTicket: Boolean(isTicket),
      },
    });

    await sendOrderCreatedEmail(account.email, account.name, newOrder.id, whatNeeded, newOrder.isTicket);

    return NextResponse.json({
      success: true,
      message: newOrder.isTicket ? "Ticket created successfully." : "Order placed successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create order API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
