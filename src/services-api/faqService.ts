import { apiFetch } from "@/utils/api";

// --- TYPES ---
export interface Faq {
  id: string;
  question: string;
  answer: string;
  status: "active" | "inactive";
  priority?: number;
}

export interface FaqResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Faq[]; // Usually FAQs are a simple array of objects
}

/**
 * Fetch all active FAQs
 */
export const getFaqs = async (): Promise<FaqResponse> => {
  const res = await apiFetch("/faqs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Optional: Revalidate cache every hour
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch FAQs");
  }

  return res.json();
};
