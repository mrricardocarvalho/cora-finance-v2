/**
 * Account Card Component
 *
 * Displays account summary with balance, type icon, and currency.
 * Used in dashboard and account list views.
 *
 * @module components/accounts/account-card
 */

'use client';

import { CurrencyDisplay } from '@/components/shared/currency-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ACCOUNT_TYPE_OPTIONS } from '@/lib/constants/account-types';
import type { Account, Currency } from '@/server/db/schema';
import * as LucideIcons from 'lucide-react';

interface AccountCardProps {
  account: Account;
  currency: Currency | null;
  onClick?: () => void;
}

/**
 * Account summary card with balance and type
 *
 * Usage:
 * ```tsx
 * <AccountCard
 *   account={account}
 *   currency={currency}
 *   onClick={() => router.push(`/accounts/${account.id}`)}
 * />
 * ```
 */
export function AccountCard({ account, currency, onClick }: AccountCardProps) {
  const typeMetadata = ACCOUNT_TYPE_OPTIONS.find((opt) => opt.value === account.type);
  const IconComponent = typeMetadata
    ? (LucideIcons[typeMetadata.icon as keyof typeof LucideIcons] as React.ComponentType<{
        className?: string;
      }>)
    : null;

  return (
    <Card
      className={`cursor-pointer transition-all hover:border-sky-500/50 ${
        account.archived ? 'opacity-50' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
        {IconComponent && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20">
            <IconComponent className="h-4 w-4 text-sky-400" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currency ? (
            <CurrencyDisplay amountCents={account.balance} currencySymbol={currency.symbol} />
          ) : (
            <span className="text-white/50">-</span>
          )}
        </div>
        <p className="text-xs text-white/50 mt-1">
          {typeMetadata?.label} • {currency?.code ?? 'Unknown'}
        </p>
      </CardContent>
    </Card>
  );
}
