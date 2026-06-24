import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STAFF_HOST = process.env.STAFF_HOST || "staff.localhost";

const isProd = process.env.NODE_ENV === "production";

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "";
}

function ipAllowed(ip: string): boolean {
  const list = (process.env.STAFF_ALLOWED_IPS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (list.length === 0) return true;
  if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") return true;
  return list.includes(ip);
}

function isStaffPath(pathname: string): boolean {
  return (
    pathname === "/employee-login" ||
    pathname.startsWith("/employee") ||
    pathname.startsWith("/api/employee")
  );
}

export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") || "").split(":")[0];
  const { pathname } = req.nextUrl;
  const onStaffHost = host === STAFF_HOST;

  if (onStaffHost) {
    if (!ipAllowed(clientIp(req))) {
      return new NextResponse(
        "Access to the staff portal is restricted to the office network.",
        { status: 403, headers: { "content-type": "text/plain" } }
      );
    }
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/employee", req.url));
    }
    if (!isStaffPath(pathname)) {
      return NextResponse.redirect(new URL("/employee", req.url));
    }
    return NextResponse.next();
  }

  if (isProd && isStaffPath(pathname)) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:png|jpg|jpeg|svg|webp|ico|gif)$).*)"],
};
