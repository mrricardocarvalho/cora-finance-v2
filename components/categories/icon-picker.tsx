/**
 * Icon Picker Component
 *
 * Select lucide-react icons with preview.
 * Displays common financial/category icons.
 *
 * @module components/categories/icon-picker
 */

'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
}

/**
 * Common financial/category icon names from lucide-react
 */
const COMMON_ICONS = [
  'ShoppingCart',
  'UtensilsCrossed',
  'Car',
  'Zap',
  'Home',
  'Heart',
  'Clapperboard',
  'Shirt',
  'Laptop',
  'Gift',
  'PiggyBank',
  'Briefcase',
  'TrendingUp',
  'Repeat',
  'DollarSign',
  'CreditCard',
  'Wallet',
  'Banknote',
  'Landmark',
  'ChartBar',
] as const;

/**
 * Icon Picker Component
 *
 * Usage:
 * ```tsx
 * <IconPicker
 *   value={field.value}
 *   onChange={field.onChange}
 * />
 * ```
 */
export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);

  // Get the icon component dynamically
  const IconComponent = value
    ? (LucideIcons[value as keyof typeof LucideIcons] as React.ComponentType<{
        className?: string;
      }>)
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start"
        >
          {IconComponent ? (
            <div className="flex items-center gap-2">
              <IconComponent className="h-4 w-4" />
              <span>{value}</span>
            </div>
          ) : (
            <span className="text-white/50">Select icon...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2">
        <div className="grid grid-cols-5 gap-2">
          {COMMON_ICONS.map((iconName) => {
            const Icon = LucideIcons[iconName] as React.ComponentType<{
              className?: string;
            }>;
            return (
              <Button
                key={iconName}
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0"
                onClick={() => {
                  onChange(iconName);
                  setOpen(false);
                }}
              >
                <Icon className="h-5 w-5" />
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
