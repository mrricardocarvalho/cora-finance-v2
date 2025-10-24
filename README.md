# Cora Finance v2

Personal finance management application built with Next.js, TypeScript, and the Liquid Glass design system.

## 🎯 Project Status

**Foundation Phase**: ✅ Complete

The foundation infrastructure is fully operational with:
- Type-safe full-stack architecture (tRPC + Drizzle ORM)
- Liquid Glass design system
- Automated testing (Jest + Playwright)
- Code quality gates (ESLint + Prettier + TypeScript strict mode)
- CI/CD ready

## 🛠️ Technology Stack

### Core

- **Next.js 16.0+** - React framework with App Router
- **TypeScript 5.9+** - Strict mode enabled for type safety
- **React 19** - UI library
- **Node.js 20 LTS** - Runtime environment

### Backend

- **tRPC 11.6+** - End-to-end type-safe API
- **Drizzle ORM 0.44+** - Type-safe database access
- **PostgreSQL 15+** - Relational database
- **Zod** - Schema validation

### Frontend

- **TailwindCSS 4.1+** - Utility-first CSS framework
- **Liquid Glass Design System** - Custom design language (MacOS Tahoe 2026 aesthetic)
- **shadcn/ui** - Component library built on Radix UI
- **Framer Motion** - Animation library
- **@tanstack/react-query** - Server state management

### Development Tools

- **Jest** - Unit testing
- **Playwright** - E2E testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Decimal.js** - Arbitrary precision arithmetic for financial calculations

## 📋 Prerequisites

- **Node.js**: 20 LTS (use `nvm use` or check `.nvmrc`)
- **PostgreSQL**: 15+ running locally or remotely
- **npm**: 10+ (comes with Node.js 20)
- **Git**: For version control

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd cora-finance-v2

