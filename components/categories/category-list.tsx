/**
 * Category List Component
 *
 * Displays categories in a table with icon/color preview.
 * Supports edit, archive, and type filtering.
 *
 * @module components/categories/category-list
 */

'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Category } from '@/server/db/schema';
import * as LucideIcons from 'lucide-react';
import { Archive, ArchiveRestore, Edit2 } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
}

/**
 * Category list table component
 *
 * Usage:
 * ```tsx
 * <CategoryList
 *   categories={categories}
 *   onEdit={(cat) => { setEditingCategory(cat); setDialogOpen(true); }}
 *   onArchive={(id) => archiveMutation.mutate({ id })}
 *   onUnarchive={(id) => unarchiveMutation.mutate({ id })}
 * />
 * ```
 */
export function CategoryList({ categories, onEdit, onArchive, onUnarchive }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
        <p className="text-white/70">No categories found. Create your first category to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Color</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const IconComponent = LucideIcons[
              category.icon as keyof typeof LucideIcons
            ] as React.ComponentType<{ className?: string }>;

            return (
              <TableRow key={category.id} className={category.archived ? 'opacity-50' : ''}>
                <TableCell>
                  {IconComponent && (
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: category.color }}
                    >
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <span
                    className={
                      category.type === 'Income'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }
                  >
                    {category.type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded border border-white/20"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-xs text-white/70">{category.color}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(category)}
                      disabled={category.archived}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {category.archived ? (
                      <Button variant="ghost" size="sm" onClick={() => onUnarchive(category.id)}>
                        <ArchiveRestore className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => onArchive(category.id)}>
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
