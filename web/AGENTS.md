# Web App Guidelines

## Structure

- `src/pages`: routed React pages.
- `src/components`: reusable ACTI components.
- `src/content`: ACTI questions and result copy.
- `src/community`, `src/archive`, `src/excer`, `src/thea`: domain data and helpers.
- `src/server`: API core, storage adapters, Drizzle schema, and backend tests.
- `api`: Vercel Functions.
- `drizzle`: generated SQL migrations.
- `public`: static assets.

## Commands

```bash
corepack pnpm dev --host 127.0.0.1 --port 4000
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```

## Backend

API handlers should keep request parsing/validation in `src/server/apiCore.ts` and persistence behind storage adapters in `src/server/storage*.ts`.

Use Neon Postgres through Drizzle when `DATABASE_URL` is configured. Keep the memory fallback working for local development without env.

Archive files go to Vercel Blob. Store only metadata in Postgres.

## Testing

Use Vitest. Add focused tests for new behavior, especially server helpers, storage adapters, routing, and data transforms.

## Safety

Do not commit `.env.local`, `.vercel/`, `node_modules/`, or `dist/`. Keep UI unchanged unless explicitly requested.
