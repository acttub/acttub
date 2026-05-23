# acttub

Acttub web monorepo.

## Current Structure

| Directory | Role |
|---|---|
| `web/` | Unified Next.js React app for landing, ACTI, thea, excer, community, archive, and coach |

Legacy source folders such as `ACTI/`, `thea/`, `comm/`, `arch/`, `excer/`, and `acttub-landing/` may still exist for history/reference, but they are no longer part of the pnpm workspace or normal build path.

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
| `corepack pnpm lint` | Lint `web` |
| `corepack pnpm test` | Run `web` tests |
| `corepack pnpm prod` | Build `web` |
| `corepack pnpm verify` | Frozen install, lint, test, and production builds |

## Deployment

Vercel projects:

| Vercel Project | Root Directory |
|---|---|
| `web` | `web` |

The `web` project uses:

- Next.js App Router for UI shell and API routes
- Route handlers under `web/src/app/api`
- Neon Postgres via `DATABASE_URL`
- Vercel Blob via `BLOB_READ_WRITE_TOKEN`
- Gemini coach analysis via `GEMINI_API_KEY`
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
