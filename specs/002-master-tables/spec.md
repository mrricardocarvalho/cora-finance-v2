# Feature Specification: Core Master Tables & App Setup

**Feature Branch**: `002-master-tables`  
**Created**: 2025-10-24  
**Status**: Ready for Planning  
**Constitution Version**: 1.0.0  
**Input**: Core Master Tables and Setup Settings - Establish core data entities (Accounts, Categories, Payees, Currencies, Settings) with CRUD operations and Liquid Glass UI

---

## 🎯 Objective

Establish the core data entities and setup screens that form the backbone of the Cora Finance application. These master tables will provide consistent, normalized data for all higher-level features including Transactions, Budgets, Portfolios, Analytics, and AI.

This phase builds Layer 2 on top of the Foundation layer, focusing on correctness, type safety, and a clean UI aligned with the Liquid Glass design language.

---

## User Scenarios & Testing

### User Story 1 - Account Management (Priority: P1)

Users need to manage their financial accounts (bank accounts, credit cards, wallets) as the foundation for tracking all financial activity.

**Why this priority**: Without accounts, no transactions can be recorded. This is the absolute foundation of any personal finance system.

**Independent Test**: Can be fully tested by creating, viewing, editing, and deleting an account. Delivers immediate value as users can set up their account structure before adding any transactions.

**Acceptance Scenarios**:

1. **Given** I'm on the Accounts page, **When** I click "Add New Account", **Then** I see a form to create a new account with fields for name, type, currency, and initial balance
2. **Given** I've filled in account details, **When** I save the account, **Then** I see the new account in my accounts list with correct balance displayed
3. **Given** I have existing accounts, **When** I view the accounts list, **Then** I see all my accounts grouped by type (Bank, Credit Card, Wallet) with current balances
4. **Given** I select an account, **When** I click edit, **Then** I can modify the account name, type, or currency (with appropriate warnings)
5. **Given** I select an account with zero balance, **When** I click delete, **Then** the account is removed from my list after confirmation
6. **Given** I try to delete an account with transactions, **When** I confirm deletion, **Then** I see an error message preventing deletion

---

### User Story 2 - Category Organization (Priority: P2)

Users need to categorize their income and expenses to understand spending patterns and create meaningful budgets.

**Why this priority**: Categories are essential for organizing financial data but users can start with default categories, making this slightly less critical than accounts.

**Independent Test**: Can be fully tested by managing expense and income categories. Delivers value as users can customize their categorization system before tracking transactions.

**Acceptance Scenarios**:

1. **Given** I'm on the Categories page, **When** I view the list, **Then** I see pre-seeded default categories for common expenses and income types
2. **Given** I click "Add New Category", **When** I fill in name, type (Expense/Income), color, and icon, **Then** the category appears in the appropriate section
3. **Given** I have custom categories, **When** I edit a category, **Then** I can change its name, color, or icon while preserving historical data
4. **Given** I try to create a duplicate category name, **When** I save, **Then** I see a validation error preventing duplicates
5. **Given** I select an unused category, **When** I delete it, **Then** it's removed from the list after confirmation

---

### User Story 3 - Payee Management (Priority: P3)

Users can optionally track merchants and people they pay to enable faster transaction entry and better merchant-specific reporting.

**Why this priority**: Payees are optional and enhance convenience rather than providing core functionality. Users can function perfectly without this feature.

**Independent Test**: Can be fully tested by managing payee records. Delivers value through autocomplete and default categorization when entering transactions.

**Acceptance Scenarios**:

1. **Given** I'm on the Payees page, **When** I add a new payee, **Then** I can set a name, type (person/vendor), and optional default category
2. **Given** I've created payees, **When** I view the list, **Then** I see all payees with their types and default categories
3. **Given** I edit a payee, **When** I change the default category, **Then** future transactions suggest this category but historical data remains unchanged

---

### User Story 4 - Currency Configuration (Priority: P2)

Users managing multi-currency finances need to configure available currencies and exchange rates.

**Why this priority**: Critical for international users but domestic-only users can ignore this entirely. Most users will use a single default currency.

**Independent Test**: Can be fully tested by managing currency records and setting exchange rates. Delivers value for multi-currency account management.

**Acceptance Scenarios**:

