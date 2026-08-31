import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

export interface Supplier {
  id: string;
  name: string;
  slug: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  image_url?: string | null;
  priority?: number;
  status: "active" | "inactive" | string;
  _count?: {
    products: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface SupplierQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface SupplierResponse {
  success: boolean;
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: Supplier[];
  };
}

/**
 * Fetch suppliers with pagination & filtering
 */
export const getSuppliers = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
): Promise<SupplierResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));
  if (search) queryParams.set("search", search);
  if (status) queryParams.set("status", status);

  const res = await apiFetch(`/suppliers?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch suppliers");
  }

  return res.json();
};

/**
 * Fetch all suppliers (for admin/catalog views)
 */
export const fetchAllSuppliers = async (query: SupplierQuery) => {
  const queryParams = new URLSearchParams();
  if (query.page) queryParams.set("page", String(query.page));
  if (query.limit) queryParams.set("limit", String(query.limit));
  if (query.search) queryParams.set("search", query.search);
  if (query.status) queryParams.set("status", query.status);

  const res = await apiFetch(`/suppliers?${queryParams.toString()}`);
  if (!res.ok) throw new Error("Failed to retrieve suppliers collection.");

  const json = await res.json();
  const records = json?.data?.data || json?.data || json || [];
  const meta = json?.data?.meta || json?.meta || { totalPages: 1, total: 0 };

  return { data: Array.isArray(records) ? records : [], meta };
};

/**
 * Fetch single supplier by ID
 */
export const fetchSingleSupplier = async (id: string) => {
  const res = await apiFetch(`/suppliers/${id}`);
  if (!res.ok) throw new Error("Could not fetch specified supplier record.");
  const json = await res.json();
  return json?.data || json;
};

/**
 * Upload supplier image / logo
 */
export const uploadSupplierImage = async (file: File) => {
  const token = await getAdminTokenAction();
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiFetch("/suppliers/upload-image", {
    method: "POST",
    headers: { Authorization: `Bearer ${token || ""}` },
    body: formData,
  });

  if (!res.ok) {
    // Fallback to general image upload endpoint if supplier-specific fails
    const fallbackRes = await apiFetch("/categories/upload-image", {
      method: "POST",
      headers: { Authorization: `Bearer ${token || ""}` },
      body: formData,
    });
    if (!fallbackRes.ok) {
      throw new Error("Failed to upload supplier image.");
    }
    const fallbackData = await fallbackRes.json();
    return { image_url: fallbackData?.image_url || fallbackData?.data?.image_url || "" };
  }

  const data = await res.json();
  return { image_url: data?.image_url || data?.data?.image_url || "" };
};

/**
 * Create a new supplier
 */
export const createSupplier = async (payload: {
  name: string;
  slug: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  image_url?: string | null;
  priority?: number;
  status: "active" | "inactive" | string;
}) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch("/suppliers", {
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
      errorJson?.message || "Failed to create supplier record.",
    );
  }
  return res.json();
};

/**
 * Update an existing supplier
 */
export const updateSupplier = async (
  id: string,
  payload: {
    name: string;
    slug: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    image_url?: string | null;
    priority?: number;
    status: "active" | "inactive" | string;
  },
) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch(`/suppliers/${id}`, {
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
      errorJson?.message || "Failed to update supplier record.",
    );
  }
  return res.json();
};

/**
 * Delete a supplier
 */
export const deleteSupplier = async (id: string) => {
  const token = await getAdminTokenAction();
  const res = await apiFetch(`/suppliers/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token || ""}` },
  });
  if (!res.ok) throw new Error("Failed to delete supplier record.");
  return res.json();
};
