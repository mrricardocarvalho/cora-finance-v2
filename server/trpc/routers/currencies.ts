/**
 * Currencies tRPC Router
 *
 * API endpoints for currency CRUD operations.
 * Supports multi-currency financial tracking with exchange rates.
 *
 * @module server/trpc/routers/currencies
 */

import {
    archiveCurrencySchema,
    createCurrencySchema,
    getCurrencyByIdSchema,
    listCurrenciesSchema,
    updateCurrencySchema,
    updateExchangeRateSchema,
} from '@/lib/validations/currency';
import { db } from '@/server/db';
import { currencies } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { publicProcedure, router } from '../init';

export const currenciesRouter = router({
  /**
   * Create a new currency
   */
  create: publicProcedure
    .input(createCurrencySchema)
    .mutation(async ({ input }) => {
      const [currency] = await db
        .insert(currencies)
        .values({
          code: input.code,
          symbol: input.symbol,
          name: input.name,
          exchangeRate: input.exchangeRate.toString(),
          lastUpdated: new Date(),
        })
        .returning();

      return currency;
    }),

  /**
   * List all currencies (optionally include archived)
   */
  list: publicProcedure
    .input(listCurrenciesSchema)
    .query(async ({ input }) => {
      const conditions = input.includeArchived
        ? []
        : [eq(currencies.archived, false)];

      return await db
        .select()
        .from(currencies)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(currencies.code);
    }),

  /**
   * Get currency by ID
   */
  getById: publicProcedure
    .input(getCurrencyByIdSchema)
    .query(async ({ input }) => {
      const [currency] = await db
        .select()
        .from(currencies)
        .where(eq(currencies.id, input.id))
        .limit(1);

      if (!currency) {
        throw new Error('Currency not found');
      }

      return currency;
    }),

  /**
   * Get default currency (EUR or first available)
   */
  getDefault: publicProcedure.query(async () => {
    // Try to find EUR first
    const [eurCurrency] = await db
      .select()
      .from(currencies)
      .where(and(eq(currencies.code, 'EUR'), eq(currencies.archived, false)))
      .limit(1);

    if (eurCurrency) {
      return eurCurrency;
    }

    // Fallback to first non-archived currency
    const [firstCurrency] = await db
      .select()
      .from(currencies)
      .where(eq(currencies.archived, false))
      .limit(1);

    if (!firstCurrency) {
      throw new Error('No currencies available. Please create EUR currency first.');
    }

    return firstCurrency;
  }),

  /**
   * Update currency details (not exchange rate)
   */
  update: publicProcedure
    .input(updateCurrencySchema)
    .mutation(async ({ input }) => {
      const { id, exchangeRate, ...updates } = input;

      const updateData = {
        ...updates,
        ...(exchangeRate !== undefined && { exchangeRate: exchangeRate.toString() }),
      };

      const [currency] = await db
        .update(currencies)
        .set(updateData)
        .where(eq(currencies.id, id))
        .returning();

      if (!currency) {
        throw new Error('Currency not found');
      }

      return currency;
    }),

  /**
   * Update exchange rate (updates lastUpdated timestamp)
   */
  updateExchangeRate: publicProcedure
    .input(updateExchangeRateSchema)
    .mutation(async ({ input }) => {
      const [currency] = await db
        .update(currencies)
        .set({
          exchangeRate: input.exchangeRate.toString(),
          lastUpdated: new Date(),
        })
        .where(eq(currencies.id, input.id))
        .returning();

      if (!currency) {
        throw new Error('Currency not found');
      }

      return currency;
    }),

  /**
   * Archive a currency (soft delete)
   */
  archive: publicProcedure
    .input(archiveCurrencySchema)
    .mutation(async ({ input }) => {
      const [currency] = await db
        .update(currencies)
        .set({ archived: true })
        .where(eq(currencies.id, input.id))
        .returning();

      if (!currency) {
        throw new Error('Currency not found');
      }

      return currency;
    }),

  /**
   * Unarchive a currency
   */
  unarchive: publicProcedure
    .input(archiveCurrencySchema)
    .mutation(async ({ input }) => {
      const [currency] = await db
        .update(currencies)
        .set({ archived: false })
        .where(eq(currencies.id, input.id))
        .returning();

      if (!currency) {
        throw new Error('Currency not found');
      }

      return currency;
    }),
});
