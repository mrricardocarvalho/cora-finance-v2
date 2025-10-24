# Research: Foundation Phase

**Created**: 2025-10-24  
**Purpose**: Document technology decisions, best practices, and rationale for Foundation Phase implementation

## Overview

This document captures research findings and decisions for establishing the Cora Finance v2 development environment. All technology choices are mandated by Constitution v1.0.0, so research focuses on optimal configuration, best practices, and integration patterns.

---

## Technology Stack Research

### Next.js 15.5+ with App Router

**Decision**: Use Next.js 15.5+ with App Router (not Pages Router)

**Rationale**:

- **App Router** is the future of Next.js, provides better support for React Server Components
- Simpler data fetching patterns with async/await in Server Components
- Better streaming and Suspense integration
- Improved layouts and nested routing
- Mandatory per Constitution v1.0.0

**Best Practices**:

- Use Server Components by default, Client Components (`'use client'`) only when needed
- Leverage React Server Components for data fetching to reduce client-side JavaScript
- Use `loading.tsx` and `error.tsx` for better UX
- Implement route handlers in `/app/api` for tRPC adapter
- Use `generateMetadata` for SEO optimization

**Configuration Decisions**:

- Enable experimental features: `serverActions` for form handling (future phases)
- Configure `output: 'standalone'` for optimized Docker builds (future deployment)
- Set `reactStrictMode: true` for development best practices
- Configure `images` domain whitelist for external images (future phases)

**References**:

- Next.js App Router Documentation: https://nextjs.org/docs/app
- React Server Components: https://react.dev/reference/react/use-server

---

### TypeScript 5.3+ (Strict Mode)

**Decision**: TypeScript 5.3+ with strictest possible configuration

**Rationale**:

- Type safety is Constitutional principle II
- Strict mode catches errors at compile time, not runtime
- Improved autocomplete and IntelliSense
- Better refactoring support

