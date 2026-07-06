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
  isChatOpen: boolean; 
  setAuth: (user: User, token: string) => void;
  setHasHydrated: (state: boolean) => void;
  setIsChatOpen: (open: boolean) => void; 
  logout: () => void;
  clearAuth?: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      _hasHydrated: false,
      isChatOpen: false, 
      setAuth: (user, token) => set({ user, token }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setIsChatOpen: (open) => set({ isChatOpen: open }), 
      logout: () => set({ user: null, token: null, isChatOpen: false }),
      clearAuth: () => set({ user: null, token: null, isChatOpen: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);