# Acttub Web

Unified Next.js React app for:

- `/`: Acttub landing
- `/ACTI`: acting style MBTI
- `/thea`: theater recommendation
- `/excer`: practice-room finder
- `/community`: community
- `/archive`: video archive
- `/coach`: Gemini acting coach

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

## Commands

```bash
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```

## Deployment

Vercel project root directory: `web`

Build command:

```bash
pnpm build
```

Output directory:

```txt
.next
```

Routes are defined with explicit App Router pages under `src/app`.
