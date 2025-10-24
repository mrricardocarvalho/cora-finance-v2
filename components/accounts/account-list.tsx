/**
 * Account List Component
 *
 * Displays accounts in a grid of cards.
 * Supports edit, archive, and type filtering.
 *
 * @module components/accounts/account-list
 */

'use client';

import type { Account, Currency } from '@/server/db/schema';
import { AccountCard } from './account-card';

interface AccountWithCurrency extends Account {
  currency: Currency | null;
}

interface AccountListProps {
  accounts: AccountWithCurrency[];
  onEdit: (account: Account) => void;
}

/**
 * Account list grid component
 *
 * Usage:
 * ```tsx
 * <AccountList
 *   accounts={accounts}
 *   onEdit={(acc) => { setEditingAccount(acc); setDialogOpen(true); }}
 * />
 * ```
 */
export function AccountList({ accounts, onEdit }: AccountListProps) {
  if (accounts.length === 0) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
        <p className="text-white/70">No accounts found. Create your first account to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          currency={account.currency}
          onClick={() => onEdit(account)}
        />
      ))}
    </div>
  );
}
