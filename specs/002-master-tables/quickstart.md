# Quickstart Guide: Core Master Tables & App Setup

**Feature**: 002-master-tables  
**Target Audience**: Developers implementing Phase 2  
**Prerequisites**: Foundation Phase (001-foundation) complete

---

## Prerequisites Checklist

Before starting Phase 2 implementation, verify:

- [ ] ✅ Foundation Phase complete (all 96 tasks done)
- [ ] ✅ PostgreSQL 15+ running locally
- [ ] ✅ Node.js 20 LTS installed
- [ ] ✅ npm dependencies installed (`npm install`)
- [ ] ✅ Environment variables configured (`.env.local`)
- [ ] ✅ Database migrations applied (`npm run db:migrate`)
- [ ] ✅ Health check passing (`npm run dev` → http://localhost:3000/api/trpc/health.check)
- [ ] ✅ All Foundation tests passing (`npm test` + `npm run test:e2e`)

---

## Local Development Setup

### 1. Switch to Feature Branch

```powershell
git checkout 002-master-tables
```

### 2. Install New Dependencies

```powershell
# Install lucide-react for category icons
npm install lucide-react

# No other new dependencies needed (using existing stack)
```

### 3. Database Migration

```powershell
# Generate migration from schema changes
npm run db:generate

# Review migration file: drizzle/migrations/0002_master_tables.sql

# Apply migration
npm run db:migrate

# Verify tables created
npm run db:studio  # Opens Drizzle Studio at http://localhost:4983
```

### 4. Seed Default Data

```powershell
# Run seed script (creates EUR, 20 categories, default settings)
npm run db:seed

# Verify seed data in Drizzle Studio
```

### 5. Start Development Server

```powershell
# Start Next.js dev server with Turbopack
npm run dev

# Server runs at http://localhost:3000
```

---

## Testing Strategy

### TDD Workflow (Test-Driven Development)

**Constitutional Requirement**: Tests MUST be written before implementation.

**Workflow**:
1. Write test describing expected behavior
2. Get user approval for test (if needed)
3. Run test → Verify it fails (red)
4. Write minimum code to pass test (green)
5. Refactor if needed
6. Repeat

### Unit Tests (Jest)

**Location**: `tests/unit/`

**Run Commands**:
```powershell
# Run all unit tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- account.test.ts

# Watch mode (re-run on file changes)
npm test -- --watch
```

**Coverage Targets**:
- Business logic: 80%+ required
- Validation schemas: 100% required
- tRPC routers: 85%+ required

**Example Test** (Validation):
```typescript
import { accountSchema } from '@/lib/validations/account';

describe('Account Validation', () => {
  it('should accept valid account data', () => {
    const result = accountSchema.safeParse({
      name: 'Checking Account',
      type: 'Bank',
      currencyId: '123e4567-e89b-12d3-a456-426614174000',
      balance: 100000,
    });
    expect(result.success).toBe(true);
  });

  it('should reject negative balance', () => {
    const result = accountSchema.safeParse({
      name: 'Checking',
      type: 'Bank',
      currencyId: '123e4567-e89b-12d3-a456-426614174000',
      balance: -1000,
    });
    expect(result.success).toBe(false);
  });
});
```

### E2E Tests (Playwright)

**Location**: `tests/e2e/`

**Run Commands**:
```powershell
# Run all E2E tests (headless)
npm run test:e2e

# Run with UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test accounts.spec.ts

# Debug mode
npx playwright test --debug
```

**Example Test** (Account CRUD):
```typescript
import { test, expect } from '@playwright/test';

test('User can create a new account', async ({ page }) => {
  await page.goto('/accounts');
  
  // Click "Add New Account"
  await page.click('button:has-text("Add New Account")');
  
  // Fill form
  await page.fill('input[name="name"]', 'Test Checking');
  await page.selectOption('select[name="type"]', 'Bank');
  await page.selectOption('select[name="currencyId"]', eurId);
  await page.fill('input[name="balance"]', '1000.00');
  
  // Submit
  await page.click('button:has-text("Save")');
  
  // Verify success
  await expect(page.locator('text=Account created successfully')).toBeVisible();
  await expect(page.locator('text=Test Checking')).toBeVisible();
});
```

---

## Common Development Tasks

### Task 1: Add New Entity Field

**Example**: Add `description` field to Account.

1. **Update Drizzle Schema** (`server/db/schema.ts`):
```typescript
export const accounts = pgTable('accounts', {
  // ... existing fields
  description: varchar('description', { length: 255 }),
});
```

2. **Generate Migration**:
```powershell
npm run db:generate
```

3. **Update Validation Schema** (`lib/validations/account.ts`):
```typescript
export const createAccountSchema = z.object({
  // ... existing fields
  description: z.string().max(255).optional(),
});
```

4. **Update tRPC Router** (`server/trpc/routers/accounts.ts`):
```typescript
.mutation('create', {
  input: createAccountSchema,
  async resolve({ input }) {
    return db.insert(accounts).values({
      ...input,
      description: input.description ?? null,
    });
  }
})
```

5. **Update UI Form** (`components/accounts/account-form.tsx`):
```typescript
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
    </FormItem>
  )}
/>
```

6. **Write Tests** (unit + E2E)

7. **Apply Migration**:
```powershell
npm run db:migrate
```

### Task 2: Add New Validation Rule

**Example**: Validate account names don't start with numbers.

1. **Update Validation Schema**:
```typescript
export const createAccountSchema = z.object({
  name: z.string()
    .min(1)
    .max(100)
    .refine((name) => !/^\d/.test(name), {
      message: 'Account name cannot start with a number',
    }),
  // ... other fields
});
```

2. **Write Test**:
```typescript
it('should reject account names starting with numbers', () => {
  const result = createAccountSchema.safeParse({
    name: '123 Checking',
    type: 'Bank',
    currencyId: eurId,
    balance: 0,
  });
  expect(result.success).toBe(false);
  expect(result.error.errors[0].message).toBe('Account name cannot start with a number');
});
```

3. **Verify E2E**: Add test scenario filling form with invalid name.

### Task 3: Customize shadcn/ui Component for Liquid Glass

**Example**: Customize Card component.

1. **Locate Component** (`components/ui/card.tsx`)

2. **Apply Liquid Glass Classes**:
```typescript
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-white/20",
      "bg-white/10 backdrop-blur-md",
      "shadow-lg shadow-black/5",
      className
    )}
    {...props}
  />
))
```

3. **Verify Visual Regression** (screenshot comparison)

---

## Troubleshooting Guide

### Problem: Migration Fails with "relation already exists"

**Cause**: Migration already applied or database out of sync.

**Solution**:
```powershell
# Check migration status
npm run db:check

# Rollback last migration
npm run db:rollback

# Re-apply migration
npm run db:migrate
```

### Problem: tRPC Type Errors in Client

**Cause**: Client/server type mismatch (tRPC not regenerating types).

**Solution**:
```powershell
# Stop dev server
Ctrl+C

# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Restart dev server
npm run dev
```

### Problem: Seed Script Creates Duplicate Categories

**Cause**: Seed script running multiple times.

**Solution**: Add idempotency check in `server/db/seed.ts`:
```typescript
export async function seedDefaultCategories() {
  const existing = await db.select().from(categories).limit(1);
  if (existing.length > 0) {
    console.log('Categories already seeded, skipping...');
    return;
  }
  // ... seed logic
}
```

### Problem: E2E Tests Failing with "element not found"

**Cause**: Page load timing issues or incorrect selectors.

**Solution**:
```typescript
// Use waitFor with better selectors
await page.waitForSelector('[data-testid="account-list"]');

// Or use Playwright's auto-waiting
await expect(page.locator('[data-testid="account-list"]')).toBeVisible();

// Add data-testid attributes to components
<div data-testid="account-list">...</div>
```

### Problem: Validation Errors Not Showing Inline

**Cause**: React Hook Form not connected to shadcn/ui Form components.

**Solution**: Verify Form structure:
```typescript
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}  // <-- Must pass control
      name="accountName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Account Name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />  {/* <-- Displays validation errors */}
        </FormItem>
      )}
    />
  </form>
</Form>
```

### Problem: Liquid Glass Effect Not Showing

**Cause**: Browser doesn't support backdrop-filter CSS property.

**Solution**: Add fallback in TailwindCSS config:
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      supports: {
        'backdrop-blur': 'backdrop-filter: blur(0px)',
      },
    },
  },
  plugins: [
    function({ addUtilities, theme, e }) {
      // Fallback for no backdrop-filter support
      addUtilities({
        '.glass-fallback': {
          '@supports not (backdrop-filter: blur(0px))': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },
        },
      });
    },
  ],
};
```

---

## Performance Optimization Tips

### 1. Database Query Optimization

- **Use Indexes**: Ensure `(type, archived)` indexes exist for filtered queries
- **Select Only Needed Fields**: Don't select all fields if only need a few
- **Batch Queries**: Use Drizzle's `db.batch()` for multiple queries

### 2. tRPC Optimization

- **Enable Query Caching**: Use TanStack Query's `staleTime` and `cacheTime`
```typescript
const { data } = trpc.accounts.list.useQuery(
  { includeArchived: false },
  { staleTime: 60000 } // Cache for 1 minute
);
```

### 3. UI Performance

- **Virtualize Long Lists**: Use `react-virtual` for 50+ items
- **Debounce Search**: Use `useDebouncedValue` for payee autocomplete
- **Lazy Load Modals**: Use `dynamic` import for modal components

---

## Next Steps

1. ✅ Complete Phase 0 & 1 (Research, Design, Contracts)
2. ⏭️ Run `/speckit.tasks` command to generate detailed task breakdown
3. ⏭️ Begin implementation following TDD workflow:
   - Start with Database Layer (Subphase 2.1)
   - Write schema tests first
   - Implement Drizzle schemas
   - Generate and apply migration
   - Create seed script
4. ⏭️ Continue through subphases 2.2-2.8 following plan.md timeline

---

## Useful Commands Reference

```powershell
# Development
npm run dev                  # Start dev server (Turbopack)
npm run build                # Production build
npm run start                # Start production server

# Database
npm run db:generate          # Generate migration from schema
npm run db:migrate           # Apply migrations
npm run db:rollback          # Rollback last migration
npm run db:check             # Check migration status
npm run db:studio            # Open Drizzle Studio
npm run db:seed              # Seed default data

# Testing
npm test                     # Run unit tests
npm run test:coverage        # Run with coverage report
npm run test:e2e             # Run E2E tests (headless)
npx playwright test --ui     # Run E2E with UI mode

# Linting & Formatting
npm run lint                 # ESLint check
npm run format               # Prettier format
npm run type-check           # TypeScript check

# Quality Gates (run before commit)
npm run test && npm run lint && npm run type-check
```

---

**Questions?** Refer to:
- Constitution: `.specify/memory/constitution.md`
- Spec: `specs/002-master-tables/spec.md`
- Plan: `specs/002-master-tables/plan.md`
- Data Model: `specs/002-master-tables/data-model.md`
- Contracts: `specs/002-master-tables/contracts/`
