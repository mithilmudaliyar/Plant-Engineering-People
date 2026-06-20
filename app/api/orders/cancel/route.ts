import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const { orderId, supplierId } = body;

  if (!orderId || !supplierId) {
    return NextResponse.json({ success: false, message: "Order ID and Supplier ID are required." }, { status: 400 });
  }

  const oId = parseInt(orderId, 10);
  const sId = parseInt(supplierId, 10);

  if (isNaN(oId) || isNaN(sId)) {
    return NextResponse.json({ success: false, message: "Invalid ID types provided." }, { status: 400 });
  }

  try {
    const order = await prisma.contractOrder.findUnique({
      where: { id: oId },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }

    if (order.supplierId !== sId) {
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
