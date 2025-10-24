# Tasks: Foundation Phase

**Input**: Design documents from `/specs/001-foundation/`  
**Prerequisites**: plan.md (✓), spec.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓)

**Tests**: The Foundation Phase includes example tests to demonstrate TDD infrastructure. All test tasks are included to validate testing framework setup.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router full-stack**: Repository root with `/app`, `/components`, `/lib`, `/server`, `/hooks`, `/types`, `/drizzle`, `/tests`
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js 15.5+ project with App Router and TypeScript using create-next-app
- [x] T002 [P] Create folder structure: /app, /components, /lib, /server, /hooks, /types, /drizzle, /tests directories
- [x] T003 [P] Configure tsconfig.json with strict mode and path aliases (@/app, @/components, @/lib, @/server, @/hooks, @/types)
- [x] T004 [P] Configure .eslintrc.json with Next.js, TypeScript, and jsx-a11y plugins
- [x] T005 [P] Configure .prettierrc with 2-space indentation and single quotes
- [x] T006 [P] Create .gitignore for Next.js, Node.js, .env files, and coverage reports
- [x] T007 [P] Add .nvmrc or .node-version file specifying Node.js 20 LTS
- [x] T008 [P] Create .env.example with DATABASE_URL and NEXT_PUBLIC_APP_URL placeholders

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Install core dependencies: @trpc/server, @trpc/client, @trpc/react-query, @trpc/next, @tanstack/react-query
- [x] T010 [P] Install database dependencies: drizzle-orm, drizzle-kit, pg, @types/pg
- [x] T011 [P] Install styling dependencies: tailwindcss@4.x, postcss, autoprefixer
- [x] T012 [P] Install utility dependencies: zod, decimal.js, framer-motion
- [x] T013 [P] Install dev dependencies: @types/node, @types/react, @types/react-dom
- [x] T014 Configure tailwind.config.ts with Liquid Glass design tokens (colors #0EA5E9, #8B5CF6, gradients, backdrop-blur)
- [x] T015 Configure postcss.config.js for TailwindCSS processing
- [x] T016 Create /server/db/index.ts with Drizzle database connection and connection pooling (min: 5, max: 20)
- [x] T017 Create /server/db/schema.ts with systemHealth table including id, status, message, checkedAt, archived, createdAt, updatedAt
- [x] T018 Create drizzle.config.ts pointing to schema file and migrations directory
- [x] T019 Generate initial database migration with drizzle-kit
- [x] T020 Create /server/trpc/init.ts initializing tRPC instance with superjson transformer
- [x] T021 Create /server/trpc/context.ts defining tRPC context with database instance
- [x] T022 Create /server/trpc/routers/\_app.ts as root router
- [x] T023 Create /lib/trpc/client.ts configuring tRPC client for browser
- [x] T024 Create /lib/trpc/react.tsx with TanStack Query provider and tRPC hooks
- [x] T025 Create /app/api/trpc/[trpc]/route.ts as Next.js App Router adapter for tRPC
- [x] T026 Update /app/layout.tsx to include TanStack Query provider and tRPC provider
- [x] T027 Create /app/globals.css with Tailwind directives and Liquid Glass global styles
- [x] T028 Configure /app/layout.tsx with Inter font, gradient background, and HTML structure

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Developer Environment Setup (Priority: P1) 🎯 MVP

**Goal**: Enable developers to clone, install, configure, and run the application with Liquid Glass UI

**Independent Test**: Run setup commands, verify app starts, displays "Hello Cora Finance" with glass styling, and health check shows database connection

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T029 [P] [US1] Create unit test for Decimal.js utility in tests/unit/lib/decimal.test.ts
- [X] T030 [P] [US1] Create E2E test for homepage in tests/e2e/homepage.spec.ts testing page load and Liquid Glass rendering

### Implementation for User Story 1

- [x] T031 [P] [US1] Create /lib/decimal.ts with formatCurrency, parseCurrency, and calculatePercentage functions
- [x] T032 [P] [US1] Create /lib/utils.ts with cn() helper for classNames merging
- [x] T033 [P] [US1] Install shadcn/ui with npx shadcn-ui@latest init
- [x] T034 [US1] Add Button component with npx shadcn-ui@latest add button
- [x] T035 [US1] Customize /components/ui/button.tsx with Liquid Glass styling (bg-white/10, backdrop-blur-md, border-white/20)
- [x] T036 [US1] Create /server/trpc/routers/health.ts with check procedure querying systemHealth table
- [x] T037 [US1] Register health router in /server/trpc/routers/\_app.ts
- [x] T038 [US1] Update /app/page.tsx with "Hello Cora Finance" heading, glass card, and health check display using trpc.health.check.useQuery()
- [x] T039 [US1] Add Framer Motion animation to homepage card with opacity and blur fade-in transitions
- [X] T040 [US1] Verify application starts in <5 seconds with npm run dev
- [X] T041 [US1] Verify homepage displays Liquid Glass UI with gradient background and glass effects

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Code Quality Validation (Priority: P2)

**Goal**: Enable developers to validate code quality with linting, type-checking, and formatting

**Independent Test**: Introduce intentional errors, run quality commands, verify they catch issues and pass on clean code

### Implementation for User Story 2

- [X] T042 [US2] Add package.json script "lint": "next lint"
- [X] T043 [US2] Add package.json script "type-check": "tsc --noEmit"
- [X] T044 [US2] Add package.json script "format": "prettier --write ."
- [X] T045 [US2] Add package.json script "format:check": "prettier --check ."
- [X] T046 [US2] Create .vscode/settings.json with recommended VS Code settings for ESLint and Prettier
- [X] T047 [US2] Verify npm run lint completes with zero errors in <10 seconds
- [X] T048 [US2] Verify npm run type-check completes with zero errors in <15 seconds
- [X] T049 [US2] Verify npm run format processes all files in <5 seconds
- [X] T050 [US2] Test intentional lint error is caught by running npm run lint
- [X] T051 [US2] Test intentional type error is caught by running npm run type-check

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Automated Testing Execution (Priority: P3)

**Goal**: Enable developers to run test suite with Jest and Playwright

**Independent Test**: Run test suite, verify execution, and coverage reporting

### Implementation for User Story 3

- [X] T052 [P] [US3] Install Jest dependencies: jest, @types/jest, ts-jest, @testing-library/react, @testing-library/jest-dom
- [X] T053 [P] [US3] Install Playwright dependencies: @playwright/test
- [X] T054 [US3] Create jest.config.js with TypeScript support, jsdom environment, and 80% coverage threshold
- [X] T055 [US3] Create jest.setup.js for global test configuration
- [X] T056 [US3] Create playwright.config.ts for Chromium browser, baseURL localhost:3000, and test timeout settings
- [X] T057 [US3] Run npx playwright install to download browser binaries
- [X] T058 [US3] Add package.json script "test": "jest --watch"
- [X] T059 [US3] Add package.json script "test:ci": "jest --ci --coverage"
- [X] T060 [US3] Add package.json script "test:e2e": "playwright test"
- [X] T061 [US3] Add package.json script "test:e2e:ui": "playwright test --ui"
- [X] T062 [US3] Verify unit test for Decimal.js (T029) passes and achieves 80%+ coverage
- [X] T063 [US3] Verify E2E test for homepage (T030) passes and completes in <30 seconds
- [X] T064 [US3] Verify npm run test:ci generates coverage report in HTML and JSON formats
- [X] T065 [US3] Add coverage/ directory to .gitignore

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Continuous Integration Verification (Priority: P4)

**Goal**: Automate quality gates when code is pushed to GitHub

**Independent Test**: Push a commit, observe GitHub Actions execute successfully

### Implementation for User Story 4

- [X] T066 [US4] Create .github/workflows/ci.yml file
- [X] T067 [US4] Configure CI workflow to trigger on push and pull_request events
- [X] T068 [US4] Add CI job: Install dependencies with npm ci
- [X] T069 [US4] Add CI job: Build application with npm run build
- [X] T070 [US4] Add CI job: Run linting with npm run lint
- [X] T071 [US4] Add CI job: Run type checking with npm run type-check
- [X] T072 [US4] Add CI job: Run unit tests with npm run test:ci
- [X] T073 [US4] Add CI job: Run E2E tests with npm run test:e2e (with PostgreSQL service container)
- [X] T074 [US4] Configure CI to cache node_modules for faster builds
- [X] T075 [US4] Configure CI to upload coverage artifacts
- [X] T076 [US4] Set CI to use Node.js 20 LTS
- [X] T077 [US4] Verify CI workflow completes in <5 minutes
- [X] T078 [US4] Test CI by pushing commit and confirming green check mark

**Checkpoint**: All user stories complete and CI/CD operational

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T079 [P] Update README.md with project overview, technology stack, and setup instructions
- [X] T080 [P] Document all npm scripts in README.md
- [X] T081 [P] Create architecture overview section in README.md explaining tRPC flow and folder structure
- [X] T082 [P] Add Constitution v1.0.0 compliance statement to README.md
- [X] T083 [P] Create LICENSE file (if applicable)
- [X] T084 [P] Create CONTRIBUTING.md with code quality standards and PR process
- [X] T085 Add package.json script "db:generate": "drizzle-kit generate:pg"
- [X] T086 Add package.json script "db:migrate": "drizzle-kit push:pg"
- [X] T087 Add package.json script "db:studio": "drizzle-kit studio"
- [X] T088 Document environment variables setup in README.md with DATABASE_URL example
- [X] T089 Verify setup time is <10 minutes by following README instructions (SC-001)
- [X] T090 Verify all quality checks complete in <30 seconds combined (SC-003)
- [X] T091 Run complete test suite and verify <2 minutes total duration (SC-004)
- [X] T092 Verify zero TypeScript errors with npm run type-check (SC-007)
- [X] T093 Verify zero linting errors with npm run lint (SC-008)
- [X] T094 Verify database connection succeeds with valid credentials (SC-009)
- [X] T095 Verify end-to-end type safety by creating new tRPC procedure and calling from client (SC-010)
- [X] T096 Run quickstart.md validation to ensure all steps work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Tests rely on US1 implementation existing
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - CI tests rely on US2 & US3 scripts existing

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD workflow)
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002-T008)
- All Foundational tasks marked [P] can run in parallel within their subgroups:
  - Dependencies: T009-T013
  - Test files: T029-T030
  - Utility files: T031-T032
  - Playwright/Jest setup: T052-T053
  - Documentation: T079-T084
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all parallel tasks for User Story 1 together:
Task: "Create unit test for Decimal.js in tests/unit/lib/decimal.test.ts" (T029)
Task: "Create E2E test for homepage in tests/e2e/homepage.spec.ts" (T030)

