/**
 * Decimal.js Utility
 *
 * Provides financial calculation helpers using Decimal.js for arbitrary precision.
 * Constitutional requirement: Never use floating-point for monetary values.
 *
 * @module lib/decimal
 */

import Decimal from 'decimal.js';

/**
 * Configure Decimal.js for financial calculations
 * - Precision: 20 decimal places
 * - Rounding: Half-even (banker's rounding)
 */
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_EVEN });

/**
 * Format cents as currency string
 *
 * @param cents - Amount in cents (integer)
 * @param currency - Currency code (default: EUR)
 * @param locale - Locale for formatting (default: pt-PT)
 * @returns Formatted currency string (e.g., "€1.234,56")
 *
 * @example
 * formatCurrency(123456); // "€1.234,56"
 * formatCurrency(-50000); // "-€500,00"
 */
export function formatCurrency(
  cents: number,
  currency: string = 'EUR',
  locale: string = 'pt-PT'
): string {
  const euros = new Decimal(cents).dividedBy(100).toNumber();
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(euros);
}

/**
 * Parse currency string to cents
 *
 * @param value - Currency string (e.g., "€1.234,56" or "1234.56")
 * @returns Amount in cents (integer)
 *
 * @example
 * parseCurrency("€1.234,56"); // 123456
 * parseCurrency("1234.56"); // 123456
 * parseCurrency("-500"); // -50000
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols, spaces, and thousand separators
  const cleaned = value
    .replace(/[€$£¥\s]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');

  const euros = new Decimal(cleaned);
  return euros.times(100).toNumber();
}

/**
 * Calculate percentage of an amount
 *
 * @param amountCents - Base amount in cents
 * @param percentage - Percentage (e.g., 15 for 15%)
 * @returns Result in cents (integer)
 *
 * @example
 * calculatePercentage(100000, 15); // 15000 (15% of €1000 = €150)
 * calculatePercentage(50000, 6.5); // 3250 (6.5% of €500 = €32.50)
 */
export function calculatePercentage(
  amountCents: number,
  percentage: number
): number {
  const amount = new Decimal(amountCents);
  const percent = new Decimal(percentage).dividedBy(100);
  return amount.times(percent).round().toNumber();
}

/**
 * Add two amounts in cents
 *
 * @param a - First amount in cents
 * @param b - Second amount in cents
 * @returns Sum in cents
 *
 * @example
 * addCurrency(100000, 50000); // 150000 (€1000 + €500 = €1500)
 */
export function addCurrency(a: number, b: number): number {
  return new Decimal(a).plus(b).toNumber();
}

/**
 * Subtract two amounts in cents
 *
 * @param a - First amount in cents
 * @param b - Amount to subtract in cents
 * @returns Difference in cents
 *
 * @example
 * subtractCurrency(100000, 50000); // 50000 (€1000 - €500 = €500)
 */
export function subtractCurrency(a: number, b: number): number {
  return new Decimal(a).minus(b).toNumber();
}

/**
 * Multiply amount by a factor
 *
 * @param amountCents - Amount in cents
 * @param factor - Multiplication factor
 * @returns Result in cents
 *
 * @example
 * multiplyCurrency(50000, 3); // 150000 (€500 × 3 = €1500)
 */
export function multiplyCurrency(amountCents: number, factor: number): number {
  return new Decimal(amountCents).times(factor).round().toNumber();
}

/**
 * Divide amount by a divisor
 *
 * @param amountCents - Amount in cents
 * @param divisor - Division factor
 * @returns Result in cents
 *
 * @example
 * divideCurrency(150000, 3); // 50000 (€1500 ÷ 3 = €500)
 */
export function divideCurrency(amountCents: number, divisor: number): number {
  return new Decimal(amountCents).dividedBy(divisor).round().toNumber();
}

/**
 * Export Decimal class for advanced use cases
 */
export { Decimal };
