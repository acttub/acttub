# Repository Guidelines

## Project Structure & Module Organization

This repository contains planning artifacts and a working web app. `outputs/` stores workflow deliverables by stage, including product, design, and implementation notes. `app/` contains the deployable Vite + React + TypeScript application.

Inside `app/src/`, use `components/` for reusable UI, `pages/` for routed screens, `content/` for questions and type copy, `lib/` for scoring, storage, sharing, analytics, and Kakao helpers, and `styles/globals.css` for shared tokens and base styles. Static assets live in `app/public/`, including character images under `public/characters/`. Serverless API code is under `app/api/`.

## Build, Test, and Development Commands

Run commands from `app/` unless noted:

- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm dev` starts the local Vite server at `http://localhost:5173`.
- `pnpm build` runs TypeScript project builds and creates the production bundle in `dist/`.
- `pnpm preview` serves the built app locally for release checks.
- `pnpm lint` runs ESLint across the app.
- `pnpm test` runs Vitest once; `pnpm test:watch` starts watch mode.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Follow the existing style: two-space indentation, single quotes, semicolons in TS/TSX files, and explicit exported types where they clarify module contracts. Name React components and files in PascalCase, such as `PrimaryButton.tsx`; name utilities in camelCase, such as `sendResult.ts`. Keep component-specific CSS beside the component or page it styles.

The app uses ESLint with TypeScript, React Hooks, and React Refresh rules. Run `pnpm lint` before submitting changes.

## Testing Guidelines

Vitest with `jsdom` is configured in `app/vite.config.ts`; setup runs through `src/test-setup.ts`. Place tests next to the code they cover using `*.test.ts` or `*.test.tsx`, for example `src/lib/scoring.test.ts`. Add or update tests for scoring rules, storage behavior, analytics, content invariants, and any user-visible logic changes. Run `pnpm test` before opening a PR.

## Commit & Pull Request Guidelines

Recent commits use short conventional-style messages such as `fix(analytics): ...` and `content(questions): ...`. Prefer `type(scope): summary`, with scopes like `questions`, `analytics`, `ui`, or `share`.

Pull requests should include a concise description, linked issue or context, test results, and screenshots or recordings for UI changes. Call out any environment variable changes, especially `VITE_KAKAO_APP_KEY`, `VITE_SITE_URL`, `VITE_GA_MEASUREMENT_ID`, or Resend-related API settings.

## Security & Configuration Tips

Do not commit `.env.local` or service keys. Start from `app/.env.example`, and keep production secrets in the deployment provider. Kakao sharing and GA can be disabled by leaving their public Vite variables blank.

## Agent Workflow Instructions

Use Superpowers by default. At the start of each task, check whether a Superpowers skill applies and follow it before editing code or asking follow-up questions. Match the workflow to the task: use planning skills for multi-step work, systematic debugging for bugs, TDD for behavior changes when practical, and verification-before-completion before claiming a fix is done.

Bring in gstack expertise at the appropriate stage instead of relying on a single generic review:

- Strategy, scope, or product ambition: use `plan-ceo-review`.
- UI/UX plans or visual design changes: use `plan-design-review` before implementation and `design-review` after implementation when a live screen exists.
- Architecture, data flow, edge cases, or test strategy: use `plan-eng-review`.
- Developer-facing APIs, docs, onboarding, or tooling: use `plan-devex-review` or `devex-review`.
- Browser QA or release confidence: use `qa`, `qa-only`, `review`, or `ship` as appropriate.

When a meaningful mistake, regression, failed assumption, or repeated debugging pattern is discovered and resolved, run Compound Engineering `ce-compound` to record the learning while context is fresh. Prefer `ce-compound mode:headless` for non-interactive follow-up documentation. Capture the symptom, root cause, failed attempts, final fix, prevention rule, and any tests added so future agents can avoid repeating the same mistake.
