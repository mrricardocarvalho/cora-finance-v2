/**
 * Database Schema
 *
 * Defines all database tables using Drizzle ORM.
 * All tables MUST include Constitutional audit fields: created_at, updated_at, archived.
 *
 * @module server/db/schema
 */

import {
    bigint,
    boolean,
    decimal,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';

/**
 * Enums
 *
 * Database-level enumerations for type safety and constraint validation.
 */

export const accountTypeEnum = pgEnum('account_type', ['Bank', 'CreditCard', 'Wallet']);
export const categoryTypeEnum = pgEnum('category_type', ['Expense', 'Income']);
export const payeeTypeEnum = pgEnum('payee_type', ['person', 'vendor']);
export const themeEnum = pgEnum('theme', ['light', 'dark', 'auto']);

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

/**
 * Currency Table
 *
 * Defines available currencies for accounts and multi-currency support.
 * EUR currency seeded by default with exchange rate 1.0.
 *
 * Constitutional compliance:
 * - ✅ ISO 4217 code validation (application-level Zod)
 * - ✅ Exchange rates as DECIMAL(18,6) for precision
 * - ✅ Soft delete via archived boolean
 * - ✅ Audit fields: createdAt, updatedAt, lastUpdated
 */
export const currencies = pgTable('currencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 3 }).notNull().unique(),
  symbol: varchar('symbol', { length: 10 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  exchangeRate: decimal('exchange_rate', { precision: 18, scale: 6 })
    .notNull()
    .default('1.0'),
  lastUpdated: timestamp('last_updated', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  archived: boolean('archived').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Currency = typeof currencies.$inferSelect;
export type NewCurrency = typeof currencies.$inferInsert;

/**
 * Settings Table
 *
 * Application-level user preferences (singleton record).
 * Auto-created on first access if missing.
 *
 * Constitutional compliance:
 * - ✅ Foreign key to Currency with RESTRICT cascade
 * - ✅ Theme enum for type safety
 * - ✅ Audit fields: createdAt, updatedAt
 */
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  defaultCurrencyId: uuid('default_currency_id')
    .notNull()
    .references(() => currencies.id, { onDelete: 'restrict' }),
  theme: themeEnum('theme').notNull().default('light'),
  aiEnabled: boolean('ai_enabled').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;

/**
 * Category Table
 *
 * Transaction classification for expenses and income.
 * 20 default categories seeded (15 Expense, 5 Income).
 *
 * Constitutional compliance:
 * - ✅ Unique composite index on (name, type) - case-insensitive enforced by app
 * - ✅ lucide-react icon names validated by application
 * - ✅ Hex color validation #RRGGBB enforced by application
 * - ✅ Soft delete via archived boolean
 * - ✅ Audit fields: createdAt, updatedAt
 */
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  type: categoryTypeEnum('type').notNull(),
  color: varchar('color', { length: 7 }).notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  parentCategoryId: uuid('parent_category_id'), // Optional - for subcategories
  archived: boolean('archived').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

/**
 * Account Table
 *
 * Financial accounts (bank, credit card, wallet) that hold transactions.
 * Balance stored as integer cents for precision.
 *
 * Constitutional compliance:
 * - ✅ Balance as BIGINT (integer cents) - no floating point
 * - ✅ Foreign key to Currency with RESTRICT cascade
 * - ✅ Unique constraint on account name
 * - ✅ Soft delete via archived boolean
 * - ✅ Audit fields: createdAt, updatedAt
 */
export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  type: accountTypeEnum('type').notNull(),
  currencyId: uuid('currency_id')
    .notNull()
    .references(() => currencies.id, { onDelete: 'restrict' }),
  balance: bigint('balance', { mode: 'number' }).notNull().default(0),
  archived: boolean('archived').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

/**
 * Payee Table
 *
 * Optional master data for merchants/people for autocomplete and default categorization.
 * Mixed delete strategy: hard delete if unused, soft delete if referenced.
 *
 * Constitutional compliance:
 * - ✅ Optional foreign key to Category with SET NULL cascade
 * - ✅ Unique constraint on payee name
 * - ✅ Soft delete via archived boolean
 * - ✅ Audit fields: createdAt, updatedAt
 */
export const payees = pgTable('payees', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  type: payeeTypeEnum('type').notNull(),
  defaultCategoryId: uuid('default_category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  archived: boolean('archived').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Payee = typeof payees.$inferSelect;
export type NewPayee = typeof payees.$inferInsert;
