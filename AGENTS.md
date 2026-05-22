# Repository Guidelines

## Project Structure & Module Organization

This monorepo contains independent Acttub web apps. Dependencies and common commands are managed from the root pnpm workspace, while each app keeps its own deployment root.

- `acttub-landing/`: static landing page (`index.html`) for `www.acttub.com`.
- `thea/`, `comm/`, `arch/`, `excer/`: Next.js apps with source in `src/app`, UI in `src/components`, and utilities in `src/lib`.
- `ACTI/`: Vite React app with source in `src`, route pages in `src/pages`, content in `src/content`, and static assets in `public/`.
- `arch/` and `excer/`: Drizzle database schemas and migrations in `drizzle/`; seed scripts in `scripts/`.
- Planning artifacts live under app-local `docs/` or `outputs/` directories where present.

## Build, Test, and Development Commands

Install dependencies from the repository root.

```bash
corepack pnpm install
corepack pnpm local
corepack pnpm local:thea
corepack pnpm --filter excer db:generate
```

Common scripts:

- `corepack pnpm local`: serve `acttub-landing/` locally on `localhost:4000` and proxy app subpaths to their Vercel deployments.
- `corepack pnpm local:gateway`: explicit alias for the same gateway.
- `corepack pnpm local:acti`, `local:thea`, `local:comm`, `local:arch`, `local:excer`: run one app locally on its assigned development port.
- `corepack pnpm prod`: run every workspace production build script.
- `corepack pnpm lint`: run every workspace lint script.
- `corepack pnpm test`: run every workspace test script.
- `corepack pnpm --filter arch db:migrate` / `corepack pnpm --filter excer db:migrate`: run Drizzle migrations for one app.

## Coding Style & Naming Conventions

Use TypeScript and React functional components. Keep app-specific code inside that app’s directory. Follow existing file naming: kebab-case components such as `room-card.tsx`, and descriptive utilities such as `apply-filters.ts`.

Use each app’s ESLint setup. Prefer existing UI primitives in `src/components/ui` before adding new base components. Keep secrets in `.env.local`; commit only examples such as `.env.local.example`.

## Testing Guidelines

There is no repository-wide test runner. For most apps, validate with lint and a production build. `ACTI` has Vitest configured; place tests near covered code using `*.test.ts` or `*.test.tsx`, and run `pnpm test`.

For `arch` or `excer` database changes, include generated Drizzle migrations and verify seed or migration commands against local environment variables.

## Commit & Pull Request Guidelines

Recent history uses concise conventional-style commits: `test: ...`, `chore: ...`, and scoped messages like `refactor(ACTI): ...`. Include the affected app when useful.

Pull requests should state the changed app, summarize behavior changes, list validation commands, and link related issues or deployment context. Include screenshots or short recordings for UI changes.

## Deployment Notes

Vercel deploys apps by root directory. Keep changes scoped to the app being updated so unrelated projects do not redeploy unexpectedly.
