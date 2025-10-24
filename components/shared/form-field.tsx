/**
 * FormField Wrapper
 *
 * Reusable form field component with label and error message display.
 * Integrates React Hook Form with shadcn/ui components.
 *
 * @module components/shared/form-field
 */

import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { ReactNode } from 'react';

interface FormFieldWrapperProps {
  label: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}

/**
 * Reusable form field wrapper with label and error handling
 *
 * Usage:
 * ```tsx
 * <FormField
 *   control={form.control}
 *   name="accountName"
 *   render={({ field }) => (
 *     <FormFieldWrapper label="Account Name" required>
 *       <Input {...field} placeholder="My Checking Account" />
 *     </FormFieldWrapper>
 *   )}
 * />
 * ```
 */
export function FormFieldWrapper({
  label,
  description,
  required = false,
  children,
}: FormFieldWrapperProps) {
  return (
    <FormItem>
      <FormLabel>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FormLabel>
      <FormControl>{children}</FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
