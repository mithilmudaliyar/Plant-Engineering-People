import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContractOrderStatus } from "@prisma/client";
import { sendOrderUpdateEmail } from "@/lib/email";

export async function GET() {
  try {
    const orders = await prisma.contractOrder.findMany({
      include: {
        supplier: {
          select: { name: true, email: true },
        },
        photos: {
          orderBy: { uploadedAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Employee fetch orders API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const { orderId, status, employeeNotes } = body;

  if (!orderId) {
    return NextResponse.json({ success: false, message: "Order ID is required." }, { status: 400 });
  }

  const oId = parseInt(orderId, 10);
  if (isNaN(oId)) {
    return NextResponse.json({ success: false, message: "Invalid Order ID." }, { status: 400 });
  }

  const updateData: { status?: ContractOrderStatus; employeeNotes?: string } = {};

  if (status) {
    const validStatuses = Object.values(ContractOrderStatus) as string[];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: `Invalid status code. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }
    updateData.status = status as ContractOrderStatus;
  }

  if (employeeNotes !== undefined) {
    updateData.employeeNotes = employeeNotes;
  }

  try {
    const order = await prisma.contractOrder.findUnique({
      where: { id: oId },
      include: { supplier: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }

    const updatedOrder = await prisma.contractOrder.update({
      where: { id: oId },
      data: updateData,
    });

    // Send email to supplier if status changed or notes added
    if (status || employeeNotes) {
      const emailStatus = status || order.status;
      const emailNotes = employeeNotes !== undefined ? employeeNotes : order.employeeNotes;
      await sendOrderUpdateEmail(
        order.supplier.email,
        order.supplier.name,
        order.id,
        emailStatus,
        emailNotes
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully.",
      order: updatedOrder,
    });

  } catch (error) {
    console.error("Employee update status API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
