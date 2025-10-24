# Implementation Plan: Foundation Phase

**Branch**: `001-foundation` | **Date**: 2025-10-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-foundation/spec.md`

**Note**: This plan breaks down the Foundation Phase into logical subphases with dependencies, durations, and quality gates.

## Summary

The Foundation Phase establishes the complete development environment for Cora Finance v2, implementing the Constitution v1.0.0 mandated technology stack. This infrastructure layer enables all future feature development by providing: type-safe full-stack architecture (Next.js 15.5+ App Router + tRPC), database layer (Drizzle ORM + PostgreSQL), Liquid Glass design system (TailwindCSS 4.x + shadcn/ui), testing infrastructure (Jest + Playwright), and automated quality gates (CI/CD). The primary goal is developer productivity: complete setup in <10 minutes, application start in <5 seconds, and full type safety from database to UI.

## Technical Context

**Language/Version**: TypeScript 5.3+ / Node.js 20 LTS  
**Primary Dependencies**: Next.js 15.5+, Drizzle ORM, tRPC, TailwindCSS 4.x, shadcn/ui  
**Storage**: PostgreSQL 15+ (relational database with full ACID compliance)  
**Testing**: Jest (unit tests), Playwright (E2E tests), @testing-library/react (component tests)  
**Target Platform**: Web application (modern browsers), Development on Windows/macOS/Linux  
**Project Type**: Web application (Next.js App Router full-stack)  
**Performance Goals**:

- Application start: <5 seconds from `npm run dev`
- Build time: <2 minutes for production build
- HMR (Hot Module Replacement): <1 second for code changes
- Test execution: <2 minutes for full suite
- CI pipeline: <5 minutes end-to-end

**Constraints**:

- TypeScript strict mode (no `any`, strict null checks)
- 80%+ code coverage on all example code
- Zero linting/type errors on fresh install
- WCAG 2.1 AA accessibility compliance
- PostgreSQL connection must support pooling (min 5, max 20 connections)

**Scale/Scope**:

- Single developer initial setup: <10 minutes
- Foundation codebase: ~50-100 files
- Configuration files: ~15-20 files
- Example components: 5-10 demonstrating patterns
- CI/CD: Single workflow file with 4-5 jobs

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### ✅ Principle I: Clean Architecture

- **Status**: COMPLIANT
- **Verification**: Folder structure follows Constitution spec (`/app`, `/components`, `/lib`, `/server`, `/hooks`, `/types`, `/drizzle`)
- **Evidence**: Project structure section below documents exact layout; TypeScript strict mode configured in tsconfig.json

### ✅ Principle II: Type Safety First

- **Status**: COMPLIANT
- **Verification**: All mandated type-safety tools configured (Drizzle ORM, tRPC, Zod, Decimal.js)
- **Evidence**: Dependencies in package.json; example tRPC procedure demonstrates end-to-end type safety; Decimal.js utility for financial math

### ✅ Principle III: Test-Driven Development

- **Status**: COMPLIANT
- **Verification**: Jest (unit) + Playwright (E2E) configured with coverage reporting
- **Evidence**: Example unit test and E2E test included; jest.config.js with 80% coverage threshold; quality gates in CI

### ✅ Principle IV: Liquid Glass Design System

- **Status**: COMPLIANT
- **Verification**: TailwindCSS 4.x config includes all Liquid Glass design tokens (colors, blur, gradients)
- **Evidence**: tailwind.config.ts with custom colors (#0EA5E9, #8B5CF6), backdrop-blur utilities; global layout with gradient background; shadcn/ui Button component styled with glass treatment

### ✅ Principle V: Data Integrity & Precision

- **Status**: COMPLIANT
- **Verification**: Database schema includes audit fields (created_at, updated_at); Decimal.js configured
- **Evidence**: Example Drizzle schema with timestamp columns; Decimal.js utility function for financial calculations; no float types for monetary values

### ✅ Principle VI: Performance & Accessibility

- **Status**: COMPLIANT
- **Verification**: Performance targets defined and testable; accessibility configuration included
- **Evidence**: Success criteria SC-002 through SC-005 specify measurable performance; Next.js config optimized; ESLint plugin jsx-a11y for accessibility linting

### ✅ Principle VII: Security & Compliance

- **Status**: COMPLIANT
- **Verification**: Security measures configured (Drizzle parameterization, Next.js CSRF middleware, XSS protection)
- **Evidence**: Drizzle ORM prevents SQL injection; .env.example includes secure credential placeholders; server-side validation with Zod

### Summary

**ALL GATES PASSED** - Foundation Phase fully complies with Constitution v1.0.0. No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-foundation/
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0: Technology decisions and best practices
├── data-model.md        # Phase 1: Initial schema design (example tables)
├── quickstart.md        # Phase 1: Developer setup guide
├── contracts/           # Phase 1: API contracts
│   └── health.yaml      # Example tRPC health check endpoint spec
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
cora-finance-v2/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Global layout with Liquid Glass design
│   ├── page.tsx                   # Homepage with "Hello Cora Finance"
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts       # tRPC HTTP adapter
│   └── globals.css                # Global styles + Tailwind imports
│
├── components/                     # React components
│   └── ui/                        # shadcn/ui components
│       └── button.tsx             # Example: Button with Liquid Glass styling
│
├── lib/                           # Shared utilities
│   ├── decimal.ts                 # Decimal.js wrapper for financial math
│   ├── utils.ts                   # General utilities (cn helper, etc.)
│   └── trpc/
│       ├── client.ts              # tRPC client for React components
│       └── react.tsx              # tRPC React hooks provider
│
├── server/                        # Server-side code
│   ├── db/
│   │   ├── index.ts               # Drizzle database connection
│   │   └── schema.ts              # Drizzle schema definitions (example)
│   └── trpc/
│       ├── context.ts             # tRPC context (session, db)
│       ├── init.ts                # tRPC instance initialization
│       └── routers/
│           ├── _app.ts            # Root router
│           └── health.ts          # Example: health check procedure
│
├── hooks/                         # Custom React hooks
│   └── use-example.ts             # Example custom hook
│
├── types/                         # TypeScript type definitions
│   └── index.ts                   # Shared types
│
├── drizzle/                       # Database migrations
│   └── 0000_initial.sql           # Initial schema migration (generated)
│
├── tests/                         # Test files
│   ├── unit/
│   │   └── lib/
│   │       └── decimal.test.ts    # Example unit test
│   └── e2e/
│       └── homepage.spec.ts       # Example E2E test (Playwright)
│
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI/CD workflow
│
├── .vscode/
│   └── settings.json              # VS Code recommended settings
│
├── public/                        # Static assets
│   └── favicon.ico
│
├── .env.example                   # Environment variables template
├── .eslintrc.json                 # ESLint configuration
├── .gitignore                     # Git ignore rules
├── .prettierrc                    # Prettier configuration
├── drizzle.config.ts              # Drizzle Kit configuration
├── jest.config.js                 # Jest configuration
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── playwright.config.ts           # Playwright configuration
├── postcss.config.js              # PostCSS configuration (for Tailwind)
├── README.md                      # Project documentation
├── tailwind.config.ts             # TailwindCSS configuration
└── tsconfig.json                  # TypeScript configuration
```

