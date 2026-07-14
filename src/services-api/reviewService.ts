import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

export const reviewApi = {
  // 🚀 FIXED: Added optional search parameter tracking to catch customer details within the comments view 
async getAll(page: number, limit: number, status: string, search: string, bypassCache = false) {
    const token = await getAdminTokenAction();
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status: status || "",
      search: search || "",
      bypassCache: String(bypassCache) // 🚀 Appends bypassCache value down to the backend controller
    });

    const res = await apiFetch(`/reviews/admin/all?${query.toString()}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    return res.json();
  },
  async updateStatus(id: string, status: string) {
    const token = await getAdminTokenAction();
    const res = await apiFetch(`/reviews/admin/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token || ""}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

// Inside reviewService.ts
async updateDetails(id: string, rating: number, comment: string, images: string[]) {
  const token = await getAdminTokenAction();
  const res = await apiFetch(`/reviews/admin/${id}/update`, {
    method: "PATCH",
    headers: { 
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ rating, comment, images }) // Ensure this is stringified
  });
  return res.json();
},

  async delete(id: string) {
    const token = await getAdminTokenAction();
    const res = await apiFetch(`/reviews/admin/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    return res.json();
  },

  async getMetrics() {
    const token = await getAdminTokenAction();
    const res = await apiFetch("/reviews/admin/metrics-summary", {
      method: "GET",
      headers: { Authorization: `Bearer ${token || ""}` }
    });
    return res.json();
  }
};