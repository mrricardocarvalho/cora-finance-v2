/**
 * Utility Functions
 *
 * General-purpose utility functions used throughout the application.
 *
 * @module lib/utils
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 *
 * Combines multiple class names and resolves Tailwind CSS conflicts.
 * Used extensively with shadcn/ui components for conditional styling.
 *
 * @param inputs - Class names to merge
 * @returns Merged class string
 *
 * @example
 * cn('bg-white', 'bg-black'); // 'bg-black' (later wins)
 * cn('px-4', condition && 'px-8'); // Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
