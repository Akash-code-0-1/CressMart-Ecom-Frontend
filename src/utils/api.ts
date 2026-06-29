const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082/api/v1";

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  return fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
};