"use client";

import { ReactNode, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/useAuthStore";

export function AuthProvider({ children }: { children: ReactNode }) {
  const setAuthState = useAuthStore((state) => state.setAuthState);

  // Use the reactive hook provided by better-auth to read session data
  const { data: sessionData, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    try {
      if (sessionData?.session && sessionData?.user) {
        setAuthState(
          {
            token: sessionData.session.token,
            expiresAt: sessionData.session.expiresAt,
            createdAt: sessionData.session.createdAt,
            updatedAt: sessionData.session.updatedAt,
            ipAddress: sessionData.session.ipAddress,
            userAgent: sessionData.session.userAgent,
            userId: sessionData.session.userId,
            id: sessionData.session.id,
          },
          sessionData.user,
        );
      } else {
        // If there's no active session, clear the store
        setAuthState(null, null);
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    }
  }, [isPending, sessionData, setAuthState]);

  return children;
}
