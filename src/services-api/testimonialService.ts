import { apiFetch } from "@/utils/api";

// --- TYPES ---
export type TestimonialType = "FACEBOOK" | "YOUTUBE";

export interface Testimonial {
  id: string;
  type: TestimonialType;
  author_name: string;
  author_avatar: string | null;
  content: string;
  rating: number;
  video_url: string | null;
  thumbnail: string | null;
  status: string;
  created_at: string;
}

export interface TestimonialResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Testimonial[];
  timestamp: string;
}

/**
 * Fetch testimonials filtered by type
 */
export const getTestimonials = async (
  type?: TestimonialType,
): Promise<TestimonialResponse> => {
  const url = type ? `/testimonials?type=${type}` : "/testimonials";
  const res = await apiFetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${type || ""} testimonials`);
  }

  return res.json();
};


export const createTestimonial = async (dto: any) => {
  const res = await apiFetch("/testimonials", {
    method: "POST",
    body: JSON.stringify(dto),
  });
  return res.json();
};

export const updateTestimonial = async (id: string, dto: any) => {
  const res = await apiFetch(`/testimonials/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
  return res.json();
};

export const deleteTestimonial = async (id: string) => {
  const res = await apiFetch(`/testimonials/${id}`, {
    method: "DELETE",
  });
  return res.json();
};

export const getAdminTestimonials = async (type?: TestimonialType) => {
  const url = type ? `/testimonials/admin-list?type=${type}` : "/testimonials/admin-list";
  const res = await apiFetch(url, { method: "GET" });
  return res.json();
};
