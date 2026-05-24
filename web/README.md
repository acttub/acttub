# Acttub Web

Unified Next.js React app for:

- `/`: Acttub landing
- `/ACTI`: acting style MBTI
- `/thea`: theater recommendation
- `/excer`: practice-room finder
- `/community`: community
- `/archive`: video archive
- `/coach`: AI acting coach
- `/team`: team introduction

## Stack

- Next.js App Router
- React 19
- TypeScript 6
- Next route handlers
- Drizzle ORM
- Neon Postgres
- Vercel Blob
- Vitest

## Local Development

From the repository root:

```bash
corepack pnpm local
```

From this directory:

```bash
corepack pnpm dev --hostname 127.0.0.1 --port 4000
```

LAN/mobile testing:

```bash
corepack pnpm dev --hostname 0.0.0.0 --port 4000
```

## Environment

Start from `.env.example`. For deployed persistence and upload support:

```txt
DATABASE_URL=...
BLOB_READ_WRITE_TOKEN=...
GEMINI_API_KEY=...
CRON_SECRET=...
COACH_BLOB_RETENTION_HOURS=24
```

Optional ACTI result email env:

```txt
RESEND_API_KEY=...
RESEND_FROM=...
```

Local secret files are ignored by git.

## Database

Schema lives in `src/server/schema.ts`; migrations live in `drizzle/`.

```bash
corepack pnpm db:generate
corepack pnpm db:migrate
```

Without `DATABASE_URL`, API handlers fall back to in-memory fixture-backed storage for local development.

## Coach Blob Cleanup

Coach uploads use Vercel Blob client uploads so large videos do not hit Vercel route request limits.

The analysis route deletes the uploaded Blob after analysis. A Vercel Cron job also calls `/api/coach/cleanup` every hour to delete leftover `coach/` blobs older than `COACH_BLOB_RETENTION_HOURS` hours. Set `CRON_SECRET` in Vercel so the cleanup endpoint rejects public requests.

## Commands

```bash
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```

From the repository root, run the full preview check before opening or updating a deployment PR:

```bash
corepack pnpm verify:preview
```

## Deployment

Vercel project root directory: `web`

Build command:

```bash
pnpm build
```

Output directory:

```txt
Leave unset. Vercel detects the Next.js output automatically.
```

Routes are defined with explicit App Router pages under `src/app`.

## Historical Artifacts

`docs/` and `outputs/` contain earlier planning and implementation notes. Some of those files refer to the previous Vite/SPA approach. Treat them as historical reference only; active routes, APIs, commands, and deployment settings are defined by this Next.js app.
