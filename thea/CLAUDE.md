# CLAUDE.md

## Project

`thea` is a new acttub sub-project for theater recommendations.

- Local path: `C:\dev\acttub\thea`
- Intended URL: `https://www.acttub.com/thea`
- GitHub target: new repository under `github.com/acttub`
- Framework: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4
- Design source: matched the nearby acttub project tone (`arch`): Pretendard, neutral surfaces, coral primary color, compact header, shadcn-style component conventions.

## Current State

The app is scaffolded and working as a static single-page recommendation tool.

Implemented:

- Hero landing section with generated theater stage image.
- Interactive recommendation form (mood / companion / pacing).
- Recommendation ranking against a hybrid play pool: curated metadata + live KOPIS schedule data.
- Server Component fetch of KOPIS (`prfstate=02`, 서울, 향후 7일) with daily `revalidate` cache.
- Graceful fallback to curated list when `KOPIS_API_KEY` is unset or the API fails.
- Header and footer matching acttub branding.
- Optional `/thea` base path support via environment variable.

Important files:

- `src/app/page.tsx`: Server Component — fetches enriched plays, renders hero, mounts client tool.
- `src/components/recommendation-tool.tsx`: Client recommendation UI; receives `plays` + `source` via props.
- `src/data/curation.ts`: Curated play metadata (mood/companion/pace/pitch/tags + KOPIS title-match regex).
- `src/lib/kopis.ts`: KOPIS Open API client (XML via `fast-xml-parser`) and curation merge logic.
- `src/components/site-header.tsx`: Header navigation.
- `src/components/ui/button.tsx`: Local shadcn-style button.
- `src/app/globals.css`: Design tokens and global styles.
- `public/theater-hero.png`: Generated hero image used by the page.
- `next.config.ts`: Enables `basePath: "/thea"` when `NEXT_PUBLIC_BASE_PATH=thea`.
- `.env.example`: Documents `NEXT_PUBLIC_BASE_PATH` and `KOPIS_API_KEY`.

## Commands

Use npm.

```bash
npm install
npm run dev
npm run lint
npm run build
```

Local dev server used during setup:

```bash
npm run dev -- -p 3002
```

The app was verified with:

- `npm run lint`
- `npm run build`
- `http://localhost:3002` returned HTTP 200

## Deployment Notes

For production under `https://www.acttub.com/thea`, set:

```bash
NEXT_PUBLIC_BASE_PATH=thea
```

This makes Next emit routes/assets under `/thea`.

If this is deployed as a separate Vercel project, the main acttub domain/project needs a rewrite or route handoff for:

```text
/thea/:path*
```

to this project.

## Known Notes

- `npm audit` currently reports 2 moderate vulnerabilities from the dependency tree. No fix was applied because `npm audit fix --force` may introduce breaking changes.
- Curated play list lives in `src/data/curation.ts`. Each entry holds a `titleMatch` regex used to attach KOPIS data to the same production across seasons/venues. Add new productions there to expand recommendations.
- KOPIS responses are XML. Parsed with `fast-xml-parser` and cached for 24h via Next.js `fetch` `revalidate`.
- When `KOPIS_API_KEY` is missing or KOPIS returns no curation matches, the UI falls back to the curated list with a "공연 일정 확인 필요" period label.
- The app currently has no auth, database, ticketing integration, or admin flow.

## Recommended Next Work

1. Provision `KOPIS_API_KEY` on Vercel so production uses live schedule data.
2. Expand `src/data/curation.ts` with more curated productions to widen recommendation coverage.
3. Add detail pages (poster, full description) using KOPIS `pblprfr/{mt20id}` endpoint.
4. Add analytics for selected preferences and clicked recommendations.
5. Wire Vercel deployment with `NEXT_PUBLIC_BASE_PATH=thea`.
