/**
 * Categories tRPC Router
 *
 * API endpoints for category CRUD operations.
 * Supports hierarchical categories (parent-child relationships).
 *
 * @module server/trpc/routers/categories
 */

import {
    archiveCategorySchema,
    createCategorySchema,
    getCategoryByIdSchema,
    listCategoriesSchema,
    updateCategorySchema,
} from '@/lib/validations/category';
import { db } from '@/server/db';
import { categories } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { publicProcedure, router } from '../init';

export const categoriesRouter = router({
  /**
   * Create a new category
   *
   * Validates parent category exists and matches type if provided.
   */
  create: publicProcedure.input(createCategorySchema).mutation(async ({ input }) => {
    // Validate parent category if provided
    if (input.parentCategoryId) {
      const [parent] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.parentCategoryId))
        .limit(1);

      if (!parent) {
        throw new Error('Parent category not found');
      }

      if (parent.type !== input.type) {
        throw new Error('Parent category must have the same type (income/expense)');
      }

      if (parent.archived) {
        throw new Error('Cannot create subcategory under an archived category');
      }
    }

    const [category] = await db.insert(categories).values(input).returning();
    return category;
  }),

  /**
   * List categories with optional filtering
   *
   * Filter by type (income/expense) and archived status.
   * Returns all categories in flat structure (frontend handles hierarchy).
   */
  list: publicProcedure.input(listCategoriesSchema).query(async ({ input }) => {
    const conditions = [];

    if (input.type) {
      conditions.push(eq(categories.type, input.type));
    }

    if (!input.includeArchived) {
      conditions.push(eq(categories.archived, false));
    }

    const result = await db
      .select()
      .from(categories)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(categories.name);

    return result;
  }),

  /**
   * Get category by ID
   */
  getById: publicProcedure.input(getCategoryByIdSchema).query(async ({ input }) => {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, input.id))
      .limit(1);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }),

  /**
   * Update category
   *
   * Cannot change category type after creation.
   * Validates parent category if changed.
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: updateCategorySchema,
      })
    )
    .mutation(async ({ input }) => {
      const [existing] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id))
        .limit(1);

      if (!existing) {
        throw new Error('Category not found');
      }

      // Validate parent category if changed
      if (input.data.parentCategoryId !== undefined) {
        if (input.data.parentCategoryId === null) {
          // Removing parent - OK
        } else {
          const [parent] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, input.data.parentCategoryId))
            .limit(1);

          if (!parent) {
            throw new Error('Parent category not found');
          }

          if (parent.type !== existing.type) {
            throw new Error('Parent category must have the same type (income/expense)');
          }

          if (parent.archived) {
            throw new Error('Cannot set archived category as parent');
          }

          // Prevent circular reference
          if (parent.id === input.id) {
            throw new Error('Category cannot be its own parent');
          }
        }
      }

      const [updated] = await db
        .update(categories)
        .set(input.data)
        .where(eq(categories.id, input.id))
        .returning();

      return updated;
    }),

  /**
   * Archive category
   *
   * Soft delete - sets archived flag to true.
   */
  archive: publicProcedure.input(archiveCategorySchema).mutation(async ({ input }) => {
    const [category] = await db
      .update(categories)
      .set({ archived: true })
      .where(eq(categories.id, input.id))
      .returning();

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }),

  /**
   * Unarchive category
   */
  unarchive: publicProcedure.input(archiveCategorySchema).mutation(async ({ input }) => {
    const [category] = await db
      .update(categories)
      .set({ archived: false })
      .where(eq(categories.id, input.id))
      .returning();

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }),
});
