# Implementation Plan: Core Master Tables & App Setup

**Branch**: `002-master-tables` | **Date**: 2025-10-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-master-tables/spec.md`

**Note**: This plan breaks down Phase 2 (Master Tables & App Setup) into detailed implementation subphases with time estimates, dependencies, and quality gates.

---

## Summary

Establish the five core data entities (Accounts, Categories, Payees, Currencies, Settings) that form the backbone of Cora Finance. This phase delivers complete CRUD operations for each entity with tRPC APIs, Liquid Glass UI components, comprehensive validation, and full test coverage. These master tables enable all future features including Transactions, Budgets, Portfolios, Analytics, and AI.

**Technical Approach**: Drizzle ORM schemas → tRPC routers with Zod validation → shadcn/ui forms with Liquid Glass styling → Jest unit tests + Playwright E2E tests. Implementation follows layered architecture with strict type safety and TDD workflow.

**Estimated Duration**: 45-60 hours total (6-8 working days)

---

## Technical Context

**Language/Version**: TypeScript 5.9+ in strict mode (Next.js 16.0+, Node.js 20 LTS)  
**Primary Dependencies**: Next.js 16, tRPC 11.6+, Drizzle ORM 0.44+, Zod, React Hook Form, shadcn/ui, TailwindCSS 4.x, Decimal.js  
**Storage**: PostgreSQL 15+ with Drizzle ORM migrations  
**Testing**: Jest 30.2+ (unit tests), Playwright 1.56+ (E2E tests)  
**Target Platform**: Web application (desktop-first, responsive design)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: API <500ms p95, Page load <2s interactive, Form submission <200ms feedback  
**Constraints**: WCAG 2.1 AA accessibility, 80%+ test coverage on business logic, all amounts as integer cents  
**Scale/Scope**: 5 entities, ~20 tRPC endpoints, 5 CRUD UI screens, 50+ unit tests, 25+ E2E tests

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Clean Architecture
- **Status**: COMPLIANT
- **Verification**: Next.js 15.5+ App Router with layered structure (`/app`, `/components`, `/lib`, `/server`, `/drizzle`)
- **Evidence**: All schemas in `/server/db/schema.ts`, routers in `/server/trpc/routers/`, components in `/components/ui/`, strict TypeScript enabled

### ✅ Principle II: Type Safety First
- **Status**: COMPLIANT
- **Verification**: Drizzle ORM for compile-time SQL safety, tRPC for end-to-end type safety, Zod for validation, Decimal.js for financial math
- **Evidence**: All entities explicitly typed, Zod schemas for all inputs, no implicit any types, integer cents storage for amounts

### ✅ Principle III: Test-Driven Development
- **Status**: COMPLIANT
- **Verification**: Jest for unit tests (targeting 80%+ coverage), Playwright for E2E tests on all major workflows, TDD workflow enforced
- **Evidence**: Tests written before implementation, quality gates require all tests passing before merge

### ✅ Principle IV: Liquid Glass Design System
- **Status**: COMPLIANT
- **Verification**: All UI components follow Liquid Glass aesthetic (neutral gradients, backdrop blur, rounded-2xl, sky blue accent)
- **Evidence**: TailwindCSS 4.x with custom tokens, shadcn/ui components customized for glass treatment, Framer Motion for transitions

### ✅ Principle V: Data Integrity & Precision
- **Status**: COMPLIANT
- **Verification**: All monetary values as integer cents, ISO 8601 UTC timestamps, soft deletes via `archived` boolean, `created_at`/`updated_at` on all tables
- **Evidence**: Drizzle schema definitions enforce constraints, foreign keys with cascade rules, no magic strings (enums used)

### ✅ Principle VI: Performance & Accessibility
- **Status**: COMPLIANT
- **Verification**: API <500ms p95, page load <2s, WCAG 2.1 AA compliance, TanStack Query for state management
- **Evidence**: Performance targets in Success Criteria (SC-202 to SC-204), shadcn/ui provides accessible components

### ✅ Principle VII: Security & Compliance
- **Status**: COMPLIANT
- **Verification**: Drizzle parameterization prevents SQL injection, server-side validation via Zod, React XSS protection, Next.js CSRF protection
- **Evidence**: All validation happens server-side in tRPC procedures, Zod schemas validate all inputs

**Overall Constitution Compliance**: ✅ **PASS** - All 7 principles satisfied with no violations or complexity exceptions needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-master-tables/
├── spec.md              # Feature specification (✅ COMPLETE)
├── plan.md              # This file - implementation plan
├── research.md          # Phase 0: Technical research and decisions
├── data-model.md        # Phase 1: Entity relationship diagram and schemas
├── quickstart.md        # Phase 1: Developer setup guide
├── contracts/           # Phase 1: API contracts (tRPC schemas)
│   ├── accounts.ts      # Account CRUD endpoints
│   ├── categories.ts    # Category CRUD endpoints
│   ├── payees.ts        # Payee CRUD endpoints
│   ├── currencies.ts    # Currency CRUD endpoints
│   └── settings.ts      # Settings endpoints
├── checklists/
│   └── requirements.md  # Quality checklist (✅ COMPLETE)
└── tasks.md             # Phase 2: Detailed task breakdown (/speckit.tasks)
```

### Source Code (repository root)

