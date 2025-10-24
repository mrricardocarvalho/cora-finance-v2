/**
 * Account Form Component
 *
 * Form for creating and editing accounts.
 * Uses React Hook Form + Zod for type-safe validation.
 *
 * @module components/accounts/account-form
 */

'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ACCOUNT_TYPE_OPTIONS } from '@/lib/constants/account-types';
import { createAccountSchema, type CreateAccountInput } from '@/lib/validations/account';
import type { Account, Currency } from '@/server/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Decimal from 'decimal.js';
import { useForm } from 'react-hook-form';

interface AccountFormProps {
  account?: Account;
  currencies: Currency[];
  defaultCurrencyId?: string;
  onSubmit: (data: CreateAccountInput) => void;
  onCancel: () => void;
}

/**
 * Account creation/edit form
 *
 * Usage:
 * ```tsx
 * <AccountForm
 *   currencies={currencies}
 *   defaultCurrencyId={defaultCurrencyId}
 *   onSubmit={(data) => createAccount.mutate(data)}
 *   onCancel={() => setIsOpen(false)}
 * />
 * ```
 */
export function AccountForm({
  account,
  currencies,
  defaultCurrencyId,
  onSubmit,
  onCancel,
}: AccountFormProps) {
  const form = useForm<CreateAccountInput>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: account?.name ?? '',
      type: account?.type ?? 'Bank',
      currencyId: account?.currencyId ?? defaultCurrencyId ?? '',
      initialBalance: account?.balance ?? 0,
    },
  });

  const handleSubmit = (data: CreateAccountInput) => {
    // Convert decimal to cents if needed
    const balanceCents =
      typeof data.initialBalance === 'number'
        ? Math.round(data.initialBalance)
        : Math.round(new Decimal(data.initialBalance).times(100).toNumber());

    onSubmit({
      ...data,
      initialBalance: balanceCents,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Account Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="My Checking Account" maxLength={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Account Type <span className="text-red-500">*</span>
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={!!account}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ACCOUNT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>{ACCOUNT_TYPE_OPTIONS.find(opt => opt.value === field.value)?.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currencyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Currency <span className="text-red-500">*</span>
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={!!account}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Cannot be changed after account creation</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="initialBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Initial Balance <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  onChange={(e) => field.onChange(parseFloat(e.target.value) * 100)}
                  value={field.value ? (field.value / 100).toFixed(2) : ''}
                />
              </FormControl>
              <FormDescription>Enter amount in decimal format (e.g., 1000.00)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{account ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Form>
  );
}
