"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

/**
 * Provides a shared React Query client to the wrapped component subtree.
 *
 * The provider supplies a module-scoped `QueryClient` configured with conservative defaults
 * (no refetch on window focus or mount, and a single retry).
 *
 * @param children - The React tree to render within the QueryClientProvider
 * @returns The `children` wrapped with a `QueryClientProvider` that supplies the shared `queryClient`
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
