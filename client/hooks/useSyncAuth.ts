"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Synchronizes Better-Auth session state into the app's Zustand auth store.
 *
 * While the session query is pending, the hook does nothing. When an active
 * session and user are present it writes session metadata (token, expiresAt,
 * createdAt, updatedAt, ipAddress, userAgent, userId, id) and the user to the
 * store; when no active session is available it clears the store.
 *
 * @returns An object with `session` (the token session or `undefined`), `user`
 *   (the authenticated user or `undefined`), and `isPending` (whether the
 *   session query is still pending)
 */
export function useSyncAuth() {
  const { data: session, isPending } = authClient.useSession();
  const { setAuthState } = useAuthStore();

  useEffect(() => {
    if (isPending) return;

    if (session?.session && session?.user) {
      // Sync better-auth session to Zustand store
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
    } else {
      // No active session — clear Zustand auth so components update
      setAuthState(null, null);
    }
  }, [session, isPending, setAuthState]);

  return { session: session?.session, user: session?.user, isPending };
}
