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
- Interactive client-side recommendation form.
- Recommendation ranking based on mood, companion, and pacing.
- Minimal shared UI button component.
- Header and footer matching acttub branding.
- Optional `/thea` base path support via environment variable.

Important files:

- `src/app/page.tsx`: Main page and hero.
- `src/components/recommendation-tool.tsx`: Client recommendation UI and sample play data.
- `src/components/site-header.tsx`: Header navigation.
- `src/components/ui/button.tsx`: Local shadcn-style button.
- `src/app/globals.css`: Design tokens and global styles.
- `public/theater-hero.png`: Generated hero image used by the page.
- `next.config.ts`: Enables `basePath: "/thea"` when `NEXT_PUBLIC_BASE_PATH=thea`.
- `.env.example`: Documents the base path env var.

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
- The recommendation data is hardcoded sample data in `src/components/recommendation-tool.tsx`. Replace with real show data/API later.
- The app currently has no auth, database, ticketing integration, or admin flow.
- The local Git repo has been initialized on `main`, but no commit or remote has been created yet.

## Recommended Next Work

1. Create the GitHub repo under `acttub/thea` and add it as `origin`.
2. Decide whether recommendations should come from a static curated list, DB, or external 공연 API.
3. Add detail pages for recommended plays if real inventory is available.
4. Add analytics for selected preferences and clicked recommendations.
5. Wire Vercel deployment with `NEXT_PUBLIC_BASE_PATH=thea`.