**Structure Decision**: Selected **Web application (Next.js App Router)** structure. This is a full-stack TypeScript application using Next.js App Router for both frontend and backend (tRPC API). No separate backend/frontend split needed since Next.js handles both. Constitution-mandated folder structure (`/app`, `/components`, `/lib`, `/server`, `/hooks`, `/types`, `/drizzle`) is preserved at repository root.

## Implementation Phases

### Overview

The Foundation Phase is broken into 7 logical subphases executed sequentially, with some parallel tasks within each subphase. Total estimated duration: **16-20 hours** (2-3 days for a single developer).

**Dependency Chain**:

```
Phase 1 (Environment)
    ↓
Phase 2 (Backend Setup) → Phase 3 (Database) → Phase 4 (API Layer)
    ↓                          ↓                    ↓
Phase 5 (UI & Design System) ←←←←←←←←←←←←←←←←←←←←←←
    ↓
Phase 6 (Testing Infrastructure)
    ↓
Phase 7 (CI/CD & Documentation)
```

---

### Phase 1: Environment & Project Initialization

**Duration**: 2-3 hours  
**Dependencies**: None  
**Can Run in Parallel**: Initial config files

#### Objectives

- Initialize Next.js 15.5+ project with TypeScript
- Configure package.json with all Constitution-mandated dependencies
- Set up development tooling (ESLint, Prettier, TypeScript)
- Create folder structure matching Constitution

