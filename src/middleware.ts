import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getUserRole(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload.role || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Skip token authentication validation entirely for the Admin signin entry view
  if (path === "/admin/dashboard/signin") {
    return NextResponse.next();
  }

  // 🚀 2. PROTECT ADMIN SUB-ROUTES
  if (path.startsWith("/admin")) {
    const adminToken = request.cookies.get("admin_token")?.value;

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/dashboard/signin", request.url));
    }

    const role = getUserRole(adminToken);
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard/signin", request.url));
    }
    
    return NextResponse.next();
  }

  // 3. PROTECT STOREFRONT CUSTOMER SUB-ROUTES
  if (path.startsWith("/profile")) {
    const customerToken = request.cookies.get("auth_token")?.value;
    if (!customerToken) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile"],
};