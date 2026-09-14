// import { apiFetch } from "@/utils/api";
// import { getAdminTokenAction } from "@/app/actions/auth";

// export const getAllIncompleteOrdersService = async (params: { page: number; limit: number }) => {
//   const token = await getAdminTokenAction();
//   const res = await apiFetch(`/incomplete-orders?page=${params.page}&limit=${params.limit}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token || ""}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) throw new Error("Failed to fetch incomplete orders");
//   return res.json();
// };

// export const trackIncompleteOrder = async (payload: Record<string, unknown>) => {
//   const token = await getAdminTokenAction();

//   const res = await apiFetch("/incomplete-orders/track", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token || ""}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) {
//     const errorJson = await res.json().catch(() => ({}));
//     console.warn("Tracking lead:", errorJson?.message);
//     return null;
//   }
//   return res.json();
// };

// export const deleteIncompleteOrderService = async (id: string) => {
//   const token = await getAdminTokenAction();
//   const res = await apiFetch(`/incomplete-orders/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token || ""}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) throw new Error("Failed to delete lead");
//   return res.json();
// };

import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

/**
 * Fetches all incomplete orders (leads) from the main orders table
 * using the status filter.
 */
export const getAllIncompleteOrdersService = async (params: {
  page: number;
  limit: number;
}) => {
  const token = await getAdminTokenAction();

  // We point to the main /orders endpoint but filter by status=INCOMPLETE
  const res = await apiFetch(
    `/orders?status=INCOMPLETE&page=${params.page}&limit=${params.limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token || ""}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) throw new Error("Failed to fetch incomplete orders");
  return res.json();
};

/**
 * Tracks an incomplete order (lead) by creating an order row with status 'INCOMPLETE'.
 * This works for both Guests and Logged-in users.
 */
export const trackIncompleteOrder = async (payload: Record<string, unknown>) => {
  // Point to main orders endpoint
  const res = await apiFetch("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, status: 'INCOMPLETE' }),
  });
  return res.json();
};


/**
 * Deletes an incomplete order by its ID from the main orders table.
 */
export const deleteIncompleteOrderService = async (id: string) => {
  const token = await getAdminTokenAction();

  // Point to the main orders delete route
  const res = await apiFetch(`/orders/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to delete incomplete order");
  return res.json();
};
