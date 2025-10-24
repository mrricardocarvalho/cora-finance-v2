/**
 * Payees tRPC Router
 *
 * API endpoints for payee/payer CRUD operations.
 * Manages merchants, people, and organizations.
 *
 * @module server/trpc/routers/payees
 */

import {
    archivePayeeSchema,
    createPayeeSchema,
    getPayeeByIdSchema,
    listPayeesSchema,
    updatePayeeSchema,
} from '@/lib/validations/payee';
import { db } from '@/server/db';
import { categories, payees } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { publicProcedure, router } from '../init';

export const payeesRouter = router({
  /**
   * Create a new payee
   *
   * Validates category exists if defaultCategoryId is provided.
   */
  create: publicProcedure.input(createPayeeSchema).mutation(async ({ input }) => {
    // Validate category exists if provided
    if (input.defaultCategoryId) {
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.defaultCategoryId))
        .limit(1);

      if (!category) {
        throw new Error('Selected category not found');
      }

      if (category.archived) {
        throw new Error('Cannot assign archived category as default');
      }
    }

    const [payee] = await db.insert(payees).values(input).returning();
    return payee;
  }),

  /**
   * List payees with optional filtering
   *
   * Filter by type (person/vendor) and archived status.
   * Returns payees with category information.
   */
  list: publicProcedure.input(listPayeesSchema).query(async ({ input }) => {
    const conditions = [];

    if (input.type) {
      conditions.push(eq(payees.type, input.type));
    }

    if (!input.includeArchived) {
      conditions.push(eq(payees.archived, false));
    }

    const result = await db
      .select({
        payee: payees,
        category: categories,
      })
      .from(payees)
      .leftJoin(categories, eq(payees.defaultCategoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(payees.name);

    return result.map((row) => ({
      ...row.payee,
      category: row.category,
    }));
  }),

  /**
   * Get payee by ID with category information
   */
  getById: publicProcedure.input(getPayeeByIdSchema).query(async ({ input }) => {
    const [result] = await db
      .select({
        payee: payees,
        category: categories,
      })
      .from(payees)
      .leftJoin(categories, eq(payees.defaultCategoryId, categories.id))
      .where(eq(payees.id, input.id))
      .limit(1);

    if (!result) {
      throw new Error('Payee not found');
    }

    return {
      ...result.payee,
      category: result.category,
    };
  }),

  /**
   * Update payee details
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: updatePayeeSchema,
      })
    )
    .mutation(async ({ input }) => {
      const [existing] = await db
        .select()
        .from(payees)
        .where(eq(payees.id, input.id))
        .limit(1);

      if (!existing) {
        throw new Error('Payee not found');
      }

      // Validate category if changing
      if (input.data.defaultCategoryId !== undefined && input.data.defaultCategoryId !== null) {
        const [category] = await db
          .select()
          .from(categories)
          .where(eq(categories.id, input.data.defaultCategoryId))
          .limit(1);

        if (!category) {
          throw new Error('Selected category not found');
        }

        if (category.archived) {
          throw new Error('Cannot assign archived category as default');
        }
      }

      const [updated] = await db
        .update(payees)
        .set(input.data)
        .where(eq(payees.id, input.id))
        .returning();

      return updated;
    }),

  /**
   * Archive payee
   *
   * Soft delete - sets archived flag to true.
   */
  archive: publicProcedure.input(archivePayeeSchema).mutation(async ({ input }) => {
    const [payee] = await db
      .update(payees)
      .set({ archived: true })
      .where(eq(payees.id, input.id))
      .returning();

    if (!payee) {
      throw new Error('Payee not found');
    }

    return payee;
  }),

  /**
   * Unarchive payee
   */
  unarchive: publicProcedure.input(archivePayeeSchema).mutation(async ({ input }) => {
    const [payee] = await db
      .update(payees)
      .set({ archived: false })
      .where(eq(payees.id, input.id))
      .returning();

    if (!payee) {
      throw new Error('Payee not found');
    }

    return payee;
  }),
});
