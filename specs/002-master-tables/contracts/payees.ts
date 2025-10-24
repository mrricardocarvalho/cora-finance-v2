/**
 * API Contract: Payees
 * 
 * tRPC router for payee management operations.
 * Payees are optional master data for merchants/people to enable
 * autocomplete and default categorization.
 */

import { z } from 'zod';

/**
 * Input Schemas
 */

export const createPayeeSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['person', 'vendor']),
  defaultCategoryId: z.string().uuid().optional(), // Optional default category
});

export const updatePayeeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  type: z.enum(['person', 'vendor']).optional(),
  defaultCategoryId: z.string().uuid().nullable().optional(), // Can set to null
});

export const payeeIdSchema = z.object({
  id: z.string().uuid(),
});

export const listPayeesSchema = z.object({
  includeArchived: z.boolean().optional().default(false),
});

export const searchPayeesSchema = z.object({
  query: z.string().min(1), // Search term (partial name match)
  limit: z.number().int().min(1).max(50).optional().default(10),
});

/**
 * Output Types
 */

export type Payee = {
  id: string;
  name: string;
  type: 'person' | 'vendor';
  defaultCategoryId: string | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PayeeWithCategory = Payee & {
  defaultCategory?: {
    id: string;
    name: string;
    type: 'Expense' | 'Income';
  };
};

/**
 * tRPC Procedures
 */

export const payeesRouter = {
  /**
   * Create new payee
   * 
   * @input createPayeeSchema
   * @output PayeeWithCategory
   * @errors
   *   - CONFLICT: Payee name already exists
   *   - BAD_REQUEST: Invalid category ID
   */
  create: {
    input: createPayeeSchema,
    output: z.custom<PayeeWithCategory>(),
  },

  /**
   * List all payees
   * 
   * @input listPayeesSchema
   * @output PayeeWithCategory[]
   */
  list: {
    input: listPayeesSchema,
    output: z.array(z.custom<PayeeWithCategory>()),
  },

  /**
   * Get payee by ID
   * 
   * @input payeeIdSchema
   * @output PayeeWithCategory
   * @errors
   *   - NOT_FOUND: Payee does not exist
   */
  getById: {
    input: payeeIdSchema,
    output: z.custom<PayeeWithCategory>(),
  },

  /**
   * Search payees by partial name (for autocomplete)
   * Case-insensitive, returns top matches.
   * 
   * @input searchPayeesSchema
   * @output PayeeWithCategory[]
   */
  search: {
    input: searchPayeesSchema,
    output: z.array(z.custom<PayeeWithCategory>()),
  },

  /**
   * Update payee properties
   * 
   * @input updatePayeeSchema
   * @output PayeeWithCategory
   * @errors
   *   - NOT_FOUND: Payee does not exist
   *   - CONFLICT: New name already exists
   */
  update: {
    input: updatePayeeSchema,
    output: z.custom<PayeeWithCategory>(),
  },

  /**
   * Delete payee (conditional: hard delete if unused, soft delete if used)
   * 
   * Checks transaction count:
   * - 0 transactions: Hard delete (removes record)
   * - >0 transactions: Soft delete (sets archived = true)
   * 
   * @input payeeIdSchema
   * @output { deleted: boolean; archived: boolean; transactionCount: number }
   * @errors
   *   - NOT_FOUND: Payee does not exist
   */
  delete: {
    input: payeeIdSchema,
    output: z.object({
      deleted: z.boolean(),
      archived: z.boolean(),
      transactionCount: z.number(),
    }),
  },

  /**
   * Unarchive payee
   * 
   * @input payeeIdSchema
   * @output Payee
   * @errors
   *   - NOT_FOUND: Payee does not exist
   */
  unarchive: {
    input: payeeIdSchema,
    output: z.custom<Payee>(),
  },
};

/**
 * Example Usage (Client)
 * 
 * ```typescript
 * // Create payee
 * const starbucks = await trpc.payees.create.mutate({
 *   name: 'Starbucks',
 *   type: 'vendor',
 *   defaultCategoryId: restaurantsCategoryId,
 * });
 * 
 * // Search for autocomplete
 * const results = await trpc.payees.search.query({
 *   query: 'star',
 *   limit: 5,
 * });
 * 
 * // Delete payee (conditional)
 * const result = await trpc.payees.delete.mutate({ id: starbucks.id });
 * if (result.archived) {
 *   console.log(`Archived (${result.transactionCount} transactions exist)`);
 * } else {
 *   console.log('Deleted permanently (no transactions)');
 * }
 * ```
 */
