# Repository Guidelines

## Project Structure & Module Organization

This monorepo contains independent Acttub web apps. Each app owns its dependencies, scripts, and deployment root.

- `acttub-landing/`: static landing page (`index.html`) for `www.acttub.com`.
- `thea/`, `comm/`, `arch/`, `excer/`: Next.js apps with source in `src/app`, UI in `src/components`, and utilities in `src/lib`.
- `ACTI/`: Vite React app with source in `src`, route pages in `src/pages`, content in `src/content`, and static assets in `public/`.
- `arch/` and `excer/`: Drizzle database schemas and migrations in `drizzle/`; seed scripts in `scripts/`.
- Planning artifacts live under app-local `docs/` or `outputs/` directories where present.

## Build, Test, and Development Commands

Run commands from the app directory you are changing.

```bash
cd thea && pnpm install && pnpm dev
cd comm && pnpm install && pnpm lint && pnpm build
cd ACTI && pnpm test
cd excer && pnpm db:generate
```

Common scripts:

- `pnpm dev`: start local development.
- `pnpm build`: create a production build.
- `pnpm lint`: run ESLint checks.
- `ACTI`: also supports `test` and `test:watch` via Vitest.
- `arch` and `excer`: use `db:generate`, `db:migrate`, and `db:studio` for Drizzle workflows.

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
