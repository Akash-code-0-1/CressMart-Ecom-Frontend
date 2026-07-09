import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

export interface CategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

// 🚀 1. FETCH ALL GENERAL CATEGORIES 
export const fetchAllCategories = async (query: CategoryQuery) => {
  const queryParams = new URLSearchParams();
  if (query.page) queryParams.set("page", String(query.page));
  if (query.limit) queryParams.set("limit", String(query.limit));
  if (query.search) queryParams.set("search", query.search);
  if (query.status) queryParams.set("status", query.status);

  const res = await apiFetch(`/categories?${queryParams.toString()}`);
  if (!res.ok) throw new Error("Failed to retrieve categories collection array");
  const json = await res.json();
  const records = json?.data?.data || json?.data || json || [];
  const meta = json?.data?.meta || json?.meta || { totalPages: 1, total: 0 };
  return { data: Array.isArray(records) ? records : [], meta };
};

// 🚀 2. FETCH ALL SUB-CATEGORIES (ONLY ONES WITH VALID PARENT ASSIGNMENTS)
export const fetchAllSubCategories = async (query: CategoryQuery) => {
  const queryParams = new URLSearchParams();
  if (query.page) queryParams.set("page", String(query.page));
  if (query.limit) queryParams.set("limit", String(query.limit));
  if (query.search) queryParams.set("search", query.search);
  if (query.status) queryParams.set("status", query.status);

  const res = await apiFetch(`/categories?${queryParams.toString()}`);
  if (!res.ok) throw new Error("Failed to retrieve subcategories collection layout array.");
  const json = await res.json();
  const rawRecords = json?.data?.data || json?.data || json || [];
  
  const subCategoryRecords = Array.isArray(rawRecords)
    ? rawRecords.filter((item: any) => item.parent_id !== null && item.parent_id !== undefined)
    : [];

  const meta = json?.data?.meta || json?.meta || { totalPages: 1, total: 0 };
  return { data: subCategoryRecords, meta };
};

// 🚀 3. STRICT FIX: FETCH ONLY TRUE ROOT PARENT NODES
export const fetchRootCategoriesOnly = async () => {
  const res = await apiFetch("/categories?limit=1000");
  if (!res.ok) throw new Error("Failed to sync root nodes.");
  const json = await res.json();
  const rawRecords = json?.data?.data || json?.data || json || [];
  return Array.isArray(rawRecords)
    ? rawRecords.filter((item: any) => item.parent_id === null || item.parent_id === undefined)
    : [];
};

// 🚀 4. FETCH SINGLE CATEGORY RECORD FOR EDIT PRE-POPULATION
export const fetchSingleCategory = async (id: string) => {
  const res = await apiFetch(`/categories/${id}`);
  if (!res.ok) throw new Error("Could not fetch the specified category details.");
  const json = await res.json();
  return json?.data || json;
};

// 🚀 5. DELETE SINGLE CATEGORY
export const deleteCategory = async (id: string) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch(`/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token || ""}` },
  });
  if (!res.ok) throw new Error("Failed to delete category");
  return res.json();
};

// 🚀 6. UPLOAD CATEGORY GRAPHIC TO STORAGE ENDPOINT
export const uploadCategoryImage = async (file: File) => {
  const token = await getAdminTokenAction();
  const formData = new FormData();
  formData.append("image", file);
  const res = await apiFetch("/categories/upload-image", {
    method: "POST",
    headers: { Authorization: `Bearer ${token || ""}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to process graphic file asset stream upload.");
  return res.json();
};

// 🚀 7. CREATE CATEGORY TRANSACTION
export const createCategory = async (payload: any) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch("/categories", {
    method: "POST",
    headers: { Authorization: `Bearer ${token || ""}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorJson = await res.json();
    throw new Error(errorJson?.message || "Failed to finalize category creation.");
  }
  return res.json();
};

// 🚀 8. UPDATE SINGLE CATEGORY RECORD (PATCH ROW)
export const updateCategory = async (id: string, payload: any) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch(`/categories/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token || ""}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorJson = await res.json();
    throw new Error(errorJson?.message || "Failed to finalize category update execution.");
  }
  return res.json();
};