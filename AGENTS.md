# Repository Guidelines

## Project Structure

This repository now has one active workspace app:

- `web/`: unified Next.js React app for landing, ACTI, thea, excer, community, archive, and coach.

The former app folders may remain as reference material, but normal development, linting, testing, and deployment go through `web/`.

## Commands

Install dependencies from the repository root:

```bash
corepack pnpm install
```

Common commands:

- `corepack pnpm local`: run `web` locally on `127.0.0.1:4000`.
- `corepack pnpm local:lan`: run `web` on `0.0.0.0:4000` for LAN/mobile testing.
- `corepack pnpm prod && corepack pnpm start`: build and run the production `web` app on `127.0.0.1:4000`.
- `corepack pnpm start:lan`: run the built production `web` app on `0.0.0.0:4000`.
- `corepack pnpm smoke`: check key pages and `/api/health` against `SMOKE_BASE_URL` or `http://127.0.0.1:4000`.
- `corepack pnpm lint`: lint `web`.
- `corepack pnpm test`: run `web` tests.
- `corepack pnpm prod`: build `web`.
- `corepack pnpm verify`: frozen install, lint, test, and production builds.
- `corepack pnpm verify:preview`: run the full preview branch check, including production runtime smoke on port 4010.
- `corepack pnpm --dir web db:migrate`: apply Drizzle migrations to the configured Neon database.

## Coding Style

Use TypeScript and React functional components. Keep unified product code inside `web/src`, Next route handlers inside `web/src/app/api`, and DB schema/migrations inside `web/src/server` and `web/drizzle`.

Prefer existing helpers and page/component patterns before adding new abstractions. Keep UI unchanged unless the task explicitly asks for a UI change.

## Testing

`web` uses Vitest. Put tests near covered code as `*.test.ts` or `*.test.tsx`.

For backend/API changes, cover the server helper or storage adapter and run:

```bash
corepack pnpm test
corepack pnpm prod
```

## Secrets

Never commit local env or Vercel metadata:

- `web/.env.local`
- `web/.vercel/`
- `web/node_modules/`
- `web/.next/`

Production env is managed in Vercel. Required web env includes `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, and `GEMINI_API_KEY`.

## Pull Requests

Use concise conventional-style commits. PRs should summarize affected app(s), list validation commands, and call out deployment or env changes.
