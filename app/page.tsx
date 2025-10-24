/**
 * Homepage
 *
 * Displays "Hello Cora Finance" with Liquid Glass UI and health check status.
 * Demonstrates tRPC integration and Liquid Glass design system.
 *
 * @module app/page
 */

'use client';

import { trpc } from '@/lib/trpc/react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const {
    data: health,
    isLoading,
    error,
  } = trpc.health.check.useQuery({
    includeDetails: true,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card rounded-2xl p-12 max-w-2xl w-full space-y-6"
      >
        <h1 className="text-5xl font-bold text-sky-600">Hello Cora Finance</h1>

        <p className="text-lg text-foreground/80">
          Welcome to your personal finance management application.
        </p>

        <div className="border-t border-white/20 pt-6 space-y-4">
          <h2 className="text-2xl font-semibold text-purple-600">
            System Health
          </h2>

          {isLoading && (
            <p className="text-foreground/60">Checking health...</p>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive font-medium">
                Error: {error.message}
              </p>
            </div>
          )}

          {health && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    health.status === 'healthy'
                      ? 'bg-green-500'
                      : health.status === 'degraded'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                />
                <span className="text-lg font-medium capitalize">
                  {health.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="glass-card rounded-lg p-4">
                  <p className="text-foreground/60 mb-1">Database</p>
                  <p className="font-medium">
                    {health.database.connected ? 'Connected' : 'Offline'}
                  </p>
                  {health.database.latency && (
                    <p className="text-xs text-foreground/50 mt-1">
                      {health.database.latency}ms latency
                    </p>
                  )}
                </div>

                <div className="glass-card rounded-lg p-4">
                  <p className="text-foreground/60 mb-1">Server Uptime</p>
                  <p className="font-medium">
                    {Math.floor(health.server.uptime)}s
                  </p>
                  <p className="text-xs text-foreground/50 mt-1">
                    {health.server.environment}
                  </p>
                </div>
              </div>

              <p className="text-xs text-foreground/40">
                Last checked:{' '}
                {new Date(health.timestamp).toLocaleString('pt-PT')}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