```text
cora-finance-v2/
├── app/                          # Next.js App Router pages
│   ├── (dashboard)/              # Dashboard layout group
│   │   ├── accounts/
│   │   │   ├── page.tsx          # Accounts list page
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Account detail/edit page
│   │   ├── categories/
│   │   │   └── page.tsx          # Categories management page
│   │   ├── payees/
│   │   │   └── page.tsx          # Payees management page
│   │   ├── currencies/
│   │   │   └── page.tsx          # Currencies management page
│   │   ├── settings/
│   │   │   └── page.tsx          # Application settings page
│   │   └── layout.tsx            # Dashboard layout with navigation
│   └── layout.tsx                # Root layout with Liquid Glass background
│
├── components/
│   ├── ui/                       # shadcn/ui components (Liquid Glass)
│   │   ├── button.tsx            # ✅ FROM FOUNDATION
│   │   ├── card.tsx              # NEW: Glass card component
│   │   ├── dialog.tsx            # NEW: Glass modal dialog
│   │   ├── form.tsx              # NEW: Form components
│   │   ├── input.tsx             # NEW: Glass input fields
│   │   ├── select.tsx            # NEW: Glass dropdown
│   │   ├── table.tsx             # NEW: Glass table component
│   │   └── toast.tsx             # NEW: Toast notifications
│   ├── accounts/                 # Account components
│   │   ├── account-form.tsx
│   │   ├── account-list.tsx
│   │   └── account-card.tsx
│   ├── categories/               # Category components
│   │   ├── category-form.tsx
│   │   ├── category-list.tsx
│   │   └── category-icon-picker.tsx
│   ├── payees/                   # Payee components
│   │   ├── payee-form.tsx
│   │   └── payee-autocomplete.tsx
│   ├── currencies/               # Currency components
│   │   ├── currency-form.tsx
│   │   └── currency-list.tsx
│   └── settings/                 # Settings components
│       └── settings-form.tsx
│
├── server/
│   ├── db/
│   │   ├── schema.ts             # All Drizzle schemas (EXTEND)
│   │   └── seed.ts               # NEW: Seed defaults
│   └── trpc/
│       ├── routers/
│       │   ├── health.ts         # ✅ FROM FOUNDATION
│       │   ├── accounts.ts       # NEW: Account CRUD
│       │   ├── categories.ts     # NEW: Category CRUD
│       │   ├── payees.ts         # NEW: Payee CRUD
│       │   ├── currencies.ts     # NEW: Currency CRUD
│       │   └── settings.ts       # NEW: Settings get/update
│       └── root.ts               # EXTEND: Register routers
│
├── lib/
│   ├── decimal.ts                # ✅ FROM FOUNDATION
│   ├── validations/              # NEW: Zod schemas
│   │   ├── account.ts
│   │   ├── category.ts
│   │   ├── payee.ts
│   │   ├── currency.ts
│   │   └── settings.ts
│   └── constants/                # NEW: Constants
│       ├── account-types.ts
│       ├── category-types.ts
│       ├── currency-codes.ts
│       └── default-categories.ts
│
├── drizzle/migrations/
│   └── 0002_master_tables.sql    # NEW: Migration
│
└── tests/
    ├── unit/
    │   ├── lib/validations/      # NEW: Validation tests
    │   │   ├── account.test.ts
    │   │   ├── category.test.ts
    │   │   ├── payee.test.ts
    │   │   ├── currency.test.ts
    │   │   └── settings.test.ts
    │   └── server/trpc/routers/  # NEW: Router tests
    │       ├── accounts.test.ts
    │       ├── categories.test.ts
    │       ├── payees.test.ts
    │       ├── currencies.test.ts
    │       └── settings.test.ts
    └── e2e/
        ├── accounts.spec.ts      # NEW: E2E tests
        ├── categories.spec.ts
        ├── payees.spec.ts
        ├── currencies.spec.ts
        └── settings.spec.ts
```

**Structure Decision**: Web application with Next.js App Router. All API logic in `/server/trpc/routers/`, UI in `/app/` and `/components/`, database schemas in `/server/db/schema.ts`. Aligns with Foundation Phase and Clean Architecture principle.

---

## Complexity Tracking

**Status**: ✅ NO VIOLATIONS

No constitutional violations detected. All complexity is justified within constitutional principles. No repository patterns, additional projects, or architectural deviations required.

---

## Phase 0: Research & Technical Decisions

**Duration**: 2 hours  
**Prerequisites**: Constitution Check passed  
**Objective**: Resolve any technical unknowns and establish implementation patterns

### Research Tasks

#### 1. Icon Library Selection (30 min)
**Question**: Which icon library best supports category icons with Liquid Glass aesthetic?

**Options Evaluated**:
- **lucide-react** (Recommended): Clean, consistent style, tree-shakeable, 1000+ icons
- **react-icons**: Larger library but heavier bundle size
- **heroicons**: Limited set but native to Tailwind ecosystem

**Decision**: **lucide-react**
- **Rationale**: Best balance of variety, bundle size, and visual consistency with Liquid Glass design
- **Implementation**: Install `lucide-react`, create icon picker component with curated subset (50-100 icons)
- **Alternatives Considered**: heroicons rejected due to limited business category icons

#### 2. Currency Code Validation (30 min)
**Question**: How to validate ISO 4217 currency codes without external API dependency?

**Options Evaluated**:
- **Static JSON list**: All 180 ISO 4217 codes in constants file
- **Zod enum**: Hardcoded enum in validation schema
- **External package**: `currency-codes` npm package

