/**
 * tRPC Context
 *
 * Defines the context available to all tRPC procedures.
 * Currently includes database instance; future: session, user, etc.
 *
 * @module server/trpc/context
 */

import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { db } from '@/server/db';

/**
 * Create context for tRPC procedures
 *
 * @param opts - Request headers and other metadata from fetch adapter
 * @returns Context object available to all procedures
 */
export async function createContext(opts?: FetchCreateContextFnOptions) {
  return {
    db,
    headers: opts?.req.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
