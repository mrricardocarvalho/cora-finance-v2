<!--
Sync Impact Report - Constitution Update to v1.0.0
══════════════════════════════════════════════════

Version Change: INITIAL → 1.0.0
Rationale: Initial constitution ratification based on comprehensive design system
           and architectural principles for Cora Finance v2.

Modified Principles: N/A (initial creation)

Added Sections:
  - Core Principles (7 architectural principles)
  - Technology Stack
  - Design System Standards
  - Data & API Standards
  - Quality & Testing Standards
  - Localization & Regional Standards
  - Security & Compliance Standards
  - Development Workflow
  - Governance

Templates Status:
  ✅ plan-template.md - Reviewed and aligned with constitution principles
  ✅ spec-template.md - Reviewed and aligned with user story approach
  ✅ tasks-template.md - Reviewed and aligned with TDD and user story workflow
  ⚠️  No command files found in .specify/templates/commands/ - skipped
  ⚠️  No README.md found - skipped

Follow-up TODOs:
  - Consider adding specific performance benchmarks as constitution matures
  - Consider adding AI assistance governance when Phase 6 begins

Generated: 2025-10-24
-->

# Cora Finance v2 Constitution

## Philosophy

Cora Finance follows a **layered incremental build** methodology:

1. **Foundation & Master Data**
2. **Transactional Engine**
3. **Budgeting (YNAB methodology)**
4. **Portfolio Tracking**
5. **Analytics & Dashboard**
6. **AI Assistance (Text + Voice)**

Each layer builds upon previous foundations and adheres to the same design, architectural, and quality principles defined in this constitution.

## Core Principles

### I. Clean Architecture (NON-NEGOTIABLE)

Every feature MUST follow layered architecture with clear separation of concerns:

- **Framework**: Next.js 15.5+ with App Router
- **Language**: TypeScript in strict mode (no implicit any, strict null checks enforced)
- **Folder Structure**: `/app`, `/components`, `/lib`, `/server`, `/hooks`, `/types`, `/drizzle`
- **Naming**: Lowercase kebab-case for files; PascalCase for components and React hooks
- All entities, schemas, and procedures MUST be explicitly typed

**Rationale**: Prevents technical debt accumulation, ensures maintainability, enables independent testing of business logic.

### II. Type Safety First

Type safety is paramount and MUST be enforced at every boundary:

- **ORM**: Drizzle ORM with PostgreSQL for compile-time SQL safety
- **API**: tRPC for end-to-end type-safe client-server communication
- **Validation**: Zod schemas for all inputs and API contracts
- **Forms**: React Hook Form + Zod integration
- **Financial Precision**: Decimal.js MUST be used for all financial calculations (never native floats)

**Rationale**: Eliminates entire classes of runtime errors, provides compile-time contract verification, prevents financial calculation errors.

### III. Test-Driven Development (NON-NEGOTIABLE)

Testing is mandatory with minimum coverage requirements:

- **Unit Tests**: Jest for business logic (80%+ coverage on core modules)
- **E2E Tests**: Playwright for every major user workflow
- **TDD Workflow**: Tests written → User approved → Tests fail → Implementation
- **Quality Gates**: All tests MUST pass before merge; TypeScript MUST build clean

**Rationale**: Prevents regressions, documents expected behavior, enables confident refactoring.

### IV. Liquid Glass Design System

All UI MUST conform to the MacOS Tahoe 2026-inspired "Liquid Glass" aesthetic:

- **Background**: Gradient from `#f5f7fa` to `#e9ecf5`
- **Surfaces**: `bg-white/10` + `backdrop-blur-md` + `border border-white/20`
- **Depth**: Light diffusion (not shadows)
- **Primary Accent**: `#0EA5E9` (Sky Blue)
- **Secondary Accent**: `#8B5CF6` (Purple)
- **Typography**: San Francisco or Inter variable font
- **Motion**: Subtle Framer Motion transitions (opacity 0.9→1, blur fade-in)
- **Layout**: 12-column responsive grid with 16px gutters

**Component Treatments**:
- Cards, modals, popovers: Full glass treatment
- Tables, forms: Semi-opaque for readability
- Inputs: 5% glass transparency
- Charts: Optional glass frames

**Rationale**: Creates distinctive, premium brand identity; ensures visual consistency; leverages modern CSS capabilities.

### V. Data Integrity & Precision

Financial data MUST be handled with absolute precision:

- All monetary values stored as **integer cents** (never decimals in database)
- All dates in **ISO 8601 format (UTC)**
- **Soft deletes** preferred (`archived` boolean)
- Foreign keys cascade on delete only when semantically safe
- Every table MUST include `created_at` and `updated_at` timestamps
- No magic strings — use enums and constants

**Rationale**: Prevents floating-point rounding errors, maintains audit trails, ensures data consistency.

### VI. Performance & Accessibility Standards

Every feature MUST meet baseline performance and accessibility requirements:

