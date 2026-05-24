# Next.js Preview Readiness

Branch: `experiment/nextjs-preview`

This branch evaluates Acttub as one unified Next.js React app under `web/`.

## Scope

- One active pnpm workspace package: `web`
- One local app port: `4000`
- Next.js App Router pages for landing, ACTI, thea, excer, community, archive, coach, and team
- Next route handlers for health, ACTI email, archive, community, and coach APIs
- Vercel-compatible server integrations for Neon Postgres, Vercel Blob, Resend, and coach analysis
- Runtime smoke coverage for representative pages and API routes

## Main Commands

```bash
corepack pnpm local
corepack pnpm start:lan
corepack pnpm verify:preview
corepack pnpm verify:runtime
```

Use `corepack pnpm verify:preview` before opening, updating, or merging the preview PR. It runs frozen install, lint, all tests, production build, and production runtime smoke on port `4010`.

Use `corepack pnpm verify:runtime` when a server is already running on `4000` and you want to check the current local runtime.

## Deployment

- Vercel root directory: `web`
- Framework: Next.js
- Build command: `pnpm build`
- Output directory: leave unset

Required production environment variables:

- `DATABASE_URL`
- `BLOB_READ_WRITE_TOKEN`
- `GEMINI_API_KEY`

Optional environment variables are documented in `web/.env.example`.

## Review Checklist

- Confirm root commands still delegate to `web`
- Confirm no legacy per-app local commands or ports were reintroduced
- Confirm coach UI/API responses do not expose provider or model details
- Confirm upload product size caps are not reintroduced
- Confirm `corepack pnpm verify:preview` passes
- Confirm the running app is reachable at `http://localhost:4000/` or LAN host `http://172.16.103.130:4000/`

## Known Notes

- Historical folders and planning files may still exist for reference, but normal development and deployment go through `web`.
- `verify:prod-runtime` intentionally fails if the requested port is already serving the app, to avoid false-positive smoke checks against an old server.
