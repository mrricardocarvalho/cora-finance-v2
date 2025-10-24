/**
 * Payee Form Component
 *
 * Form for creating and editing payees/payers.
 * Uses React Hook Form + Zod for type-safe validation.
 *
 * @module components/payees/payee-form
 */

'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPayeeSchema, type CreatePayeeInput } from '@/lib/validations/payee';
import type { Category, Payee } from '@/server/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface PayeeFormProps {
  payee?: Payee;
  categories: Category[];
  onSubmit: (data: CreatePayeeInput) => void;
  onCancel: () => void;
}

/**
 * Payee creation/edit form
 *
 * Usage:
 * ```tsx
 * <PayeeForm
 *   categories={categories}
 *   onSubmit={(data) => createPayee.mutate(data)}
 *   onCancel={() => setIsOpen(false)}
 * />
 * ```
 */
export function PayeeForm({ payee, categories, onSubmit, onCancel }: PayeeFormProps) {
  const form = useForm<CreatePayeeInput>({
    resolver: zodResolver(createPayeeSchema),
    defaultValues: {
      name: payee?.name ?? '',
      type: payee?.type ?? 'vendor',
      defaultCategoryId: payee?.defaultCategoryId ?? undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Payee Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Amazon" maxLength={100} />
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
                Type <span className="text-red-500">*</span>
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="vendor">Vendor/Merchant</SelectItem>
                  <SelectItem value="person">Person</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Category</FormLabel>
              <Select
                value={field.value ?? 'none'}
                onValueChange={(value) => field.onChange(value === 'none' ? undefined : value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No default category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Auto-categorize transactions with this payee</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{payee ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Form>
  );
}
