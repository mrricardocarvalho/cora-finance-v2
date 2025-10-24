/**
 * tRPC Client Configuration
 *
 * Configures the tRPC client for browser use.
 * Handles HTTP requests to the tRPC API endpoint.
 *
 * @module lib/trpc/client
 */

import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '@/server/trpc/routers/_app';

/**
 * Get base URL for tRPC requests
 * Uses NEXT_PUBLIC_APP_URL in production, localhost in development
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser: use relative URL
    return '';
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    // Server: use public URL
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Development: use localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Vanilla tRPC client (for use outside React components)
 */
export const trpc = createTRPCClient<AppRouter>({
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
});
