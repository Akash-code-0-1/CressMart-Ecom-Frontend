import { apiFetch } from "@/utils/api";
import { BlogResponse } from "@/@types/blog.type";

export const getBlogs = async (page = 1, limit = 4): Promise<BlogResponse> => {
  const res = await apiFetch(`/blogs?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
};