**Decision**: **Static JSON list in constants**
- **Rationale**: No external dependencies, full control, supports future i18n
- **Implementation**: Create `/lib/constants/currency-codes.ts` with ISO 4217 array, validate via Zod `.refine()`
- **Alternatives Considered**: External package adds dependency for minimal value

#### 3. Default Category Seed Data (30 min)
**Question**: What default categories should be seeded for Portuguese/European users?

**Decision**: **20 default categories** (15 Expense, 5 Income)
- **Expense Categories**: Groceries, Restaurants, Transportation, Utilities, Housing, Healthcare, Entertainment, Shopping, Education, Insurance, Pets, Gifts, Travel, Subscriptions, Other
- **Income Categories**: Salary, Freelance, Investments, Gifts Received, Other
- **Rationale**: Covers 90% of common household transactions, balanced granularity
- **Implementation**: Create `/lib/constants/default-categories.ts`, seed via migration or first-run check

#### 4. Soft Delete vs Hard Delete Strategy (30 min)
**Question**: When should entities use soft delete (archived) vs allow hard delete?

**Decision Matrix**:
| Entity | Delete Strategy | Rationale |
|--------|----------------|-----------|
| Accounts | Soft only | Preserve transaction history integrity |
| Categories | Soft only | Historical transaction categorization |
| Payees | Hard if unused, soft if used | No impact if no transactions |
| Currencies | Soft only | Account currency references |
| Settings | No delete | Singleton record |

**Implementation**: All tables include `archived BOOLEAN DEFAULT false`, UI shows unarchived by default, separate "Archive" view for recovery.

**Output**: ✅ `specs/002-master-tables/research.md` (created next)

---

## Phase 1: Design & Contracts

**Duration**: 3 hours  
**Prerequisites**: Phase 0 research complete  
**Objective**: Define data models, API contracts, and generate developer documentation

### 1.1 Data Model Design (90 min)

**Task**: Create complete entity-relationship diagram and Drizzle schema definitions.

**Deliverable**: `specs/002-master-tables/data-model.md`

**Content**:
- Entity relationship diagram (Mermaid syntax)
- 5 entity definitions with all fields, types, constraints
- Foreign key relationships and cascade rules
- Index strategy for query performance
- Migration strategy from Foundation Phase

**Entities**:
1. **Currency** (no dependencies - create first)
   - `id` (UUID, PK)
   - `code` (VARCHAR(3), UNIQUE, NOT NULL) - ISO 4217
   - `symbol` (VARCHAR(10), NOT NULL)
   - `name` (VARCHAR(100), NOT NULL)
   - `exchangeRate` (DECIMAL(18,6), NOT NULL) - to base currency (EUR)
   - `lastUpdated` (TIMESTAMP, NOT NULL)
   - `archived` (BOOLEAN, DEFAULT false)
   - `createdAt`, `updatedAt` (TIMESTAMP)

2. **Settings** (depends on Currency)
   - `id` (UUID, PK)
   - `defaultCurrencyId` (UUID, FK → Currency, NOT NULL)
   - `theme` (ENUM: 'light', 'dark', 'auto', DEFAULT 'light')
   - `aiEnabled` (BOOLEAN, DEFAULT true)
   - `createdAt`, `updatedAt` (TIMESTAMP)

3. **Category** (no dependencies)
   - `id` (UUID, PK)
   - `name` (VARCHAR(100), NOT NULL)
   - `type` (ENUM: 'Expense', 'Income', NOT NULL)
   - `color` (VARCHAR(7), NOT NULL) - hex code
   - `icon` (VARCHAR(50), NOT NULL) - lucide-react icon name
   - `archived` (BOOLEAN, DEFAULT false)
   - `createdAt`, `updatedAt` (TIMESTAMP)
   - UNIQUE constraint on (name, type) - case-insensitive

4. **Account** (depends on Currency)
   - `id` (UUID, PK)
   - `name` (VARCHAR(100), NOT NULL, UNIQUE)
   - `type` (ENUM: 'Bank', 'CreditCard', 'Wallet', NOT NULL)
   - `currencyId` (UUID, FK → Currency, NOT NULL)
   - `balance` (BIGINT, NOT NULL) - stored as integer cents
   - `archived` (BOOLEAN, DEFAULT false)
   - `createdAt`, `updatedAt` (TIMESTAMP)

5. **Payee** (optional FK to Category)
   - `id` (UUID, PK)
   - `name` (VARCHAR(100), NOT NULL, UNIQUE)
   - `type` (ENUM: 'person', 'vendor', NOT NULL)
   - `defaultCategoryId` (UUID, FK → Category, NULLABLE)
   - `archived` (BOOLEAN, DEFAULT false)
   - `createdAt`, `updatedAt` (TIMESTAMP)

**Foreign Key Cascade Rules**:
- `Settings.defaultCurrencyId` → RESTRICT (prevent deleting EUR if set as default)
- `Account.currencyId` → RESTRICT (prevent deleting currency with accounts)
- `Payee.defaultCategoryId` → SET NULL (allow category deletion)

### 1.2 API Contract Generation (60 min)

**Task**: Define tRPC router procedures for all CRUD operations.

**Deliverable**: `specs/002-master-tables/contracts/` directory with TypeScript contract definitions

**Routers** (5 files):

**`contracts/accounts.ts`**:
```typescript
// Account CRUD
accounts.create({ name, type, currencyId, balance })
accounts.list({ includeArchived?: boolean })
accounts.getById({ id })
accounts.update({ id, name?, type?, currencyId? }) // balance updated via transactions
accounts.archive({ id }) // soft delete
accounts.unarchive({ id })
accounts.checkDeletable({ id }) // returns { deletable: boolean, transactionCount: number }
```

