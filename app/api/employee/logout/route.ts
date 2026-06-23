import { NextResponse } from "next/server";
import { destroyEmployeeSession } from "@/lib/employeeAuth";

export async function POST() {
  await destroyEmployeeSession();
  return NextResponse.json({ success: true });
}
