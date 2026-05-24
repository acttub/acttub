# acttub

Acttub web app.

The active implementation is a single unified Next.js React project in `web/`. It serves the landing page, ACTI diagnosis, theater listings, practice-room listings, community, archive, coach, and team pages from one build and one local port.

## Current Structure

| Directory | Role |
|---|---|
| `web/` | Unified Next.js React app for landing, ACTI, thea, excer, community, archive, coach, and team pages |

Legacy source folders such as `ACTI/`, `thea/`, `comm/`, `arch/`, `excer/`, and `acttub-landing/` may still exist for history/reference, but they are no longer part of the pnpm workspace or normal build path.

Historical planning artifacts under `web/docs/` and `web/outputs/` may mention earlier Vite/SPA plans. The active implementation is the Next.js app under `web/src/app`.

## App Areas

| Path | Area |
|---|---|
| `/` | Acttub home |
| `/ACTI` | ACTI diagnosis, quiz, survey, and result pages |
| `/coach` | AI coach video analysis |
| `/archive` | Acting video archive, search, upload, user, playlist, and detail pages |
| `/community` | Community posts, comments, search, write, and profile pages |
| `/excer` | Practice-room listings and detail pages |
| `/thea` | Theater listings and play detail pages |
| `/team` | Team page |

API routes live under `web/src/app/api`. The backend uses Next route handlers, Drizzle, Neon Postgres, Vercel Blob, and Gemini for coach analysis. Coach video files are uploaded to Blob before analysis and cleaned up through a protected cron route.

## Local Development

```bash
corepack pnpm install
corepack pnpm local
```

Open:

```txt
http://localhost:4000/
http://localhost:4000/ACTI
http://localhost:4000/thea
http://localhost:4000/excer
http://localhost:4000/community
http://localhost:4000/archive
http://localhost:4000/coach
http://localhost:4000/team
```

For LAN/mobile testing:

```bash
corepack pnpm local:lan
```

## Common Commands

| Command | Description |
|---|---|
| `corepack pnpm local` | Run the unified `web` app on `127.0.0.1:4000` |
| `corepack pnpm local:lan` | Run the unified `web` app on `0.0.0.0:4000` |
| `corepack pnpm prod` | Build `web` for production |
| `corepack pnpm start` | Run the built `web` app on `127.0.0.1:4000` |
| `corepack pnpm start:lan` | Run the built `web` app on `0.0.0.0:4000` |
| `corepack pnpm smoke` | Check representative pages and APIs against `SMOKE_BASE_URL` or `http://127.0.0.1:4000` |
| `corepack pnpm verify:runtime` | Run the smoke checks against the currently running app |
| `corepack pnpm verify:prod-runtime` | Build `web`, start it on port 4000, run smoke checks, and stop it |
| `corepack pnpm lint` | Lint `web` |
| `corepack pnpm test` | Run `web` tests |
| `corepack pnpm db:generate` | Generate Drizzle migrations for `web` |
| `corepack pnpm db:migrate` | Apply Drizzle migrations for `web` |
| `corepack pnpm verify` | Frozen install, lint, test, and production builds |
| `corepack pnpm verify:preview` | Full preview branch check: install, lint, test, build, then production runtime smoke on port 4010 |

If `corepack pnpm verify:prod-runtime` reports that port 4000 is already serving the app, stop the running app first or run the check on another port:

```bash
PROD_VERIFY_PORT=4010 corepack pnpm verify:prod-runtime
```

For preview branch review and deployment checks, see `docs/nextjs-preview-readiness.md`.

## Deployment

Vercel projects:

| Vercel Project | Root Directory |
|---|---|
| `web` | `web` |

Deployment is intended to run through GitHub Actions, not Vercel's direct Git auto-deploy flow:

- Pull requests run `corepack pnpm verify`, then deploy a Vercel Preview if verification passes.
- Pushes to `main` run `corepack pnpm verify`, then deploy Vercel Production if verification passes.
- Repository secrets required by the workflow: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.
- Keep Vercel Git auto-deploy disabled for `web`, and disconnect or disable the legacy Vercel projects so only one deployment pipeline runs.

The `web` project uses:

- Next.js App Router for UI routes and API routes
- Route handlers under `web/src/app/api`
- Neon Postgres via `DATABASE_URL`
- Vercel Blob via `BLOB_READ_WRITE_TOKEN`
- AI coach analysis via `GEMINI_API_KEY`
- Coach Blob cleanup via `CRON_SECRET`
- Drizzle migrations under `web/drizzle`

Apply DB migrations from `web/` after pulling env vars:

```bash
corepack pnpm dlx vercel env pull .env.local
set -a
source .env.local
set +a
corepack pnpm db:migrate
```

Do not commit `.env.local`, `.vercel/`, `.next/`, or `node_modules/`.