**`contracts/categories.ts`**:
```typescript
// Category CRUD
categories.create({ name, type, color, icon })
categories.list({ type?: 'Expense' | 'Income', includeArchived?: boolean })
categories.getById({ id })
categories.update({ id, name?, color?, icon? })
categories.archive({ id })
categories.unarchive({ id })
categories.checkDeletable({ id })
```

**`contracts/payees.ts`**:
```typescript
// Payee CRUD
payees.create({ name, type, defaultCategoryId? })
payees.list({ includeArchived?: boolean })
payees.getById({ id })
payees.update({ id, name?, type?, defaultCategoryId? })
payees.delete({ id }) // conditional: hard if unused, soft if used
payees.unarchive({ id })
payees.search({ query }) // autocomplete support
```

**`contracts/currencies.ts`**:
```typescript
// Currency CRUD
currencies.create({ code, symbol, name, exchangeRate })
currencies.list({ includeArchived?: boolean })
currencies.getById({ id })
currencies.update({ id, symbol?, name?, exchangeRate? })
currencies.archive({ id })
currencies.unarchive({ id })
currencies.updateExchangeRate({ id, exchangeRate }) // special endpoint
currencies.getDefault() // returns EUR or current default
```

**`contracts/settings.ts`**:
```typescript
// Settings get/update (singleton)
settings.get() // returns current settings or creates with defaults
settings.update({ defaultCurrencyId?, theme?, aiEnabled? })
```

### 1.3 Quickstart Guide (30 min)

**Task**: Create developer onboarding documentation.

**Deliverable**: `specs/002-master-tables/quickstart.md`

**Content**:
- Prerequisites checklist (Foundation Phase complete, PostgreSQL running)
- Local development setup (database migration, seed data)
- Testing strategy (unit tests first, then E2E)
- Common development tasks (add entity, add validation, add UI component)
- Troubleshooting guide (common errors, solutions)

### 1.4 Update Agent Context (15 min)

**Task**: Update AI assistant context with new technologies and patterns.

**Command**: `.\.specify\scripts\powershell\update-agent-context.ps1 -AgentType copilot`

**Updates**:
- Add lucide-react to technology list
- Add React Hook Form patterns
- Add Zod validation patterns
- Add Drizzle migration workflow

**Output**: Updated `.github/copilot-instructions.md`

---

## Phase 2: Implementation Subphases

**Total Duration**: 40-55 hours  
**Prerequisites**: Phase 0 and Phase 1 complete

### Overview

Implementation is organized into logical subphases with clear dependencies:

1. **Database Layer** (8-10 hours) - Foundation for all other work
2. **API Layer** (10-12 hours) - Depends on Database
3. **UI Components** (12-15 hours) - Depends on API
4. **UX/Design Polish** (4-6 hours) - Depends on UI Components
5. **Testing** (8-10 hours) - Parallel with implementation (TDD)
6. **Documentation** (2-3 hours) - Final step

**Parallelization Opportunities**:
- Database + Validation schemas (can be done together)
- API routers for different entities (parallel after Currency/Settings)
- UI components for different entities (parallel after shared components)
- Unit tests written before implementation (TDD workflow)

---

### Subphase 2.1: Database Layer

**Duration**: 8-10 hours  
**Prerequisites**: Phase 1 data-model.md complete  
**Quality Gate**: Migration runs without errors, all tables created with correct constraints

#### Tasks

**2.1.1 Drizzle Schema Definitions** (3 hours)
- Extend `server/db/schema.ts` with 5 new table schemas
- Define enums: AccountType, CategoryType, PayeeType, Theme
- Add foreign key relationships with cascade rules
- Add unique constraints and indexes
- **TDD**: Write schema tests verifying field types and constraints

**2.1.2 Create Migration** (1 hour)
- Run `npm run db:generate` to create migration file
- Review generated SQL for correctness
- Test migration on clean database
- **Verification**: `npm run db:migrate` succeeds

**2.1.3 Seed Data Script** (2 hours)
- Create `server/db/seed.ts` with:
  - EUR currency (code: 'EUR', symbol: '€', rate: 1.0)
  - 20 default categories (from research.md)
  - Default settings record
- Add seed command to package.json: `npm run db:seed`
- **TDD**: Write tests verifying seed data structure

**2.1.4 Database Utilities** (2 hours)
- Create helper functions for common queries:
  - `checkEntityHasTransactions(entityType, id)` - for delete validation
  - `getUnarchivedEntities(tableName)` - default list query
- Add to `/lib/db-utils.ts`
- **TDD**: Write unit tests for each utility function

**Dependencies**: None (first subphase)  
**Can Parallelize**: Schema definitions + Validation schemas (Subphase 2.2.1)

**Quality Gate Checklist**:
- [ ] All 5 tables created in database
- [ ] Foreign keys enforce referential integrity
- [ ] Unique constraints prevent duplicate names
- [ ] Migration reversible with `db:rollback`
- [ ] Seed script creates EUR currency + 20 categories + default settings
- [ ] Schema tests pass (100% coverage on table definitions)

---

### Subphase 2.2: Validation Layer

**Duration**: 4-5 hours  
**Prerequisites**: Database schema defined  
**Quality Gate**: All Zod schemas validate correctly, 100% test coverage

