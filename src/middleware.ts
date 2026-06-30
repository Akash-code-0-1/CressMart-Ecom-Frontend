import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getUserRole(token: string): string | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload.role || null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  //   const path = request.nextUrl.pathname;
  const token = request.cookies.get("accessToken")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  const role = getUserRole(token);
  if (role !== "ADMIN") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/admin/:path*", "/profile"],
};
