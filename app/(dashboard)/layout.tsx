/**
 * Dashboard Layout
 *
 * Nested layout for dashboard routes with Liquid Glass navigation sidebar.
 * Provides consistent navigation across all CRUD screens.
 *
 * @module app/(dashboard)/layout
 */

'use client';

import { cn } from '@/lib/utils';
import {
    Coins,
    FolderKanban,
    LayoutDashboard,
    Settings,
    Users,
    Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Accounts', href: '/accounts', icon: Wallet },
  { name: 'Categories', href: '/categories', icon: FolderKanban },
  { name: 'Payees', href: '/payees', icon: Users },
  { name: 'Currencies', href: '/currencies', icon: Coins },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <h1 className="text-xl font-bold text-sky-500">Cora Finance</h1>
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
