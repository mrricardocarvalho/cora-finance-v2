/**
 * Root Layout
 *
 * Global application layout with Liquid Glass design system.
 * Wraps all pages with providers and gradient background.
 *
 * @module app/layout
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TRPCProvider } from '@/lib/trpc/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Cora Finance v2',
  description: 'Personal finance management application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={inter.variable}>
      <body className="min-h-screen bg-gradient-to-br from-gradient-start to-gradient-end antialiased">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
