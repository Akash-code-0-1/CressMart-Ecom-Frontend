// const BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082/api/v1";

// export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
//   const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
//   // 1. Prepare default headers
//   const headers: Record<string, string> = {
//     ...options.headers as Record<string, string>,
//   };

//   // 2. Only add JSON Content-Type if the body is NOT FormData
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


const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082/api/v1";

const INTERNAL_API_URL =
  process.env.API_INTERNAL_URL || PUBLIC_API_URL;

const BASE_URL =
  typeof window === "undefined"
    ? INTERNAL_API_URL
    : PUBLIC_API_URL;

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] =
      headers["Content-Type"] || "application/json";
  } else {
    delete headers["Content-Type"];
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
};