#### Tasks

**2.2.1 Zod Validation Schemas** (3 hours)
- Create `/lib/validations/account.ts` - Account create/update schemas
- Create `/lib/validations/category.ts` - Category create/update schemas
- Create `/lib/validations/payee.ts` - Payee create/update schemas
- Create `/lib/validations/currency.ts` - Currency create/update schemas with ISO 4217 validation
- Create `/lib/validations/settings.ts` - Settings update schema
- **TDD**: Write validation tests for each schema (valid inputs, invalid inputs, edge cases)

**2.2.2 Constants and Enums** (1 hour)
- Create `/lib/constants/account-types.ts` - AccountType enum
- Create `/lib/constants/category-types.ts` - CategoryType enum
- Create `/lib/constants/currency-codes.ts` - ISO 4217 codes array (180 codes)
- Create `/lib/constants/default-categories.ts` - Default category definitions
- **TDD**: Write tests verifying enum values and constants

**Dependencies**: Database schema (for type alignment)  
**Can Parallelize**: Yes - with Subphase 2.1.1 (Database schemas)

**Quality Gate Checklist**:
- [ ] All validation schemas export create/update/delete input types
- [ ] Currency code validation rejects invalid ISO 4217 codes
- [ ] Category name uniqueness enforced (case-insensitive)
- [ ] Account name uniqueness enforced
- [ ] Balance stored as integer cents (no decimals accepted)
- [ ] All validation tests pass (50+ tests total)
- [ ] 100% coverage on validation logic

---

### Subphase 2.3: API Layer (tRPC Routers)

**Duration**: 10-12 hours  
**Prerequisites**: Database + Validation layers complete  
**Quality Gate**: All endpoints functional, input validation working, unit tests passing

#### Tasks

**2.3.1 Currency Router** (2 hours)
- Create `server/trpc/routers/currencies.ts`
- Implement: create, list, getById, update, archive, unarchive, updateExchangeRate, getDefault
- Use Zod schemas for input validation
- **TDD**: Write router tests (15+ tests covering all endpoints and edge cases)

**2.3.2 Settings Router** (1.5 hours)
- Create `server/trpc/routers/settings.ts`
- Implement: get (with auto-create if not exists), update
- **TDD**: Write router tests (8+ tests)

**2.3.3 Category Router** (2 hours)
- Create `server/trpc/routers/categories.ts`
- Implement: create, list (with type filter), getById, update, archive, unarchive, checkDeletable
- Add duplicate name validation (case-insensitive)
- **TDD**: Write router tests (18+ tests)

**2.3.4 Account Router** (2.5 hours)
- Create `server/trpc/routers/accounts.ts`
- Implement: create, list, getById, update, archive, unarchive, checkDeletable
- Add balance calculation logic (initial balance only in this phase)
- **TDD**: Write router tests (20+ tests including currency relationship)

**2.3.5 Payee Router** (2 hours)
- Create `server/trpc/routers/payees.ts`
- Implement: create, list, getById, update, delete (conditional), unarchive, search (autocomplete)
- Add transaction count check for conditional delete
- **TDD**: Write router tests (15+ tests)

**2.3.6 Router Registration** (0.5 hours)
- Update `server/trpc/root.ts` to register 5 new routers
- Update tRPC context if needed
- Verify type safety across client/server boundary

**Dependencies**: Subphase 2.1 (Database) + Subphase 2.2 (Validation)  
**Can Parallelize**: Yes - routers are independent after Currency/Settings (needed for FKs)

**Execution Order**:
1. Currency + Settings (parallel) - no dependencies
2. Category + Account + Payee (parallel) - depend on Currency/Settings

**Quality Gate Checklist**:
- [ ] All 20+ endpoints implemented and functional
- [ ] Input validation via Zod prevents invalid data
- [ ] Foreign key violations handled gracefully (user-friendly errors)
- [ ] Soft delete logic prevents deletion of entities with transactions
- [ ] Conditional delete for Payees works correctly
- [ ] All router unit tests pass (75+ tests total)
- [ ] tRPC type inference works client-side (no `any` types)
- [ ] API response times <500ms p95 (measured via tests)

---

### Subphase 2.4: UI Components Library

**Duration**: 6-8 hours  
**Prerequisites**: shadcn/ui setup from Foundation, Liquid Glass tokens configured  
**Quality Gate**: All base components render with Liquid Glass styling, accessible (WCAG 2.1 AA)

#### Tasks

**2.4.1 Install shadcn/ui Components** (2 hours)
- Run `npx shadcn@latest add card dialog form input select table toast`
- Customize each component for Liquid Glass aesthetic:
  - `card.tsx`: Add `bg-white/10 backdrop-blur-md border-white/20 rounded-2xl`
  - `dialog.tsx`: Apply glass treatment to modal overlay and content
  - `form.tsx`: Integrate React Hook Form + Zod
  - `input.tsx`: Glass input with 5% transparency
  - `select.tsx`: Glass dropdown with blur effect
  - `table.tsx`: Semi-opaque for readability
  - `toast.tsx`: Glass toast notifications
- **Testing**: Visual regression tests for each component

**2.4.2 Shared Form Components** (2 hours)
- Create `components/shared/form-field.tsx` - Reusable form field wrapper
- Create `components/shared/delete-confirm-dialog.tsx` - Confirmation modal
- Create `components/shared/archive-toggle.tsx` - Show archived toggle
- Create `components/shared/currency-display.tsx` - Format currency with symbol
- **Testing**: Component tests for each shared component

