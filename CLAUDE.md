# Frontend Development Guidelines

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Package Manager**: pnpm
- **Testing**: Vitest + React Testing Library + jsdom
- **Styling**: TailwindCSS v4 + PostCSS
- **State/Queries**: TanStack React Query v5
- **Forms**: react-hook-form + zod validation
- **UI Components**: Custom shadcn-inspired components in `src/components/ui/`
- **Icons**: lucide-react
- **Theming**: next-themes (dark/light/system)

## Architecture
```
src/
├── app/                     # Next.js App Router pages
├── components/
│   ├── ui/                  # Reusable primitive components
│   ├── layout/              # Sidebar, dashboard layout
│   └── auth/                # ProtectedRoute
├── features/                # Feature-specific components
│   ├── auth/                # Login, signup, forgot.password forms
│   ├── dashboard/           # Metric cards, appointment lists
│   ├── agenda/              # Calendar, appointment form
│   ├── clients/             # Table, form, filters
│   └── ...                  # One folder per domain
├── hooks/                   # React hooks (query mutations, etc.)
├── services/                # API client layer
├── types/                   # TypeScript interfaces
├── utils/                   # Pure utility functions
└── tests/                   # Global test setup
```

## Rules

### TDD (Mandatory)
Never write implementation code before a test.
1. Write the test that describes the expected behavior.
2. Run the test and confirm it fails.
3. Write the minimum code to make the test pass.
4. Run the test to validate.
5. Refactor only after green.

### Simplicity (KISS)
- Do not add libraries or abstractions unless explicitly necessary.
- Prefer inline styles/composition over premature component extraction.
- Three similar lines is better than a speculative abstraction.
- No hooks, wrappers, or HOCs for one-off cases.

### Component Standards
- UI components live in `src/components/ui/` and re-export from `index.ts`.
- Feature components live in `src/features/<domain>/`.
- All interactive components must be keyboard-accessible and have proper ARIA attributes.
- Use `forwardRef` for UI primitives. Add `displayName`.

### Accessibility
- Forms: `label` + `htmlFor`, `aria-describedby` for errors, `aria-invalid` on fields.
- Modals: `role="dialog"`, `aria-modal="true"`, focus trap, ESC close, focus return.
- Alerts/status: use semantic colors + `role="alert"` for dynamic messages.
- All images/icons with decorative purpose: `aria-hidden="true"`.

### API Pattern
- Use the `ApiClient` class in `src/services/api.ts` for all HTTP calls.
- Hooks in `src/hooks/` wrap React Query (`useQuery`/`useMutation`).
- Handle errors in components, not in services (services throw).

### Code Style
- Imports at top of file, never at the bottom.
- No `as any` — type properly or add to `src/types/`.
- Use `cn()` from `@/utils` for conditional classNames.
- BRC-BR (Brazilian Portuguese) for user-facing text.

## Commands
- Run tests: `pnpm test`
- Run test (watch): `pnpm test:watch`
- Run test (coverage): `pnpm test:coverage`
- Run dev server: `pnpm dev` (port 5173)
- Run lint: `pnpm lint`
- Build: `pnpm build`
