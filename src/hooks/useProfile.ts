import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";

interface AddressItem {
  id?: string;
  address: string;
  label: "PRIMARY" | "CUSTOM";
}

// 1. Hook for Fetching Profile Details
export function useProfileData() {
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await apiFetch("/users/profile", { method: "GET" });
      if (!res.ok) throw new Error("Failed to load profile details.");
      const rawData = await res.json();
      const data = rawData?.data || rawData;

      // Keep Zustand user cache up to date Reactively
      if (data) {
        setAuthUser({
          id: data.id || data._id,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "USER",
          avatar: data.avatar || null,
        });
      }
      return data;
    },
  });
}

// 2. Hook for Updating Profile Identity Metadata
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (payload: { name: string; email?: string; primaryAddress?: string }) => {
      const res = await apiFetch("/users/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to sync changes.");
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      // Perform optimistic or post-mutation store updates safely
      if (user) {
        setAuthUser({
          ...user,
          name: variables.name,
          email: variables.email || user.email,
        });
      }
    },
  });
}

// 3. Hook for Appending a New Physical Custom Address
export function useAddAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: string) => {
      const res = await apiFetch("/users/addresses", {
        method: "POST",
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to append address.");
      return data?.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}