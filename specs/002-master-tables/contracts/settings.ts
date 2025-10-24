/**
 * API Contract: Settings
 * 
 * tRPC router for application settings (singleton record).
 * Settings are auto-created on first access with sensible defaults.
 */

import { z } from 'zod';

/**
 * Input Schemas
 */

export const updateSettingsSchema = z.object({
  defaultCurrencyId: z.string().uuid().optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  aiEnabled: z.boolean().optional(),
});

/**
 * Output Types
 */

export type Settings = {
  id: string;
  defaultCurrencyId: string;
  theme: 'light' | 'dark' | 'auto';
  aiEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * tRPC Procedures
 */

export const settingsRouter = {
  /**
   * Get current settings (auto-creates with defaults if not exists)
   * 
   * Defaults:
   * - defaultCurrencyId: EUR currency ID
   * - theme: 'light'
   * - aiEnabled: true
   * 
   * @input none
   * @output Settings
   */
  get: {
    input: z.void(),
    output: z.custom<Settings>(),
  },

  /**
   * Update settings
   * 
   * @input updateSettingsSchema
   * @output Settings
   * @errors
   *   - BAD_REQUEST: Invalid currency ID
   *   - BAD_REQUEST: Currency is archived
   */
  update: {
    input: updateSettingsSchema,
    output: z.custom<Settings>(),
  },
};

/**
 * Example Usage (Client)
 * 
 * ```typescript
 * // Get current settings
 * const settings = await trpc.settings.get.query();
 * 
 * // Update theme
 * const updated = await trpc.settings.update.mutate({
 *   theme: 'dark',
 * });
 * 
 * // Enable AI features
 * const withAI = await trpc.settings.update.mutate({
 *   aiEnabled: true,
 * });
 * ```
 */
