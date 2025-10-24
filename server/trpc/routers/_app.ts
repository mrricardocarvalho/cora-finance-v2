/**
 * Root tRPC Router
 *
 * Aggregates all sub-routers into a single application router.
 * Export the AppRouter type for client-side type inference.
 *
 * @module server/trpc/routers/_app
 */

import { router } from '../init';
import { accountsRouter } from './accounts';
import { categoriesRouter } from './categories';
import { currenciesRouter } from './currencies';
import { healthRouter } from './health';
import { payeesRouter } from './payees';
import { settingsRouter } from './settings';

/**
 * Application Router
 *
 * All tRPC procedures are organized under this root router.
 * Add new routers here as features are developed.
 */
export const appRouter = router({
  health: healthRouter,
  currencies: currenciesRouter,
  settings: settingsRouter,
  categories: categoriesRouter,
  accounts: accountsRouter,
  payees: payeesRouter,
  // Future routers will be added here:
  // transactions: transactionsRouter,
  // budgets: budgetsRouter,
});

/**
 * Export type definition for client-side inference
 * This enables end-to-end type safety without code generation
 */
export type AppRouter = typeof appRouter;
