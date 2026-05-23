# acttub

Acttub web monorepo.

## Current Structure

| Directory | Role |
|---|---|
| `web/` | Unified Vite React app for landing, ACTI, thea, excer, community, and archive |
| `coach/` | Separate Next.js Gemini coach app, kept separate until it is safe to merge |

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
```

For LAN/mobile testing:

```bash
corepack pnpm local:lan
```

Coach remains separate:

```bash
corepack pnpm local:coach
```

## Common Commands

| Command | Description |
|---|---|
| `corepack pnpm local` | Run the unified `web` app on `127.0.0.1:4000` |
| `corepack pnpm local:lan` | Run the unified `web` app on `0.0.0.0:4000` |
| `corepack pnpm local:coach` | Run the separate coach app |
| `corepack pnpm lint` | Lint `web` and `coach` |
| `corepack pnpm test` | Run `web` tests |
| `corepack pnpm prod` | Build `web` and `coach` |
| `corepack pnpm verify` | Frozen install, lint, test, and production builds |

## Deployment

Vercel projects:

| Vercel Project | Root Directory |
|---|---|
| `web` | `web` |
| `acttub-coach` | `coach` |

The `web` project uses:

- Vite React for UI
- Vercel Functions under `web/api`
- Neon Postgres via `DATABASE_URL`
- Vercel Blob via `BLOB_READ_WRITE_TOKEN`
- Drizzle migrations under `web/drizzle`

Apply DB migrations from `web/` after pulling env vars:

```bash
corepack pnpm dlx vercel env pull .env.local
set -a
source .env.local
set +a
corepack pnpm db:migrate
```

Do not commit `.env.local`, `.vercel/`, `node_modules/`, or `dist/`.
