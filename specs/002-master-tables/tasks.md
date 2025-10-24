# Tasks: Core Master Tables & App Setup

**Feature**: 002-master-tables  
**Input**: Design documents from `/specs/002-master-tables/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: TDD workflow enforced - tests written FIRST, must FAIL before implementation

**Organization**: Tasks grouped by user story to enable independent implementation and testing. Each user story is a complete, deployable increment.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1=Accounts, US2=Categories, US4=Currencies, US3=Payees, US5=Settings)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Repository root with `/app`, `/components`, `/lib`, `/server`, `/tests`
- All paths relative to `cora-finance-v2/` repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and tool installation

**Duration**: 30 minutes

- [x] T001 Install lucide-react dependency for category icons (`npm install lucide-react`)
- [x] T002 [P] Install shadcn/ui components: card, dialog, form, input, select, table, sonner (`npx shadcn@latest add`)
- [x] T003 [P] Create constants directory structure (`lib/constants/`)
- [x] T004 [P] Create validations directory structure (`lib/validations/`)

**Checkpoint**: Development dependencies installed, directory structure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Duration**: 6-8 hours

### Database Layer (Foundation)

- [x] T005 Define AccountType enum in `server/db/schema.ts` (values: Bank, CreditCard, Wallet)
- [x] T006 [P] Define CategoryType enum in `server/db/schema.ts` (values: Expense, Income)
- [x] T007 [P] Define PayeeType enum in `server/db/schema.ts` (values: person, vendor)
- [x] T008 [P] Define Theme enum in `server/db/schema.ts` (values: light, dark, auto)

### Constants & Configuration

- [x] T009 [P] Create ISO 4217 currency codes constant in `lib/constants/currency-codes.ts` (180 currency codes array)
- [x] T010 [P] Create default categories constant in `lib/constants/default-categories.ts` (20 categories: 15 Expense, 5 Income)
- [x] T011 [P] Create account types constant in `lib/constants/account-types.ts` (export AccountType enum for validation)
- [x] T012 [P] Create category types constant in `lib/constants/category-types.ts` (export CategoryType enum)

### Shared UI Components (Liquid Glass Customization)

- [x] T013 [P] Customize Card component in `components/ui/card.tsx` (apply bg-white/10, backdrop-blur-md, border-white/20, rounded-2xl)
- [x] T014 [P] Customize Dialog component in `components/ui/dialog.tsx` (glass modal with backdrop blur)
- [x] T015 [P] Customize Input component in `components/ui/input.tsx` (glass input with 5% transparency)
- [x] T016 [P] Customize Select component in `components/ui/select.tsx` (glass dropdown with blur)
- [x] T017 [P] Customize Table component in `components/ui/table.tsx` (semi-opaque for readability)
- [x] T018 [P] Customize Sonner component in `components/ui/sonner.tsx` (glass toast notifications)
- [x] T019 Create Form component in `components/ui/form.tsx` (React Hook Form + Zod integration)

### Shared Feature Components

- [x] T020 [P] Create FormField wrapper in `components/shared/form-field.tsx` (reusable field with label + error)
- [x] T021 [P] Create DeleteConfirmDialog in `components/shared/delete-confirm-dialog.tsx` (confirmation modal for destructive actions)
- [x] T022 [P] Create ArchiveToggle in `components/shared/archive-toggle.tsx` (show/hide archived items toggle)
- [x] T023 [P] Create CurrencyDisplay in `components/shared/currency-display.tsx` (format currency with symbol)

### Dashboard Layout

- [x] T024 Create dashboard layout in `app/(dashboard)/layout.tsx` (navigation sidebar with Liquid Glass styling)
- [x] T025 Update root layout in `app/layout.tsx` (add Liquid Glass gradient background: f5f7fa → e9ecf5)

**Checkpoint**: Foundation ready - all shared infrastructure complete. User story implementation can now begin in parallel.

---

## Phase 3: User Story 4 - Currency Configuration (Priority: P2) 🎯 FOUNDATIONAL

**Goal**: Enable multi-currency support with EUR as default. MUST complete before User Story 1 (Accounts depend on Currency).

**Independent Test**: Can create, list, update currencies. EUR pre-configured. Exchange rates updateable. All without needing accounts or other entities.

**Duration**: 3-4 hours

### Database Schema (Currency)

- [ ] T026 [US4] Create Currency table schema in `server/db/schema.ts` (id, code, symbol, name, exchangeRate, lastUpdated, archived, createdAt, updatedAt)
- [ ] T027 [US4] Add unique index on currency code in `server/db/schema.ts`
- [ ] T028 [US4] Add archived index on currencies in `server/db/schema.ts`

### Validation Layer (Currency)

- [ ] T029 [P] [US4] Write unit tests for currency validation in `tests/unit/lib/validations/currency.test.ts` (10+ tests: valid data, invalid ISO code, negative rate, etc.)
- [x] T030 [US4] Create currency validation schemas in `lib/validations/currency.ts` (createCurrencySchema, updateCurrencySchema with ISO 4217 validation)

### API Layer (Currency)

- [ ] T031 [P] [US4] Write unit tests for currency router in `tests/unit/server/trpc/routers/currencies.test.ts` (15+ tests: CRUD, getDefault, updateExchangeRate, archive)
- [x] T032 [US4] Create currencies tRPC router in `server/trpc/routers/currencies.ts` (create, list, getById, update, archive, unarchive, updateExchangeRate, getDefault)
- [x] T033 [US4] Register currencies router in `server/trpc/root.ts`

### UI Layer (Currency)

- [x] T034 [P] [US4] Create currency form component in `components/currencies/currency-form.tsx` (React Hook Form + Zod, ISO 4217 validation)
- [x] T035 [P] [US4] Create currency list component in `components/currencies/currency-list.tsx` (table with exchange rates, EUR highlighted)
- [x] T036 [US4] Create currencies page in `app/(dashboard)/currencies/page.tsx` (list view with add/edit/archive actions)

### E2E Tests (Currency)

- [ ] T037 [P] [US4] Write E2E test for viewing default EUR in `tests/e2e/currencies.spec.ts` (scenario 1)
- [ ] T038 [P] [US4] Write E2E test for adding new currency in `tests/e2e/currencies.spec.ts` (scenario 2)
- [ ] T039 [P] [US4] Write E2E test for updating exchange rate in `tests/e2e/currencies.spec.ts` (scenario 4)

### Database Migration & Seed

- [x] T040 [US4] Generate Drizzle migration for Currency table for Currency table (`npm run db:generate`)
- [x] T041 [US4] Create seed script for EUR currency in `server/db/seed.ts` currency in `server/db/seed.ts` (code: EUR, symbol: €, rate: 1.0)
- [ ] T042 [US4] Apply migration (⚠️ Requires database connection) (`npm run db:migrate`)
- [ ] T043 [US4] Run seed script (⚠️ Requires database connection) (`npm run db:seed`)

**Checkpoint**: Currency management fully functional. EUR seeded. Accounts can now reference currencies.

---

## Phase 4: User Story 5 - Application Settings (Priority: P3) 🎯 FOUNDATIONAL

**Goal**: Configure app-level preferences (default currency, theme, AI). MUST complete before User Story 1 (Settings defines default currency for new accounts).

**Independent Test**: Can view/update settings singleton. Changes take effect immediately. No other entities needed.

**Duration**: 2-3 hours

### Database Schema (Settings)

- [ ] T044 [US5] Create Settings table schema in `server/db/schema.ts` (id, defaultCurrencyId FK, theme enum, aiEnabled, createdAt, updatedAt)
- [ ] T045 [US5] Add foreign key constraint Settings.defaultCurrencyId → Currency.id RESTRICT in `server/db/schema.ts`

### Validation Layer (Settings)

- [ ] T046 [P] [US5] Write unit tests for settings validation in `tests/unit/lib/validations/settings.test.ts` (8+ tests: valid updates, invalid currency, theme enum)
- [ ] T047 [US5] Create settings validation schemas in `lib/validations/settings.ts` (updateSettingsSchema only - get has no input)

### API Layer (Settings)

- [ ] T048 [P] [US5] Write unit tests for settings router in `tests/unit/server/trpc/routers/settings.test.ts` (10+ tests: get with auto-create, update, FK validation)
- [ ] T049 [US5] Create settings tRPC router in `server/trpc/routers/settings.ts` (get with auto-create logic, update)
- [ ] T050 [US5] Register settings router in `server/trpc/root.ts`

### UI Layer (Settings)

- [x] T051 [P] [US5] Create settings form component in `components/settings/settings-form.tsx` (React Hook Form, currency dropdown, theme radio, AI toggle)
- [x] T052 [US5] Create settings page in `app/(dashboard)/settings/page.tsx` (form view with real-time updates)

### E2E Tests (Settings)

- [ ] T053 [P] [US5] Write E2E test for changing default currency in `tests/e2e/settings.spec.ts` (scenario 1)
- [ ] T054 [P] [US5] Write E2E test for toggling AI features in `tests/e2e/settings.spec.ts` (scenario 2)
- [ ] T055 [P] [US5] Write E2E test for changing theme in `tests/e2e/settings.spec.ts` (scenario 3)

### Database Migration & Seed

- [ ] T056 [US5] Generate Drizzle migration for Settings table (`npm run db:generate`)
- [ ] T057 [US5] Add seed logic for default settings in `server/db/seed.ts` (defaultCurrency: EUR, theme: light, aiEnabled: true)
- [ ] T058 [US5] Apply migration (`npm run db:migrate`)
- [ ] T059 [US5] Run seed script (`npm run db:seed`)

**Checkpoint**: Settings singleton functional. Default currency configured. New accounts will use EUR by default.

---

## Phase 5: User Story 2 - Category Organization (Priority: P2) 🎯 INDEPENDENT

**Goal**: Manage expense/income categories with pre-seeded defaults. Independent of accounts - users can organize categories before tracking finances.

**Independent Test**: Can CRUD categories. 20 defaults visible on first view. Duplicate prevention works. Icon picker functional. No accounts needed.

**Duration**: 4-5 hours

### Database Schema (Category)

- [ ] T060 [US2] Create Category table schema in `server/db/schema.ts` (id, name, type enum, color, icon, archived, createdAt, updatedAt)
- [ ] T061 [US2] Add unique composite index on (name, type) in `server/db/schema.ts` (case-insensitive enforced by app)
- [ ] T062 [US2] Add index on (type, archived) for filtered queries in `server/db/schema.ts`

### Validation Layer (Category)

- [ ] T063 [P] [US2] Write unit tests for category validation in `tests/unit/lib/validations/category.test.ts` (12+ tests: valid data, duplicate name, invalid hex color, icon validation)
- [ ] T064 [US2] Create category validation schemas in `lib/validations/category.ts` (createCategorySchema, updateCategorySchema with color regex, icon enum)

### API Layer (Category)

- [ ] T065 [P] [US2] Write unit tests for category router in `tests/unit/server/trpc/routers/categories.test.ts` (18+ tests: CRUD, type filter, duplicate prevention, checkDeletable)
- [ ] T066 [US2] Create categories tRPC router in `server/trpc/routers/categories.ts` (create, list with type filter, getById, update, archive, unarchive, checkDeletable)
- [ ] T067 [US2] Register categories router in `server/trpc/root.ts`

### UI Layer (Category)

- [ ] T068 [P] [US2] Create category icon picker component in `components/categories/category-icon-picker.tsx` (grid of 60 curated lucide-react icons with search)
- [x] T069 [P] [US2] Create category form component in `components/categories/category-form.tsx` (React Hook Form, icon picker, color picker, type radio)
- [x] T070 [P] [US2] Create category list component in `components/categories/category-list.tsx` (tabs for Expense/Income, color swatches, icon display)
- [x] T071 [US2] Create categories page in `app/(dashboard)/categories/page.tsx` (tabbed list view with add/edit/archive)

### E2E Tests (Category)

- [ ] T072 [P] [US2] Write E2E test for viewing default categories in `tests/e2e/categories.spec.ts` (scenario 1: see 20 pre-seeded)
- [ ] T073 [P] [US2] Write E2E test for creating new category in `tests/e2e/categories.spec.ts` (scenario 2: fill form, see in list)
- [ ] T074 [P] [US2] Write E2E test for editing category in `tests/e2e/categories.spec.ts` (scenario 3: change color/icon)
- [ ] T075 [P] [US2] Write E2E test for duplicate prevention in `tests/e2e/categories.spec.ts` (scenario 4: see validation error)
- [ ] T076 [P] [US2] Write E2E test for deleting unused category in `tests/e2e/categories.spec.ts` (scenario 5: confirm deletion)

### Database Migration & Seed

- [ ] T077 [US2] Generate Drizzle migration for Category table (`npm run db:generate`)
- [ ] T078 [US2] Add seed logic for 20 default categories in `server/db/seed.ts` (15 Expense, 5 Income with icons/colors)
- [ ] T079 [US2] Apply migration (`npm run db:migrate`)
- [ ] T080 [US2] Run seed script (`npm run db:seed`)

**Checkpoint**: Category management fully functional. 20 defaults visible. Users can customize category system independently.

---

## Phase 6: User Story 1 - Account Management (Priority: P1) 🎯 MVP CORE

**Goal**: Manage financial accounts (bank, credit card, wallet) with multi-currency support. THE FOUNDATION of personal finance tracking.

**Independent Test**: Can CRUD accounts. Grouped by type. Balance displays with currency symbol. Cannot delete with transactions (future phase check). Works with currencies from US4.

**Duration**: 5-6 hours

### Database Schema (Account)

- [ ] T081 [US1] Create Account table schema in `server/db/schema.ts` (id, name unique, type enum, currencyId FK, balance bigint, archived, createdAt, updatedAt)
- [ ] T082 [US1] Add foreign key constraint Account.currencyId → Currency.id RESTRICT in `server/db/schema.ts`
- [ ] T083 [US1] Add unique index on account name in `server/db/schema.ts`
- [ ] T084 [US1] Add index on (type, archived) for filtered queries in `server/db/schema.ts`

### Validation Layer (Account)

- [ ] T085 [P] [US1] Write unit tests for account validation in `tests/unit/lib/validations/account.test.ts` (15+ tests: valid data, negative balance, invalid currency, name uniqueness)
- [ ] T086 [US1] Create account validation schemas in `lib/validations/account.ts` (createAccountSchema with balance as integer cents, updateAccountSchema)

### API Layer (Account)

- [ ] T087 [P] [US1] Write unit tests for account router in `tests/unit/server/trpc/routers/accounts.test.ts` (20+ tests: CRUD, currency relationships, balance validation, checkDeletable)
- [ ] T088 [US1] Create accounts tRPC router in `server/trpc/routers/accounts.ts` (create, list with currency join, getById, update, archive, unarchive, checkDeletable)
- [ ] T089 [US1] Register accounts router in `server/trpc/root.ts`

### UI Layer (Account)

- [x] T090 [P] [US1] Create account form component in `components/accounts/account-form.tsx` (React Hook Form, type dropdown, currency dropdown from US4, balance input with decimal conversion)
- [x] T091 [P] [US1] Create account card component in `components/accounts/account-card.tsx` (glass card with balance, currency symbol, type icon)
- [x] T092 [P] [US1] Create account list component in `components/accounts/account-list.tsx` (grouped by type: Bank/CreditCard/Wallet, archive toggle)
- [ ] T093 [US1] Create accounts list page in `app/(dashboard)/accounts/page.tsx` (grouped list view with add/edit/archive)
- [ ] T094 [US1] Create account detail page in `app/(dashboard)/accounts/[id]/page.tsx` (edit form with currency warning if transactions exist - placeholder for future)

### E2E Tests (Account)

- [ ] T095 [P] [US1] Write E2E test for creating new account in `tests/e2e/accounts.spec.ts` (scenario 1: click add, fill form, see in list)
- [ ] T096 [P] [US1] Write E2E test for viewing accounts list grouped by type in `tests/e2e/accounts.spec.ts` (scenario 3: see Bank/CreditCard/Wallet groups)
- [ ] T097 [P] [US1] Write E2E test for editing account in `tests/e2e/accounts.spec.ts` (scenario 4: change name/type)
- [ ] T098 [P] [US1] Write E2E test for deleting account with zero balance in `tests/e2e/accounts.spec.ts` (scenario 5: confirm deletion)
- [ ] T099 [P] [US1] Write E2E test for preventing deletion with transactions in `tests/e2e/accounts.spec.ts` (scenario 6: see error - placeholder check)
- [ ] T100 [P] [US1] Write E2E test for complete account setup workflow in `tests/e2e/accounts.spec.ts` (SC-206: create 3+ accounts in <5 min)

### Database Migration

- [ ] T101 [US1] Generate Drizzle migration for Account table (`npm run db:generate`)
- [ ] T102 [US1] Apply migration (`npm run db:migrate`)

**Checkpoint**: 🎉 **MVP COMPLETE** - Users can manage accounts, the foundation of personal finance tracking. FULLY FUNCTIONAL and independently testable.

---

## Phase 7: User Story 3 - Payee Management (Priority: P3) 🎯 ENHANCEMENT

**Goal**: Optional payee tracking for autocomplete and default categorization. Enhances convenience but not required for core functionality.

**Independent Test**: Can CRUD payees. Search autocomplete works. Default category suggestions functional. Conditional delete logic works (hard if unused, soft if used).

**Duration**: 3-4 hours

### Database Schema (Payee)

- [ ] T103 [US3] Create Payee table schema in `server/db/schema.ts` (id, name unique, type enum, defaultCategoryId FK nullable, archived, createdAt, updatedAt)
- [ ] T104 [US3] Add foreign key constraint Payee.defaultCategoryId → Category.id SET NULL in `server/db/schema.ts`
- [ ] T105 [US3] Add unique index on payee name in `server/db/schema.ts`
- [ ] T106 [US3] Add index on archived for filtered queries in `server/db/schema.ts`

### Validation Layer (Payee)

- [ ] T107 [P] [US3] Write unit tests for payee validation in `tests/unit/lib/validations/payee.test.ts` (10+ tests: valid data, optional category, invalid category ID)
- [ ] T108 [US3] Create payee validation schemas in `lib/validations/payee.ts` (createPayeeSchema, updatePayeeSchema with nullable defaultCategoryId)

### API Layer (Payee)

- [ ] T109 [P] [US3] Write unit tests for payee router in `tests/unit/server/trpc/routers/payees.test.ts` (15+ tests: CRUD, search autocomplete, conditional delete, category relationships)
- [ ] T110 [US3] Create payees tRPC router in `server/trpc/routers/payees.ts` (create, list with category join, getById, search, update, delete with conditional logic, unarchive)
- [ ] T111 [US3] Register payees router in `server/trpc/root.ts`

### UI Layer (Payee)

- [ ] T112 [P] [US3] Create payee autocomplete component in `components/payees/payee-autocomplete.tsx` (debounced search input calling payees.search)
- [x] T113 [P] [US3] Create payee form component in `components/payees/payee-form.tsx` (React Hook Form, type radio, category dropdown from US2)
- [ ] T114 [US3] Create payees page in `app/(dashboard)/payees/page.tsx` (list view with type/category display, add/edit/delete)

### E2E Tests (Payee)

- [ ] T115 [P] [US3] Write E2E test for creating payee in `tests/e2e/payees.spec.ts` (scenario 1: set name, type, default category)
- [ ] T116 [P] [US3] Write E2E test for viewing payee list in `tests/e2e/payees.spec.ts` (scenario 2: see types and categories)
- [ ] T117 [P] [US3] Write E2E test for editing payee default category in `tests/e2e/payees.spec.ts` (scenario 3: change category suggestion)

### Database Migration

- [ ] T118 [US3] Generate Drizzle migration for Payee table (`npm run db:generate`)
- [ ] T119 [US3] Apply migration (`npm run db:migrate`)

**Checkpoint**: Payee management fully functional. Autocomplete ready for future transaction entry. Default categorization suggestions work.

---

## Phase 8: UX/Design Polish & Cross-Cutting Concerns

**Purpose**: Refinements that affect multiple user stories, performance optimization, accessibility compliance

**Duration**: 4-6 hours

### Liquid Glass Refinement

- [ ] T120 [P] Audit all pages for consistent glass treatment (backdrop-blur-md, bg-white/10, border-white/20, rounded-2xl)
- [ ] T121 [P] Verify neutral gradient background (f5f7fa → e9ecf5) on all pages
- [ ] T122 [P] Check rounded-2xl corners on all cards/modals/dialogs

### Animations & Transitions

- [ ] T123 [P] Add Framer Motion page transitions in dashboard layout (opacity 0.9 → 1, 200ms)
- [ ] T124 [P] Add modal fade-in animations (blur fade-in effect)
- [ ] T125 [P] Add list item stagger animations on all list views

### Empty States & Loading States

- [ ] T126 [P] Create empty state for accounts list in `components/accounts/account-list.tsx` (no accounts created yet)
- [ ] T127 [P] Create empty state for categories list in `components/categories/category-list.tsx` (should not occur - defaults seeded)
- [ ] T128 [P] Create empty state for payees list in `components/payees/payee-list.tsx` (no payees created yet)
- [ ] T129 [P] Create empty state for currencies list in `components/currencies/currency-list.tsx` (should not occur - EUR seeded)
- [ ] T130 [P] Add skeleton loaders for all list views during data fetching
- [ ] T131 [P] Add loading spinners for form submissions

### Error Handling UX

- [ ] T132 [P] Design error toast notification component (glass style, auto-dismiss)
- [ ] T133 [P] Add inline validation error messages to all forms (red text, icon, positioned below field)
- [ ] T134 [P] Add confirmation dialogs for all destructive actions (delete, archive with transaction warning)
- [ ] T135 [P] Add retry button for network errors

### Performance Optimization

- [ ] T136 Run performance benchmarks: API response times (target <500ms p95) for all endpoints
- [ ] T137 Run performance benchmarks: Page load times (target <2s interactive) for all pages
- [ ] T138 Run performance benchmarks: Form submission feedback (target <200ms) for all forms
- [ ] T139 Run performance benchmarks: Validation inline errors (target <500ms) for all forms
- [ ] T140 Optimize: Verify category list supports 50+ custom categories without degradation (SC-207)

### Accessibility Compliance

- [ ] T141 Run axe DevTools audit on all 5 CRUD pages (accounts, categories, payees, currencies, settings)
- [ ] T142 Test keyboard navigation on all forms (Tab, Enter, Esc)
- [ ] T143 Test screen reader compatibility (NVDA/JAWS) on all pages
- [ ] T144 Verify ARIA labels and roles on all interactive elements
- [ ] T145 Check color contrast ratios (WCAG 2.1 AA minimum)

### Documentation

- [ ] T146 [P] Update README.md with Phase 2 features (5 entities, CRUD operations, Liquid Glass UI)
- [ ] T147 [P] Add screenshots of Liquid Glass UI to README.md (accounts list, category form, settings page)
- [ ] T148 [P] Update CONTRIBUTING.md with patterns for adding new entities
- [ ] T149 [P] Add JSDoc comments to all tRPC router procedures
- [ ] T150 [P] Add JSDoc comments to all Zod validation schemas

### Final Quality Gates

- [ ] T151 Run full test suite: `npm test` - verify all unit tests pass (50+ tests, 80%+ coverage target)
- [ ] T152 Run E2E test suite: `npm run test:e2e` - verify all E2E tests pass (25+ scenarios)
- [ ] T153 Run type check: `npm run type-check` - verify TypeScript builds clean (no errors)
- [ ] T154 Run linter: `npm run lint` - verify ESLint passes
- [ ] T155 Run formatter: `npm run format` - verify Prettier formatting consistent
- [ ] T156 Verify all Success Criteria (SC-201 to SC-210) from spec.md

**Checkpoint**: ✅ **PHASE 2 COMPLETE** - All 5 entities functional, Liquid Glass design applied, tests passing, documentation updated, ready for merge to main.

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies - start immediately (30 min)
2. **Foundational (Phase 2)**: Depends on Setup completion (6-8 hours) - **BLOCKS all user stories**
3. **User Story 4 - Currency (Phase 3)**: Depends on Foundational (3-4 hours) - **BLOCKS US1 and US5**
4. **User Story 5 - Settings (Phase 4)**: Depends on Foundational + US4 Currency (2-3 hours) - **BLOCKS US1**
5. **User Story 2 - Category (Phase 5)**: Depends on Foundational (4-5 hours) - **INDEPENDENT**, can parallel with US1/US3
6. **User Story 1 - Account (Phase 6)**: Depends on Foundational + US4 Currency + US5 Settings (5-6 hours) - **MVP CORE**
7. **User Story 3 - Payee (Phase 7)**: Depends on Foundational + US2 Category (3-4 hours) - **INDEPENDENT**, can parallel with US1
8. **Polish (Phase 8)**: Depends on all desired user stories complete (4-6 hours)

### Critical Path (Sequential)

**Minimum path to MVP (User Story 1 - Accounts only)**:
1. Setup (Phase 1) → 30 min
2. Foundational (Phase 2) → 6-8 hours
3. Currency (Phase 3) → 3-4 hours
4. Settings (Phase 4) → 2-3 hours
5. Account (Phase 6) → 5-6 hours
6. Polish (Phase 8 - subset) → 2 hours

**Total MVP Time**: ~20-24 hours (3 working days single developer)

### Parallel Opportunities

**After Foundational Phase completes**:
- **Track 1** (Team Member A): US4 Currency → US5 Settings → US1 Account (Critical path to MVP)
- **Track 2** (Team Member B): US2 Category → US3 Payee (Independent track)

**Within each phase**: All tasks marked `[P]` can run in parallel

**Example: Phase 2 Foundational - Parallel execution**:
- Batch 1 (parallel): T005, T006, T007, T008 (all enum definitions)
- Batch 2 (parallel): T009, T010, T011, T012 (all constants)
- Batch 3 (parallel): T013, T014, T015, T016, T017, T018 (all UI component customizations)
- Batch 4 (parallel): T020, T021, T022, T023 (all shared components)
- Batch 5 (sequential): T024 → T025 (dashboard layout depends on root layout)

**Example: Phase 6 User Story 1 - Parallel execution**:
- Batch 1 (sequential): T081 → T082 → T083 → T084 (schema must be complete first)
- Batch 2 (parallel): T085, T087 (tests can be written in parallel)
- Batch 3 (sequential): T086, T088 (validation needed before router, but tests were written first in TDD)
- Batch 4 (sequential): T089 (router registration after router implementation)
- Batch 5 (parallel): T090, T091, T092 (all UI components different files)
- Batch 6 (sequential): T093 → T094 (pages depend on components)
- Batch 7 (parallel): T095, T096, T097, T098, T099, T100 (all E2E tests independent)
- Batch 8 (sequential): T101 → T102 (migration generation then apply)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Fastest path to working product** (20-24 hours):

1. ✅ Complete Phase 1: Setup (30 min)
2. ✅ Complete Phase 2: Foundational (6-8 hours) - **CRITICAL BLOCKER**
3. ✅ Complete Phase 3: Currency (3-4 hours) - **Required for accounts**
4. ✅ Complete Phase 4: Settings (2-3 hours) - **Required for default currency**
5. ✅ Complete Phase 6: Account (5-6 hours) - **THE MVP FEATURE**
6. ✅ Subset of Phase 8: Minimal polish (accessibility, basic animations, documentation) (2 hours)

**MVP Deliverable**: Users can manage bank accounts, credit cards, wallets with multi-currency support. EUR pre-configured. Settings adjustable. Liquid Glass UI. All tests passing.

**MVP Success Criteria**:
- SC-201: Account entity has functional CRUD ✅
- SC-202: Account creation <30s ✅
- SC-203: CRUD feedback <2s ✅
- SC-204: Validation errors <500ms ✅
- SC-206: 3+ accounts setup <5 min ✅
- SC-210: Liquid Glass design applied ✅

### Incremental Delivery (Add features progressively)

**Week 1: MVP** (20-24 hours)
- Complete Phase 1-4 + Phase 6 (Account management)
- Deploy MVP
- User can manage accounts and start tracking (even without categories/payees)

**Week 2: Add Categories** (+4-5 hours)
- Complete Phase 5: Category (US2)
- Deploy update
- User can now categorize future transactions (Phase 3 feature)

**Week 2: Add Payees** (+3-4 hours)
- Complete Phase 7: Payee (US3)
- Deploy update
- User can now use autocomplete for merchants (convenience feature)

**Week 2: Polish** (+4-6 hours)
- Complete Phase 8: Full polish
- Final QA, accessibility audit, performance optimization
- Deploy production-ready version

### Parallel Team Strategy (3 developers)

**Team Allocation**:

**Developer A (Critical Path - MVP)**:
- Phase 1 (together)
- Phase 2 (together)
- Phase 3: US4 Currency (3-4 hours)
- Phase 4: US5 Settings (2-3 hours)
- Phase 6: US1 Account (5-6 hours)

**Developer B (Independent Track - Categories)**:
- Phase 1 (together)
- Phase 2 (together)
- Phase 5: US2 Category (4-5 hours)
- Phase 8: Polish - Accessibility & Documentation (2-3 hours)

**Developer C (Independent Track - Payees)**:
- Phase 1 (together)
- Phase 2 (together)
- Phase 5: US2 Category (helps Developer B or waits)
- Phase 7: US3 Payee (3-4 hours)
- Phase 8: Polish - Performance & Animations (2-3 hours)

**Total Team Time**: 3-4 working days (all features complete in parallel)

---

## Task Summary

**Total Tasks**: 156 tasks

**Breakdown by Phase**:
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 21 tasks
- Phase 3 (US4 - Currency): 18 tasks
- Phase 4 (US5 - Settings): 16 tasks
- Phase 5 (US2 - Category): 21 tasks
- Phase 6 (US1 - Account): 22 tasks
- Phase 7 (US3 - Payee): 17 tasks
- Phase 8 (Polish): 37 tasks

**Breakdown by User Story**:
- US1 (Account - P1): 22 tasks ⭐ **MVP CORE**
- US2 (Category - P2): 21 tasks
- US3 (Payee - P3): 17 tasks
- US4 (Currency - P2): 18 tasks 🔒 **FOUNDATIONAL**
- US5 (Settings - P3): 16 tasks 🔒 **FOUNDATIONAL**
- Foundational: 21 tasks 🔒 **BLOCKS ALL**
- Setup: 4 tasks
- Polish: 37 tasks

**Parallel Tasks**: 98 tasks marked `[P]` (63% parallelizable within phases)

**Independent User Stories**: 2 (US2 Category, US3 Payee can parallel with US1 Account after foundational complete)

**TDD Compliance**: 50+ unit test tasks + 25+ E2E test tasks = **TESTS FIRST** workflow enforced

**Estimated Time**:
- MVP only (US1): 20-24 hours
- All user stories: 45-60 hours
- With 3-person team: 3-4 working days

---

## Format Validation

✅ **All tasks follow checklist format**: `- [ ] [ID] [P?] [Story?] Description with file path`
✅ **All user story tasks labeled**: [US1], [US2], [US3], [US4], [US5]
✅ **All parallel tasks marked**: [P] for parallelizable tasks
✅ **All tasks have file paths**: Exact paths included in descriptions
✅ **Sequential IDs**: T001 through T156 in execution order
✅ **TDD workflow**: Tests written before implementation
✅ **Independent stories**: Each user story can be tested standalone
✅ **Clear checkpoints**: Each phase has validation criteria

---

## Notes

- **TDD Enforcement**: All test tasks (`tests/unit/`, `tests/e2e/`) MUST be written first, MUST fail before implementation
- **[P] = Parallelizable**: Different files, no dependencies on incomplete tasks
- **[Story] = Traceability**: Maps task to specific user story for independent testing
- **File Paths**: All tasks include exact file paths for immediate execution
- **Checkpoints**: Validate each phase before proceeding to next
- **MVP Flexibility**: Can stop after Phase 6 (Account) for minimal viable product
- **Incremental Value**: Each user story adds value without breaking previous stories
- **Constitution Compliance**: All tasks respect Clean Architecture, Type Safety, TDD, Liquid Glass design
- **Quality Gates**: Phase 8 final tasks verify all Success Criteria (SC-201 to SC-210) met

**Ready for Execution**: ✅ Tasks immediately executable by LLM or human developer. Each task self-contained with specific file path and clear action.















