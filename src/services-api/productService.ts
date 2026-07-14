import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  status?: string;
}

// 🚀 1. FETCH ALL PRODUCTS
export const fetchAllProducts = async (query: ProductQuery) => {
  const queryParams = new URLSearchParams();
  if (query.page) queryParams.set("page", String(query.page));
  if (query.limit) queryParams.set("limit", String(query.limit));
  if (query.search) queryParams.set("search", query.search);
  if (query.category_id) queryParams.set("category_id", query.category_id);
  if (query.status) queryParams.set("status", query.status);

  // 🚀 CRITICAL FIX: Explicitly append the cache bypass property to skip database cache matching logic
  queryParams.set("bypassCache", "true");

  const res = await apiFetch(`/products?${queryParams.toString()}`, {
    method: "GET",
  });

  if (!res.ok)
    throw new Error("Failed to sync catalog rows from backend database.");

  const json = await res.json();
  const records = json?.data?.data || json?.data || json || [];
  const meta = json?.data?.meta || json?.meta || { totalPages: 1, total: 0 };

  return { data: Array.isArray(records) ? records : [], meta };
};

// 🚀 2. FETCH SINGLE PRODUCT BY ID FOR PRE-POPULATION
export const fetchSingleProduct = async (id: string) => {
  const res = await apiFetch(`/products/${id}`, {
    method: "GET",
  });
  if (!res.ok)
    throw new Error("Could not retrieve the specified product profiles.");
  const json = await res.json();
  return json?.data || json;
};

// 🚀 3. UPLOAD MULTIPLE IMAGES TO SHARED TAXONOMY INTERCEPTOR
export const uploadProductMedia = async (files: FileList) => {
  const token = await getAdminTokenAction();
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("image", file);
  });

  const res = await apiFetch("/categories/upload-image", {
    method: "POST",
    headers: { Authorization: `Bearer ${token || ""}` },
    body: formData,
  });

  if (!res.ok)
    throw new Error("Failed to upload the product image assets to server.");
  const data = await res.json();

  if (data?.image_url) return [data.image_url];
  if (data?.data?.image_url) return [data.data.image_url];
  if (Array.isArray(data?.image_urls)) return data.image_urls;

  return [];
};

// 🚀 4. SUBMIT NEW PRODUCT
export const createProduct = async (payload: Record<string, unknown>) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch("/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json();
    throw new Error(
      errorJson?.message || "Failed to finalize product creation.",
    );
  }
  return res.json();
};

// 🚀 5. UPDATE EXISTING PRODUCT (PATCH OPERATION)
export const updateProduct = async (
  id: string,
  payload: Record<string, unknown>,
) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch(`/products/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json();
    throw new Error(
      errorJson?.message || "Failed to finalize product update specifications.",
    );
  }
  return res.json();
};

// 🚀 6. DELETE PRODUCT
export const deleteProduct = async (id: string) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch(`/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token || ""}` },
  });
  if (!res.ok) throw new Error("Could not drop target catalog item.");
  return res.json();
};

// =========== Store Front ============
// search product

export const searchProducts = async (query: string) => {
  if (!query) return [];
  const res = await apiFetch(
    `/products/search?page=1&limit=10&search=${query}`,
    {
      method: "GET",
    },
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.products || data.data || [];
};
