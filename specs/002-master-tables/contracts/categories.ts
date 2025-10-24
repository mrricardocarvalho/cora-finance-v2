/**
 * API Contract: Categories
 * 
 * tRPC router for category management operations.
 * Categories classify transactions as Expense or Income.
 */

import { z } from 'zod';

/**
 * Input Schemas
 */

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['Expense', 'Income']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/), // Hex color #RRGGBB
  icon: z.string().min(1).max(50), // lucide-react icon name (validated against curated list)
});

export const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().min(1).max(50).optional(),
  // Note: type is immutable after creation
});

export const categoryIdSchema = z.object({
  id: z.string().uuid(),
});

export const listCategoriesSchema = z.object({
  type: z.enum(['Expense', 'Income']).optional(), // Filter by type
  includeArchived: z.boolean().optional().default(false),
});

export const checkDeletableSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Output Types
 */

export type Category = {
  id: string;
  name: string;
  type: 'Expense' | 'Income';
  color: string;
  icon: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DeletableCheck = {
  deletable: boolean;
  transactionCount: number; // Number of transactions using this category
};

/**
 * tRPC Procedures
 */

export const categoriesRouter = {
  /**
   * Create new category
   * 
   * @input createCategorySchema
   * @output Category
   * @errors
   *   - CONFLICT: Category name already exists for this type (case-insensitive)
   *   - BAD_REQUEST: Invalid icon name
   */
  create: {
    input: createCategorySchema,
    output: z.custom<Category>(),
  },

  /**
   * List categories
   * 
   * @input listCategoriesSchema
   * @output Category[]
   */
  list: {
    input: listCategoriesSchema,
    output: z.array(z.custom<Category>()),
  },

  /**
   * Get category by ID
   * 
   * @input categoryIdSchema
   * @output Category
   * @errors
   *   - NOT_FOUND: Category does not exist
   */
  getById: {
    input: categoryIdSchema,
    output: z.custom<Category>(),
  },

  /**
   * Update category properties
   * Cannot update type (immutable).
   * 
   * @input updateCategorySchema
   * @output Category
   * @errors
   *   - NOT_FOUND: Category does not exist
   *   - CONFLICT: New name already exists for this type
   */
  update: {
    input: updateCategorySchema,
    output: z.custom<Category>(),
  },

  /**
   * Archive category (soft delete)
   * 
   * @input categoryIdSchema
   * @output Category
   * @errors
   *   - BAD_REQUEST: Category has active transactions (use archive instead of delete)
   *   - NOT_FOUND: Category does not exist
   */
  archive: {
    input: categoryIdSchema,
    output: z.custom<Category>(),
  },

  /**
   * Unarchive category
   * 
   * @input categoryIdSchema
   * @output Category
   * @errors
   *   - NOT_FOUND: Category does not exist
   */
  unarchive: {
    input: categoryIdSchema,
    output: z.custom<Category>(),
  },

  /**
   * Check if category can be deleted
   * Returns transaction count to inform user of impact.
   * 
   * @input checkDeletableSchema
   * @output DeletableCheck
   * @errors
   *   - NOT_FOUND: Category does not exist
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
 * // Create expense category
 * const groceries = await trpc.categories.create.mutate({
 *   name: 'Groceries',
 *   type: 'Expense',
 *   color: '#10B981',
 *   icon: 'shopping-cart',
 * });
 * 
 * // List expense categories
 * const expenses = await trpc.categories.list.query({ type: 'Expense' });
 * 
 * // Check if deletable
 * const check = await trpc.categories.checkDeletable.query({ id: groceriesId });
 * if (!check.deletable) {
 *   console.log(`Cannot delete: ${check.transactionCount} transactions exist`);
 * }
 * ```
 */
