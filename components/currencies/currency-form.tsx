/**
 * Currency Form Component
 *
 * Form for creating and editing currencies with ISO 4217 validation.
 * Uses React Hook Form + Zod for type-safe validation.
 *
 * @module components/currencies/currency-form
 */

'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createCurrencySchema, type CreateCurrencyInput } from '@/lib/validations/currency';
import type { Currency } from '@/server/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface CurrencyFormProps {
  currency?: Currency;
  onSubmit: (data: CreateCurrencyInput) => void;
  onCancel: () => void;
}

/**
 * Currency creation/edit form with ISO 4217 validation
 *
 * Usage:
 * ```tsx
 * <CurrencyForm
 *   onSubmit={(data) => createCurrency.mutate(data)}
 *   onCancel={() => setIsOpen(false)}
 * />
 * ```
 */
export function CurrencyForm({ currency, onSubmit, onCancel }: CurrencyFormProps) {
  const form = useForm<CreateCurrencyInput>({
    resolver: zodResolver(createCurrencySchema),
    defaultValues: {
      code: currency?.code ?? '',
      symbol: currency?.symbol ?? '',
      name: currency?.name ?? '',
      exchangeRate: currency?.exchangeRate ? parseFloat(currency.exchangeRate) : 1.0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Currency Code <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="EUR"
                  maxLength={3}
                  disabled={!!currency}
                  className="uppercase"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Symbol <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="€" maxLength={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Euro" maxLength={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="exchangeRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exchange Rate (to EUR)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.000001"
                  min="0"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-sky-500 hover:bg-sky-600">
            {currency ? 'Update' : 'Create'} Currency
          </Button>
        </div>
      </form>
    </Form>
  );
}