1. **Given** I'm on the Currencies page, **When** I view the list, **Then** I see EUR pre-configured as the default currency
2. **Given** I add a new currency, **When** I provide code (USD, GBP, etc.), symbol, and exchange rate, **Then** it becomes available for account creation
3. **Given** I have accounts in different currencies, **When** I view totals, **Then** I see converted amounts with clear indication of exchange rate used
4. **Given** I update an exchange rate, **When** I save, **Then** future calculations use the new rate while historical data remains unchanged

---

### User Story 5 - Application Settings (Priority: P3)

Users need to configure application-level preferences like default currency, theme, and AI features.

**Why this priority**: Settings enhance user experience but reasonable defaults allow the app to function without user configuration.

**Independent Test**: Can be fully tested by modifying settings and observing their effects. Delivers value through personalization.

**Acceptance Scenarios**:

1. **Given** I'm on the Settings page, **When** I change the default currency, **Then** new accounts default to this currency
2. **Given** I toggle AI features, **When** I save, **Then** AI-powered suggestions appear or disappear throughout the app
3. **Given** I change the theme, **When** I save, **Then** the UI updates with the new theme preference

---

### Edge Cases

- What happens when a user tries to delete an account that has associated transactions? (Prevent deletion with clear error message)
- What happens when a user changes account currency after transactions exist? (Show conversion warning with impact preview)
- What happens when no categories exist and user tries to add a transaction? (Disable transaction creation or show setup wizard)
- How does the system handle duplicate category or account names? (Validate uniqueness and show inline error)
- What happens if Settings table has no record? (Initialize with sensible defaults on first app launch)
- What happens when exchange rates are outdated? (Show age of rate and allow manual refresh)
- How does the system handle orphaned payees (payee without any transactions)? (Allow deletion without warning)

---

## Requirements

### Functional Requirements

#### Accounts

- **FR-001**: System MUST allow users to create new accounts with name, type (Bank/Credit Card/Wallet), currency, and initial balance
- **FR-002**: System MUST prevent deletion of accounts that have associated transactions
- **FR-003**: System MUST validate that account names are unique within user's account list
- **FR-004**: System MUST display current balance for each account calculated from initial balance and transactions
- **FR-005**: System MUST allow soft-delete (archival) of accounts to preserve historical data integrity
- **FR-006**: System MUST warn users when changing account currency if transactions exist

#### Categories

- **FR-007**: System MUST provide pre-seeded default categories for common expense and income types
- **FR-008**: System MUST allow users to create custom categories with name, type (Expense/Income), color, and icon
- **FR-009**: System MUST prevent duplicate category names within the same type (case-insensitive)
- **FR-010**: System MUST allow editing of category properties without affecting historical transaction data
- **FR-011**: System MUST prevent deletion of categories that have associated transactions (offer archival instead)

#### Payees

- **FR-012**: System MUST allow users to optionally create payee records with name, type (person/vendor), and default category
- **FR-013**: System MUST provide autocomplete for payee names when entering transactions
- **FR-014**: System MUST allow deletion of payees that have no associated transactions
- **FR-015**: System MUST preserve payee information in transactions even after payee is deleted

#### Currencies

- **FR-016**: System MUST provide EUR as the default pre-configured currency
- **FR-017**: System MUST allow users to add additional currencies with code (ISO 4217), symbol, name, and exchange rate
- **FR-018**: System MUST validate currency codes against ISO 4217 standard
- **FR-019**: System MUST store exchange rates with timestamp for tracking rate changes over time
- **FR-020**: System MUST support manual refresh of exchange rates

#### Settings

- **FR-021**: System MUST maintain a single Settings record per user with default currency, theme preference, and AI enablement flag
- **FR-022**: System MUST initialize Settings with sensible defaults on first application launch (EUR currency, light theme, AI enabled)
- **FR-023**: System MUST apply default currency setting to new accounts unless explicitly overridden
- **FR-024**: System MUST apply theme preference consistently across all application screens

#### Data Integrity

- **FR-025**: All entities MUST include audit timestamps (createdAt, updatedAt) following Constitutional requirements
- **FR-026**: All entities MUST support soft deletion via archived boolean flag
- **FR-027**: System MUST enforce referential integrity between currencies and accounts
- **FR-028**: System MUST validate all currency amounts are stored as integers (cents) to prevent floating-point errors

### Key Entities

