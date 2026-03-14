# Frontend Development Guidelines

## Tech Stack
- Framework: Next.js (App Router likely based on version 16.1.6)
- Package Manager: pnpm
- Testing: Vitest + React Testing Library + jsdom
- Styling: TailwindCSS (v4) + PostCSS
- State/Queries: React Query
- Forms: react-hook-form + zod

## Rules
- **TDD Requirement:** Never write implementation code before a test. 
  1. Write the test.
  2. Run the test and show failure.
  3. Implement minimum code.
  4. Run test to validate.
- **Simplicity (KISS):** Do not add libraries or abstractions unless explicitly necessary to make the test pass or requested by the user.
- **Feedback:** Always ask the user if we should proceed or refactor after a small victory (test passing).

## Commands
- Run tests: `pnpm test`
- Run test (watch): `pnpm test:watch`
- Run dev server: `pnpm dev`
- Run lint: `pnpm lint`
