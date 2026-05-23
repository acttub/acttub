# Repository Guidelines

## Project Structure

This repository now has two active workspace apps:

- `web/`: unified Vite React app for landing, ACTI, thea, excer, community, and archive.
- `coach/`: separate Next.js Gemini coach app.

The former app folders may remain as reference material, but normal development, linting, testing, and deployment go through `web/` and `coach/`.

## Commands

Install dependencies from the repository root:

```bash
corepack pnpm install
```

Common commands:

- `corepack pnpm local`: run `web` locally on `127.0.0.1:4000`.
- `corepack pnpm local:lan`: run `web` on `0.0.0.0:4000` for LAN/mobile testing.
- `corepack pnpm local:coach`: run `coach`.
- `corepack pnpm lint`: lint `web` and `coach`.
- `corepack pnpm test`: run `web` tests.
- `corepack pnpm prod`: build `web` and `coach`.
- `corepack pnpm verify`: frozen install, lint, test, and production builds.
- `corepack pnpm --dir web db:migrate`: apply Drizzle migrations to the configured Neon database.

## Coding Style

Use TypeScript and React functional components. Keep unified product code inside `web/src`, Vercel Functions inside `web/api`, and DB schema/migrations inside `web/src/server` and `web/drizzle`.

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
- `web/dist/`

Production env is managed in Vercel. Required web env includes `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN`.

## Pull Requests

Use concise conventional-style commits. PRs should summarize affected app(s), list validation commands, and call out deployment or env changes.