#### Tasks

1. **Initialize Next.js project** (30 min)
   - Run `npx create-next-app@latest` with TypeScript + App Router + TailwindCSS
   - Verify Node.js 20 LTS and npm 10+ installed
   - Set up `.nvmrc` or `.node-version` file for version consistency

2. **Install core dependencies** (30 min) [PARALLEL]
   - Next.js 15.5+, React 18+, TypeScript 5.3+
   - TailwindCSS 4.x, PostCSS, Autoprefixer
   - @tanstack/react-query, Zod
   - Note: Database and testing deps added in later phases

3. **Configure TypeScript strict mode** (30 min) [PARALLEL]
   - Update `tsconfig.json` with strict mode, no implicit any
   - Configure path aliases (@/components, @/lib, @/server, etc.)
   - Set up incremental compilation for faster builds

4. **Configure ESLint** (30 min) [PARALLEL]
   - Extend Next.js ESLint config
   - Add @typescript-eslint plugins
   - Add eslint-plugin-jsx-a11y for accessibility
   - Configure rules for Constitution compliance

5. **Configure Prettier** (15 min)
   - Set 2-space indentation, single quotes
   - Configure to work with ESLint
   - Add .prettierignore

6. **Create folder structure** (30 min)
   - Create `/app`, `/components`, `/lib`, `/server`, `/hooks`, `/types`, `/drizzle`, `/tests` directories
   - Add README placeholders in each directory explaining purpose

#### Deliverables

- ✅ `package.json` with all environment dependencies
- ✅ `tsconfig.json` with strict mode configuration
- ✅ `.eslintrc.json` with linting rules
- ✅ `.prettierrc` with formatting rules
- ✅ Folder structure matching Constitution
- ✅ `.gitignore` configured for Next.js/Node.js

#### Quality Gates

- [ ] `npm install` completes without errors
- [ ] `npm run lint` passes (no errors on empty project)
- [ ] `tsc --noEmit` passes (TypeScript compiles)
- [ ] All Constitutional folders exist

---

### Phase 2: Backend Setup (Next.js API + tRPC)

**Duration**: 3-4 hours  
**Dependencies**: Phase 1 complete  
**Can Run in Parallel**: None (requires environment ready)

#### Objectives

- Install and configure tRPC for type-safe API
- Set up tRPC router structure
- Create example health check endpoint
- Configure Next.js API route for tRPC

#### Tasks

1. **Install tRPC dependencies** (15 min)
   - @trpc/server, @trpc/client, @trpc/react-query, @trpc/next
   - @tanstack/react-query (if not already installed)

2. **Create tRPC initialization** (45 min)
   - `/server/trpc/init.ts`: Initialize tRPC instance
   - `/server/trpc/context.ts`: Create context (database, session placeholders)
   - Configure superjson for serialization (handles Date, Map, Set, etc.)

3. **Create root router** (30 min)
   - `/server/trpc/routers/_app.ts`: Root router aggregating all sub-routers
   - Export type definitions for client

4. **Create example health router** (45 min)
   - `/server/trpc/routers/health.ts`: Health check procedure
   - Input validation with Zod (example: optional message parameter)
   - Return typed response with server status, timestamp, database status placeholder

5. **Configure tRPC API route** (45 min)
   - `/app/api/trpc/[trpc]/route.ts`: Next.js App Router adapter
   - Handle GET and POST requests
   - Configure CORS headers if needed

