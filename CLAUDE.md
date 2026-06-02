# Repository Guidelines

## Project Structure

This repository now has one active workspace app:

- `web/`: unified Next.js React app for landing, ACTI, thea, excer, community, archive, and coach.

The former app folders may remain as reference material, but normal development, linting, testing, and deployment go through `web/`.

## Current Product Surface

The active app serves all user-facing pages from one Next.js project and one port:

- `/`: Acttub home.
- `/ACTI`, `/ACTI/quiz`, `/ACTI/survey`, `/ACTI/result/[code]`: ACTI diagnosis flow.
- `/coach`: AI coach video analysis.
- `/archive`: acting video archive, search, upload, user, playlist, and video detail pages.
- `/community`: community board, search, write/new, profile, post, and comment flows.
- `/excer`: practice-room listing and room detail pages.
- `/thea`: theater listing and play detail pages.
- `/team`: team page.

Backend behavior lives in Next route handlers under `web/src/app/api`. Current API areas include archive videos/uploads, community posts/comments, coach upload/analyze/cleanup, result email sending, and health checks. Shared backend code is under `web/src/server`.

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

## Deployment

GitHub Actions owns the deployment pipeline. Pull requests run verification and then deploy a Vercel Preview. Pushes to `main` run verification and then deploy Vercel Production.

Required GitHub repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Vercel direct Git auto-deploy should stay disabled for `web`, and legacy Vercel projects should be disconnected or disabled so only the unified `web` app deploys.
This repository disables Vercel Git auto-deploy through `git.deploymentEnabled: false` in `web/vercel.json` and the legacy project-root `vercel.json` files.

Drizzle migrations are not applied automatically by GitHub Actions. For schema changes, keep migration files under `web/drizzle`, call out the exact migration files in the PR/Jira notes, and apply them explicitly to the target Neon database before validating deployed persistence. Preview persistence requires the Vercel Preview environment to have `DATABASE_URL`; otherwise API handlers use in-memory fallback storage.

For API paths that accept potentially sensitive user data, keep the user flow non-blocking where appropriate but log server-side failures with sanitized metadata only. Do not log raw request bodies, survey `answers`, contact information, tokens, or uploaded file contents.

## Secrets

Never commit local env or Vercel metadata:

- `web/.env.local`
- `web/.vercel/`
- `web/node_modules/`
- `web/.next/`

Production env is managed in Vercel. Required web env includes `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `GEMINI_API_KEY`, and `CRON_SECRET`.

## Pull Requests

Use concise conventional-style commits. PRs should summarize affected app(s), list validation commands, and call out deployment or env changes.
When work is tied to Jira, include the Jira key in branch names, commit messages, and PR titles, e.g. `SOMA-36 feat: store acti survey responses`.
