/**
 * API Contract: Currencies
 * 
 * tRPC router for currency management operations.
 * All procedures include input validation via Zod schemas.
 */

import { z } from 'zod';

/**
 * Input Schemas
 */

export const createCurrencySchema = z.object({
  code: z.string().length(3).toUpperCase(), // ISO 4217 code (validated against constant list)
  symbol: z.string().min(1).max(10),
  name: z.string().min(1).max(100),
  exchangeRate: z.number().positive(), // Exchange rate to EUR (base currency)
});

export const updateCurrencySchema = z.object({
  id: z.string().uuid(),
  symbol: z.string().min(1).max(10).optional(),
  name: z.string().min(1).max(100).optional(),
  exchangeRate: z.number().positive().optional(),
  // Note: code is immutable after creation
});

export const updateExchangeRateSchema = z.object({
  id: z.string().uuid(),
  exchangeRate: z.number().positive(),
});

export const currencyIdSchema = z.object({
  id: z.string().uuid(),
});

export const listCurrenciesSchema = z.object({
  includeArchived: z.boolean().optional().default(false),
});

/**
 * Output Types (inferred from Drizzle schema)
 */

export type Currency = {
  id: string;
  code: string;
  symbol: string;
  name: string;
  exchangeRate: string; // Decimal as string
  lastUpdated: Date;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * tRPC Procedures
 */

export const currenciesRouter = {
  /**
   * Create new currency
   * 
   * @input createCurrencySchema
   * @output Currency
   * @errors
   *   - CONFLICT: Currency code already exists
   *   - BAD_REQUEST: Invalid ISO 4217 code
   */
  create: {
    input: createCurrencySchema,
    output: z.custom<Currency>(),
  },

  /**
   * List all currencies
   * 
   * @input listCurrenciesSchema
   * @output Currency[]
   */
  list: {
    input: listCurrenciesSchema,
    output: z.array(z.custom<Currency>()),
  },

  /**
   * Get currency by ID
   * 
   * @input currencyIdSchema
   * @output Currency
   * @errors
   *   - NOT_FOUND: Currency does not exist
   */
  getById: {
    input: currencyIdSchema,
    output: z.custom<Currency>(),
  },

  /**
   * Get default currency (EUR or current default from settings)
   * 
   * @input none
   * @output Currency
   */
  getDefault: {
    input: z.void(),
    output: z.custom<Currency>(),
  },

  /**
   * Update currency properties
   * Cannot update code (immutable).
   * 
   * @input updateCurrencySchema
   * @output Currency
   * @errors
   *   - NOT_FOUND: Currency does not exist
   */
  update: {
    input: updateCurrencySchema,
    output: z.custom<Currency>(),
  },

  /**
   * Update exchange rate and lastUpdated timestamp
   * 
   * @input updateExchangeRateSchema
   * @output Currency
   * @errors
   *   - NOT_FOUND: Currency does not exist
   */
  updateExchangeRate: {
    input: updateExchangeRateSchema,
    output: z.custom<Currency>(),
  },

  /**
   * Archive currency (soft delete)
   * 
   * @input currencyIdSchema
   * @output Currency
   * @errors
   *   - BAD_REQUEST: Currency has active accounts
   *   - BAD_REQUEST: Currency is default in settings
   *   - NOT_FOUND: Currency does not exist
   */
  archive: {
    input: currencyIdSchema,
    output: z.custom<Currency>(),
  },

  /**
   * Unarchive currency
   * 
   * @input currencyIdSchema
   * @output Currency
   * @errors
   *   - NOT_FOUND: Currency does not exist
   */
  unarchive: {
    input: currencyIdSchema,
    output: z.custom<Currency>(),
  },
};

/**
 * Example Usage (Client)
 * 
 * ```typescript
 * // Create EUR currency
 * const eur = await trpc.currencies.create.mutate({
 *   code: 'EUR',
 *   symbol: '€',
 *   name: 'Euro',
 *   exchangeRate: 1.0,
 * });
 * 
 * // List active currencies
 * const currencies = await trpc.currencies.list.query({ includeArchived: false });
 * 
 * // Update exchange rate
 * const updated = await trpc.currencies.updateExchangeRate.mutate({
 *   id: usdId,
 *   exchangeRate: 1.12,
 * });
 * ```
 */
