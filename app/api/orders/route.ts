import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderCreatedEmail } from "@/lib/email";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get("supplierId");

  if (!supplierId) {
    return NextResponse.json(
      { success: false, message: "Supplier ID is required." },
      { status: 400 }
    );
  }

  const sId = parseInt(supplierId, 10);
  if (isNaN(sId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Supplier ID." },
      { status: 400 }
    );
  }

  try {
    const orders = await prisma.contractOrder.findMany({
      where: { supplierId: sId },
      include: {
        photos: {
          orderBy: { uploadedAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch supplier orders API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const { supplierId, whatNeeded, dimensions, blueprintAvailable, briefDetails, isTicket } = body;

  if (!supplierId || !whatNeeded) {
    return NextResponse.json(
      { success: false, message: "Supplier ID and requirements are required." },
      { status: 400 }
    );
  }

  const sId = parseInt(supplierId, 10);
  if (isNaN(sId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Supplier ID." },
      { status: 400 }
    );
  }

  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: sId },
    });

    if (!supplier) {
      return NextResponse.json(
        { success: false, message: "Supplier not found." },
        { status: 404 }
      );
    }

    const newOrder = await prisma.contractOrder.create({
      data: {
        supplierId: sId,
        whatNeeded,
        dimensions: dimensions || null,
        blueprintAvailable: Boolean(blueprintAvailable),
        briefDetails: briefDetails || null,
        isTicket: Boolean(isTicket),
      },
    });

    // Send email notification to supplier
    await sendOrderCreatedEmail(
      supplier.email,
      supplier.name,
      newOrder.id,
      whatNeeded,
      newOrder.isTicket
    );

    return NextResponse.json({
      success: true,
      message: newOrder.isTicket ? "Ticket created successfully." : "Order placed successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create order API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
