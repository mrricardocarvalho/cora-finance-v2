/**
 * Category Form Component
 *
 * Form for creating and editing categories with icon/color pickers.
 * Uses React Hook Form + Zod for type-safe validation.
 *
 * @module components/categories/category-form
 */

'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createCategorySchema, type CreateCategoryInput } from '@/lib/validations/category';
import type { Category } from '@/server/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IconPicker } from './icon-picker';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryInput) => void;
  onCancel: () => void;
}

/**
 * Category creation/edit form with icon and color pickers
 *
 * Usage:
 * ```tsx
 * <CategoryForm
 *   onSubmit={(data) => createCategory.mutate(data)}
 *   onCancel={() => setIsOpen(false)}
 * />
 * ```
 */
export function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name ?? '',
      type: category?.type ?? 'Expense',
      color: category?.color ?? '#3b82f6',
      icon: category?.icon ?? 'ShoppingCart',
      parentCategoryId: category?.parentCategoryId ?? undefined,
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
                Category Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Groceries" maxLength={100} />
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
              <Select value={field.value} onValueChange={field.onChange} disabled={!!category}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Icon <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <IconPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Color <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    type="color"
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    placeholder="#3B82F6"
                    maxLength={7}
                    className="flex-1 uppercase"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{category ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Form>
  );
}
