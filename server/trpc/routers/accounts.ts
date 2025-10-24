/**
 * Accounts tRPC Router
 *
 * API endpoints for financial account CRUD operations.
 * Manages bank accounts, credit cards, and cash wallets.
 *
 * @module server/trpc/routers/accounts
 */

import {
    archiveAccountSchema,
    createAccountSchema,
    getAccountByIdSchema,
    listAccountsSchema,
    updateAccountBalanceSchema,
    updateAccountSchema,
} from '@/lib/validations/account';
import { db } from '@/server/db';
import { accounts, currencies, settings } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { publicProcedure, router } from '../init';

export const accountsRouter = router({
  /**
   * Create a new account
   *
   * Validates currency exists and is not archived.
   * Sets initial balance and creates account.
   */
  create: publicProcedure.input(createAccountSchema).mutation(async ({ input }) => {
    // Validate currency exists and is not archived
    const [currency] = await db
      .select()
      .from(currencies)
      .where(eq(currencies.id, input.currencyId))
      .limit(1);

    if (!currency) {
      throw new Error('Selected currency not found');
    }

    if (currency.archived) {
      throw new Error('Cannot create account with archived currency');
    }

    // Create account
    const [account] = await db
      .insert(accounts)
      .values({
        name: input.name,
        type: input.type,
        currencyId: input.currencyId,
        balance: input.initialBalance,
      })
      .returning();

    return account;
  }),

  /**
   * List accounts with optional filtering
   *
   * Filter by type (Bank/CreditCard/Wallet) and archived status.
   * Returns accounts with currency information.
   */
  list: publicProcedure.input(listAccountsSchema).query(async ({ input }) => {
    const conditions = [];

    if (input.type) {
      conditions.push(eq(accounts.type, input.type));
    }

    if (!input.includeArchived) {
      conditions.push(eq(accounts.archived, false));
    }

    const result = await db
      .select({
        account: accounts,
        currency: currencies,
      })
      .from(accounts)
      .leftJoin(currencies, eq(accounts.currencyId, currencies.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(accounts.name);

    return result.map((row) => ({
      ...row.account,
      currency: row.currency,
    }));
  }),

  /**
   * Get account by ID with currency information
   */
  getById: publicProcedure.input(getAccountByIdSchema).query(async ({ input }) => {
    const [result] = await db
      .select({
        account: accounts,
        currency: currencies,
      })
      .from(accounts)
      .leftJoin(currencies, eq(accounts.currencyId, currencies.id))
      .where(eq(accounts.id, input.id))
      .limit(1);

    if (!result) {
      throw new Error('Account not found');
    }

    return {
      ...result.account,
      currency: result.currency,
    };
  }),

  /**
   * Get default currency ID from settings
   *
   * Helper for new account creation - suggests default currency.
   */
  getDefaultCurrency: publicProcedure.query(async () => {
    const [settingsRecord] = await db.select().from(settings).limit(1);
    
    if (!settingsRecord) {
      // Fallback to EUR if settings not initialized
      const [eurCurrency] = await db
        .select()
        .from(currencies)
        .where(eq(currencies.code, 'EUR'))
        .limit(1);
      
      return eurCurrency?.id;
    }

    return settingsRecord.defaultCurrencyId;
  }),

  /**
   * Update account details
   *
   * Cannot change currency (affects transaction history).
   * Cannot change balance directly (use updateBalance endpoint).
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: updateAccountSchema,
      })
    )
    .mutation(async ({ input }) => {
      const [existing] = await db
        .select()
        .from(accounts)
        .where(eq(accounts.id, input.id))
        .limit(1);

      if (!existing) {
        throw new Error('Account not found');
      }

      const [updated] = await db
        .update(accounts)
        .set(input.data)
        .where(eq(accounts.id, input.id))
        .returning();

      return updated;
    }),

  /**
   * Update account balance
   *
   * Manual balance adjustment for reconciliation.
   * Use with caution - normally balance updates via transactions.
   */
  updateBalance: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: updateAccountBalanceSchema,
      })
    )
    .mutation(async ({ input }) => {
      const [existing] = await db
        .select()
        .from(accounts)
        .where(eq(accounts.id, input.id))
        .limit(1);

      if (!existing) {
        throw new Error('Account not found');
      }

      const [updated] = await db
        .update(accounts)
        .set({ balance: input.data.balance })
        .where(eq(accounts.id, input.id))
        .returning();

      return updated;
    }),

  /**
   * Archive account
   *
   * Soft delete - sets archived flag to true.
   */
  archive: publicProcedure.input(archiveAccountSchema).mutation(async ({ input }) => {
    const [account] = await db
      .update(accounts)
      .set({ archived: true })
      .where(eq(accounts.id, input.id))
      .returning();

    if (!account) {
      throw new Error('Account not found');
    }

    return account;
  }),

  /**
   * Unarchive account
   */
  unarchive: publicProcedure.input(archiveAccountSchema).mutation(async ({ input }) => {
    const [account] = await db
      .update(accounts)
      .set({ archived: false })
      .where(eq(accounts.id, input.id))
      .returning();

    if (!account) {
      throw new Error('Account not found');
    }

    return account;
  }),
});
