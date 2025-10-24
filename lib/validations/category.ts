/**
 * Category Validation Schemas
 *
 * Zod schemas for category management (income/expense categorization).
 * Validates name, type, color, icon, and parent relationships.
 *
 * @module lib/validations/category
 */

import { z } from 'zod';

/**
 * Category type enum (matches database schema)
 */
const categoryTypes = ['Income', 'Expense'] as const;

/**
 * Create category input schema
 *
 * Validates:
 * - name (1-100 chars, required)
 * - type (income/expense, required)
 * - color (hex color with #, optional)
 * - icon (lucide icon name, optional)
 * - parentCategoryId (UUID, optional for sub-categories)
 */
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  type: z.enum(categoryTypes, { message: 'Category type is required' }),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g., #FF5733)'),
  icon: z.string().min(1, 'Icon is required').max(50, 'Icon name too long'),
  parentCategoryId: z.string().uuid('Invalid parent category ID').optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

/**
 * Update category input schema
 *
 * All fields optional except type (cannot change type after creation).
 */
export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g., #FF5733)')
    .optional(),
  icon: z.string().min(1, 'Icon is required').max(50, 'Icon name too long').optional(),
  parentCategoryId: z.string().uuid('Invalid parent category ID').nullable().optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

/**
 * Get category by ID schema
 */
export const getCategoryByIdSchema = z.object({
  id: z.string().uuid('Invalid category ID'),
});

export type GetCategoryByIdInput = z.infer<typeof getCategoryByIdSchema>;

/**
 * List categories schema
 *
 * Filter by type and archived status.
 */
export const listCategoriesSchema = z.object({
  type: z.enum(categoryTypes).optional(),
  includeArchived: z.boolean().default(false),
});

export type ListCategoriesInput = z.infer<typeof listCategoriesSchema>;

/**
 * Archive/unarchive category schema
 */
export const archiveCategorySchema = z.object({
  id: z.string().uuid('Invalid category ID'),
});

export type ArchiveCategoryInput = z.infer<typeof archiveCategorySchema>;
