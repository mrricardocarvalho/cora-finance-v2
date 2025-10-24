/**
 * tRPC Instance Initialization
 *
 * This module initializes the tRPC instance with superjson for enhanced serialization.
 * superjson allows passing Date, Map, Set, and other non-JSON types between server and client.
 *
 * @module server/trpc/init
 */

import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from './context';

/**
 * Initialize tRPC with context and superjson transformer
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
