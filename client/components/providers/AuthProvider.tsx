"use client";

import { ReactNode, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Provides auth synchronization by loading the current Better-Auth session into the global auth store.
 *
 * On mount, attempts to read the current session from `authClient.getSession()` and, if a session and user are present,
 * maps relevant session fields into the Zustand `setAuthState` store. Initialization errors are caught and logged to the console.
 *
 * @returns The component's `children` unchanged.
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
              token: session?.session.token,
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