# Then launch all model tasks together:
Task: "Create Decimal.js utility in /lib/decimal.ts" (T031)
Task: "Create utils.ts in /lib/utils.ts" (T032)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T028) **CRITICAL** - blocks all stories
3. Complete Phase 3: User Story 1 (T029-T041)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

**Result**: Working development environment with Liquid Glass UI and database connectivity (~10-12 hours)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! ✓)
3. Add User Story 2 → Test independently → Deploy/Demo (Quality gates ready)
4. Add User Story 3 → Test independently → Deploy/Demo (Testing infrastructure ready)
5. Add User Story 4 → Test independently → Deploy/Demo (CI/CD ready)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T028)
2. Once Foundational is done:
   - Developer A: User Story 1 (T029-T041) - Environment setup
   - Developer B: User Story 2 (T042-T051) - Quality validation
   - Developer C: User Story 3 (T052-T065) - Testing infrastructure
3. Stories complete and integrate independently
4. Developer D or team lead: User Story 4 (T066-T078) - CI/CD (depends on US2 & US3 scripts)

---

## Task Summary Statistics

**Total Tasks**: 96

- **Setup (Phase 1)**: 8 tasks
- **Foundational (Phase 2)**: 20 tasks (CRITICAL PATH)
- **User Story 1 (P1)**: 13 tasks (MVP)
- **User Story 2 (P2)**: 10 tasks
- **User Story 3 (P3)**: 14 tasks
- **User Story 4 (P4)**: 13 tasks
- **Polish (Phase 7)**: 18 tasks

**Parallel Opportunities**: 32 tasks marked [P] can run in parallel with other tasks
**Test Tasks**: 2 explicit test creation tasks (T029, T030) + 12 verification tasks

**Critical Path**: Phase 1 → Phase 2 → Phase 3 (US1) for MVP
**Estimated Duration**: 16-20 hours for complete implementation (all user stories)
**MVP Duration**: 10-12 hours (Phase 1 + 2 + US1 only)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD workflow mandated by Constitution)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Success Criteria Mapping

Each task maps to Constitution v1.0.0 Success Criteria:

- **SC-001** (Setup <10 min): Verified by T089
- **SC-002** (App start <5 sec): Verified by T040
- **SC-003** (Quality checks <30 sec): Verified by T047-T049, T090
- **SC-004** (Test suite <2 min): Verified by T091
- **SC-005** (CI pipeline <5 min): Verified by T077
- **SC-006** (80%+ coverage): Configured in T054, verified by T062
- **SC-007** (Zero TS errors): Verified by T092
- **SC-008** (Zero lint errors): Verified by T093
- **SC-009** (Database connects): Verified by T094
- **SC-010** (Type-safe API): Verified by T095






