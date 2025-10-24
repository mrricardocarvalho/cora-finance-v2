/**
 * Payee Validation Schemas
 *
 * Zod schemas for payee/payer management.
 * Validates name, type, and category associations.
 *
 * @module lib/validations/payee
 */

import { z } from 'zod';

/**
 * Payee type enum (matches database schema)
 */
const payeeTypes = ['person', 'vendor'] as const;

/**
 * Create payee input schema
 *
 * Validates:
 * - name (1-100 chars, required)
 * - type (person/vendor, required)
 * - defaultCategoryId (UUID, optional - auto-categorization)
 */
export const createPayeeSchema = z.object({
  name: z.string().min(1, 'Payee name is required').max(100, 'Name too long'),
  type: z.enum(payeeTypes, { message: 'Payee type is required' }),
  defaultCategoryId: z.string().uuid('Invalid category ID').optional(),
});

export type CreatePayeeInput = z.infer<typeof createPayeeSchema>;

/**
 * Update payee input schema
 *
 * All fields optional.
 */
export const updatePayeeSchema = z.object({
  name: z.string().min(1, 'Payee name is required').max(100, 'Name too long').optional(),
  type: z.enum(payeeTypes).optional(),
  defaultCategoryId: z.string().uuid('Invalid category ID').nullable().optional(),
});

export type UpdatePayeeInput = z.infer<typeof updatePayeeSchema>;

/**
 * Get payee by ID schema
 */
export const getPayeeByIdSchema = z.object({
  id: z.string().uuid('Invalid payee ID'),
});

export type GetPayeeByIdInput = z.infer<typeof getPayeeByIdSchema>;

/**
 * List payees schema
 *
 * Filter by type and archived status.
 */
export const listPayeesSchema = z.object({
  type: z.enum(payeeTypes).optional(),
  includeArchived: z.boolean().default(false),
});

export type ListPayeesInput = z.infer<typeof listPayeesSchema>;

/**
 * Archive/unarchive payee schema
 */
export const archivePayeeSchema = z.object({
  id: z.string().uuid('Invalid payee ID'),
});

export type ArchivePayeeInput = z.infer<typeof archivePayeeSchema>;
