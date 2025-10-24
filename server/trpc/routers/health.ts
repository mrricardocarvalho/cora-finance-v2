/**
 * Health Check Router
 *
 * Provides health check endpoint to verify server and database connectivity.
 * Demonstrates tRPC procedure definition, Zod validation, and database queries.
 *
 * @module server/trpc/routers/health
 */

import { z } from 'zod';
import { router, publicProcedure } from '../init';
import { db } from '@/server/db';
import { systemHealth } from '@/server/db/schema';
import { count } from 'drizzle-orm';

export const healthRouter = router({
  /**
   * Health Check Procedure
   *
   * Returns server status, uptime, and database connectivity.
   * Optional: Include detailed database metrics.
   *
   * @input includeDetails - Whether to include database latency and record count
   * @input message - Optional message to echo back (for testing)
   * @output status - healthy | degraded | unhealthy
   * @output server - Server metadata (uptime, version, environment)
   * @output database - Database connection status and optional metrics
   */
  check: publicProcedure
    .input(
      z
        .object({
          includeDetails: z.boolean().optional().default(false),
          message: z.string().optional(),
        })
        .optional()
    )
    .output(
      z.object({
        status: z.enum(['healthy', 'degraded', 'unhealthy']),
        timestamp: z.date(),
        server: z.object({
          uptime: z.number(),
          nodeVersion: z.string(),
          environment: z.string(),
        }),
        database: z.object({
          connected: z.boolean(),
          latency: z.number().optional(),
          recordCount: z.number().optional(),
        }),
        message: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const timestamp = new Date();

      // Server info
      const server = {
        uptime: process.uptime(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
      };

      // Database check
      let database: {
        connected: boolean;
        latency?: number;
        recordCount?: number;
      };

      try {
        const queryStart = Date.now();
        const result = await db.select({ count: count() }).from(systemHealth);
        const latency = Date.now() - queryStart;

        database = {
          connected: true,
          ...(input?.includeDetails && {
            latency,
            recordCount: result[0]?.count || 0,
          }),
        };
      } catch (error) {
        database = {
          connected: false,
        };
      }

      // Determine status
      const status = database.connected
        ? database.latency && database.latency > 100
          ? 'degraded'
          : 'healthy'
        : 'unhealthy';

      return {
        status,
        timestamp,
        server,
        database,
        ...(input?.message && { message: input.message }),
      };
    }),
});