**2.4.3 Icon Picker Component** (2 hours)
- Install lucide-react: `npm install lucide-react`
- Create `components/categories/category-icon-picker.tsx`
- Curate 60 icons for common categories
- Grid layout with search/filter
- **Testing**: Icon selection interaction tests

**Dependencies**: Foundation Phase (shadcn/ui setup, TailwindCSS 4.x)  
**Can Parallelize**: Yes - all tasks can be done in parallel

**Quality Gate Checklist**:
- [ ] All shadcn/ui components installed and customized
- [ ] Liquid Glass aesthetic applied consistently (glass blur, rounded-2xl, neutral colors)
- [ ] All components accessible (keyboard navigation, ARIA labels, screen reader support)
- [ ] Icon picker renders 60 curated icons
- [ ] Form components integrate React Hook Form + Zod
- [ ] Visual regression tests pass
- [ ] Component tests pass (20+ tests)

---

### Subphase 2.5: Feature-Specific UI

**Duration**: 12-15 hours  
**Prerequisites**: Subphase 2.3 (API) + Subphase 2.4 (UI Components)  
**Quality Gate**: All 5 CRUD screens functional, forms validate, Liquid Glass design applied

#### Tasks

**2.5.1 Accounts Management** (3 hours)
- Create `app/(dashboard)/accounts/page.tsx` - Accounts list page
  - Group accounts by type (Bank, Credit Card, Wallet)
  - Display balance with currency symbol
  - Show archived toggle
  - Add/Edit/Archive buttons
- Create `app/(dashboard)/accounts/[id]/page.tsx` - Account detail/edit
- Create `components/accounts/account-form.tsx` - Create/edit form with validation
- Create `components/accounts/account-list.tsx` - Grouped accounts list
- Create `components/accounts/account-card.tsx` - Single account card with glass effect
- **Testing**: E2E tests for account CRUD workflow (6 scenarios from spec)

**2.5.2 Categories Management** (3 hours)
- Create `app/(dashboard)/categories/page.tsx` - Categories list with tabs (Expense/Income)
- Create `components/categories/category-form.tsx` - Create/edit form with icon picker
- Create `components/categories/category-list.tsx` - Categories list with color swatches
- **Testing**: E2E tests for category CRUD workflow (5 scenarios)

**2.5.3 Payees Management** (2.5 hours)
- Create `app/(dashboard)/payees/page.tsx` - Payees list
- Create `components/payees/payee-form.tsx` - Create/edit form
- Create `components/payees/payee-autocomplete.tsx` - Search autocomplete input
- **Testing**: E2E tests for payee CRUD workflow (3 scenarios)

**2.5.4 Currencies Management** (2 hours)
- Create `app/(dashboard)/currencies/page.tsx` - Currencies list with EUR highlighted
- Create `components/currencies/currency-form.tsx` - Create/edit form with ISO 4217 validation
- Create `components/currencies/currency-list.tsx` - Currencies table with exchange rates
- **Testing**: E2E tests for currency CRUD workflow (4 scenarios)

**2.5.5 Settings Page** (1.5 hours)
- Create `app/(dashboard)/settings/page.tsx` - Settings form page
- Create `components/settings/settings-form.tsx` - Settings form (currency, theme, AI toggle)
- **Testing**: E2E tests for settings update (3 scenarios)

**Dependencies**: Subphase 2.3 (API endpoints) + Subphase 2.4 (UI components)  
**Can Parallelize**: Yes - all 5 features can be developed in parallel

**Quality Gate Checklist**:
- [ ] All 5 CRUD screens functional and navigable
- [ ] Forms validate input client-side (React Hook Form + Zod)
- [ ] Server-side validation errors display inline
- [ ] Toast notifications show success/error feedback within 2s
- [ ] Liquid Glass design applied consistently (gradient background, glass cards, blur effects)
- [ ] All E2E tests pass (25+ scenarios total)
- [ ] Accessibility: Keyboard navigation, focus management, ARIA labels
- [ ] Responsive design works on desktop (1280px+) and tablet (768px+)

---

### Subphase 2.6: UX/Design Polish

**Duration**: 4-6 hours  
**Prerequisites**: Subphase 2.5 (Feature UI) complete  
**Quality Gate**: All Success Criteria met, design consistency verified

#### Tasks

**2.6.1 Liquid Glass Refinement** (2 hours)
- Audit all screens for consistent glass treatment
- Verify neutral color palette (f5f7fa → e9ecf5 gradient)
- Check rounded-2xl corners on all cards/modals
- Verify backdrop blur effects (backdrop-blur-md)
- Adjust opacity levels for optimal readability (10% glass for surfaces)
- **Testing**: Visual regression testing, screenshot comparison

**2.6.2 Framer Motion Transitions** (1.5 hours)
- Add page transition animations (opacity 0.9 → 1)
- Add modal fade-in effects (blur fade-in)
- Add list item animations (stagger children)
- Keep transitions subtle (200-300ms duration)
- **Testing**: Animation performance (60fps target)

**2.6.3 Empty States & Loading States** (1 hour)
- Design empty state for each list view (no accounts, no categories, etc.)
- Add skeleton loaders for data fetching
- Add loading spinners for form submissions
- **Testing**: Test slow network conditions

**2.6.4 Error Handling UX** (1.5 hours)
- Design error toast notifications
- Add inline validation error messages (red text, icon)
- Add confirmation dialogs for destructive actions (delete, archive)
- Handle network errors gracefully (retry button)
- **Testing**: Test error scenarios (validation, network, server errors)

