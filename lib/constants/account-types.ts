/**
 * Account Types
 *
 * Valid account type enumeration for validation and display.
 *
 * @module lib/constants/account-types
 */

/**
 * Valid account types
 *
 * Matches database enum: account_type
 */
export const ACCOUNT_TYPES = ['Bank', 'CreditCard', 'Wallet'] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

/**
 * Account type metadata for UI display
 */
export interface AccountTypeMetadata {
  value: AccountType;
  label: string;
  description: string;
  icon: string; // lucide-react icon name
}

/**
 * Account type options with metadata
 */
export const ACCOUNT_TYPE_OPTIONS: AccountTypeMetadata[] = [
  {
    value: 'Bank',
    label: 'Bank Account',
    description: 'Checking, savings, or other bank accounts',
    icon: 'Landmark',
  },
  {
    value: 'CreditCard',
    label: 'Credit Card',
    description: 'Credit card accounts with revolving credit',
    icon: 'CreditCard',
  },
  {
    value: 'Wallet',
    label: 'Wallet',
    description: 'Cash wallet or digital wallet',
    icon: 'Wallet',
  },
];

/**
 * Check if a string is a valid account type
 */
export function isValidAccountType(type: string): type is AccountType {
  return ACCOUNT_TYPES.includes(type as AccountType);
}

/**
 * Get metadata for an account type
 */
export function getAccountTypeMetadata(type: AccountType): AccountTypeMetadata | undefined {
  return ACCOUNT_TYPE_OPTIONS.find((option) => option.value === type);
}
