// import { getCookie } from "cookies-next";

// const PUBLIC_API_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082/api/v1";
// const INTERNAL_API_URL =
//   process.env.API_INTERNAL_URL || PUBLIC_API_URL;
// const BASE_URL =
//   typeof window === "undefined" ? INTERNAL_API_URL : PUBLIC_API_URL;

// export const apiFetch = async (
//   endpoint: string,
//   options: RequestInit = {}
// ) => {
//   const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

//   let token: string | undefined | null = null;
//   const headers: Record<string, string> = {
//     ...(options.headers as Record<string, string>),
//   };

//   // --- START OF FIX: Context Awareness ---
//   if (typeof window !== "undefined") {
//     // Determine if we are on the Admin side or Storefront side
//     const isAdminPath = window.location.pathname.startsWith("/admin");

//     if (isAdminPath) {
//       token = getCookie("admin_token") as string;
//       headers["x-admin-request"] = "true";
//     } else {
//       // Prioritize customer tokens on storefront
//       token = (getCookie("auth_token") as string) || (getCookie("token") as string);
//       headers["x-customer-request"] = "true";
//     }

//     // Last resort fallback if specific token not found
//     if (!token) token = localStorage.getItem("token");

//   } else {
//     // Server-side logic (e.g., SSR or Server Actions)
//     try {
//       const { cookies } = await import("next/headers");
//       const cookieStore = await cookies();

//       // On server side, check headers to see if we're proxying an admin request
//       // This is often passed manually or detected via the incoming request URL
//       token =
//         cookieStore.get("admin_token")?.value ||
//         cookieStore.get("auth_token")?.value ||
//         cookieStore.get("token")?.value;
//     } catch {
//       token = null;
//     }
//   }
//   // --- END OF FIX ---

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   if (!(options.body instanceof FormData)) {
//     headers["Content-Type"] = headers["Content-Type"] || "application/json";
//   } else {
//     delete headers["Content-Type"];
//   }

//   return fetch(url, {
//     ...options,
//     headers,
//     credentials: "include",
//   });
// };




import { getCookie } from "cookies-next";

const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082/api/v1";
const INTERNAL_API_URL = process.env.API_INTERNAL_URL || PUBLIC_API_URL;
const BASE_URL =
  typeof window === "undefined" ? INTERNAL_API_URL : PUBLIC_API_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  // 1. Maintain your exact URL construction logic
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  let token: string | undefined | null = null;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (typeof window !== "undefined") {
    // 2. CLIENT SIDE (Matches your original logic + improved fallback)
    const isAdminPath = window.location.pathname.startsWith("/admin");

    if (isAdminPath) {
      token = getCookie("admin_token") as string;
      headers["x-admin-request"] = "true";
    } else {
      // Prioritize customer tokens exactly like your original
      token =
        (getCookie("auth_token") as string) || (getCookie("token") as string);
      headers["x-customer-request"] = "true";
    }

    // 🚀 IMPROVED FALLBACK (Fulfills your original 'localStorage' requirement but better)
    // Your original code only checked 'token'. This checks all 3 possible keys.
    if (!token) {
      token =
        localStorage.getItem("auth_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("admin_token");
    }
  } else {
    // 3. SERVER SIDE (Matches your original logic but safer)
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();

      const adminToken = cookieStore.get("admin_token")?.value;
      const authToken =
        cookieStore.get("auth_token")?.value || cookieStore.get("token")?.value;

      token = adminToken || authToken;

      // Ensure the backend knows the context even on server-side calls
      if (adminToken) {
        headers["x-admin-request"] = "true";
      } else if (authToken) {
        headers["x-customer-request"] = "true";
      }
    } catch {
      token = null;
    }
  }

  // 4. Authorization Header (Standard Bearer Token)
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 5. FormData Handling (Exactly as in your original code)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  } else {
    // Browser must set boundary for FormData
    delete headers["Content-Type"];
  }

  // 6. Fetch Execution (Preserving your 'credentials: "include"' requirement)
  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
};