# Install dependencies
npm install
\`\`\`

### 2. Configure Environment

\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and set your database connection:
# DATABASE_URL="postgresql://username:password@localhost:5432/cora_finance"
\`\`\`

### 3. Set Up Database

\`\`\`bash
# Create the database (if it doesn't exist)
createdb cora_finance

# Generate and run migrations
npm run db:generate
npm run db:push

# Optional: Open Drizzle Studio to inspect schema
npm run db:studio
\`\`\`

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

**Expected result**: Homepage displays "Hello Cora Finance" with Liquid Glass UI and health check showing database connection status.

## 📦 Available Scripts

### Development

- \`npm run dev\` - Start development server with Turbopack
- \`npm run build\` - Build for production
- \`npm start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript type checking
- \`npm run format\` - Format code with Prettier
- \`npm run format:check\` - Check code formatting

### Database

- \`npm run db:generate\` - Generate migrations from schema changes
- \`npm run db:push\` - Push schema changes to database
- \`npm run db:migrate\` - Run migrations
- \`npm run db:studio\` - Open Drizzle Studio (database GUI)

### Testing

- \`npm test\` - Run unit tests in watch mode
- \`npm run test:ci\` - Run unit tests with coverage (CI mode)
- \`npm run test:e2e\` - Run Playwright E2E tests
- \`npm run test:e2e:ui\` - Run Playwright tests with UI

## 🏗️ Architecture

### Folder Structure

\`\`\`
cora-finance-v2/
├── app/                    # Next.js App Router
│   ├── api/trpc/          # tRPC HTTP endpoint
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Shared utilities
│   ├── decimal.ts        # Financial calculations
│   ├── utils.ts          # General utilities
│   └── trpc/             # tRPC client config
├── server/               # Server-side code
│   ├── db/              # Database connection & schema
│   └── trpc/            # tRPC routers & context
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── drizzle/             # Database migrations
└── tests/               # Test files
    ├── unit/           # Unit tests (Jest)
    └── e2e/            # E2E tests (Playwright)
\`\`\`

### Data Flow

1. **Client** → React component uses \`trpc.health.check.useQuery()\`
2. **tRPC Client** → HTTP request to \`/api/trpc\`
3. **Next.js API Route** → Routes to tRPC handler
4. **tRPC Router** → Executes procedure with Zod validation
5. **Database** → Drizzle ORM queries PostgreSQL
6. **Response** → Type-safe data flows back to client

**Key**: Full type inference from database → server → client with zero code generation.

## 🎨 Liquid Glass Design System

### Colors

- **Primary**: Sky (#0EA5E9) - Main interactive elements
- **Secondary**: Purple (#8B5CF6) - Accents and highlights
- **Background**: Gradient (#f5f7fa → #e9ecf5)

### Glass Effect

\`\`\`tsx
<div className="glass-card">
  {/* Your content */}
</div>
\`\`\`

Applies:
- \`bg-white/10\` - Semi-transparent white background
- \`backdrop-blur-md\` - Blur effect
- \`border border-white/20\` - Subtle border
- \`shadow-lg\` - Drop shadow

### Custom Button Variant

\`\`\`tsx
<Button variant="glass">Click me</Button>
\`\`\`

## 🧪 Testing

### Unit Tests

Located in \`tests/unit/\`, using Jest + React Testing Library.

\`\`\`bash
# Run in watch mode
npm test

# Run with coverage
npm run test:ci
\`\`\`

**Coverage Threshold**: 80% for tested files (currently: \`lib/decimal.ts\`)

### E2E Tests

Located in \`tests/e2e/\`, using Playwright.

\`\`\`bash
# Run E2E tests
npm run test:e2e

# Run with UI (interactive)
npm run test:e2e:ui
\`\`\`

## 🔒 Constitutional Compliance

This project follows **Constitution v1.0.0** with 7 core principles:

1. **Clean Architecture** - Layered structure with clear separation
2. **Type Safety First** - TypeScript strict mode, Drizzle ORM, tRPC, Zod
3. **Test-Driven Development** - Jest + Playwright infrastructure
4. **Liquid Glass Design** - MacOS Tahoe 2026 aesthetic
5. **Data Integrity** - Decimal.js for finance, audit fields, soft deletes
6. **Performance & Accessibility** - <5s startup, WCAG 2.1 AA compliance
7. **Security** - Drizzle parameterization, server-side validation

See \`.specify/memory/constitution.md\` for full details.

## 🐛 Troubleshooting

### Database Connection Failed

**Error**: \`DATABASE_URL is not defined\`

**Solution**: Create \`.env.local\` file with your database connection string.

### Port 3000 Already in Use

**Error**: \`EADDRINUSE\`

**Solution**: Kill the process using port 3000 or change the port:
\`\`\`bash
PORT=3001 npm run dev
\`\`\`

### TypeScript Errors

**Error**: Type errors in \`node_modules\`

**Solution**: Delete \`node_modules\` and reinstall:
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Playwright Browser Not Installed

**Error**: \`browserType.launch: Executable doesn't exist\`

**Solution**: Install Playwright browsers:
\`\`\`bash
npx playwright install
\`\`\`

## 📚 Documentation

- **Constitution**: \`.specify/memory/constitution.md\`
- **Specification**: \`specs/001-foundation/spec.md\`
- **Implementation Plan**: \`specs/001-foundation/plan.md\`
- **Tasks**: \`specs/001-foundation/tasks.md\`
- **API Contracts**: \`specs/001-foundation/contracts/\`
- **Data Model**: \`specs/001-foundation/data-model.md\`

## 🤝 Contributing

1. Follow the Constitution v1.0.0 principles
2. Write tests before implementation (TDD)
3. Ensure \`npm run type-check\` passes
4. Ensure \`npm run lint\` passes
5. Ensure \`npm run format:check\` passes
6. Ensure \`npm run test:ci\` passes
7. Run \`npm run test:e2e\` before committing

## 📄 License

UNLICENSED - Private project

---

**Built with** ❤️ **following Constitution v1.0.0**
