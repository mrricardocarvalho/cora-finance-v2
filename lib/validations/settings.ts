/**
 * Settings Validation Schemas
 *
 * Zod schemas for application settings (singleton record).
 * Validates theme, default currency, and AI feature toggles.
 *
 * @module lib/validations/settings
 */

import { z } from 'zod';

/**
 * Theme enum values
 */
const themeValues = ['light', 'dark', 'auto'] as const;

/**
 * Update settings input schema
 *
 * All fields optional - only update what's provided.
 * Get operation has no input (returns singleton).
 */
export const updateSettingsSchema = z.object({
  defaultCurrencyId: z.string().uuid('Invalid currency ID').optional(),
  theme: z.enum(themeValues).optional(),
  aiEnabled: z.boolean().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

/**
 * Settings response type includes all fields
 */
export type SettingsResponse = {
  id: string;
  defaultCurrencyId: string;
  theme: (typeof themeValues)[number];
  aiEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};
