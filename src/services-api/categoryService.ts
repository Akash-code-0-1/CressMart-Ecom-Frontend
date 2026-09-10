import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

export interface CategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  level?: number;
}

// 🚀 1. FETCH ALL GENERAL CATEGORIES (ONLY Level 1 Root Nodes)
export const fetchAllCategories = async (query: CategoryQuery) => {
  const res = await apiFetch(
    `/categories?limit=5000${query.search ? `&search=${encodeURIComponent(query.search)}` : ""}${query.status ? `&status=${query.status}` : ""}`,
  );
  if (!res.ok)
    throw new Error("Failed to retrieve categories collection array");

  const json = await res.json();
  const rawRecords = json?.data?.data || json?.data || json || [];

  // Filter ONLY Root Level 1 categories (no parent_id)
  const rootRecords = Array.isArray(rawRecords)
    ? rawRecords.filter(
        (item: { parent_id?: string | null }) =>
          item.parent_id === null ||
          item.parent_id === undefined ||
          item.parent_id === "",
      )
    : [];

  const limit = query.limit || 10;
  const page = query.page || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = rootRecords.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(rootRecords.length / limit) || 1;

  return {
    data: paginatedData,
    meta: { totalPages, total: rootRecords.length },
  };
};

// 🚀 2. FETCH ALL SUB-CATEGORIES (ONLY Level 2 Direct Sub-Categories)
export const fetchAllSubCategories = async (query: CategoryQuery) => {
  const res = await apiFetch(
    `/categories?limit=1000${query.search ? `&search=${encodeURIComponent(query.search)}` : ""}${query.status ? `&status=${query.status}` : ""}`,
  );
  if (!res.ok) throw new Error("Failed to retrieve subcategories.");

  const json = await res.json();
  const rawRecords = json?.data?.data || json?.data || json || [];

  // Filter ONLY Level 2 Sub-Categories: Has parent_id, but parent has NO parent_id (or parent is null)
  const subRecords = Array.isArray(rawRecords)
    ? rawRecords.filter(
        (item: {
          parent_id?: string | null;
          parent?: { parent_id?: string | null };
        }) =>
          item.parent_id !== null &&
          item.parent_id !== undefined &&
          item.parent_id !== "" &&
          (!item.parent ||
            item.parent.parent_id === null ||
            item.parent.parent_id === undefined ||
            item.parent.parent_id === ""),
      )
    : [];

  const limit = query.limit || 10;
  const page = query.page || 1;
  const startIndex = (page - 1) * limit;
  const paginatedData = subRecords.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(subRecords.length / limit) || 1;

  return {
    data: paginatedData,
    meta: { totalPages, total: subRecords.length },
  };
};

// 🚀 3. STRICT FIX: FETCH ONLY TRUE ROOT PARENT NODES
export const fetchRootCategoriesOnly = async () => {
  const res = await apiFetch("/categories?limit=1000");
  if (!res.ok) throw new Error("Failed to sync root nodes.");
  const json = await res.json();
  const rawRecords = json?.data?.data || json?.data || json || [];
  return Array.isArray(rawRecords)
    ? rawRecords.filter(
        (item: { parent_id: string | null | undefined }) =>
          item.parent_id === null || item.parent_id === undefined,
      )
    : [];
};

// 🚀 4. FETCH SINGLE CATEGORY RECORD FOR EDIT PRE-POPULATION
export const fetchSingleCategory = async (id: string) => {
  const res = await apiFetch(`/categories/${id}`);
  if (!res.ok)
    throw new Error("Could not fetch the specified category details.");
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
  if (!res.ok)
    throw new Error("Failed to process graphic file asset stream upload.");
  return res.json();
};

// 🚀 7. CREATE CATEGORY TRANSACTION
export const createCategory = async (payload: {
  name: string;
  slug: string;
  description?: string | null;
  meta_title?: string;
  meta_description?: string;
  meta_tags?: string;
  parent_id?: string | null;
  image_url?: string | null;
  background_image_url?: string | null;
  priority?: number;
  status?: string;
  image?: File;
}) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch("/categories", {
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
      errorJson?.message || "Failed to finalize category creation.",
    );
  }
  return res.json();
};

// 🚀 8. UPDATE SINGLE CATEGORY RECORD (PATCH ROW)
export const updateCategory = async (
  id: string,
  payload: {
    name?: string;
    slug?: string;
    description?: string | null;
    meta_title?: string;
    meta_description?: string;
    meta_tags?: string;
    parent_id?: string | null;
    image_url?: string | null;
    background_image_url?: string | null;
    priority?: number;
    status?: string;
    image?: File;
  },
) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch(`/categories/${id}`, {
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
      errorJson?.message || "Failed to finalize category update execution.",
    );
  }
  return res.json();
};

// 🚀 9. BULK DELETE CATEGORIES
export const bulkDeleteCategories = async (ids: string[]) => {
  const token = await getAdminTokenAction();

  const res = await apiFetch("/categories/bulk-delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson?.message || "Failed to execute bulk deletion.");
  }

  return res.json();
};

// ======= Store Front Service ==============

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  image_url?: string | null;
  children?: Category[];
  image?: File;
  created_at?: string;
  updated_at?: string;
  _count?: { products: number };
  product_count?: number;
  status?: string;
  sl?: number;
}

export interface CategoryDetail extends Category {
  description?: string | null;
  background_image_url?: string | null;
  children?: CategoryDetail[];
  _count?: { products: number };
  meta_title: string;
  meta_description: string;
  meta_tags: string;
}

export const getCategory = async (slug: string): Promise<CategoryDetail> => {
  const res = await apiFetch(`/categories/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch category");
  const result = await res.json();
  return result?.data || result;
};

// Flat list of all categories for filter sidebar
export const getAllcategoryFlatList = async (): Promise<{
  data: Category[];
}> => {
  const res = await apiFetch("/categories?limit=200");
  if (!res.ok) throw new Error("Failed to fetch category list");
  const json = await res.json();
  const records = json?.data?.data || json?.data || json || [];
  return { data: Array.isArray(records) ? records : [] };
};

export const getCategoryTree = async (): Promise<Category[]> => {
  const res = await apiFetch("/categories/tree?page=1&limit=30");
  if (!res.ok) throw new Error("Failed to fetch categories");
  const result = await res.json();
  const data = result?.data?.data || result?.data || result || [];
  return Array.isArray(data) ? data : [];
};

export const getFeaturedCategory = async (): Promise<Category[]> => {
  const res = await apiFetch("/categories/tree?limit=8");
  if (!res.ok) throw new Error("Failed to fetch categories");
  const result = await res.json();
  const data = result?.data?.data || result?.data || result || [];
  return Array.isArray(data) ? data : [];
};
