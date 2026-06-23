import { NextResponse } from "next/server";
import { getCurrentEmployee } from "@/lib/employeeAuth";

export async function GET() {
  const employee = await getCurrentEmployee();
  if (!employee) return NextResponse.json({ authenticated: false }, { status: 200 });
  return NextResponse.json({ authenticated: true, employee });
}
