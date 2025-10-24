/**
 * Database Connection
 *
 * Configures PostgreSQL connection with Drizzle ORM.
 * Uses connection pooling for performance (min: 5, max: 20 connections).
 *
 * @module server/db/index
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Validate DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not defined in environment variables. ' +
      'Please copy .env.example to .env.local and configure your database connection.'
  );
}

/**
 * PostgreSQL connection pool
 * Constitutional requirement: min 5, max 20 connections
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  min: 5,
  max: 20,
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 10000, // 10 seconds
});

/**
 * Drizzle database instance
 * Type-safe database access with full schema inference
 */
export const db = drizzle(pool, { schema });

/**
 * Graceful shutdown handler
 * Closes all database connections when process terminates
 */
process.on('SIGTERM', async () => {
  await pool.end();
});

process.on('SIGINT', async () => {
  await pool.end();
});