6. **Create tRPC React client** (45 min)
   - `/lib/trpc/client.ts`: tRPC client configuration
   - `/lib/trpc/react.tsx`: React Query + tRPC provider
   - Configure base URL, headers, credentials

#### Deliverables

- ✅ tRPC server configured with example procedure
- ✅ tRPC client configured for React components
- ✅ Type safety verified end-to-end (server → client)
- ✅ Example health check endpoint functional

#### Quality Gates

- [ ] TypeScript compilation succeeds with full type inference
- [ ] Example tRPC procedure callable from client code
- [ ] No `any` types in tRPC configuration
- [ ] Server starts without tRPC errors

---

### Phase 3: Database Layer (Drizzle ORM + PostgreSQL)

**Duration**: 2-3 hours  
**Dependencies**: Phase 2 complete  
**Can Run in Parallel**: None (requires server infrastructure)

#### Objectives

- Install and configure Drizzle ORM
- Set up PostgreSQL connection with pooling
- Create example schema with audit fields
- Configure migrations with Drizzle Kit
- Create database management scripts

#### Tasks

1. **Install database dependencies** (15 min)
   - drizzle-orm, drizzle-kit
   - pg (PostgreSQL driver), @types/pg
   - dotenv for environment variables

2. **Configure environment variables** (30 min)
   - Create `.env.example` with DATABASE_URL placeholder
   - Document required format: `postgresql://user:password@localhost:5432/cora_finance`
   - Add `.env.local` to `.gitignore`
   - Load environment variables in Next.js config

3. **Create database connection** (45 min)
   - `/server/db/index.ts`: Drizzle database client
   - Configure connection pooling (min: 5, max: 20)
   - Add connection error handling with helpful messages
   - Export typed database instance

4. **Create example schema** (60 min)
   - `/server/db/schema.ts`: Example table (e.g., `system_health`)
   - Include Constitutional audit fields (`created_at`, `updated_at`)
   - Use proper types (serial for IDs, timestamp with timezone, text)
   - Export schema types for use in procedures

5. **Configure Drizzle Kit** (30 min)
   - `drizzle.config.ts`: Migration configuration
   - Point to schema file and output directory
   - Configure introspection and migration generation

6. **Create database scripts** (30 min)
   - Add `package.json` scripts: `db:generate`, `db:migrate`, `db:push`, `db:studio`
   - Document each script's purpose in README

#### Deliverables

- ✅ `.env.example` with database configuration
- ✅ Drizzle ORM configured and connected
- ✅ Example schema with Constitutional audit fields
- ✅ Migration system functional
- ✅ Database management scripts in package.json

#### Quality Gates

- [ ] Database connection succeeds with valid credentials
- [ ] Connection fails gracefully with helpful error message when DB unavailable
- [ ] Migration generates SQL files correctly
- [ ] `db:studio` opens Drizzle Studio for schema inspection
- [ ] Example schema includes `created_at`, `updated_at` fields

---

### Phase 4: API Layer Integration

**Duration**: 1-2 hours  
**Dependencies**: Phase 2 + Phase 3 complete  
**Can Run in Parallel**: None (requires both tRPC and database)

#### Objectives

- Integrate database into tRPC context
- Update health check to query database
- Demonstrate end-to-end type safety (DB → tRPC → Client)
- Add Decimal.js utility for financial calculations

#### Tasks

1. **Update tRPC context with database** (30 min)
   - Modify `/server/trpc/context.ts` to include `db` instance
   - Type context properly for autocomplete in procedures

2. **Update health router with database query** (45 min)
   - Modify `/server/trpc/routers/health.ts`
   - Add database query (e.g., count rows from example table)
   - Return database status in response
   - Handle database errors gracefully

3. **Create Decimal.js utility** (45 min)
   - `/lib/decimal.ts`: Wrapper functions for financial math
   - Example functions: `formatCurrency(cents)`, `parseCurrency(string)`, `calculatePercentage(amount, percent)`
   - Include JSDoc comments with usage examples
   - Export Decimal class for advanced use