**Dependencies**: Subphase 2.5 (Feature UI)  
**Can Parallelize**: Partial - some tasks can overlap with 2.5 development

**Quality Gate Checklist**:
- [ ] SC-210: All screens follow Liquid Glass design (blur, rounded-2xl, neutral palette)
- [ ] SC-203: All CRUD operations provide feedback within 2s
- [ ] SC-204: Validation errors display inline within 500ms
- [ ] Transitions smooth and performant (60fps, no jank)
- [ ] Empty states guide users to create first record
- [ ] Loading states prevent user confusion during data fetch
- [ ] Error messages user-friendly and actionable
- [ ] Confirmation dialogs prevent accidental deletions

---

### Subphase 2.7: Testing & Quality Assurance

**Duration**: 8-10 hours  
**Prerequisites**: Implementation complete (TDD tests written during development)  
**Quality Gate**: 80%+ coverage, all tests passing, performance targets met

#### Tasks

**2.7.1 Unit Test Completion** (3 hours)
- Review unit test coverage for validation schemas (target: 100%)
- Review unit test coverage for tRPC routers (target: 85%+)
- Review unit test coverage for utility functions (target: 100%)
- Add missing tests for edge cases
- **Command**: `npm run test:coverage`
- **Target**: 80%+ overall coverage, 100% on business logic

**2.7.2 E2E Test Completion** (4 hours)
- Verify all user scenarios from spec have E2E tests (25+ scenarios)
- Test all acceptance criteria (Given/When/Then scenarios)
- Test edge cases (delete with transactions, duplicate names, currency changes)
- Test cross-entity workflows (create account → requires currency)
- **Command**: `npm run test:e2e`
- **Target**: All user stories testable independently

**2.7.3 Performance Testing** (1.5 hours)
- Measure API response times (p50, p95, p99)
- Measure page load times (Time to Interactive)
- Measure form submission feedback timing
- **Targets**:
  - API <500ms p95 (SC-203)
  - Page load <2s interactive
  - Form feedback <200ms (SC-204)
  - Validation inline <500ms (SC-204)

**2.7.4 Accessibility Audit** (1.5 hours)
- Run axe DevTools on all pages
- Test keyboard navigation (Tab, Enter, Esc)
- Test screen reader compatibility (NVDA/JAWS)
- Verify ARIA labels and roles
- Test color contrast ratios
- **Target**: WCAG 2.1 AA compliance (Constitution requirement)

**Dependencies**: All implementation subphases  
**Can Parallelize**: No - final quality assurance step

**Quality Gate Checklist**:
- [ ] 80%+ unit test coverage (jest --coverage)
- [ ] All 25+ E2E tests pass (Playwright)
- [ ] SC-202: Account creation <30s end-to-end
- [ ] SC-203: CRUD operations provide feedback <2s
- [ ] SC-204: Validation errors <500ms
- [ ] SC-205: Zero orphaned records (referential integrity verified)
- [ ] SC-206: Account setup (3+ accounts) completable in <5 min
- [ ] SC-207: 50+ custom categories supported without degradation
- [ ] SC-208: Multi-currency totals display correctly
- [ ] SC-209: Settings changes take effect immediately
- [ ] WCAG 2.1 AA compliance verified
- [ ] No console errors or warnings in production build

---

### Subphase 2.8: Documentation

**Duration**: 2-3 hours  
**Prerequisites**: Implementation and testing complete  
**Quality Gate**: README updated, inline comments complete, API docs generated

#### Tasks

**2.8.1 Update README** (1 hour)
- Document new features (Accounts, Categories, Payees, Currencies, Settings)
- Update environment variables if any
- Update database setup instructions
- Add screenshots of new UI
- **File**: `README.md`

**2.8.2 Inline Code Documentation** (1 hour)
- Add JSDoc comments to all public API functions
- Add comments explaining complex business logic
- Document Zod schemas with examples
- **Target**: All exported functions documented

**2.8.3 Update CONTRIBUTING.md** (30 min)
- Add guidance for adding new entities
- Document validation schema patterns
- Document Liquid Glass customization process
- **File**: `CONTRIBUTING.md`

**Dependencies**: All implementation complete  
**Can Parallelize**: No - final documentation step

**Quality Gate Checklist**:
- [ ] README reflects current state of Phase 2
- [ ] All new environment variables documented
- [ ] Database migration instructions clear
- [ ] Screenshots showcase Liquid Glass aesthetic
- [ ] All public APIs have JSDoc comments
- [ ] CONTRIBUTING.md updated with Phase 2 patterns

---

## Implementation Timeline

### Sequential Path (Single Developer)

**Week 1** (40 hours):
- Day 1: Phase 0 (Research) + Phase 1 (Design) - 5 hours
- Day 2: Database Layer (2.1) + Validation (2.2) - 8 hours
- Day 3: API Layer (2.3) - Currency, Settings, Category - 7 hours
- Day 4: API Layer (2.3) - Account, Payee + UI Components (2.4 start) - 8 hours
- Day 5: UI Components (2.4 finish) + Feature UI (2.5 start) - 8 hours

**Week 2** (20 hours):
- Day 6: Feature UI (2.5 continue) - Accounts, Categories - 6 hours
- Day 7: Feature UI (2.5 finish) - Payees, Currencies, Settings - 6 hours
- Day 8: UX/Design Polish (2.6) + Testing (2.7 start) - 8 hours

