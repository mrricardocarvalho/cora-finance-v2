/**
 * Category Types
 *
 * Valid category type enumeration for validation and display.
 *
 * @module lib/constants/category-types
 */

/**
 * Valid category types
 *
 * Matches database enum: category_type
 */
export const CATEGORY_TYPES = ['Expense', 'Income'] as const;

export type CategoryType = (typeof CATEGORY_TYPES)[number];

/**
 * Category type metadata for UI display
 */
export interface CategoryTypeMetadata {
  value: CategoryType;
  label: string;
  description: string;
  color: string; // Tailwind color class
}

/**
 * Category type options with metadata
 */
export const CATEGORY_TYPE_OPTIONS: CategoryTypeMetadata[] = [
  {
    value: 'Expense',
    label: 'Expense',
    description: 'Money spent (outflows)',
    color: 'text-red-600',
  },
  {
    value: 'Income',
    label: 'Income',
    description: 'Money received (inflows)',
    color: 'text-green-600',
  },
];

/**
 * Check if a string is a valid category type
 */
export function isValidCategoryType(type: string): type is CategoryType {
  return CATEGORY_TYPES.includes(type as CategoryType);
}

/**
 * Get metadata for a category type
 */
export function getCategoryTypeMetadata(type: CategoryType): CategoryTypeMetadata | undefined {
  return CATEGORY_TYPE_OPTIONS.find((option) => option.value === type);
}
