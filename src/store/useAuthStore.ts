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

interface AuthState {
  user: User | null;
  token: string | null;
  _hasHydrated: boolean;
  isChatOpen: boolean; // 👈 Added for tracking global chat window visibility
  setAuth: (user: User, token: string) => void;
  setHasHydrated: (state: boolean) => void;
  setIsChatOpen: (open: boolean) => void; // 👈 Added action to mutate chat window state
  logout: () => void;
  clearAuth?: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      _hasHydrated: false,
      isChatOpen: false, // 👈 Initial state: Chat box is closed by default
      setAuth: (user, token) => set({ user, token }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setIsChatOpen: (open) => set({ isChatOpen: open }), // 👈 Direct state mutations hook
      logout: () => set({ user: null, token: null, isChatOpen: false }), // Reset chat on logout
      clearAuth: () => set({ user: null, token: null, isChatOpen: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // Optional: Prevent chat toggle from saving to localStorage permanently
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);