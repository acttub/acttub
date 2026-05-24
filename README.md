# acttub

Acttub web monorepo.

## Current Structure

| Directory | Role |
|---|---|
| `web/` | Unified Next.js React app for landing, ACTI, thea, excer, community, archive, coach, and team pages |

Legacy source folders such as `ACTI/`, `thea/`, `comm/`, `arch/`, `excer/`, and `acttub-landing/` may still exist for history/reference, but they are no longer part of the pnpm workspace or normal build path.

Historical planning artifacts under `web/docs/` and `web/outputs/` may mention earlier Vite/SPA plans. The active implementation is the Next.js app under `web/src/app`.

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

## Deployment

Vercel projects:

| Vercel Project | Root Directory |
|---|---|
| `web` | `web` |

The `web` project uses:

- Next.js App Router for UI routes and API routes
- Route handlers under `web/src/app/api`
- Neon Postgres via `DATABASE_URL`
- Vercel Blob via `BLOB_READ_WRITE_TOKEN`
- AI coach analysis via `GEMINI_API_KEY`
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
