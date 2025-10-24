/**
 * Currency Display
 *
 * Format and display monetary amounts with currency symbols.
 * Handles integer cents conversion to decimal display.
 *
 * @module components/shared/currency-display
 */

import Decimal from 'decimal.js';

interface CurrencyDisplayProps {
  /**
   * Amount in integer cents (e.g., 1050 for €10.50)
   */
  amountCents: number;
  /**
   * Currency symbol (e.g., '€', '$', '£')
   */
  currencySymbol: string;
  /**
   * CSS class name for styling
   */
  className?: string;
}

/**
 * Display formatted currency amount with symbol
 *
 * Usage:
 * ```tsx
 * <CurrencyDisplay amountCents={105000} currencySymbol="€" />
 * // Renders: €1,050.00
 * ```
 */
export function CurrencyDisplay({
  amountCents,
  currencySymbol,
  className = '',
}: CurrencyDisplayProps) {
  // Convert integer cents to decimal using Decimal.js for precision
  const amount = new Decimal(amountCents).dividedBy(100);

  // Format with 2 decimal places and thousand separators
  const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <span className={className}>
      {currencySymbol}
      {formatted}
    </span>
  );
}
