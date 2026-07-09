import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

export interface TagQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

// 🚀 1. FETCH ALL TAGS PAGINATED
export const fetchAllTags = async (query: TagQuery) => {
  const queryParams = new URLSearchParams();
  if (query.page) queryParams.set("page", String(query.page));
  if (query.limit) queryParams.set("limit", String(query.limit));
  if (query.search) queryParams.set("search", query.search);
  if (query.status) queryParams.set("status", query.status);

  const res = await apiFetch(`/tags?${queryParams.toString()}`);
  if (!res.ok) throw new Error("Failed to retrieve tags dataset allocation.");
  
  const json = await res.json();
  const records = json?.data?.data || json?.data || json || [];
  const meta = json?.data?.meta || json?.meta || { totalPages: 1, total: 0 };
  
  return { data: Array.isArray(records) ? records : [], meta };
};

// 🚀 2. FETCH SINGLE TAG BY ID
export const fetchSingleTag = async (id: string) => {
  const res = await apiFetch(`/tags/${id}`);
  if (!res.ok) throw new Error("Could not load tag entity details.");
  const json = await res.json();
  return json?.data || json;
};

// 🚀 3. DELETE SINGLE TAG
export const deleteTag = async (id: string) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch(`/tags/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token || ""}` },
  });
  if (!res.ok) throw new Error("Failed to delete selected tag record.");
  return res.json();
};

// 🚀 4. UPLOAD MEDIA ASSETS (UNIVERSAL FOR IMAGE AND BANNER FILTERS)
export const uploadTagMedia = async (file: File) => {
  const token = await getAdminTokenAction();
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiFetch("/tags/upload-image", {
    method: "POST",
    headers: { Authorization: `Bearer ${token || ""}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload graphic asset.");
  const data = await res.json();
  return data?.image_url || data?.data?.image_url || "";
};

// 🚀 5. CREATE NEW TAG 
export const createTag = async (payload: any) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch("/tags", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorJson = await res.json();
    throw new Error(errorJson?.message || "Failed to finalize tag record creation.");
  }
  return res.json();
};

// 🚀 6. UPDATE EXISTING TAG RECORD
export const updateTag = async (id: string, payload: any) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch(`/tags/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorJson = await res.json();
    throw new Error(errorJson?.message || "Failed to finalize tag record modifications.");
  }
  return res.json();
};