- **API Response**: <500ms for p95
- **Page Load**: <2s for interactive
- **Accessibility**: WCAG 2.1 AA compliance mandatory
- **State Management**: TanStack Query (React Query) for server state
- **UI Library**: shadcn/ui components customized for Liquid Glass

**Rationale**: Ensures professional user experience, legal compliance (accessibility), maintains user trust.

### VII. Security & Compliance

Security MUST be built-in, not bolted-on:

- Drizzle parameterization for SQL injection protection
- File uploads: PDFs only, max 10MB, validated
- XSS protection via React automatic escaping
- CSRF protection via Next.js middleware
- HTTPS enforced in production
- All validation happens server-side (client validation is UX only)

**Rationale**: Protects user data, maintains regulatory compliance, prevents common attack vectors.

## Technology Stack

**Framework**: Next.js 15.5+ (App Router)
**Language**: TypeScript (strict mode)
**Database**: PostgreSQL
**ORM**: Drizzle ORM
**API**: tRPC
**UI**: shadcn/ui + TailwindCSS 4.x
**State**: TanStack Query (React Query)
**Forms**: React Hook Form + Zod
**Animation**: Framer Motion
**Testing**: Jest (unit), Playwright (E2E)
**Math**: Decimal.js

## Design System Standards

All visual and interaction design MUST adhere to the Liquid Glass system documented in Principle IV.

Component design rules:
- Glass transparency for layering and depth
- Blur effects for background separation
- Minimal shadows (use diffused light instead)
- Consistent 16px spacing grid
- Responsive breakpoints at 640px, 768px, 1024px, 1280px

## Data & API Standards

### Data Layer

- Store monetary values as integer cents
- Use ISO 8601 UTC for all timestamps
- Implement soft deletes with `archived` boolean
- Include audit fields: `created_at`, `updated_at`
- Use enums for finite value sets (never magic strings)

### API Layer

- All endpoints via tRPC for type safety
- Input validation with Zod schemas
- Business logic in server procedures (not client)
- Return typed responses (no any types)
- Error responses MUST include user-friendly messages

## Quality & Testing Standards

### Test Coverage Requirements

- **Core Business Logic**: 80%+ unit test coverage
- **User Workflows**: E2E test for each major flow
- **Edge Cases**: Explicit tests for boundary conditions
- **Integration**: Contract tests for API boundaries

### Definition of Done

No phase is complete until:
- All tests pass
- TypeScript builds without errors
- Accessibility audit passes
- Performance within targets (<500ms API, <2s page load)
- Documentation updated

## Localization & Regional Standards

**Default Settings** (Portuguese Market):
- Locale: `pt-PT`
- Currency: EUR (€)
- Date Format: DD/MM/YYYY
- Thousands Separator: period (.)
- Decimal Separator: comma (,)
- First Day of Week: Monday

**Rationale**: Optimized for primary target market; extensible for internationalization later.

## Security & Compliance Standards

All features MUST implement:
- Parameterized queries (via Drizzle ORM)
- Server-side input validation (Zod)
- XSS protection (React escaping)
- CSRF tokens (Next.js middleware)
- HTTPS in production
- File upload restrictions (type, size)

## Development Workflow

### Feature Development Process

1. **Specification**: Create feature spec following template in `.specify/templates/spec-template.md`
2. **Planning**: Generate implementation plan via SpecKit
3. **Constitution Check**: Verify compliance with all principles
4. **Implementation**: Follow TDD workflow (tests first)
5. **Review**: Code review verifies constitution compliance
6. **Quality Gates**: Pass all tests, builds, accessibility, performance
7. **Documentation**: Update relevant docs before merge

### Branch Strategy

- Feature branches: `###-feature-name`
- Documentation in: `specs/###-feature/`
- Tests MUST be written before implementation

### Code Review Requirements

Reviewers MUST verify:
- Constitution compliance (all principles)
- Test coverage meets requirements
- Type safety (no any types without justification)
- Performance within targets
- Accessibility standards met
- Security considerations addressed

## Governance

### Authority

This constitution supersedes all other development practices and guidelines. When conflicts arise, constitution principles take precedence.

### Amendments

Constitution changes require:
1. Documented rationale for change
2. Impact analysis on existing features
3. Template and guidance updates
4. Version increment following semantic versioning:
   - **MAJOR**: Breaking principle changes or removals
   - **MINOR**: New principles or material expansions
   - **PATCH**: Clarifications, typos, non-semantic refinements

### Compliance

- All specifications MUST reference constitutional compliance
- All code reviews MUST verify constitutional adherence
- Complexity that violates principles MUST be justified in writing
- Quality gates enforce constitutional standards

### Runtime Guidance

For detailed development workflows and command usage, refer to `.specify/templates/` and `.github/prompts/` directories.

**Version**: 1.0.0 | **Ratified**: 2025-10-24 | **Last Amended**: 2025-10-24