#### Deliverables

- ✅ Database integrated into tRPC procedures
- ✅ Health check endpoint queries database
- ✅ Decimal.js utility with financial helper functions
- ✅ Full type safety from database to client verified

#### Quality Gates

- [ ] Health check endpoint returns database status
- [ ] TypeScript infers database query return types
- [ ] Decimal.js utility has unit test (added in Phase 6)
- [ ] No manual type casting in database queries

---

### Phase 5: UI & Liquid Glass Design System

**Duration**: 4-5 hours  
**Dependencies**: Phase 1-4 complete  
**Can Run in Parallel**: Some tasks (Tailwind config, shadcn install)

#### Objectives

- Configure TailwindCSS 4.x with Liquid Glass design tokens
- Install and configure shadcn/ui
- Create global layout with Liquid Glass aesthetic
- Build example Button component with glass treatment
- Add Framer Motion for animations
- Create homepage displaying "Hello Cora Finance" with glass styling

#### Tasks

1. **Configure TailwindCSS with design tokens** (60 min)
   - Update `tailwind.config.ts` with Liquid Glass colors
   - Add custom color: `sky` (#0EA5E9), `purple` (#8B5CF6)
   - Add custom backdrop-blur utilities
   - Configure gradient backgrounds (`#f5f7fa` → `#e9ecf5`)
   - Set up 16px spacing grid
   - Configure responsive breakpoints (640, 768, 1024, 1280px)

2. **Install shadcn/ui** (30 min) [CAN PARALLEL with task 1]
   - Run `npx shadcn-ui@latest init`
   - Configure for Next.js App Router + TypeScript
   - Set CSS variables for theming
   - Install Button component: `npx shadcn-ui@latest add button`

3. **Customize Button with Liquid Glass** (45 min)
   - Modify `/components/ui/button.tsx`
   - Apply glass treatment: `bg-white/10`, `backdrop-blur-md`, `border border-white/20`
   - Add hover states with subtle transitions
   - Ensure accessibility (proper contrast ratios)

4. **Create global layout** (90 min)
   - Update `/app/layout.tsx` with Liquid Glass design
   - Apply gradient background
   - Add Inter or San Francisco font via next/font
   - Include TanStack Query provider
   - Include tRPC provider
   - Set up proper HTML structure with accessibility

5. **Install and configure Framer Motion** (30 min)
   - Install `framer-motion`
   - Create example animation variants
   - Document motion guidelines (opacity 0.9→1, blur fade-in)

6. **Create homepage** (60 min)
   - Update `/app/page.tsx`
   - Display "Hello Cora Finance" with glass card
   - Add glass-styled card with example tRPC health check call
   - Show database connection status
   - Include example Button component
   - Add subtle Framer Motion entrance animation

7. **Create global styles** (30 min)
   - Update `/app/globals.css`
   - Import TailwindCSS directives
   - Add custom CSS for glass effects not possible with utilities
   - Set up CSS variables for theming

#### Deliverables

- ✅ `tailwind.config.ts` with complete Liquid Glass tokens
- ✅ shadcn/ui installed and configured
- ✅ Button component with glass treatment
- ✅ Global layout with gradient background and providers
- ✅ Framer Motion configured
- ✅ Homepage displaying Liquid Glass UI
- ✅ Example tRPC call from homepage component

#### Quality Gates

- [ ] Homepage renders with Liquid Glass styling
- [ ] Gradient background visible
- [ ] Glass cards display correctly with blur and transparency
- [ ] Button component has glass treatment
- [ ] tRPC health check call succeeds and displays data
- [ ] Page loads in <5 seconds
- [ ] No console errors in browser
- [ ] Accessibility audit passes (basic check)

---

### Phase 6: Testing Infrastructure

**Duration**: 3-4 hours  
**Dependencies**: Phase 1-5 complete  
**Can Run in Parallel**: Jest and Playwright setup can happen in parallel

#### Objectives

- Configure Jest for unit testing
- Configure Playwright for E2E testing
- Create example unit test (Decimal.js utility)
- Create example E2E test (homepage)
- Achieve 80%+ coverage on example code
- Configure coverage reporting

#### Tasks

1. **Install and configure Jest** (60 min) [PARALLEL option]
   - Install jest, @types/jest, ts-jest, @testing-library/react, @testing-library/jest-dom
   - Create `jest.config.js` for TypeScript support
   - Configure test environment (jsdom for React testing)
   - Set up coverage thresholds (80% minimum)
   - Add `jest.setup.js` for global test configuration
   - Configure path aliases to match tsconfig

2. **Create example unit test** (45 min)
   - `/tests/unit/lib/decimal.test.ts`
   - Test `formatCurrency()`, `parseCurrency()`, `calculatePercentage()`
   - Cover edge cases (negative numbers, zero, large numbers)
   - Achieve 80%+ coverage of decimal.ts

3. **Install and configure Playwright** (60 min) [PARALLEL with Jest]
   - Install @playwright/test
   - Run `npx playwright install` for browser binaries
   - Create `playwright.config.ts`
   - Configure for Chromium (primary), Firefox, Safari (optional)
   - Set base URL to http://localhost:3000
   - Configure test timeout and retries

4. **Create example E2E test** (60 min)
   - `/tests/e2e/homepage.spec.ts`
   - Test: Homepage loads and displays "Hello Cora Finance"
   - Test: Glass card is visible
   - Test: Health check displays database status
   - Test: Button is clickable and accessible
   - Use Playwright assertions for visual verification

5. **Add test scripts to package.json** (15 min)
   - `test`: Run Jest in watch mode
   - `test:ci`: Run Jest once with coverage
   - `test:e2e`: Run Playwright tests
   - `test:e2e:ui`: Run Playwright with UI mode

6. **Configure coverage reporting** (30 min)
   - Generate coverage reports in HTML and JSON
   - Add coverage/ directory to .gitignore
   - Document how to view coverage report

#### Deliverables

- ✅ `jest.config.js` with TypeScript and React support
- ✅ `playwright.config.ts` with browser configurations
- ✅ Example unit test with 80%+ coverage
- ✅ Example E2E test covering homepage
- ✅ Test scripts in package.json
- ✅ Coverage reporting configured

#### Quality Gates

- [ ] `npm run test:ci` passes with 80%+ coverage
- [ ] `npm run test:e2e` passes all E2E tests
- [ ] Tests complete in <2 minutes
- [ ] Coverage report generates successfully
- [ ] No flaky tests (tests pass consistently)

---

### Phase 7: CI/CD & Documentation

**Duration**: 2-3 hours  
**Dependencies**: All previous phases complete  
**Can Run in Parallel**: GitHub Actions and README can be done simultaneously

#### Objectives

- Create GitHub Actions CI workflow
- Update README with comprehensive setup instructions
- Document all npm scripts
- Create architecture overview
- Verify all Success Criteria from spec

#### Tasks

1. **Create GitHub Actions workflow** (90 min)
   - Create `.github/workflows/ci.yml`
   - Jobs: Install, Build, Lint, Type-check, Test (unit), Test (E2E)
   - Use Node.js 20 LTS matrix
   - Cache dependencies for faster builds
   - Run on: push to any branch, pull requests to main
   - Configure PostgreSQL service for E2E tests
   - Upload coverage artifacts

2. **Update README.md** (60 min) [CAN PARALLEL with workflow]
   - Project overview and philosophy
   - Technology stack list
   - Prerequisites (Node.js, PostgreSQL, Git)
   - Step-by-step setup instructions
   - Environment variable configuration guide
   - Available npm scripts with descriptions
   - Folder structure overview
   - Constitution compliance statement
   - Contributing guidelines placeholder
   - License information

3. **Create architecture documentation** (30 min)
   - Document layered architecture
   - Explain tRPC flow (client → API route → router → procedure → database)
   - Explain Liquid Glass design system usage
   - Reference Constitution v1.0.0

4. **Verify Success Criteria** (30 min)
   - Run through each SC-001 through SC-010
   - Time the setup process (<10 min)
   - Verify application start time (<5 sec)
   - Verify quality checks (<30 sec)
   - Verify test execution (<2 min)
   - Document any gaps

#### Deliverables

- ✅ `.github/workflows/ci.yml` with complete pipeline
- ✅ Comprehensive README.md
- ✅ Architecture documentation
- ✅ All Success Criteria verified

#### Quality Gates

- [ ] CI workflow runs successfully on push
- [ ] All CI jobs pass (install, build, lint, type-check, test)
- [ ] CI completes in <5 minutes
- [ ] README instructions are accurate and complete
- [ ] Fresh clone setup completes in <10 minutes following README

---

## Deliverables Checklist

This checklist maps directly to the Foundation Phase spec's Success Criteria:

### Setup & Performance

- [ ] **SC-001**: Developer setup completes in <10 minutes ✓ (Phase 7 verification)
- [ ] **SC-002**: Application starts in <5 seconds ✓ (Phase 5 + 7 verification)
- [ ] **SC-003**: Quality checks execute in <30 seconds ✓ (Phase 1 + 7 verification)
- [ ] **SC-004**: Test suite executes in <2 minutes ✓ (Phase 6 + 7 verification)
- [ ] **SC-005**: CI pipeline completes in <5 minutes ✓ (Phase 7 verification)

### Code Quality

- [ ] **SC-006**: 80%+ code coverage on examples ✓ (Phase 6)
- [ ] **SC-007**: Zero TypeScript errors in strict mode ✓ (Phase 1 + all phases)
- [ ] **SC-008**: Zero linting errors on fresh install ✓ (Phase 1 + all phases)

### Functionality

- [ ] **SC-009**: Database connection succeeds ✓ (Phase 3 + 4)
- [ ] **SC-010**: Full type safety end-to-end ✓ (Phase 2 + 3 + 4)

### Constitution Compliance

- [ ] All 7 Constitutional Principles implemented ✓ (Constitution Check section)
- [ ] Folder structure matches Constitution ✓ (Phase 1)
- [ ] Liquid Glass design system implemented ✓ (Phase 5)
- [ ] TDD infrastructure ready ✓ (Phase 6)

### Documentation

- [ ] README with setup instructions ✓ (Phase 7)
- [ ] `.env.example` with all variables ✓ (Phase 3)
- [ ] Architecture overview ✓ (Phase 7)
- [ ] npm scripts documented ✓ (Phase 7)

---

## Estimated Timeline

**Total Duration**: 16-20 hours (2-3 days for single developer)

| Phase                    | Duration  | Can Start After |
| ------------------------ | --------- | --------------- |
| Phase 1: Environment     | 2-3 hours | Immediately     |
| Phase 2: Backend Setup   | 3-4 hours | Phase 1         |
| Phase 3: Database        | 2-3 hours | Phase 2         |
| Phase 4: API Integration | 1-2 hours | Phase 2 + 3     |
| Phase 5: UI & Design     | 4-5 hours | Phase 1-4       |
| Phase 6: Testing         | 3-4 hours | Phase 1-5       |
| Phase 7: CI/CD & Docs    | 2-3 hours | All previous    |

**Critical Path**: Phase 1 → 2 → 3 → 4 → 5 → 6 → 7 (sequential)

**Parallel Opportunities**:

- Within Phase 1: Config files can be created simultaneously
- Within Phase 5: Tailwind config and shadcn install
- Within Phase 6: Jest and Playwright configuration
- Within Phase 7: GitHub Actions and README updates

---

## Next Steps

After this plan is approved:

1. **Phase 0**: Generate `research.md` with technology best practices (if needed)
2. **Phase 1**: Generate `data-model.md` with initial schema design
3. **Phase 1**: Generate `contracts/health.yaml` with API specifications
4. **Phase 1**: Generate `quickstart.md` for developer onboarding
5. **Phase 2**: Run `/speckit.tasks` to generate granular task list

The plan is now ready for implementation following the TDD workflow mandated by Constitution v1.0.0.
