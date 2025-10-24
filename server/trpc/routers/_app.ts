/**
 * Root tRPC Router
 *
 * Aggregates all sub-routers into a single application router.
 * Export the AppRouter type for client-side type inference.
 *
 * @module server/trpc/routers/_app
 */

import { router } from '../init';
import { healthRouter } from './health';

/**
 * Application Router
 *
 * All tRPC procedures are organized under this root router.
 * Add new routers here as features are developed.
 */
export const appRouter = router({
  health: healthRouter,
  // Future routers will be added here:
  // accounts: accountsRouter,
  // transactions: transactionsRouter,
  // budgets: budgetsRouter,
});

/**
 * Export type definition for client-side inference
 * This enables end-to-end type safety without code generation
 */
export type AppRouter = typeof appRouter;
