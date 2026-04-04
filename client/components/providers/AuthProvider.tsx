"use client";

import { ReactNode, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * App wrapper that syncs better-auth session to Zustand store
 * This ensures auth state is available to all components
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const setAuthState = useAuthStore((state) => state.setAuthState);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.session && session?.user) {
          // Sync better-auth session to Zustand
          setAuthState(
            {
              token: session.session.token,
              expiresAt: session.session.expiresAt,
              createdAt: session.session.createdAt,
              updatedAt: session.session.updatedAt,
              ipAddress: session.session.ipAddress,
              userAgent: session.session.userAgent,
              userId: session.session.userId,
              id: session.session.id,
            },
            session.user,
          );
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      }
    };

    initAuth();
  }, [setAuthState]);

  return children;
}