**Total**: 45-48 hours (6-7 working days)

### Parallel Path (Team of 3)

**Developer 1** (Database + API): 15-18 hours
- Phase 0 + Phase 1 (2 hours)
- Database Layer (2.1) - 8 hours
- Validation Layer (2.2) - 4 hours
- API Layer (2.3) - Currency, Settings - 3 hours

**Developer 2** (API + Backend UI): 16-19 hours
- API Layer (2.3) - Category, Account, Payee - 7 hours
- Feature UI (2.5) - Accounts, Categories - 6 hours
- Testing (2.7) - Backend tests - 3 hours

**Developer 3** (UI + Frontend): 14-17 hours
- UI Components (2.4) - 6 hours
- Feature UI (2.5) - Payees, Currencies, Settings - 6 hours
- UX/Design Polish (2.6) - 4 hours

**Shared** (Final QA): 4-6 hours
- Testing (2.7) - Integration + E2E - 3 hours
- Documentation (2.8) - 2 hours

**Total**: 3-4 working days (with team coordination overhead)

---

## Deliverables Checklist

### Phase 0 & 1 Outputs
- [x] `specs/002-master-tables/research.md` - Technical decisions documented
- [ ] `specs/002-master-tables/data-model.md` - Entity schemas and relationships
- [ ] `specs/002-master-tables/contracts/` - API contract definitions (5 files)
- [ ] `specs/002-master-tables/quickstart.md` - Developer onboarding guide
- [ ] `.github/copilot-instructions.md` - Updated with Phase 2 technologies

### Database Layer
- [ ] 5 Drizzle schemas in `server/db/schema.ts` (Currency, Settings, Category, Account, Payee)
- [ ] Migration file `drizzle/migrations/0002_master_tables.sql`
- [ ] Seed script `server/db/seed.ts` (EUR + 20 categories + default settings)
- [ ] Database utilities in `/lib/db-utils.ts`

### Validation Layer
- [ ] 5 Zod validation schemas in `/lib/validations/` (account, category, payee, currency, settings)
- [ ] 4 constants files in `/lib/constants/` (account-types, category-types, currency-codes, default-categories)

### API Layer
- [ ] 5 tRPC routers in `/server/trpc/routers/` (accounts, categories, payees, currencies, settings)
- [ ] Router registration in `server/trpc/root.ts`
- [ ] 75+ router unit tests in `/tests/unit/server/trpc/routers/`

### UI Layer
- [ ] 7 shadcn/ui components customized for Liquid Glass (`components/ui/`)
- [ ] 4 shared components (`components/shared/`)
- [ ] 15 feature-specific components across 5 entity folders
- [ ] 5 App Router pages (`app/(dashboard)/*/page.tsx`)
- [ ] Dashboard layout with navigation (`app/(dashboard)/layout.tsx`)

### Testing
- [ ] 50+ unit tests for validations and routers
- [ ] 25+ E2E tests for all user scenarios (Playwright)
- [ ] 80%+ code coverage on business logic
- [ ] Performance benchmarks documented (API <500ms, page load <2s)
- [ ] Accessibility audit report (WCAG 2.1 AA compliance)

### Documentation
- [ ] Updated README.md with Phase 2 features
- [ ] Updated CONTRIBUTING.md with Phase 2 patterns
- [ ] JSDoc comments on all public APIs
- [ ] Screenshots of Liquid Glass UI in documentation

### Success Criteria Verification

Match all Success Criteria from spec.md:

- [ ] **SC-201**: All 5 entities have functional CRUD operations through UI
- [ ] **SC-202**: Account creation completes in <30s
- [ ] **SC-203**: CRUD operations provide feedback within 2s
- [ ] **SC-204**: Validation errors display inline within 500ms
- [ ] **SC-205**: Zero orphaned records (referential integrity enforced)
- [ ] **SC-206**: Account setup (3+ accounts) completes in <5 minutes
- [ ] **SC-207**: 50+ custom categories supported without performance degradation
- [ ] **SC-208**: Multi-currency totals display with conversion indicators
- [ ] **SC-209**: Settings changes take effect immediately
- [ ] **SC-210**: All screens follow Liquid Glass design language

---

## Risk Mitigation

### Risk 1: Currency Code Validation Complexity
**Mitigation**: Static ISO 4217 list in constants (Decision 2 from research.md). No external API dependency.

### Risk 2: Soft Delete Complexity
**Mitigation**: Clear decision matrix in research.md (Decision 4). Conditional logic in Payee router only.

### Risk 3: Liquid Glass Performance
**Mitigation**: Use CSS backdrop-filter sparingly, test on mid-range hardware, provide fallback for low-end devices.

### Risk 4: Test Coverage Goals
**Mitigation**: TDD workflow enforced - write tests before implementation. Quality gate blocks merge if <80% coverage.

### Risk 5: Accessibility Compliance
**Mitigation**: Use shadcn/ui components (accessible by default), audit early with axe DevTools, test with screen readers.

---

## Next Steps

1. **Complete Phase 1**: Generate data-model.md and contracts/
2. **Run agent context update**: Update .github/copilot-instructions.md
3. **Proceed to /speckit.tasks**: Break down implementation into granular tasks
4. **Begin TDD implementation**: Start with Database Layer (2.1)

**Status**: ✅ Plan ready for execution. Proceed to `/speckit.tasks` command to generate detailed task breakdown.
