/**
 * Account Validation Schemas
 *
 * Zod schemas for financial account management.
 * Validates account name, type, currency, and balance (in cents).
 *
 * @module lib/validations/account
 */

import { z } from 'zod';

/**
 * Account type enum (matches database schema)
 */
const accountTypes = ['Bank', 'CreditCard', 'Wallet'] as const;

/**
 * Create account input schema
 *
 * Validates:
 * - name (1-100 chars, required)
 * - type (Bank/CreditCard/Wallet, required)
 * - currencyId (UUID, required)
 * - initialBalance (integer cents, required)
 */
export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100, 'Name too long'),
  type: z.enum(accountTypes, { message: 'Account type is required' }),
  currencyId: z.string().uuid('Invalid currency ID'),
  initialBalance: z.number().int('Balance must be in cents (integer)'),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

/**
 * Update account input schema
 *
 * All fields optional except balance (use separate balance update endpoint).
 * Cannot change currency after creation (affects transaction history).
 */
export const updateAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100, 'Name too long').optional(),
  type: z.enum(accountTypes).optional(),
});

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

/**
 * Update account balance input schema
 *
 * For manual balance adjustments (reconciliation).
 */
export const updateAccountBalanceSchema = z.object({
  balance: z.number().int('Balance must be in cents (integer)'),
});

export type UpdateAccountBalanceInput = z.infer<typeof updateAccountBalanceSchema>;

/**
 * Get account by ID schema
 */
export const getAccountByIdSchema = z.object({
  id: z.string().uuid('Invalid account ID'),
});

export type GetAccountByIdInput = z.infer<typeof getAccountByIdSchema>;

/**
 * List accounts schema
 *
 * Filter by type and archived status.
 */
export const listAccountsSchema = z.object({
  type: z.enum(accountTypes).optional(),
  includeArchived: z.boolean().default(false),
});

export type ListAccountsInput = z.infer<typeof listAccountsSchema>;

/**
 * Archive/unarchive account schema
 */
export const archiveAccountSchema = z.object({
  id: z.string().uuid('Invalid account ID'),
});

export type ArchiveAccountInput = z.infer<typeof archiveAccountSchema>;
