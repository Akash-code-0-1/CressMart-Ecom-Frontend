import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string | null;
  role: string;
}

// 👈 Updated Contract interface to satisfy compiler type definitions
interface AuthState {
  user: User | null;
  token: string | null;
  _hasHydrated: boolean; // 👈 Solves: Property '_hasHydrated' does not exist
  setAuth: (user: User, token: string) => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
  clearAuth?: () => void; // 👈 Solves: Property 'clearAuth' does not exist
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      _hasHydrated: false,
      setAuth: (user, token) => set({ user, token }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      logout: () => set({ user: null, token: null }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);