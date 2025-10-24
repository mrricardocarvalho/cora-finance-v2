/**
 * Default Categories
 *
 * Pre-seeded categories covering 90% of European household transactions.
 * 15 Expense categories, 5 Income categories.
 *
 * @module lib/constants/default-categories
 */

/**
 * Default category configuration
 */
export interface DefaultCategory {
  name: string;
  type: 'Expense' | 'Income';
  color: string; // Hex color #RRGGBB
  icon: string; // lucide-react icon name
}

/**
 * 20 default categories (15 Expense, 5 Income)
 *
 * Used for: Database seeding on initial setup
 * Covers: Common European household expense/income patterns
 */
export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Expense Categories (15)
  { name: 'Groceries', type: 'Expense', color: '#22c55e', icon: 'ShoppingCart' },
  { name: 'Dining Out', type: 'Expense', color: '#f97316', icon: 'UtensilsCrossed' },
  { name: 'Transportation', type: 'Expense', color: '#3b82f6', icon: 'Car' },
  { name: 'Utilities', type: 'Expense', color: '#eab308', icon: 'Zap' },
  { name: 'Rent/Mortgage', type: 'Expense', color: '#8b5cf6', icon: 'Home' },
  { name: 'Healthcare', type: 'Expense', color: '#ec4899', icon: 'Heart' },
  { name: 'Entertainment', type: 'Expense', color: '#f43f5e', icon: 'Tv' },
  { name: 'Shopping', type: 'Expense', color: '#14b8a6', icon: 'ShoppingBag' },
  { name: 'Insurance', type: 'Expense', color: '#6366f1', icon: 'Shield' },
  { name: 'Education', type: 'Expense', color: '#06b6d4', icon: 'GraduationCap' },
  { name: 'Personal Care', type: 'Expense', color: '#a855f7', icon: 'Sparkles' },
  { name: 'Travel', type: 'Expense', color: '#0ea5e9', icon: 'Plane' },
  { name: 'Subscriptions', type: 'Expense', color: '#84cc16', icon: 'RefreshCw' },
  { name: 'Gifts & Donations', type: 'Expense', color: '#f472b6', icon: 'Gift' },
  { name: 'Other Expenses', type: 'Expense', color: '#64748b', icon: 'MoreHorizontal' },

  // Income Categories (5)
  { name: 'Salary', type: 'Income', color: '#10b981', icon: 'Wallet' },
  { name: 'Freelance', type: 'Income', color: '#3b82f6', icon: 'Briefcase' },
  { name: 'Investments', type: 'Income', color: '#8b5cf6', icon: 'TrendingUp' },
  { name: 'Gifts Received', type: 'Income', color: '#f59e0b', icon: 'Gift' },
  { name: 'Other Income', type: 'Income', color: '#64748b', icon: 'MoreHorizontal' },
];

/**
 * Get default categories by type
 */
export function getDefaultCategoriesByType(type: 'Expense' | 'Income'): DefaultCategory[] {
  return DEFAULT_CATEGORIES.filter((cat) => cat.type === type);
}

/**
 * Get all expense categories
 */
export function getDefaultExpenseCategories(): DefaultCategory[] {
  return getDefaultCategoriesByType('Expense');
}

/**
 * Get all income categories
 */
export function getDefaultIncomeCategories(): DefaultCategory[] {
  return getDefaultCategoriesByType('Income');
}
