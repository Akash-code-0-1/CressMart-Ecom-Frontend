
// import { NextRequest, NextResponse } from "next/server";

// function getUserRole(token: string): string |null {
//   try {
//     const [, payload] = token.split(".");
//     if (!payload) return null;

//     const normalized = payload
//       .replace(/-/g, "+")
//       .replace(/_/g, "/")
//       .padEnd(Math.ceil(payload.length / 4) * 4, "=");

//     const decoded = JSON.parse(atob(normalized));

//     return decoded.role ?? null;
//   } catch {
//     return null;
//   }
// }

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Allow admin signin page
//   if (pathname === "/admin/dashboard/signin") {
//     return NextResponse.next();
//   }

//   // ==========================
//   // ADMIN PANEL PROTECTION
//   // ==========================
//   if (pathname.startsWith("/admin")) {
//     const adminToken = request.cookies.get("admin_token")?.value;

//     if (!adminToken) {
//       return NextResponse.redirect(
//         new URL("/admin/dashboard/signin", request.url)
//       );
//     }

//     const role = getUserRole(adminToken);

//     // Allow both ADMIN and MANAGER
//     if (!role || !["ADMIN", "MANAGER"].includes(role)) {
//       return NextResponse.redirect(
//         new URL("/admin/dashboard/signin", request.url)
//       );
//     }

//     return NextResponse.next();
//   }

//   // ==========================
//   // CUSTOMER PROFILE PROTECTION
//   // ==========================
//   if (pathname.startsWith("/profile")) {
//     const customerToken = request.cookies.get("auth_token")?.value;

//     if (!customerToken) {
//       return NextResponse.redirect(
//         new URL("/signin", request.url)
//       );
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/profile",
//   ],
// };


import { NextRequest, NextResponse } from "next/server";

function getUserRole(token: string): string | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");

    const decoded = JSON.parse(atob(normalized));

    return decoded.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const customerToken = request.cookies.get("auth_token")?.value;

  // ==========================
  // REDIRECT LOGGED-IN USERS FROM SIGNIN TO PROFILE
  // ==========================
  if (pathname === "/signin" && customerToken) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // Allow admin signin page
  if (pathname === "/admin/dashboard/signin") {
    return NextResponse.next();
  }

  // ==========================
  // ADMIN PANEL PROTECTION
  // ==========================
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("admin_token")?.value;

    if (!adminToken) {
      return NextResponse.redirect(
        new URL("/admin/dashboard/signin", request.url)
      );
    }

    const role = getUserRole(adminToken);

    // Allow both ADMIN and MANAGER
    if (!role || !["ADMIN", "MANAGER"].includes(role)) {
      return NextResponse.redirect(
        new URL("/admin/dashboard/signin", request.url)
      );
    }

    return NextResponse.next();
  }

  // ==========================
  // CUSTOMER PROFILE PROTECTION
  // ==========================
  if (pathname.startsWith("/profile")) {
    if (!customerToken) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

// Next.js expects a default export or an export named 'middleware'.
// Aliasing proxy guarantees Next.js detects it without renaming your function.
export { proxy as middleware };
export default proxy;

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/signin",
  ],
};