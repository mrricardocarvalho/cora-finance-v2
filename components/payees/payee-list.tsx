/**
 * Payee List Component
 *
 * Displays payees in a table with type and category information.
 * Supports edit, archive, and type filtering.
 *
 * @module components/payees/payee-list
 */

'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Category, Payee } from '@/server/db/schema';
import { Archive, ArchiveRestore, Edit2 } from 'lucide-react';

interface PayeeWithCategory extends Payee {
  category: Category | null;
}

interface PayeeListProps {
  payees: PayeeWithCategory[];
  onEdit: (payee: Payee) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
}

/**
 * Payee list table component
 *
 * Usage:
 * ```tsx
 * <PayeeList
 *   payees={payees}
 *   onEdit={(payee) => { setEditingPayee(payee); setDialogOpen(true); }}
 *   onArchive={(id) => archiveMutation.mutate({ id })}
 *   onUnarchive={(id) => unarchiveMutation.mutate({ id })}
 * />
 * ```
 */
export function PayeeList({ payees, onEdit, onArchive, onUnarchive }: PayeeListProps) {
  if (payees.length === 0) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
        <p className="text-white/70">No payees found. Create your first payee to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payees.map((payee) => (
            <TableRow key={payee.id} className={payee.archived ? 'opacity-50' : ''}>
              <TableCell className="font-medium">{payee.name}</TableCell>
              <TableCell>
                <span className="capitalize">{payee.type === 'vendor' ? 'Vendor' : 'Person'}</span>
              </TableCell>
              <TableCell>
                {payee.category ? (
                  <span className="text-sm text-white/70">{payee.category.name}</span>
                ) : (
                  <span className="text-sm text-white/40">None</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(payee)}
                    disabled={payee.archived}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {payee.archived ? (
                    <Button variant="ghost" size="sm" onClick={() => onUnarchive(payee.id)}>
                      <ArchiveRestore className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => onArchive(payee.id)}>
                      <Archive className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
