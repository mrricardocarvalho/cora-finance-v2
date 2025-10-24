/**
 * Unit tests for Decimal.js utility
 * 
 * Tests financial calculation helpers to ensure Constitutional compliance:
 * - No floating-point arithmetic for monetary values
 * - Arbitrary precision calculations
 * - Correct formatting for pt-PT locale
 * 
 * @module tests/unit/lib/decimal.test
 */

import {
    addCurrency,
    calculatePercentage,
    divideCurrency,
    formatCurrency,
    multiplyCurrency,
    parseCurrency,
    subtractCurrency,
} from '@/lib/decimal';

describe('Decimal.js Utility', () => {
  describe('formatCurrency', () => {
    it('should format cents as EUR currency string', () => {
      const result = formatCurrency(123456);
      expect(result).toContain('1234,56');
      expect(result).toContain('€');
    });

    it('should format zero correctly', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0,00');
      expect(result).toContain('€');
    });

    it('should format negative amounts', () => {
      const result = formatCurrency(-50000);
      expect(result).toContain('-');
      expect(result).toContain('500,00');
      expect(result).toContain('€');
    });

    it('should handle large amounts', () => {
      const result = formatCurrency(123456789);
      expect(result).toContain('567,89');
      expect(result).toContain('€');
    });
  });

  describe('parseCurrency', () => {
    it('should parse formatted currency to cents', () => {
      expect(parseCurrency('1234,56 €')).toBe(123456);
    });

    it('should parse plain decimal numbers', () => {
      expect(parseCurrency('123456')).toBe(12345600);
    });

    it('should parse negative amounts', () => {
      expect(parseCurrency('-500')).toBe(-50000);
    });

    it('should handle zero', () => {
      expect(parseCurrency('0')).toBe(0);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate 15% of €1000', () => {
      expect(calculatePercentage(100000, 15)).toBe(15000);
    });

    it('should calculate 6.5% of €500', () => {
      expect(calculatePercentage(50000, 6.5)).toBe(3250);
    });

    it('should handle zero percentage', () => {
      expect(calculatePercentage(100000, 0)).toBe(0);
    });

    it('should handle zero amount', () => {
      expect(calculatePercentage(0, 15)).toBe(0);
    });
  });

  describe('addCurrency', () => {
    it('should add two amounts', () => {
      expect(addCurrency(100000, 50000)).toBe(150000);
    });

    it('should handle negative amounts', () => {
      expect(addCurrency(100000, -30000)).toBe(70000);
    });
  });

  describe('subtractCurrency', () => {
    it('should subtract two amounts', () => {
      expect(subtractCurrency(100000, 50000)).toBe(50000);
    });

    it('should handle negative results', () => {
      expect(subtractCurrency(50000, 100000)).toBe(-50000);
    });
  });

  describe('multiplyCurrency', () => {
    it('should multiply amount by factor', () => {
      expect(multiplyCurrency(50000, 3)).toBe(150000);
    });

    it('should handle decimal factors', () => {
      expect(multiplyCurrency(100000, 0.5)).toBe(50000);
    });
  });

  describe('divideCurrency', () => {
    it('should divide amount by divisor', () => {
      expect(divideCurrency(150000, 3)).toBe(50000);
    });

    it('should round to nearest cent', () => {
      expect(divideCurrency(100000, 3)).toBe(33333); // €333.33
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers without precision loss', () => {
      const largeAmount = 999999999999; // ~€10 billion
      const result = addCurrency(largeAmount, 1);
      expect(result).toBe(1000000000000);
    });

    it('should maintain precision in complex calculations', () => {
      // Calculate 15% VAT on €1234.56, then add to original
      const amount = 123456;
      const vat = calculatePercentage(amount, 15);
      const total = addCurrency(amount, vat);
      expect(total).toBe(141974); // €1234.56 + €185.18 = €1419.74
    });
  });
});
