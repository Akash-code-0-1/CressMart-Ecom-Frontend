import { apiFetch } from "@/utils/api";

export const fetchChatSettings = async () => {
  const res = await apiFetch("/admin/chat-settings", { method: "GET" });
  return res.json();
};

export const updateChatSettings = async (data: any) => {
  const res = await apiFetch("/admin/chat-settings", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};