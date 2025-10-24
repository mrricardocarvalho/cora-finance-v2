/**
 * Currency List Component
 *
 * Table displaying all currencies with exchange rates.
 * Highlights EUR (base currency) and shows last updated timestamps.
 *
 * @module components/currencies/currency-list
 */

'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Currency } from '@/server/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { Archive, ArchiveRestore, Pencil } from 'lucide-react';

interface CurrencyListProps {
  currencies: Currency[];
  onEdit: (currency: Currency) => void;
  onArchive: (currency: Currency) => void;
  onUnarchive: (currency: Currency) => void;
}

/**
 * Currency list table with EUR highlighted
 *
 * Usage:
 * ```tsx
 * <CurrencyList
 *   currencies={data}
 *   onEdit={(c) => setEditCurrency(c)}
 *   onArchive={(c) => archiveMutation.mutate(c.id)}
 *   onUnarchive={(c) => unarchiveMutation.mutate(c.id)}
 * />
 * ```
 */
export function CurrencyList({ currencies, onEdit, onArchive, onUnarchive }: CurrencyListProps) {
  if (currencies.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No currencies found. Create your first currency to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Exchange Rate</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currencies.map((currency) => {
            const isEUR = currency.code === 'EUR';
            return (
              <TableRow key={currency.id} className={isEUR ? 'bg-sky-500/10' : undefined}>
                <TableCell className="font-mono font-semibold">
                  {currency.code}
                  {isEUR && <span className="ml-2 text-xs text-sky-500">(Base)</span>}
                </TableCell>
                <TableCell>{currency.symbol}</TableCell>
                <TableCell>{currency.name}</TableCell>
                <TableCell className="font-mono">
                  {parseFloat(currency.exchangeRate).toFixed(6)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(currency.lastUpdated, { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(currency)}
                      className="hover:bg-white/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {currency.archived ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUnarchive(currency)}
                        className="hover:bg-white/10"
                      >
                        <ArchiveRestore className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onArchive(currency)}
                        className="hover:bg-white/10"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
