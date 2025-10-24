# Technical Research: Core Master Tables & App Setup

**Feature**: 002-master-tables  
**Date**: 2025-10-24  
**Status**: Complete

---

## Decision 1: Icon Library Selection

**Context**: Category management requires users to select visual icons for quick recognition. Need a library that supports Liquid Glass aesthetic and provides business-relevant icons.

**Options Evaluated**:
1. **lucide-react** - 1000+ icons, tree-shakeable, clean SVG design
2. **react-icons** - Multiple icon sets, larger bundle
3. **heroicons** - Tailwind-native, limited selection

**Selected**: **lucide-react**

**Rationale**:
- Clean, minimalist style aligns with Liquid Glass design language
- Tree-shakeable - only imports used icons, optimal bundle size
- Extensive business/finance icon set (wallet, credit-card, shopping-cart, home, etc.)
- TypeScript-first with full type definitions
- Active maintenance and React 18+ support

**Implementation**:
- Install: `npm install lucide-react`
- Create `components/categories/category-icon-picker.tsx` with curated subset
- Curated icons: ~60 icons covering common expense/income categories
- Store icon name as string in database, render dynamically via lucide-react

**Alternatives Considered**:
- heroicons: Too limited (200 icons), missing key business categories
- react-icons: Larger bundle, inconsistent styles across icon sets

---

## Decision 2: ISO 4217 Currency Code Validation

**Context**: Currency management must validate user-entered currency codes against ISO 4217 standard (EUR, USD, GBP, etc.) without external API calls.

**Options Evaluated**:
1. **Static JSON array** in `/lib/constants/currency-codes.ts`
2. **Zod enum** with hardcoded values
3. **External npm package** (`currency-codes`)

**Selected**: **Static JSON array**

**Rationale**:
- No runtime dependencies or network calls
- Full control over supported currencies
- Easy to extend for future i18n (currency names, symbols)
- Zod `.refine()` method validates against array efficiently
- 180 currency codes = ~5KB uncompressed (negligible)

**Implementation**:
```typescript
// lib/constants/currency-codes.ts
export const ISO_4217_CODES = [
  'EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', ...
] as const;

// lib/validations/currency.ts
export const currencySchema = z.object({
  code: z.string().refine(
    (code) => ISO_4217_CODES.includes(code as any),
    { message: 'Invalid ISO 4217 currency code' }
  ),
  // ... other fields
});
```

**Alternatives Considered**:
- External package: Adds dependency for minimal functionality
- Zod enum: Requires manual listing, harder to maintain

---

## Decision 3: Default Category Seed Data

**Context**: New users need default categories for common expenses/income to start tracking immediately. Target Portuguese/European household finance patterns.

**Selected**: **20 default categories** (15 Expense, 5 Income)

**Category List**:

**Expenses** (15):
- 🛒 Groceries
- 🍴 Restaurants & Dining
- 🚗 Transportation
- 💡 Utilities (Electric, Water, Gas)
- 🏠 Housing (Rent/Mortgage)
- 🏥 Healthcare & Medical
- 🎬 Entertainment
- 🛍️ Shopping & Retail
- 📚 Education
- 🛡️ Insurance
- 🐾 Pets
- 🎁 Gifts & Donations
- ✈️ Travel & Vacation
- 📱 Subscriptions & Memberships
- 📦 Other Expenses

**Income** (5):
- 💼 Salary & Wages
- 💻 Freelance & Contracting
- 📈 Investments & Dividends
- 🎁 Gifts Received
- 💰 Other Income

**Rationale**:
- Covers 90% of common household transactions
- Balanced granularity (not too broad, not too specific)
- European-focused (e.g., separate utilities from housing)
- Users can customize/add more as needed

**Implementation**:
```typescript
// lib/constants/default-categories.ts
export const DEFAULT_CATEGORIES = [
  { name: 'Groceries', type: 'Expense', icon: 'shopping-cart', color: '#10B981' },
  // ... 19 more
];

// server/db/seed.ts
async function seedDefaultCategories() {
  // Check if categories exist, if not insert defaults
}
```

**Seeding Strategy**: Run on first application launch (check if categories table is empty), not in migration. Allows fresh installs to get defaults while preserving existing user data.

---

## Decision 4: Delete Strategy per Entity

**Context**: Financial applications must preserve data integrity. Need clear rules for when entities can be permanently deleted vs. archived.

**Selected**: **Mixed strategy based on referential impact**

**Strategy Matrix**:

| Entity | Strategy | Rationale | Implementation |
|--------|----------|-----------|----------------|
| **Accounts** | Soft delete only | Transactions reference accounts. Deleting breaks history. | `archived` boolean, UI filter, prevent hard delete |
| **Categories** | Soft delete only | Transactions reference categories. Historical reports need categories. | `archived` boolean, UI filter, prevent hard delete |
| **Payees** | Hard delete if unused, soft if used | No transactions = safe to delete. Transactions exist = preserve for history. | Check transaction count, conditional delete/archive |
| **Currencies** | Soft delete only | Accounts reference currencies. Exchange rate history needed. | `archived` boolean, UI filter, prevent hard delete |
| **Settings** | No delete | Singleton record per user. Reset to defaults instead. | No delete endpoint, only update |

**Implementation Pattern**:
```typescript
// Soft delete (Accounts, Categories, Currencies)
.mutation('delete', {
  input: z.object({ id: z.string() }),
  async resolve({ input }) {
    // Check for dependent records
    const hasTransactions = await checkTransactions(input.id);
    if (hasTransactions) {
      throw new Error('Cannot delete: transactions exist. Archive instead.');
    }
    // Set archived = true
    return db.update(...).set({ archived: true });
  }
});

// Conditional delete (Payees)
.mutation('delete', {
  input: z.object({ id: z.string() }),
  async resolve({ input }) {
    const transactionCount = await countPayeeTransactions(input.id);
    if (transactionCount > 0) {
      // Soft delete
      return db.update(...).set({ archived: true });
    } else {
      // Hard delete
      return db.delete(...);
    }
  }
});
```

**UI Implications**:
- All list views show `archived: false` by default
- "Show Archived" toggle in each management screen
- Archive action shows warning: "This will hide the item but preserve history"
- Unarchive action available in archived view

---

## Summary

All technical decisions resolved with no blockers. Implementation can proceed to Phase 1 (Design & Contracts).

**Key Takeaways**:
- lucide-react for icons (clean, tree-shakeable)
- Static currency code validation (no external dependencies)
- 20 default categories for European users
- Mixed delete strategy (soft for referenced entities, conditional for payees)

**Next Steps**: Generate data model and API contracts in Phase 1.
