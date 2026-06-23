import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentApplicant } from "@/lib/auth";

export async function POST(request: Request) {
  const account = await getCurrentApplicant();
  if (!account) {
    return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const oId = parseInt(body.orderId, 10);
  if (isNaN(oId)) {
    return NextResponse.json({ success: false, message: "Invalid order id." }, { status: 400 });
  }

  try {
    const order = await prisma.contractOrder.findUnique({
      where: { id: oId },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }

    // Ownership enforced against the session account, not a client-supplied id.
    if (order.supplierId !== account.id) {
      return NextResponse.json({ success: false, message: "Unauthorized operation." }, { status: 403 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json(
        { success: false, message: `Cannot cancel order with status '${order.status}'. Only PENDING orders can be cancelled.` },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.contractOrder.update({
      where: { id: oId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({
      success: true,
      message: "Order successfully cancelled.",
      order: updatedOrder,
    });

  } catch (error) {
    console.error("Failed to cancel contract order:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
