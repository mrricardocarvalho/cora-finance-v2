/**
 * Database Schema
 *
 * Defines all database tables using Drizzle ORM.
 * All tables MUST include Constitutional audit fields: created_at, updated_at, archived.
 *
 * @module server/db/schema
 */

import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

/**
 * System Health Table
 *
 * Example table demonstrating database connectivity for Foundation Phase.
 * Used by health check endpoint to verify database access.
 *
 * Constitutional compliance:
 * - ✅ created_at: Audit field (timestamp with timezone)
 * - ✅ updated_at: Audit field (auto-updates on modification)
 * - ✅ archived: Soft delete flag (boolean default false)
 */
export const systemHealth = pgTable('system_health', {
  id: serial('id').primaryKey(),

  status: text('status').notNull(),
  message: text('message'),
  checkedAt: timestamp('checked_at', {
    withTimezone: true,
    mode: 'date',
  })
    .notNull()
    .defaultNow(),

  // Constitutional audit fields
  archived: boolean('archived').notNull().default(false),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/**
 * Inferred Types
 *
 * TypeScript types automatically derived from schema.
 * Used for type-safe database queries and inserts.
 */
export type SystemHealth = typeof systemHealth.$inferSelect;
export type NewSystemHealth = typeof systemHealth.$inferInsert;
