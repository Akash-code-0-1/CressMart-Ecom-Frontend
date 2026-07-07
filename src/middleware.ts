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
  
  // 🔍 FIXED: Changed from "accessToken" to "auth_token" to match your auth.ts precisely!
  const token = request.cookies.get("auth_token")?.value;

  // 1. If no token exists, lock protected paths down
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const role = getUserRole(token);

  // 2. Strict protection for Admin dashboard routes
  if (path.startsWith("/admin")) {
    if (role !== "ADMIN") {
      // Non-admins attempting to access backend dashboards are blocked
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // 3. Storefront `/profile` allows CUSTOMER, ADMIN, or any other logged-in user through safely
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile"],
};