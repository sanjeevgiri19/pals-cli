import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Session {
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string;
  userAgent: string;
  userId: string;
  id: string;
}

export interface User {
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface AuthState {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setAuthState: (session: Session | null, user: User | null) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setSession: (session) => {
        set({
          session,
          isAuthenticated: !!session,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      setAuthState: (session, user) => {
        set({
          session,
          user,
          isAuthenticated: !!(session && user),
        });
      },

      logout: () => {
        set({
          session: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setError: (error) => {
        set({ error });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
