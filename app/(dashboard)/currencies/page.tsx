/**
 * Currencies Page
 *
 * Manage currencies with CRUD operations.
 * Configure exchange rates and set base currency (EUR).
 *
 * @module app/(dashboard)/currencies/page
 */

'use client';

import { CurrencyForm } from '@/components/currencies/currency-form';
import { CurrencyList } from '@/components/currencies/currency-list';
import { ArchiveToggle } from '@/components/shared/archive-toggle';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc/react';
import type { CreateCurrencyInput } from '@/lib/validations/currency';
import type { Currency } from '@/server/db/schema';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CurrenciesPage() {
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

  const utils = trpc.useUtils();

  // Queries
  const { data: currencies = [], isLoading } = trpc.currencies.list.useQuery({
    includeArchived: showArchived,
  });

  // Mutations
  const createMutation = trpc.currencies.create.useMutation({
    onSuccess: () => {
      toast.success('Currency created successfully');
      utils.currencies.list.invalidate();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = trpc.currencies.update.useMutation({
    onSuccess: () => {
      toast.success('Currency updated successfully');
      utils.currencies.list.invalidate();
      setIsDialogOpen(false);
      setEditingCurrency(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const archiveMutation = trpc.currencies.archive.useMutation({
    onSuccess: () => {
      toast.success('Currency archived');
      utils.currencies.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const unarchiveMutation = trpc.currencies.unarchive.useMutation({
    onSuccess: () => {
      toast.success('Currency restored');
      utils.currencies.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: CreateCurrencyInput) => {
    if (editingCurrency) {
      updateMutation.mutate({
        id: editingCurrency.id,
        ...data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCurrency(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Currencies</h1>
          <p className="text-muted-foreground mt-1">
            Manage currencies and exchange rates for multi-currency support
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-sky-500 hover:bg-sky-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Currency
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <ArchiveToggle showArchived={showArchived} onToggle={setShowArchived} />
        <p className="text-sm text-muted-foreground">
          {currencies.length} {currencies.length === 1 ? 'currency' : 'currencies'}
        </p>
      </div>

      {/* Currency List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading currencies...</div>
      ) : (
        <CurrencyList
          currencies={currencies}
          onEdit={handleEdit}
          onArchive={(c) => archiveMutation.mutate({ id: c.id })}
          onUnarchive={(c) => unarchiveMutation.mutate({ id: c.id })}
        />
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCurrency ? 'Edit Currency' : 'Add Currency'}</DialogTitle>
          </DialogHeader>
          <CurrencyForm
            currency={editingCurrency ?? undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