- **Account**: Represents a financial account (bank, credit card, wallet). Attributes: name, type (enum), currencyId (foreign key), balance (integer cents), archived flag, timestamps. Relationships: belongs to Currency (many-to-one).

- **Category**: Defines transaction classifications for expenses and income. Attributes: name, type (enum: Expense/Income), color (hex code), icon identifier, archived flag, timestamps. Relationships: none (referenced by Transactions in future phase).

- **Payee**: Optional master for merchants or people. Attributes: name, type (enum: person/vendor), defaultCategoryId (nullable foreign key), archived flag, timestamps. Relationships: optionally belongs to Category (many-to-one).

- **Currency**: Defines available currencies for accounts. Attributes: code (ISO 4217), symbol, name, exchangeRate (decimal to base currency), lastUpdated timestamp, archived flag, timestamps. Relationships: has many Accounts (one-to-many).

- **Settings**: User-level configuration singleton. Attributes: defaultCurrencyId (foreign key), theme (enum: light/dark/auto), aiEnabled (boolean), timestamps. Relationships: belongs to Currency (one-to-one).

---

## Success Criteria

### Measurable Outcomes

- **SC-201**: Users can create, view, edit, and delete all five entity types (Accounts, Categories, Payees, Currencies, Settings) through the UI without errors
- **SC-202**: Account creation workflow completes in under 30 seconds from clicking "Add New" to seeing the account in the list
- **SC-203**: All CRUD operations provide immediate visual feedback within 2 seconds through toast notifications
- **SC-204**: Data validation errors display inline within 500ms of user input
- **SC-205**: All database tables maintain referential integrity with zero orphaned records
- **SC-206**: Users can successfully populate their account structure (3+ accounts across different types and currencies) in under 5 minutes
- **SC-207**: Category organization supports at least 50 custom categories without performance degradation
- **SC-208**: Multi-currency account totals display with clear conversion indicators and accurate calculations
- **SC-209**: Settings changes take effect immediately without requiring application restart
- **SC-210**: All UI screens follow Liquid Glass design language with consistent blur effects, rounded corners (2xl), and neutral color palette

---

## Assumptions

- Users have PostgreSQL 15+ running and accessible from the Foundation Phase
- Foundation Phase infrastructure (Next.js, tRPC, Drizzle ORM, TailwindCSS) is fully operational
- Users will primarily manage accounts in 1-3 currencies (EUR dominant for Portuguese market)
- Default categories will be seeded based on common European household expense patterns
- Exchange rates will be manually managed initially (auto-refresh from API is future enhancement)
- Settings will be stored per-installation (multi-user support is future phase)
- Icons for categories will use a predefined icon library (lucide-react or similar)
- Color picker will provide a curated palette rather than full RGB selection
- Soft delete (archival) is preferred over hard delete to maintain data integrity
- All financial amounts stored as integer cents (Constitutional requirement)

---

## Dependencies

- **Foundation Phase (001-foundation)**: Must be complete with all infrastructure operational
- **Database**: PostgreSQL 15+ running and accessible
- **Frontend**: Next.js 16+ with App Router configured
- **API**: tRPC 11.6+ with working routers
- **ORM**: Drizzle ORM 0.44+ with migration capability
- **UI**: shadcn/ui components and TailwindCSS 4.x with Liquid Glass tokens
- **Testing**: Jest and Playwright infrastructure from Foundation Phase

---

## Out of Scope

- Automatic exchange rate updates from external APIs (manual only in this phase)
- Multi-user account sharing or collaboration features
- Category budgets or spending limits (separate Budget phase)
- Transaction management (separate Transactions phase)
- Account reconciliation features
- CSV import/export of master data
- Mobile-responsive layouts beyond basic responsiveness
- Bulk operations (bulk delete, bulk edit)
- Advanced search or filtering of entities
- Category hierarchies or subcategories
- Account balance history or trends
- Currency conversion history tracking

---

## Notes

This phase creates the "data backbone" of Cora Finance. All future modules (Transactions, Budgets, Portfolios, Analytics, AI) will depend on these entities for data integrity and consistency.

The focus is on correctness and usability rather than advanced features. Each entity should be fully functional for its core purpose, with enhancements deferred to future phases.

Liquid Glass design language must be consistently applied across all screens to establish the visual identity early.
