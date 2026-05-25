# Web App Guidelines

## Structure

- `src/views`: client view components rendered by Next App Router pages.
- `src/components`: reusable ACTI components.
- `src/content`: ACTI questions and result copy.
- `src/community`, `src/archive`, `src/coach`, `src/excer`, `src/thea`: domain data and helpers.
- `src/server`: API core, storage adapters, Drizzle schema, and backend tests.
- `src/app/api`: Next route handlers.
- `drizzle`: generated SQL migrations.
- `public`: static assets.

## Commands

```bash
corepack pnpm dev --hostname 127.0.0.1 --port 4000
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```

## Backend

API handlers should keep request parsing/validation in `src/server/apiCore.ts` or focused server helpers such as `src/server/coachAnalyze.ts`, and persistence behind storage adapters in `src/server/storage*.ts`.

Use Neon Postgres through Drizzle when `DATABASE_URL` is configured. Keep the memory fallback working for local development without env.

Archive files go to Vercel Blob. Store only metadata in Postgres.

Coach analysis uses `GEMINI_API_KEY` through the unified Next route handler at `src/app/api/coach/analyze/route.ts`.

## Testing

Use Vitest. Add focused tests for new behavior, especially server helpers, storage adapters, routing, and data transforms.

## Safety

Do not commit `.env.local`, `.vercel/`, `node_modules/`, or `.next/`. Keep UI unchanged unless explicitly requested.
