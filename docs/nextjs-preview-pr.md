# PR Draft: Unify Acttub into one Next.js web app

## Title

Unify Acttub into one Next.js web app

## Body

### Summary

This PR consolidates Acttub into a single active Next.js React app under `web/`.

The unified app now serves landing, ACTI, thea, excer, community, archive, coach, and team pages from one App Router tree, with API routes handled by Next route handlers in the same project.

### What Changed

- Scoped the pnpm workspace to the single active `web` app
- Replaced per-app local commands with one `4000` port workflow
- Added App Router pages for all product surfaces
- Added Next route handlers for health, ACTI email, archive, community, and coach APIs
- Added Vercel-compatible server support for Neon Postgres, Vercel Blob, Resend, and coach analysis
- Preserved path-based navigation for major flows and added route-link tests
- Added runtime smoke checks for representative pages and APIs
- Added guard tests against legacy per-app commands, legacy ports, provider/model leaks, and deployment drift
- Documented preview readiness and Vercel deployment expectations

### Validation

Latest local validation:

```bash
corepack pnpm verify:preview
```

Result:

- frozen install passed
- lint passed
- 24 Vitest files passed
- 118 tests passed
- production build passed
- production runtime smoke passed for 30 routes/APIs on port `4010`

Current running local server:

```txt
http://172.16.103.130:4000/
```

Health check:

```json
{"ok":true}
```

### Deployment Notes

- Vercel root directory: `web`
- Framework: Next.js
- Build command: `pnpm build`
- Output directory: leave unset

Required production environment variables:

- `DATABASE_URL`
- `BLOB_READ_WRITE_TOKEN`
- `GEMINI_API_KEY`

Optional variables are documented in `web/.env.example`.

### Review Notes

- Historical folders and planning artifacts may still exist for reference, but normal development, validation, and deployment go through `web`.
- `corepack pnpm verify:prod-runtime` intentionally fails if the target port is already serving the app, to avoid false-positive smoke checks against an old server.
- If testing with the existing 4000 server still running, use `corepack pnpm verify:preview`; it runs production runtime smoke on port `4010`.

## Create Command

No PR is currently open for `experiment/nextjs-preview` into `main`.

Browser URL:

```txt
https://github.com/acttub/acttub/compare/main...experiment/nextjs-preview?quick_pull=1
```

After GitHub CLI auth is fixed:

```bash
gh auth login -h github.com
gh pr create --base main --head experiment/nextjs-preview --title "Unify Acttub into one Next.js web app" --body-file docs/nextjs-preview-pr.md
```
