"use server";

import { cookies } from "next/headers";

/**
 * Commits the session token into an HTTP-only cookie.
 */
export async function setSessionToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // 7 days duration matching typical SaaS session lengths
    maxAge: 60 * 60 * 24 * 7, 
  });
}

/**
 * Deletes the session token cookie from the browser storage context.
 */
export async function deleteSessionToken() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}