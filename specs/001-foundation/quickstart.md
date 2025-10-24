# Quickstart Guide: Cora Finance v2 Foundation

**Target Audience**: Developers setting up the project for the first time  
**Estimated Time**: <10 minutes  
**Last Updated**: 2025-10-24

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20 LTS or newer ([Download](https://nodejs.org/))
- **npm** 10+ (included with Node.js 20)
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/) or use Docker)
- **Git** ([Download](https://git-scm.com/downloads))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

### Verify Prerequisites

```bash
node --version   # Should be v20.x.x or higher
npm --version    # Should be 10.x.x or higher
psql --version   # Should be 15.x or higher
git --version    # Any recent version
```

---

## Quick Setup (5 Minutes)

### 1. Clone Repository

```bash
git clone <repository-url> cora-finance-v2
cd cora-finance-v2
```

### 2. Install Dependencies

```bash
npm install
```

**Expected time**: 1-2 minutes  
**Success**: No errors, all packages installed

### 3. Configure Environment Variables

Copy the example environment file and update with your database credentials:

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your database credentials
```

**`.env.local` contents**:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/cora_finance"

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Database URL Format**:

```
postgresql://[username]:[password]@[host]:[port]/[database]
```

**Common configurations**:

- **Local PostgreSQL**: `postgresql://postgres:yourpassword@localhost:5432/cora_finance`
- **Docker PostgreSQL**: `postgresql://postgres:postgres@localhost:5432/cora_finance`
- **Neon (cloud)**: Use connection string from Neon dashboard

### 4. Create Database

```bash
# Option A: Using psql command line
createdb cora_finance

# Option B: Using PostgreSQL client
psql -U postgres
CREATE DATABASE cora_finance;
\q

# Option C: Using Docker
docker run --name cora-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cora_finance \
  -p 5432:5432 \
  -d postgres:15
```

### 5. Run Database Migrations

```bash
npm run db:migrate
```

**Expected output**:

```
Applying migrations...
✓ 0000_initial.sql applied
Database migrated successfully!
```

### 6. Start Development Server

```bash
npm run dev
```

**Expected output**:

```
  ▲ Next.js 15.5.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.x:3000

✓ Ready in 2.5s
```

### 7. Verify Installation

Open your browser to: **http://localhost:3000**

You should see:

- ✅ "Hello Cora Finance" heading with Liquid Glass styling
- ✅ Glass-styled card with gradient background
- ✅ Health check status showing "Server Health: healthy"
- ✅ Database connection confirmed

**Success Criteria** (from spec):

- [ ] Setup completed in <10 minutes ✓
- [ ] Application starts in <5 seconds ✓
- [ ] Liquid Glass UI visible ✓
- [ ] Database connected ✓

---

## Development Workflow

### Available Commands

| Command               | Description                         | When to Use                      |
| --------------------- | ----------------------------------- | -------------------------------- |
| `npm run dev`         | Start development server            | Daily development                |
| `npm run build`       | Build for production                | Before deployment                |
| `npm start`           | Run production build                | Testing production build locally |
| `npm run lint`        | Run ESLint                          | Before committing                |
| `npm run format`      | Format code with Prettier           | Before committing                |
| `npm run type-check`  | Check TypeScript types              | Before committing                |
| `npm run test`        | Run unit tests (watch mode)         | TDD workflow                     |
| `npm run test:ci`     | Run unit tests (once with coverage) | CI/CD pipeline                   |
| `npm run test:e2e`    | Run Playwright E2E tests            | Before major changes             |
| `npm run test:e2e:ui` | Run Playwright with UI              | Debugging E2E tests              |
| `npm run db:generate` | Generate new migration              | After schema changes             |
| `npm run db:migrate`  | Apply pending migrations            | After pulling schema changes     |
| `npm run db:push`     | Push schema changes directly        | Quick prototyping (dev only)     |
| `npm run db:studio`   | Open Drizzle Studio                 | Inspecting database              |

### Pre-Commit Checklist

Before committing code, run:

```bash
npm run lint          # Fix linting issues
npm run type-check    # Verify TypeScript compiles
npm run test:ci       # Ensure tests pass
```

**All should complete in <30 seconds combined** (Success Criteria SC-003)

### Code Quality Standards

**Constitution v1.0.0 requires**:

- ✅ TypeScript strict mode (no `any` types without justification)
- ✅ Zero linting errors
- ✅ 80%+ test coverage on core modules
- ✅ All tests passing before merge

---

## Project Structure Overview

```
cora-finance-v2/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Global layout with Liquid Glass
│   ├── page.tsx            # Homepage
│   └── api/trpc/           # tRPC API endpoints
│
├── components/             # React components
│   └── ui/                 # shadcn/ui components (e.g., Button)
│
├── lib/                    # Shared utilities
│   ├── decimal.ts          # Financial math (Decimal.js)
│   ├── utils.ts            # General utilities
│   └── trpc/               # tRPC client configuration
│
├── server/                 # Server-side code
│   ├── db/                 # Database (Drizzle ORM)
│   │   ├── index.ts        # DB connection
│   │   └── schema.ts       # Database schema
│   └── trpc/               # tRPC routers
│       ├── init.ts         # tRPC initialization
│       └── routers/        # API procedures
│
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── drizzle/                # Database migrations
├── tests/                  # Test files
│   ├── unit/               # Unit tests (Jest)
│   └── e2e/                # E2E tests (Playwright)
│
├── .env.example            # Environment variables template
├── .env.local              # Your local environment (git-ignored)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # TailwindCSS + Liquid Glass tokens
└── README.md               # Project documentation
```

---

## Common Tasks

### Adding a New tRPC Procedure

1. **Define the router** (if new domain):

```typescript
// /server/trpc/routers/example.ts
import { z } from 'zod';
import { publicProcedure, router } from '../init';

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { message: `Hello, ${input.name}!` };
    }),
});
```

2. **Add to root router**:

```typescript
// /server/trpc/routers/_app.ts
import { exampleRouter } from './example';

export const appRouter = router({
  health: healthRouter,
  example: exampleRouter, // Add here
});
```

3. **Use in component**:

```typescript
const { data } = trpc.example.hello.useQuery({ name: 'World' });
// data.message === "Hello, World!"
```

**Type safety**: Autocomplete and type checking work automatically! ✨

---

### Adding a New Database Table

1. **Update schema**:

```typescript
// /server/db/schema.ts
export const newTable = pgTable('new_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  // Constitutional requirements:
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  archived: boolean('archived').notNull().default(false),
});
```

2. **Generate migration**:

```bash
npm run db:generate
```

3. **Review generated SQL**:

```bash
cat drizzle/0001_new_table.sql  # Check the migration
```

4. **Apply migration**:

```bash
npm run db:migrate
```

---

### Adding a New UI Component

1. **Install shadcn/ui component**:

```bash
npx shadcn-ui@latest add card
```

2. **Customize with Liquid Glass**:

```typescript
// /components/ui/card.tsx
const cardVariants = cva(
  // Add glass treatment
  'bg-white/10 backdrop-blur-md border border-white/20',
  {
    /* variants */
  }
);
```

3. **Use in page**:

```typescript
import { Card } from '@/components/ui/card';

<Card className="glass-card">
  Content here
</Card>
```

---

## Troubleshooting

### Database Connection Fails

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solutions**:

1. Verify PostgreSQL is running: `pg_ctl status` or `docker ps`
2. Check DATABASE_URL in `.env.local` matches your setup
3. Ensure database exists: `psql -l` (should list `cora_finance`)
4. Check credentials: `psql -U postgres -d cora_finance` (should connect)

### Port 3000 Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:

1. Kill existing process:
   - **Windows**: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
   - **macOS/Linux**: `lsof -ti:3000 | xargs kill -9`
2. Or use different port: `PORT=3001 npm run dev`

### TypeScript Errors After npm install

**Error**: Type errors in node_modules

**Solutions**:

1. Delete `.next` folder: `rm -rf .next`
2. Delete node_modules: `rm -rf node_modules package-lock.json`
3. Reinstall: `npm install`
4. Restart TypeScript server in VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### Tests Fail with Database Error

**Error**: Tests cannot connect to database

**Solutions**:

1. Ensure test database exists: `createdb cora_finance_test`
2. Update `.env.test`: `DATABASE_URL="postgresql://postgres:password@localhost:5432/cora_finance_test"`
3. Run migrations on test DB: `NODE_ENV=test npm run db:migrate`

### Linting Errors on Fresh Install

**Error**: ESLint reports errors

**Solution**: This should NOT happen (Success Criteria SC-008). If it does:

1. Check you're on correct branch: `git branch`
2. Verify clean clone: `git status`
3. Report issue if errors exist on fresh `001-foundation` branch

---

## Performance Expectations

Based on Constitution v1.0.0 Success Criteria:

| Metric         | Target  | How to Measure                 |
| -------------- | ------- | ------------------------------ |
| Setup Time     | <10 min | Time from clone to running app |
| App Start      | <5 sec  | `npm run dev` to page load     |
| Build Time     | <2 min  | `npm run build` duration       |
| Quality Checks | <30 sec | `lint + type-check` combined   |
| Unit Tests     | <1 min  | `npm run test:ci` duration     |
| E2E Tests      | <2 min  | `npm run test:e2e` duration    |
| CI Pipeline    | <5 min  | GitHub Actions workflow        |

**If targets not met**, check:

- Slow disk I/O (especially WSL on Windows)
- Insufficient RAM (<8GB)
- Too many background processes
- Antivirus scanning node_modules

---

## Next Steps

After Foundation Phase is complete:

1. **Explore the codebase**:
   - Read `/server/trpc/routers/health.ts` - example procedure
   - Read `/components/ui/button.tsx` - Liquid Glass component
   - Read `/tests/unit/lib/decimal.test.ts` - example test

2. **Learn the stack**:
   - Next.js App Router: https://nextjs.org/docs/app
   - tRPC: https://trpc.io/docs
   - Drizzle ORM: https://orm.drizzle.team/
   - TailwindCSS: https://tailwindcss.com/docs

3. **Prepare for next phase**:
   - Review Constitution: `.specify/memory/constitution.md`
   - Read Master Data spec (when available)
   - Familiarize yourself with YNAB budgeting methodology

---

## Getting Help

### Documentation

- **Constitution**: `.specify/memory/constitution.md` - Core principles
- **Spec**: `specs/001-foundation/spec.md` - Foundation requirements
- **Plan**: `specs/001-foundation/plan.md` - Implementation plan
- **Contracts**: `specs/001-foundation/contracts/` - API specifications

### Common Questions

**Q: Why TypeScript strict mode?**  
A: Constitutional requirement (Principle II: Type Safety First). Prevents entire classes of runtime errors.

**Q: Why Decimal.js for math?**  
A: JavaScript's `0.1 + 0.2 !== 0.3`. Financial calculations require precision (Constitutional Principle V).

**Q: Why tRPC instead of REST?**  
A: End-to-end type safety without code generation. Changes to API immediately show type errors in client code.

**Q: Why PostgreSQL instead of MongoDB?**  
A: Financial data requires ACID transactions and relational integrity. Constitutional requirement.

**Q: Can I use `any` type?**  
A: No (except in rare cases with written justification). TypeScript strict mode enforced.

---

## Development Tips

### VS Code Setup

Recommended extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript
- Playwright Test for VS Code

### Hot Reload

Next.js automatically reloads on file changes:

- **Server code** (`/server`): Full reload
- **Components** (`/components`): Fast Refresh
- **Styles** (`/app/globals.css`): Instant

### Debugging

**Server-side**:

```typescript
console.log('Debugging:', variable); // Appears in terminal
```

**Client-side**:

```typescript
console.log('Debugging:', variable); // Appears in browser console
```

**Database queries**:

```bash
npm run db:studio  # Visual query builder
```

---

## Summary

You now have:

- ✅ Complete development environment
- ✅ Type-safe full-stack architecture
- ✅ Database connected and migrated
- ✅ Liquid Glass design system
- ✅ Testing infrastructure
- ✅ CI/CD pipeline ready

**Verification**:

```bash
npm run lint && npm run type-check && npm run test:ci
```

All should pass with zero errors. Ready to build features! 🚀
