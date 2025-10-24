/**
 * Accounts Page
 *
 * Account management with type filtering and CRUD operations.
 * Displays accounts in a grid with balance summaries.
 *
 * @module app/(dashboard)/accounts/page
 */

'use client';

import { AccountForm } from '@/components/accounts/account-form';
import { AccountList } from '@/components/accounts/account-list';
import { ArchiveToggle } from '@/components/shared/archive-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc/react';
import type { CreateAccountInput } from '@/lib/validations/account';
import type { Account } from '@/server/db/schema';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AccountsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'Bank' | 'CreditCard' | 'Wallet' | 'all'>('all');

  const utils = trpc.useUtils();

  // Fetch accounts
  const { data: accounts, isLoading } = trpc.accounts.list.useQuery({
    type: typeFilter === 'all' ? undefined : typeFilter,
    includeArchived,
  });

  // Fetch currencies for form
  const { data: currencies } = trpc.currencies.list.useQuery({ includeArchived: false });

  // Fetch default currency
  const { data: defaultCurrencyId } = trpc.accounts.getDefaultCurrency.useQuery();

  // Create mutation
  const createMutation = trpc.accounts.create.useMutation({
    onSuccess: () => {
      toast.success('Account created successfully');
      setDialogOpen(false);
      void utils.accounts.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create account');
    },
  });

  // Update mutation
  const updateMutation = trpc.accounts.update.useMutation({
    onSuccess: () => {
      toast.success('Account updated successfully');
      setDialogOpen(false);
      setEditingAccount(undefined);
      void utils.accounts.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update account');
    },
  });

  const handleSubmit = (data: CreateAccountInput) => {
    if (editingAccount) {
      updateMutation.mutate({
        id: editingAccount.id,
        data: {
          name: data.name,
          type: data.type,
        },
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setDialogOpen(true);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingAccount(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Accounts</h1>
          <p className="text-white/70 mt-2">Manage your bank accounts, credit cards, and wallets</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Account
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter accounts by type and archived status</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="w-48">
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as 'Bank' | 'CreditCard' | 'Wallet' | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Bank">Bank Account</SelectItem>
                <SelectItem value="CreditCard">Credit Card</SelectItem>
                <SelectItem value="Wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ArchiveToggle showArchived={includeArchived} onToggle={setIncludeArchived} />
        </CardContent>
      </Card>

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
          <CardDescription>
            {accounts?.length ?? 0} {typeFilter === 'all' ? '' : typeFilter.toLowerCase()} accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-white/70">Loading accounts...</div>
          ) : (
            <AccountList accounts={accounts ?? []} onEdit={handleEdit} />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'Edit Account' : 'Create Account'}</DialogTitle>
            <DialogDescription>
              {editingAccount
                ? 'Update account details. Currency cannot be changed after creation.'
                : 'Add a new account to track your finances.'}
            </DialogDescription>
          </DialogHeader>
          <AccountForm
            account={editingAccount}
            currencies={currencies ?? []}
            defaultCurrencyId={defaultCurrencyId}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
