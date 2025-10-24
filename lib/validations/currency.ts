/**
 * Currency Validation Schemas
 *
 * Zod schemas for currency creation and updates.
 * Validates ISO 4217 currency codes and exchange rates.
 *
 * @module lib/validations/currency
 */

import { ISO_4217_CURRENCY_CODES } from '@/lib/constants/currency-codes';
import { z } from 'zod';

/**
 * Create currency input schema
 *
 * Validates:
 * - ISO 4217 code (3 uppercase letters)
 * - Symbol (max 10 chars)
 * - Name (max 100 chars)
 * - Exchange rate (positive decimal)
 */
export const createCurrencySchema = z.object({
  code: z
    .string()
    .length(3, 'Currency code must be exactly 3 characters')
    .toUpperCase()
    .refine((code) => ISO_4217_CURRENCY_CODES.includes(code as any), {
      message: 'Invalid ISO 4217 currency code',
    }),
  symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol too long'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  exchangeRate: z
    .number()
    .positive('Exchange rate must be positive'),
});

export type CreateCurrencyInput = z.infer<typeof createCurrencySchema>;

/**
 * Update currency input schema
 *
 * All fields optional except what's being updated.
 * Code cannot be changed (must delete and recreate).
 */
export const updateCurrencySchema = z.object({
  id: z.string().uuid('Invalid currency ID'),
  symbol: z.string().min(1).max(10).optional(),
  name: z.string().min(1).max(100).optional(),
  exchangeRate: z.number().positive().optional(),
});

export type UpdateCurrencyInput = z.infer<typeof updateCurrencySchema>;

/**
 * Update exchange rate input schema
 *
 * Specialized schema for updating just the exchange rate.
 * Updates lastUpdated timestamp automatically.
 */
export const updateExchangeRateSchema = z.object({
  id: z.string().uuid('Invalid currency ID'),
  exchangeRate: z.number().positive('Exchange rate must be positive'),
});

export type UpdateExchangeRateInput = z.infer<typeof updateExchangeRateSchema>;

/**
 * Get currency by ID schema
 */
export const getCurrencyByIdSchema = z.object({
  id: z.string().uuid('Invalid currency ID'),
});

/**
 * List currencies schema
 */
export const listCurrenciesSchema = z.object({
  includeArchived: z.boolean().default(false),
});

/**
 * Archive/Unarchive currency schema
 */
export const archiveCurrencySchema = z.object({
  id: z.string().uuid('Invalid currency ID'),
});
