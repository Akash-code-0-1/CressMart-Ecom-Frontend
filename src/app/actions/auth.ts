// "use server";

// import { cookies } from "next/headers";

// /**
//  * STOREFRONT CUSTOMER COOKIE ACTIONS
//  */
// export async function setSessionToken(token: string) {
//   const cookieStore = await cookies();
//   cookieStore.set("auth_token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7, 
//   });
// }

// export async function deleteSessionToken() {
//   const cookieStore = await cookies();
//   cookieStore.delete("auth_token");
// }

// /**
//  * 🚀 FIXED ADMIN DEDICATED COOKIE ACTIONS
//  * Removed the path restrictions so cross-origin microservice calls (/api/v1) receive authentication contexts.
//  */
// export async function setAdminSessionToken(token: string) {
//   const cookieStore = await cookies();
//   cookieStore.set("admin_token", token, {
//     httpOnly: true, // Kept for advanced XSS defense protection
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7, 
//   });
// }

// export async function deleteAdminSessionToken() {
//   const cookieStore = await cookies();
//   cookieStore.delete("admin_token");
// }

// /**
//  * 🚀 NEW EXPORT: Server Runtime Token Reader
//  * Safely decrypts and fetches the token inside HttpOnly secure containers
//  */
// export async function getAdminTokenAction() {
//   const cookieStore = await cookies();
//   return cookieStore.get("admin_token")?.value || null;
// }



"use server";

import { cookies } from "next/headers";

// Sets secure to true ONLY if running on https://
const isHttps = process.env.NEXT_PUBLIC_API_BASE_URL?.startsWith("https://") ?? false;

const defaultOptions = {
  httpOnly: false, // Allows apiFetch to read token client-side
  secure: isHttps, // Crucial: false on http://...sslip.io
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

/**
 * STOREFRONT CUSTOMER COOKIE ACTIONS
 */
export async function setSessionToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, defaultOptions);
  cookieStore.set("token", token, defaultOptions);
}

export async function deleteSessionToken() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "auth_token", path: "/" });
  cookieStore.delete({ name: "token", path: "/" });
}

export async function getSessionTokenAction() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value || cookieStore.get("token")?.value || null;
}

/**
 * ADMIN COOKIE ACTIONS
 */
export async function setAdminSessionToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, defaultOptions);
}

export async function deleteAdminSessionToken() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: "admin_token", path: "/" });
}

export async function getAdminTokenAction() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value || null;
}