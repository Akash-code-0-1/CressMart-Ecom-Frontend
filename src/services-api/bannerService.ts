import { apiFetch } from "@/utils/api";

export interface Banner {
  id: string;
  image_url: string[];
  link_url: string;
  meta_title: string;
  status: "active" | "inactive";
  position: number;
}

interface BannerResponse {
  success: boolean;
  data: Banner[];
  statusCode: number;
}

export const getPublicBanners = async (): Promise<Banner[]> => {
  const res = await apiFetch("/banners/public", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch public banners");
  }

  const result: BannerResponse = await res.json();
  return result.data || [];
};
