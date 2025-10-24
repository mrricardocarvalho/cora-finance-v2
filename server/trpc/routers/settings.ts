/**
 * Settings tRPC Router
 *
 * API endpoints for application settings (singleton).
 * Auto-creates settings record on first access if missing.
 *
 * @module server/trpc/routers/settings
 */

import { updateSettingsSchema } from '@/lib/validations/settings';
import { db } from '@/server/db';
import { currencies, settings } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { publicProcedure, router } from '../init';

export const settingsRouter = router({
  /**
   * Get settings (auto-creates if not exists)
   *
   * Returns singleton settings record.
   * Creates default settings with EUR currency if missing.
   */
  get: publicProcedure.query(async () => {
    // Try to get existing settings
    const [existingSettings] = await db.select().from(settings).limit(1);

    if (existingSettings) {
      return existingSettings;
    }

    // Auto-create settings if missing
    // Find EUR currency (should exist from seed)
    const [eurCurrency] = await db
      .select()
      .from(currencies)
      .where(eq(currencies.code, 'EUR'))
      .limit(1);

    if (!eurCurrency) {
      throw new Error(
        'Cannot create default settings: EUR currency not found. Please seed database first.'
      );
    }

    // Create default settings
    const [newSettings] = await db
      .insert(settings)
      .values({
        defaultCurrencyId: eurCurrency.id,
        theme: 'light',
        aiEnabled: true,
      })
      .returning();

    return newSettings;
  }),

  /**
   * Update settings
   *
   * Updates the singleton settings record.
   * Validates currency exists if defaultCurrencyId is provided.
   */
  update: publicProcedure.input(updateSettingsSchema).mutation(async ({ input }) => {
    // Get current settings (auto-creates if needed)
    const [currentSettings] = await db.select().from(settings).limit(1);

    if (!currentSettings) {
      throw new Error('Settings not found. Please refresh and try again.');
    }

    // If changing currency, validate it exists and is not archived
    if (input.defaultCurrencyId) {
      const [currency] = await db
        .select()
        .from(currencies)
        .where(eq(currencies.id, input.defaultCurrencyId))
        .limit(1);

      if (!currency) {
        throw new Error('Selected currency not found');
      }

      if (currency.archived) {
        throw new Error('Cannot set archived currency as default');
      }
    }

    // Update settings
    const [updated] = await db
      .update(settings)
      .set(input)
      .where(eq(settings.id, currentSettings.id))
      .returning();

    return updated;
  }),
});
