### Summary

Consolidates Acttub into a single active Next.js React app under `web/`.

The unified app serves landing, ACTI, thea, excer, community, archive, coach, and team pages from one App Router tree, with API routes handled by Next route handlers in the same project.

### What Changed

- Unified user-facing routes and APIs under `web/src/app`
- Added Next route handlers for archive, community, coach, health, and result email flows
- Added Vercel-compatible storage/backend support with Neon Postgres, Vercel Blob, Drizzle, Resend, and Gemini coach analysis
- Routed coach video uploads through Vercel Blob and added protected stale Blob cleanup
- Switched CI/CD to GitHub Actions: verify first, then Vercel deploy through CLI
- Disabled Vercel direct Git auto-deploy for `web` and legacy project roots
- Added `CLAUDE.md` and made `AGENTS.md` a symlink to it
- Updated README/deployment docs for the current structure

### Validation

- `corepack pnpm verify`
- `corepack pnpm lint`
- `corepack pnpm prod`
- `corepack pnpm verify:preview`

### Deployment Notes

Vercel root directory: `web`

Required GitHub Actions secrets are configured:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Required Vercel env vars for `web`:

- `DATABASE_URL`
- `BLOB_READ_WRITE_TOKEN`
- `GEMINI_API_KEY`
- `CRON_SECRET`

Vercel Hobby deployment creation limits may delay the first Actions-driven deployment if the daily quota has not reset yet.
