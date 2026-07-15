// @/services-api/settingsService.ts
import { apiFetch } from "@/utils/api";
import { getAdminTokenAction } from "@/app/actions/auth";

export const fetchSettings = async () => {
  const res = await apiFetch("/settings");
  if (!res.ok) throw new Error("Failed to retrieve settings.");
  
  const data = await res.json();
  
  // Return the API data, but guarantee structure for JSON fields 
  // so the form doesn't crash if the database returns null for these
  return {
    ...data,
    social_links: data?.social_links || [],
    offers: data?.offers || [],
    chat_support: data?.chat_support || {},
    site_toggles: data?.site_toggles || {},
  };
};

export const updateSettings = async (payload: any) => {
  const token = await getAdminTokenAction();
  
  // Production-grade: Strip sensitive or read-only fields before sending
  const { id, updated_at, ...cleanPayload } = payload;
  
  const res = await apiFetch("/settings", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanPayload),
  });
  
  if (!res.ok) {
    const errorJson = await res.json();
    throw new Error(errorJson?.message || "Failed to update settings.");
  }
  return res.json();
};

export const uploadSettingsMedia = async (file: File) => {
  const token = await getAdminTokenAction();
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiFetch("/settings/upload-logo", {
    method: "POST",
    headers: { Authorization: `Bearer ${token || ""}` },
    body: formData,
  });
  
  if (!res.ok) throw new Error("Failed to upload settings asset.");
  
  const response = await res.json();
  
  // Extract URL from the nested "data" object returned by your backend
  return response?.data?.image_url || "";
};