/**
 * tRPC React Provider
 *
 * Provides tRPC hooks for React components.
 * Integrates with TanStack Query for caching and state management.
 *
 * @module lib/trpc/react
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import superjson from 'superjson';
import type { AppRouter } from '@/server/trpc/routers/_app';

/**
 * tRPC React hooks
 * Use these hooks in React components for type-safe API calls
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Get base URL for tRPC requests
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * tRPC Provider Component
 *
 * Wraps the application to provide tRPC hooks.
 * Must be used in a Client Component.
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          headers() {
            return {
              'Content-Type': 'application/json',
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
