/**
 * Payees Page
 *
 * Payee management with type filtering and CRUD operations.
 * Displays vendors and people with default category assignments.
 *
 * @module app/(dashboard)/payees/page
 */

'use client';

import { PayeeForm } from '@/components/payees/payee-form';
import { PayeeList } from '@/components/payees/payee-list';
import { ArchiveToggle } from '@/components/shared/archive-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc/react';
import type { CreatePayeeInput } from '@/lib/validations/payee';
import type { Payee } from '@/server/db/schema';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PayeesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPayee, setEditingPayee] = useState<Payee | undefined>();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'person' | 'vendor' | 'all'>('all');

  const utils = trpc.useUtils();

  // Fetch payees
  const { data: payees, isLoading } = trpc.payees.list.useQuery({
    type: typeFilter === 'all' ? undefined : typeFilter,
    includeArchived,
  });

  // Fetch categories for form
  const { data: categories } = trpc.categories.list.useQuery({ includeArchived: false });

  // Create mutation
  const createMutation = trpc.payees.create.useMutation({
    onSuccess: () => {
      toast.success('Payee created successfully');
      setDialogOpen(false);
      void utils.payees.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create payee');
    },
  });

  // Update mutation
  const updateMutation = trpc.payees.update.useMutation({
    onSuccess: () => {
      toast.success('Payee updated successfully');
      setDialogOpen(false);
      setEditingPayee(undefined);
      void utils.payees.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update payee');
    },
  });

  // Archive mutation
  const archiveMutation = trpc.payees.archive.useMutation({
    onSuccess: () => {
      toast.success('Payee archived');
      void utils.payees.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to archive payee');
    },
  });

  // Unarchive mutation
  const unarchiveMutation = trpc.payees.unarchive.useMutation({
    onSuccess: () => {
      toast.success('Payee restored');
      void utils.payees.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to restore payee');
    },
  });

  const handleSubmit = (data: CreatePayeeInput) => {
    if (editingPayee) {
      updateMutation.mutate({
        id: editingPayee.id,
        data: {
          name: data.name,
          type: data.type,
          defaultCategoryId: data.defaultCategoryId,
        },
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (payee: Payee) => {
    setEditingPayee(payee);
    setDialogOpen(true);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingPayee(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Payees</h1>
          <p className="text-white/70 mt-2">Manage vendors and people you transact with</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Payee
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter payees by type and archived status</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="w-48">
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as 'person' | 'vendor' | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="vendor">Vendors</SelectItem>
                <SelectItem value="person">People</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ArchiveToggle showArchived={includeArchived} onToggle={setIncludeArchived} />
        </CardContent>
      </Card>

      {/* Payees List */}
      <Card>
        <CardHeader>
          <CardTitle>All Payees</CardTitle>
          <CardDescription>
            {payees?.length ?? 0} {typeFilter === 'all' ? '' : typeFilter} payees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-white/70">Loading payees...</div>
          ) : (
            <PayeeList
              payees={payees ?? []}
              onEdit={handleEdit}
              onArchive={(id) => archiveMutation.mutate({ id })}
              onUnarchive={(id) => unarchiveMutation.mutate({ id })}
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPayee ? 'Edit Payee' : 'Create Payee'}</DialogTitle>
            <DialogDescription>
              {editingPayee
                ? 'Update payee details and default category assignment.'
                : 'Add a new payee to organize your transactions.'}
            </DialogDescription>
          </DialogHeader>
          <PayeeForm
            payee={editingPayee}
            categories={categories ?? []}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