**Configuration Decisions**:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "strictBindCallApply": true,
  "strictPropertyInitialization": true,
  "noImplicitThis": true,
  "alwaysStrict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
}
```

**Path Alias Strategy**:

- `@/app/*`, `@/components/*`, `@/lib/*`, `@/server/*`, `@/hooks/*`, `@/types/*`
- Improves import readability and refactoring
- Standard practice in Next.js ecosystem

**Best Practices**:

- Never use `any` type (use `unknown` if truly dynamic)
- Prefer `interface` over `type` for object shapes (better error messages)
- Use `const` assertions for literal types
- Leverage TypeScript utility types (`Partial`, `Pick`, `Omit`, etc.)

---

### tRPC for Type-Safe API

**Decision**: tRPC v10+ with React Query integration

**Rationale**:

- End-to-end type safety without code generation
- Automatically synced types between client and server
- Eliminates API contract drift
- Better DX with autocomplete for procedures
- Constitutional requirement

**Integration Pattern**:

- Server: tRPC router in `/server/trpc/routers/`
- API Route: Next.js App Router adapter in `/app/api/trpc/[trpc]/route.ts`
- Client: React hooks in components via `@trpc/react-query`
- Context: Database + session in tRPC context

**Best Practices**:

- Use `publicProcedure` for unauthenticated endpoints
- Use `protectedProcedure` for authenticated (implement in future phase)
- Always validate inputs with Zod schemas
- Keep routers focused (one router per domain: users, transactions, etc.)
- Use superjson for serialization (handles Date, Map, Set, undefined)

**Performance Considerations**:

- Enable batching for multiple parallel queries (reduce HTTP requests)
- Use `useQuery` with `staleTime` to avoid unnecessary refetches
- Implement pagination for large datasets (future phases)

**References**:

- tRPC Documentation: https://trpc.io/docs
- Next.js Integration: https://trpc.io/docs/client/nextjs/setup

---

### Drizzle ORM + PostgreSQL

**Decision**: Drizzle ORM with PostgreSQL 15+

**Rationale**:

- Type-safe SQL with compile-time validation
- Lightweight (no heavy runtime overhead like Prisma)
- Full SQL power (complex queries, CTEs, window functions)
- Excellent TypeScript inference
- Constitutional requirement

**Schema Design Principles**:

- Use `serial` or `bigserial` for auto-incrementing IDs
- Always include `created_at timestamp default now()`
- Always include `updated_at timestamp default now()`
- Use `boolean` for soft deletes: `archived boolean default false`
- Store monetary values as `integer` (cents, not decimals)
- Use `timestamp with time zone` for all dates (ISO 8601 UTC)

**Migration Strategy**:

- Use Drizzle Kit for migration generation: `drizzle-kit generate:pg`
- Store migrations in `/drizzle` directory
- Run migrations manually during deployment (not auto-apply)
- Keep migrations reversible when possible

**Connection Pooling**:

- Min connections: 5
- Max connections: 20
- Idle timeout: 30 seconds
- Connection timeout: 10 seconds

**Best Practices**:

- Use transactions for multi-step operations
- Leverage prepared statements (Drizzle does this automatically)
- Use `.returning()` to get inserted/updated data
- Index foreign keys and frequently queried columns

**References**:

- Drizzle ORM Documentation: https://orm.drizzle.team/docs/overview
- PostgreSQL Best Practices: https://wiki.postgresql.org/wiki/Don't_Do_This

---

### TailwindCSS 4.x + Liquid Glass Design System

**Decision**: TailwindCSS 4.x with custom design tokens for Liquid Glass

**Rationale**:

- Utility-first CSS maximizes development speed
- Minimal runtime CSS (purged unused styles)
- Excellent TypeScript autocomplete support
- Constitutional design system requirement

**Liquid Glass Implementation**:

**Colors**:

```javascript
colors: {
  sky: { DEFAULT: '#0EA5E9' },      // Primary accent
  purple: { DEFAULT: '#8B5CF6' },   // Secondary accent
  glass: {
    bg: '#f5f7fa',                  // Gradient start
    bgEnd: '#e9ecf5',               // Gradient end
  }
}
```

**Custom Utilities**:

- `backdrop-blur-md`: 12px blur for glass effect
- `bg-white/10`: 10% white opacity for panels
- `border-white/20`: 20% white border for depth

**Component Patterns**:

- Card: `bg-white/10 backdrop-blur-md border border-white/20 rounded-xl`
- Button: `bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20`
- Input: `bg-white/5 backdrop-blur-sm border border-white/15`

**Best Practices**:

- Use Tailwind's built-in dark mode support (future phase)
- Leverage `@apply` sparingly (only for complex repeated patterns)
- Use CSS variables for dynamic theming
- Configure content paths to include all component files

**Performance**:

- Enable JIT mode (default in Tailwind 3+)
- Purge unused styles in production
- Optimize for production with `minify: true`

---

### shadcn/ui Component Library

**Decision**: Use shadcn/ui for base components, customize with Liquid Glass

**Rationale**:

- Not a library (copy-paste components into codebase)
- Full control over styling and behavior
- Built with Radix UI (accessibility first)
- Excellent TypeScript support
- Easy to customize for Liquid Glass aesthetic

**Component Strategy**:

- Install only needed components (start with Button)
- Customize variants to match Liquid Glass
- Maintain accessibility features from Radix
- Add glass treatment to all interactive components

**Customization Approach**:

- Modify `tailwind.config.ts` CSS variables
- Update component variants in `/components/ui/`
- Add glass-specific variants (e.g., `variant: "glass"`)

**Accessibility**:

- Preserve ARIA attributes from Radix UI
- Ensure contrast ratios meet WCAG 2.1 AA (4.5:1 for text)
- Test with keyboard navigation
- Use semantic HTML

**References**:

- shadcn/ui: https://ui.shadcn.com/
- Radix UI Primitives: https://www.radix-ui.com/primitives

---

### Jest + Playwright Testing

**Decision**: Jest for unit tests, Playwright for E2E

**Rationale**:

- Jest: Industry standard, excellent TypeScript support, fast
- Playwright: Modern, reliable, multi-browser support
- Constitutional TDD requirement mandates robust testing

**Jest Configuration**:

- Use `ts-jest` for TypeScript transformation
- Configure `@testing-library/react` for component tests
- Set coverage threshold: 80% minimum
- Enable watch mode for TDD workflow
- Use `jsdom` environment for React testing

**Playwright Configuration**:

- Test in Chromium (primary), optionally Firefox/Safari
- Run against `http://localhost:3000` (dev server)
- Configure retries: 2 on CI, 0 locally
- Use Page Object Model pattern for maintainability
- Take screenshots on failure

**Testing Strategy**:

- Unit tests: Pure functions, utilities, hooks
- Component tests: React components with `@testing-library/react`
- Integration tests: tRPC procedures with database
- E2E tests: Critical user workflows

**Best Practices**:

- Follow AAA pattern: Arrange, Act, Assert
- Use descriptive test names: `it('should format 100 cents as €1,00', ...)`
- Mock external dependencies (database, APIs)
- Avoid testing implementation details

---

### Decimal.js for Financial Math

**Decision**: Decimal.js for all monetary calculations

**Rationale**:

- JavaScript's native `Number` type has floating-point precision issues
- `0.1 + 0.2 !== 0.3` in JavaScript (floating-point rounding)
- Financial calculations MUST be precise (Constitutional requirement)
- Decimal.js provides arbitrary-precision arithmetic

**Usage Patterns**:

```typescript
// Store in database as integer cents
const amountCents = 12345; // €123.45

// Convert to Decimal for calculations
const amount = new Decimal(amountCents).div(100);

// Perform calculations
const tax = amount.mul(0.23); // 23% VAT
const total = amount.plus(tax);

// Convert back to cents for storage
const totalCents = total.mul(100).toNumber();
```

**Best Practices**:

- Never use `Number` for monetary values
- Always store as integer cents in database
- Use Decimal.js for all calculations
- Round explicitly (don't rely on default rounding)
- Document precision requirements (e.g., 2 decimal places for EUR)

---

### Framer Motion for Animations

**Decision**: Framer Motion for UI animations

**Rationale**:

- Declarative animation API (React-friendly)
- Better performance than CSS transitions (GPU-accelerated)
- Constitutional motion guidelines: opacity 0.9→1, blur fade-in
- Gesture support (drag, tap, hover)

**Animation Patterns**:

```typescript
// Glass panel entrance
const glassVariants = {
  hidden: { opacity: 0.9, backdropFilter: 'blur(0px)' },
  visible: { opacity: 1, backdropFilter: 'blur(12px)' },
};
```

**Performance Considerations**:

- Use `layoutId` for shared element transitions
- Animate `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height` (causes reflow)
- Use `will-change` sparingly

---

## Environment Configuration

### Environment Variables Strategy

**Decision**: Use `.env.local` for local development, `.env.example` for documentation

**Required Variables**:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cora_finance"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Future: Authentication (Clerk/NextAuth)
# Future: Observability (Sentry, Vercel Analytics)
```

**Security Best Practices**:

- Never commit `.env.local` (add to `.gitignore`)
- Use `NEXT_PUBLIC_` prefix only for client-exposed variables
- Validate required env vars at startup (custom utility)
- Document all variables in `.env.example` with examples

---

## Development Workflow

### Git Workflow

**Decision**: Feature branches with descriptive names

**Branch Naming**: `###-feature-name` (e.g., `001-foundation`)

**Commit Messages**:

- Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `test:`
- Include feature number: `feat(001): add Liquid Glass button component`

---

## Performance Targets

Based on Success Criteria from spec:

| Metric         | Target  | Measurement                    |
| -------------- | ------- | ------------------------------ |
| Setup Time     | <10 min | Time from clone to running app |
| App Start      | <5 sec  | `npm run dev` to page load     |
| Build Time     | <2 min  | Production build duration      |
| Quality Checks | <30 sec | lint + type-check combined     |
| Test Suite     | <2 min  | Jest + Playwright combined     |
| CI Pipeline    | <5 min  | All jobs end-to-end            |

---

## Alternatives Considered

### Why Not Prisma ORM?

- **Rejected**: Heavier runtime overhead, less SQL flexibility
- Drizzle offers better TypeScript inference and smaller bundle size

### Why Not GraphQL?

- **Rejected**: More complexity (schema definition, code generation)
- tRPC provides type safety without GraphQL overhead

### Why Not Emotion/Styled Components?

- **Rejected**: Runtime CSS-in-JS has performance cost
- TailwindCSS offers better performance (build-time CSS generation)

### Why Not Vitest Instead of Jest?

- **Considered**: Vitest is faster and more modern
- **Decision**: Stick with Jest for broader ecosystem support and stability

---

## Risks & Mitigations

| Risk                                | Impact | Mitigation                                                     |
| ----------------------------------- | ------ | -------------------------------------------------------------- |
| Next.js 15.5+ breaking changes      | High   | Pin exact version, test thoroughly                             |
| Database connection failures        | High   | Helpful error messages, connection pooling, retry logic        |
| Type safety compromised             | Medium | Strict TypeScript config, linting rules, code review           |
| Poor performance on low-end devices | Medium | Performance budget, Lighthouse CI, regular testing             |
| Accessibility issues                | Medium | eslint-plugin-jsx-a11y, manual testing, Playwright a11y checks |

---

## References

- Constitution v1.0.0: `../.specify/memory/constitution.md`
- Next.js Documentation: https://nextjs.org/docs
- tRPC Documentation: https://trpc.io/docs
- Drizzle ORM Documentation: https://orm.drizzle.team/
- TailwindCSS Documentation: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/
- Playwright Documentation: https://playwright.dev/
- Jest Documentation: https://jestjs.io/

---

**Conclusion**: All technical decisions are aligned with Constitution v1.0.0 requirements. Best practices research complete. Ready to proceed to Phase 1 (data model and contracts).
