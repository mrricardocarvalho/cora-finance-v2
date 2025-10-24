/**
 * Categories Page
 *
 * Category management with type filtering and CRUD operations.
 * Displays income/expense categories with icon/color visual indicators.
 *
 * @module app/(dashboard)/categories/page
 */

'use client';

import { CategoryForm } from '@/components/categories/category-form';
import { CategoryList } from '@/components/categories/category-list';
import { ArchiveToggle } from '@/components/shared/archive-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc/react';
import type { CreateCategoryInput } from '@/lib/validations/category';
import type { Category } from '@/server/db/schema';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'Income' | 'Expense' | 'all'>('all');

  const utils = trpc.useUtils();

  // Fetch categories
  const { data: categories, isLoading } = trpc.categories.list.useQuery({
    type: typeFilter === 'all' ? undefined : typeFilter,
    includeArchived,
  });

  // Create mutation
  const createMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success('Category created successfully');
      setDialogOpen(false);
      void utils.categories.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category');
    },
  });

  // Update mutation
  const updateMutation = trpc.categories.update.useMutation({
    onSuccess: () => {
      toast.success('Category updated successfully');
      setDialogOpen(false);
      setEditingCategory(undefined);
      void utils.categories.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category');
    },
  });

  // Archive mutation
  const archiveMutation = trpc.categories.archive.useMutation({
    onSuccess: () => {
      toast.success('Category archived');
      void utils.categories.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to archive category');
    },
  });

  // Unarchive mutation
  const unarchiveMutation = trpc.categories.unarchive.useMutation({
    onSuccess: () => {
      toast.success('Category restored');
      void utils.categories.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to restore category');
    },
  });

  const handleSubmit = (data: CreateCategoryInput) => {
    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        data: {
          name: data.name,
          color: data.color,
          icon: data.icon,
          parentCategoryId: data.parentCategoryId,
        },
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setEditingCategory(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Categories</h1>
          <p className="text-white/70 mt-2">
            Organize your income and expenses with custom categories
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter categories by type and archived status</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="w-48">
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as 'Income' | 'Expense' | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ArchiveToggle showArchived={includeArchived} onToggle={setIncludeArchived} />
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            {categories?.length ?? 0} {typeFilter === 'all' ? '' : typeFilter.toLowerCase()} categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-white/70">Loading categories...</div>
          ) : (
            <CategoryList
              categories={categories ?? []}
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
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update category details. Type cannot be changed after creation.'
                : 'Add a new category to organize your transactions.'}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm category={editingCategory} onSubmit={handleSubmit} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
