import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Hostname that serves the staff portal. In dev, use staff.localhost:3000
// (Chrome/Edge/Firefox resolve *.localhost to 127.0.0.1 automatically).
const STAFF_HOST = process.env.STAFF_HOST || "staff.localhost";

const isProd = process.env.NODE_ENV === "production";

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "";
}

// Office-network gate. If STAFF_ALLOWED_IPS is empty, allow everyone (so you
// are never locked out before configuring it). Localhost is always allowed.
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

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").split(":")[0];
  const { pathname } = req.nextUrl;
  const onStaffHost = host === STAFF_HOST;

  if (onStaffHost) {
    // Restrict the staff subdomain to the office network.
    if (!ipAllowed(clientIp(req))) {
      return new NextResponse(
        "Access to the staff portal is restricted to the office network.",
        { status: 403, headers: { "content-type": "text/plain" } }
      );
    }
    // This host serves staff routes only.
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/employee", req.url));
    }
    if (!isStaffPath(pathname)) {
      return NextResponse.redirect(new URL("/employee", req.url));
    }
    return NextResponse.next();
  }

  // Main domain: in production, hide the staff portal entirely (404). In dev we
  // leave it reachable on localhost so your local workflow is unaffected.
  if (isProd && isStaffPath(pathname)) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals and static asset files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:png|jpg|jpeg|svg|webp|ico|gif)$).*)"],
};
