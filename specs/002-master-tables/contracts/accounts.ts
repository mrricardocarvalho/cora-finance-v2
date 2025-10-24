/**
 * API Contract: Accounts
 * 
 * tRPC router for account management operations.
 * Accounts represent financial accounts (bank, credit card, wallet).
 */

import { z } from 'zod';

/**
 * Input Schemas
 */

export const createAccountSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['Bank', 'CreditCard', 'Wallet']),
  currencyId: z.string().uuid(),
  balance: z.number().int(), // Initial balance in cents
});

export const updateAccountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  type: z.enum(['Bank', 'CreditCard', 'Wallet']).optional(),
  currencyId: z.string().uuid().optional(), // Warning if transactions exist
  // Note: balance is updated via transactions, not directly
});

export const accountIdSchema = z.object({
  id: z.string().uuid(),
});

export const listAccountsSchema = z.object({
  includeArchived: z.boolean().optional().default(false),
});

export const checkDeletableSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Output Types
 */

export type Account = {
  id: string;
  name: string;
  type: 'Bank' | 'CreditCard' | 'Wallet';
  currencyId: string;
  balance: number; // Integer cents
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AccountWithCurrency = Account & {
  currency: {
    code: string;
    symbol: string;
  };
};

export type DeletableCheck = {
  deletable: boolean;
  transactionCount: number;
};

/**
 * tRPC Procedures
 */

export const accountsRouter = {
  /**
   * Create new account
   * 
   * @input createAccountSchema
   * @output AccountWithCurrency
   * @errors
   *   - CONFLICT: Account name already exists
   *   - BAD_REQUEST: Invalid currency ID
   *   - BAD_REQUEST: Currency is archived
   */
  create: {
    input: createAccountSchema,
    output: z.custom<AccountWithCurrency>(),
  },

  /**
   * List all accounts
   * Returns accounts grouped by type with currency details.
   * 
   * @input listAccountsSchema
   * @output AccountWithCurrency[]
   */
  list: {
    input: listAccountsSchema,
    output: z.array(z.custom<AccountWithCurrency>()),
  },

  /**
   * Get account by ID
   * 
   * @input accountIdSchema
   * @output AccountWithCurrency
   * @errors
   *   - NOT_FOUND: Account does not exist
   */
  getById: {
    input: accountIdSchema,
    output: z.custom<AccountWithCurrency>(),
  },

  /**
   * Update account properties
   * Changing currency shows warning if transactions exist.
   * Balance cannot be updated directly (use transactions).
   * 
   * @input updateAccountSchema
   * @output AccountWithCurrency
   * @errors
   *   - NOT_FOUND: Account does not exist
   *   - CONFLICT: New name already exists
   *   - BAD_REQUEST: Cannot change currency (transactions exist)
   */
  update: {
    input: updateAccountSchema,
    output: z.custom<AccountWithCurrency>(),
  },

  /**
   * Archive account (soft delete)
   * 
   * @input accountIdSchema
   * @output Account
   * @errors
   *   - BAD_REQUEST: Account has active transactions
   *   - NOT_FOUND: Account does not exist
   */
  archive: {
    input: accountIdSchema,
    output: z.custom<Account>(),
  },

  /**
   * Unarchive account
   * 
   * @input accountIdSchema
   * @output Account
   * @errors
   *   - NOT_FOUND: Account does not exist
   */
  unarchive: {
    input: accountIdSchema,
    output: z.custom<Account>(),
  },

  /**
   * Check if account can be deleted
   * 
   * @input checkDeletableSchema
   * @output DeletableCheck
   * @errors
   *   - NOT_FOUND: Account does not exist
   */
  checkDeletable: {
    input: checkDeletableSchema,
    output: z.custom<DeletableCheck>(),
  },
};

/**
 * Example Usage (Client)
 * 
 * ```typescript
 * // Create checking account
 * const checking = await trpc.accounts.create.mutate({
 *   name: 'Checking Account',
 *   type: 'Bank',
 *   currencyId: eurId,
 *   balance: 100000, // €1000.00 in cents
 * });
 * 
 * // List all accounts
 * const accounts = await trpc.accounts.list.query({ includeArchived: false });
 * 
 * // Update account name
 * const updated = await trpc.accounts.update.mutate({
 *   id: checking.id,
 *   name: 'Main Checking',
 * });
 * 
 * // Check if deletable
 * const check = await trpc.accounts.checkDeletable.query({ id: checking.id });
 * ```
 */
