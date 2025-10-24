# Contributing to Cora Finance v2

Thank you for your interest in contributing to Cora Finance v2! This document provides guidelines and standards for contributing to the project.

## Code Quality Standards

### Type Safety

- **TypeScript strict mode** is enabled and enforced
- All functions must have explicit return types
- No `any` types except in exceptional cases (must be documented)
- Use Zod for runtime validation of external data

### Code Style

- **ESLint**: All code must pass linting (`npm run lint`)
- **Prettier**: Code must be formatted (`npm run format`)
- **Naming conventions**:
  - Components: PascalCase (e.g., `UserProfile`)
  - Functions: camelCase (e.g., `calculateTotal`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
  - Files: kebab-case for utilities, PascalCase for components

### Testing

- **Unit tests** required for all utility functions and business logic
- **E2E tests** required for user-facing features
- **Coverage**: Maintain 80%+ coverage on business logic
- **TDD**: Write tests before implementation when possible

### Database

- **Migrations only**: Never modify schema directly
- **Constitutional audit fields**: All tables must include:
  - `createdAt` (timestamp with timezone)
  - `updatedAt` (timestamp with timezone, auto-update)
  - `archived` (boolean, soft delete)
- **Cents not decimals**: Store currency as integers (cents)

### Financial Calculations

- **Use Decimal.js** for all financial arithmetic
- Never use JavaScript's built-in floating point math
- Round to nearest cent using banker's rounding (ROUND_HALF_EVEN)

## Pull Request Process

### 1. Before You Start

- Check existing issues and PRs to avoid duplicates
- For major changes, open an issue first to discuss
- Ensure you have the latest code: `git pull origin main`

### 2. Development Workflow

\`\`\`bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Run quality checks
npm run type-check
npm run lint
npm run format
npm run test:ci

# Commit your changes (see commit guidelines below)
git commit -m "feat: add user authentication"

# Push to your fork
git push origin feature/your-feature-name
\`\`\`

### 3. Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
\`\`\`
feat(auth): add login with email/password
fix(api): handle database connection timeout
docs(readme): update installation instructions
test(transactions): add unit tests for splitTransaction
\`\`\`

### 4. Pull Request Guidelines

- **Title**: Use conventional commit format
- **Description**: Explain what and why, not how
- **Screenshots**: Include for UI changes
- **Tests**: Ensure all tests pass
- **Documentation**: Update README if needed
- **Breaking changes**: Clearly document in PR description

### 5. Code Review

All PRs require:
- ✅ All CI checks passing
- ✅ At least one approving review
- ✅ No merge conflicts
- ✅ Up-to-date with base branch

## Development Setup

See [README.md](./README.md#quick-start) for complete setup instructions.

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Create an issue with reproduction steps
- **Security**: Email security@example.com (do not create public issues)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).
