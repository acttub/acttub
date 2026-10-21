# codex advisor artifact

- Provider: codex
- Exit code: 0
- Created at: 2026-07-03T08:50:01.873Z

## Original task

acttub 토론 R3(확정 라운드). eng 관점. R2 확정안을 코드 관점서 최종 승인 or 반박만. 한글 간결.

[R2 확정] primary=waitlist(/tester) 전환율·/coach=secondary. 산출=얇은 캠페인 라우트 1개(신규 랜딩 아님). 정적 코치샘플 MVP 제외. 착수전 하드게이트(submodule bump[우영 lineshot 미커밋 해소 선행]·/tester·/coach prod 200·Gemini키·IG웹뷰×coach 업로드 실기기·GA4+UTM allowlist 실발화·tester-write-verified). dev0 용어분리(coach product dev=0 / campaign surface dev≤1 route). UTM allowlist(source/medium/campaign/content/term/ref). dedupe=unique email.

[확인된 사실] /waitlist→/tester rename(git). submodule 6커밋 뒤짐. UTM analytics.ts서 소실. /coach 녹화+업로드 2경로.

[R3 확정할 것 — 코드 관점 최종 판정]
1) 이 하드게이트 체크리스트로 착수하면 "코치 8월 검증 capacity 무접촉"이 실제로 지켜지나? 빠진 게이트 항목 있나.
2) UTM allowlist 최소 구현: normalizePath 안 건드리고 utm_* 6개만 GA custom dimension으로. 대략 규모·리스크.
3) 보조증거: 정적 코치카드(FALLBACK_FEEDBACK=에러카피라 못씀) 대신 기존 인스타 장면해부 이미지 1장 재사용(coach 무접촉)이 맞나.
4) 최종 승인/반박: 이 확정안으로 CONVERGE 가능한가. 남은 blocker critical 있으면만 지목.

간결히. 신규 critical 없으면 "신규 critical 없음" 명시.

## Final prompt

acttub 토론 R3(확정 라운드). eng 관점. R2 확정안을 코드 관점서 최종 승인 or 반박만. 한글 간결.

[R2 확정] primary=waitlist(/tester) 전환율·/coach=secondary. 산출=얇은 캠페인 라우트 1개(신규 랜딩 아님). 정적 코치샘플 MVP 제외. 착수전 하드게이트(submodule bump[우영 lineshot 미커밋 해소 선행]·/tester·/coach prod 200·Gemini키·IG웹뷰×coach 업로드 실기기·GA4+UTM allowlist 실발화·tester-write-verified). dev0 용어분리(coach product dev=0 / campaign surface dev≤1 route). UTM allowlist(source/medium/campaign/content/term/ref). dedupe=unique email.

[확인된 사실] /waitlist→/tester rename(git). submodule 6커밋 뒤짐. UTM analytics.ts서 소실. /coach 녹화+업로드 2경로.

[R3 확정할 것 — 코드 관점 최종 판정]
1) 이 하드게이트 체크리스트로 착수하면 "코치 8월 검증 capacity 무접촉"이 실제로 지켜지나? 빠진 게이트 항목 있나.
2) UTM allowlist 최소 구현: normalizePath 안 건드리고 utm_* 6개만 GA custom dimension으로. 대략 규모·리스크.
3) 보조증거: 정적 코치카드(FALLBACK_FEEDBACK=에러카피라 못씀) 대신 기존 인스타 장면해부 이미지 1장 재사용(coach 무접촉)이 맞나.
4) 최종 승인/반박: 이 확정안으로 CONVERGE 가능한가. 남은 blocker critical 있으면만 지목.

간결히. 신규 critical 없으면 "신규 critical 없음" 명시.

## Raw output

```text
결론: **현 체크리스트 그대로는 반박.** 아래 critical 보강하면 **CONVERGE 가능**.

1. **coach capacity 무접촉**
   부족함. 하드게이트에 `coach diff-free` 필요합니다. 캠페인 착수 브랜치에서 `web/src/app/coach*`, `web/src/app/api/coach*`, `web/src/server/coach*`, `web/src/coach*`, `web/src/coach2*` 변경 0이어야 함.  
   지금 로컬도 `web/src/server/coachSecondAnalyze.ts`가 dirty라 이 상태 착수는 무접촉 보장 안 됩니다.

2. **UTM allowlist**
   가능. `normalizePath` 안 건드리고 `trackPageView()`에서 `window.location.search` 읽어 `utm_source/medium/campaign/content/term/ref`만 event param으로 붙이면 됩니다.  
   규모: `analytics.ts` + test 2~3개, 대략 40~70 LOC. 리스크 낮음. 단, GA4 admin에서 custom dimension 등록 + DebugView/Realtime 실발화 확인은 별도 게이트.

3. **보조증거**
   맞음. `FALLBACK_FEEDBACK`은 에러/파싱 실패 카피라 증거 카드로 쓰면 안 됩니다. 기존 인스타 장면해부 이미지 1장 정적 재사용이 coach 무접촉에 맞음. 단, repo 내 `web/public`에는 해당 자산이 안 보여서 자산 위치 확정 필요.

4. **남은 critical blocker**
   - `/tester` 라우트가 현재 코드에는 없고 `/form`만 있음. `/tester prod 200` 및 write 검증 전 착수 불가.
   - `dedupe=unique email`인데 현재 신청 payload는 `phone` 기준이고 email 필드가 없음. email 수집/저장/중복 기준을 실제 코드나 시트에서 확정해야 함.
   - dirty worktree, 특히 coach 파일 변경 해소 필요.

최종 판정: **조건부 승인. 위 3개 critical 해소 전에는 승인 불가.**


OpenAI Codex v0.142.5
--------
workdir: C:\soma\repos\acttub
model: gpt-5.5
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: xhigh
reasoning summaries: none
session id: 019f2729-4e24-79c2-a754-8977c6a2d9e0
--------
user
acttub 토론 R3(확정 라운드). eng 관점. R2 확정안을 코드 관점서 최종 승인 or 반박만. 한글 간결.

[R2 확정] primary=waitlist(/tester) 전환율·/coach=secondary. 산출=얇은 캠페인 라우트 1개(신규 랜딩 아님). 정적 코치샘플 MVP 제외. 착수전 하드게이트(submodule bump[우영 lineshot 미커밋 해소 선행]·/tester·/coach prod 200·Gemini키·IG웹뷰×coach 업로드 실기기·GA4+UTM allowlist 실발화·tester-write-verified). dev0 용어분리(coach product dev=0 / campaign surface dev≤1 route). UTM allowlist(source/medium/campaign/content/term/ref). dedupe=unique email.

[확인된 사실] /waitlist→/tester rename(git). submodule 6커밋 뒤짐. UTM analytics.ts서 소실. /coach 녹화+업로드 2경로.

[R3 확정할 것 — 코드 관점 최종 판정]
1) 이 하드게이트 체크리스트로 착수하면 "코치 8월 검증 capacity 무접촉"이 실제로 지켜지나? 빠진 게이트 항목 있나.
2) UTM allowlist 최소 구현: normalizePath 안 건드리고 utm_* 6개만 GA custom dimension으로. 대략 규모·리스크.
3) 보조증거: 정적 코치카드(FALLBACK_FEEDBACK=에러카피라 못씀) 대신 기존 인스타 장면해부 이미지 1장 재사용(coach 무접촉)이 맞나.
4) 최종 승인/반박: 이 확정안으로 CONVERGE 가능한가. 남은 blocker critical 있으면만 지목.

간결히. 신규 critical 없으면 "신규 critical 없음" 명시.
codex
karpathy-guidelines 스킬을 사용해 코드 관점 판정이 과장되지 않게 확인하겠습니다. 먼저 프로젝트 지시와 관련 코드만 빠르게 읽겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Raw C:\\Users\\sukpo\\.codex\\skills\\karpathy-guidelines\\SKILL.md" in C:\soma\repos\acttub
 succeeded in 616ms:
---
name: karpathy-guidelines
description: Behavioral guidelines to reduce common LLM coding mistakes. Use when writing, reviewing, or refactoring code to avoid overcomplication, make surgical changes, surface assumptions, and define verifiable success criteria.
license: MIT
---

# Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" ??"Write tests for invalid inputs, then make them pass"
- "Fix the bug" ??"Write a test that reproduces it, then make it pass"
- "Refactor X" ??"Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] ??verify: [check]
2. [Step] ??verify: [check]
3. [Step] ??verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.


codex
이건 구현 착수 전 승인/반박 문제라, 변경 없이 근거가 되는 라우트/analytics/coach 코드와 git 상태만 확인하겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'git status --short; git submodule status' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg --files' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'Get-Content -Raw CLAUDE.md' in C:\soma\repos\acttub
 succeeded in 656ms:
# Repository Guidelines

## Project Structure

This repository now has one active workspace app:

- `web/`: unified Next.js React app for landing, ACTI, thea, excer, community, archive, and coach.

The former app folders may remain as reference material, but normal development, linting, testing, and deployment go through `web/`.

## Current Product Surface

The active app serves all user-facing pages from one Next.js project and one port:

- `/`: Acttub home.
- `/ACTI`, `/ACTI/quiz`, `/ACTI/survey`, `/ACTI/result/[code]`: ACTI diagnosis flow.
- `/coach`: AI coach video analysis.
- `/archive`: acting video archive, search, upload, user, playlist, and video detail pages.
- `/community`: community board, search, write/new, profile, post, and comment flows.
- `/excer`: practice-room listing and room detail pages.
- `/thea`: theater listing and play detail pages.
- `/team`: team page.

Backend behavior lives in Next route handlers under `web/src/app/api`. Current API areas include archive videos/uploads, community posts/comments, coach upload/analyze/cleanup, result email sending, and health checks. Shared backend code is under `web/src/server`.

## Commands

Install dependencies from the repository root:

```bash
corepack pnpm install
```

Common commands:

- `corepack pnpm local`: run `web` locally on `127.0.0.1:4000`.
- `corepack pnpm local:lan`: run `web` on `0.0.0.0:4000` for LAN/mobile testing.
- `corepack pnpm prod && corepack pnpm start`: build and run the production `web` app on `127.0.0.1:4000`.
- `corepack pnpm start:lan`: run the built production `web` app on `0.0.0.0:4000`.
- `corepack pnpm smoke`: check key pages and `/api/health` against `SMOKE_BASE_URL` or `http://127.0.0.1:4000`.
- `corepack pnpm lint`: lint `web`.
- `corepack pnpm test`: run `web` tests.
- `corepack pnpm prod`: build `web`.
- `corepack pnpm verify`: frozen install, lint, test, and production builds.
- `corepack pnpm verify:preview`: run the full preview branch check, including production runtime smoke on port 4010.
- `corepack pnpm --dir web db:migrate`: apply Drizzle migrations to the configured Neon database.

## Coding Style

Use TypeScript and React functional components. Import via the `@/*` alias (??`src/*`), not long relative paths.

Code placement:

- `web/src/app/<area>`: App Router pages. `web/src/app/api/<area>/<action>/route.ts`: route handlers.
- `web/src/server`: backend core ??storage, DB schema/migrations (`schema.ts` + `web/drizzle`), blob, external services (Gemini, email).
- `web/src/lib`: shared/client-side utilities (scoring, analytics, share, survey submit, ??.
- `web/src/components`: reusable UI. `web/src/views`: page-level views. `web/src/styles`: tokens and global CSS.

Prefer existing helpers and page/component patterns before adding new abstractions. Keep UI unchanged unless the task explicitly asks for a UI change.

Types: prefer `type` aliases over `interface`; validate external input with `zod`. Note `strictNullChecks` is off in `tsconfig` ??guard nullable values explicitly rather than relying on the compiler.

For UI work, read [`web/design.md`](web/design.md) first. Note `web/` has **two style systems** (see its "Scope" section): System A (global `:root` tokens + BEM, in `src/components`/ACTI) and legacy System B (page-scoped tokens + frozen utility classes, in `src/views`). Follow System A for new components; when editing an existing `src/views` page, match that file's existing pattern. Never hardcode colors, spacing, radii, shadows, or font sizes ??use the tokens already in scope.

## Backend & API Conventions

Route handlers stay thin ??they adapt HTTP only and delegate all logic to `web/src/server`:

```ts
export async function POST(request: Request) {
  return jsonResponse(await handleCommunityPosts(await jsonRequestInput(request)));
}
```

- Business logic lives in `handle*(input: ApiRequestInput, storage?: ActtubStorage): Promise<ApiResult>` functions (see `apiCore.ts`). They return `{ status, body }` ??never construct `Response` objects in server logic.
- Accept an optional injected `storage` (default via `storageOrDefault`) so handlers are unit-testable without a live DB. Access data only through the `ActtubStorage` interface (`createActtubStorage()`), not DB clients directly.
- Validate request bodies with a `zod` schema via `safeParse`; on failure return `badRequest(parsed.error.issues)` (400).
- Status conventions: 200/201 success, `badRequest` 400, 404 for missing resources, `methodNotAllowed()` 405. In `catch`, derive the message with `error instanceof Error ? error.message : '<fallback>'`.

## Testing

`web` uses Vitest. Put tests near covered code as `*.test.ts` or `*.test.tsx`.

For backend/API changes, cover the server helper or storage adapter and run:

```bash
corepack pnpm test
corepack pnpm prod
```

## Deployment

GitHub Actions owns the deployment pipeline. Pull requests run verification and then deploy a Vercel Preview. Pushes to `main` run verification and then deploy Vercel Production.

Required GitHub repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Vercel direct Git auto-deploy should stay disabled for `web`, and legacy Vercel projects should be disconnected or disabled so only the unified `web` app deploys.
This repository disables Vercel Git auto-deploy through `git.deploymentEnabled: false` in `web/vercel.json` and the legacy project-root `vercel.json` files.

Drizzle migrations are not applied automatically by GitHub Actions. For schema changes, keep migration files under `web/drizzle`, call out the exact migration files in the PR/Jira notes, and apply them explicitly to the target Neon database before validating deployed persistence. Preview persistence requires the Vercel Preview environment to have `DATABASE_URL`; otherwise API handlers use in-memory fallback storage.

For API paths that accept potentially sensitive user data, keep the user flow non-blocking where appropriate but log server-side failures with sanitized metadata only. Do not log raw request bodies, survey `answers`, contact information, tokens, or uploaded file contents.

## Secrets

Never commit local env or Vercel metadata:

- `web/.env.local`
- `web/.vercel/`
- `web/node_modules/`
- `web/.next/`

Production env is managed in Vercel. Required web env includes `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `GEMINI_API_KEY`, and `CRON_SECRET`.

## Pull Requests

Use concise conventional-style commits. PRs should summarize affected app(s), list validation commands, and call out deployment or env changes.
When work is tied to Jira, include the Jira key in branch names, commit messages, and PR titles, e.g. `SOMA-36 feat: store acti survey responses`.


 succeeded in 882ms:
pnpm-workspace.yaml
pnpm-lock.yaml
package.json
README.md
coach\vercel.json
CLAUDE.md
docs\nextjs-preview-pr.md
docs\nextjs-preview-pr-body.md
docs\nextjs-preview-readiness.md
scripts\smoke-routes.mjs
scripts\create-preview-pr.mjs
scripts\verify-prod-runtime.mjs
AGENTS.md
comm\vercel.json
comm\tsconfig.json
thea\vercel.json
thea\tsconfig.json
excer\vercel.json
excer\tsconfig.json
web\vitest.config.ts
web\vercel.json
web\tsconfig.json
arch\vercel.json
arch\tsconfig.json
acttub-landing\vercel.json
acttub-landing\index.html
comm\firestore.rules
comm\firestore.indexes.json
comm\eslint.config.mjs
comm\components.json
comm\CLAUDE.md
comm\.env.example
docs\superpowers\specs\2026-05-22-coach-gemini-mvp-design.md
ACTI\vite.config.ts
ACTI\vercel.json
ACTI\tsconfig.node.json
ACTI\tsconfig.json
ACTI\tsconfig.app.json
comm\src\proxy.ts
arch\src\proxy.ts
comm\public\window.svg
comm\public\vercel.svg
comm\public\next.svg
comm\public\globe.svg
comm\public\file.svg
comm\postcss.config.mjs
comm\next.config.ts
docs\superpowers\plans\2026-05-22-coach-gemini-mvp.md
excer\next.config.ts
excer\eslint.config.mjs
excer\drizzle.config.ts
comm\src\lib\utils.ts
comm\src\lib\posts.ts
comm\src\lib\me.ts
ACTI\src\test-setup.ts
thea\src\lib\utils.ts
thea\src\lib\kopis.ts
thea\src\lib\auto-tag.ts
arch\src\lib\utils.ts
arch\src\lib\share.ts
excer\src\types\kakao-maps.d.ts
comm\scripts\seed.mjs
comm\README.md
comm\src\lib\api.ts
comm\src\lib\anonymous-labels.ts
web\src\views\TheaPage.tsx
web\src\views\TheaPage.test.tsx
web\src\views\TheaPage.css
web\src\views\TeamPage.tsx
web\src\views\TeamPage.css
web\src\views\SurveyPage.tsx
web\src\views\SurveyPage.test.tsx
web\src\views\SurveyPage.css
web\src\views\RootLandingPage.tsx
web\src\views\RootLandingPage.test.tsx
web\src\views\RootLandingPage.css
web\src\views\ResultPage.tsx
web\src\views\ResultPage.css
web\src\views\QuizPage.tsx
web\src\views\QuizPage.css
web\src\views\QuickTestPage.tsx
web\src\views\PlayPage.tsx
web\src\views\PlayPage.css
web\src\views\NotFoundPage.tsx
web\src\views\NotFoundPage.css
web\src\views\LineshotPage.tsx
web\src\views\LineshotPage.css
web\src\views\LandingPage.tsx
web\src\views\LandingPage.test.tsx
web\src\views\LandingPage.css
web\src\views\FortunePage.tsx
web\src\views\FortunePage.css
web\src\views\FormReviewPage.tsx
web\src\views\FormPage.tsx
web\src\views\FormPage.css
web\src\views\ExcerPage.tsx
web\src\views\ExcerPage.test.tsx
web\src\views\ExcerPage.css
web\src\views\CommunityPage.tsx
web\src\views\CommunityPage.test.tsx
web\src\views\CommunityPage.css
web\src\views\CoachPage.tsx
web\src\views\CoachPage.css
web\src\views\coachFeedbackCards.tsx
web\src\views\ArchivePage.tsx
web\src\views\ArchivePage.test.tsx
web\src\views\ArchivePage.css
comm\src\lib\firebase\schema.ts
comm\src\lib\firebase\client.ts
comm\src\lib\firebase\admin.ts
comm\src\lib\comments.ts
comm\src\lib\boards.ts
comm\src\lib\auth.ts
thea\next.config.ts
thea\next-env.d.ts
thea\eslint.config.mjs
thea\components.json
thea\CLAUDE.md
thea\.env.example
thea\README.md
thea\src\data\curation.ts
ACTI\src\styles\globals.css
excer\src\lib\utils.ts
arch\src\lib\db\schema.ts
arch\src\lib\db\index.ts
arch\src\lib\auth.ts
comm\src\components\vote-button.tsx
web\src\thea\curation.ts
excer\drizzle\meta\_journal.json
excer\drizzle\meta\0000_snapshot.json
excer\drizzle\0000_big_leech.sql
thea\public\theater-hero.png
thea\postcss.config.mjs
thea\src\components\recommendation-tool.tsx
ACTI\src\pages\SurveyPage.tsx
ACTI\src\pages\SurveyPage.test.tsx
ACTI\src\pages\SurveyPage.css
ACTI\src\pages\ResultPage.tsx
ACTI\src\pages\ResultPage.css
ACTI\src\pages\QuizPage.tsx
ACTI\src\pages\QuizPage.css
ACTI\src\pages\NotFoundPage.tsx
ACTI\src\pages\NotFoundPage.css
ACTI\src\pages\LandingPage.tsx
ACTI\src\pages\LandingPage.css
ACTI\src\main.tsx
arch\src\components\video-player.tsx
arch\src\components\video-card.tsx
arch\src\components\video-actions.tsx
arch\src\components\upload-form.tsx
excer\src\lib\url\search-params.ts
excer\src\lib\url\apply-filters.ts
web\src\testcoach\types.ts
web\src\testcoach\schemas.ts
web\src\testcoach\prompts.ts
web\src\testcoach\pipeline.ts
web\src\testcoach\dictionaries.ts
web\src\test-setup.ts
excer\docs\seed-guide.md
excer\components.json
excer\CLAUDE.md
excer\.env.local.example
comm\src\components\ui\textarea.tsx
comm\src\components\ui\separator.tsx
comm\src\components\ui\label.tsx
comm\src\components\ui\input.tsx
comm\src\components\ui\dropdown-menu.tsx
comm\src\components\ui\dialog.tsx
comm\src\components\ui\card.tsx
comm\src\components\ui\button.tsx
comm\src\components\ui\avatar.tsx
comm\src\components\site-sidebar.tsx
comm\src\components\site-header.tsx
comm\src\components\search-form.tsx
comm\src\components\post-form.tsx
comm\src\components\post-card.tsx
comm\src\components\post-actions.tsx
comm\src\components\comment-thread.tsx
comm\src\components\comment-item.tsx
comm\src\components\comment-form.tsx
comm\src\components\comment-card.tsx
comm\src\components\bookmark-button.tsx
comm\src\components\board-tabs.tsx
thea\src\components\ui\button.tsx
thea\src\components\site-header.tsx
excer\postcss.config.mjs
ACTI\src\lib\surveySubmit.ts
ACTI\src\lib\storage.ts
ACTI\src\lib\storage.test.ts
ACTI\src\lib\share.ts
ACTI\src\lib\sendResult.ts
ACTI\src\lib\scoring.ts
ACTI\src\lib\scoring.test.ts
ACTI\src\lib\kakao.ts
ACTI\src\lib\analytics.ts
ACTI\src\lib\analytics.test.ts
arch\src\components\ui\textarea.tsx
arch\src\components\ui\tabs.tsx
arch\src\components\ui\sonner.tsx
arch\src\components\ui\skeleton.tsx
arch\src\components\ui\label.tsx
arch\src\components\ui\input.tsx
arch\src\components\ui\dialog.tsx
arch\src\components\ui\card.tsx
arch\src\components\ui\button.tsx
arch\src\components\ui\badge.tsx
arch\src\components\ui\avatar.tsx
arch\src\components\site-header.tsx
arch\src\components\playlist-form.tsx
arch\src\components\comment-section.tsx
web\src\styles\globals.css
excer\scripts\seed.ts
excer\scripts\seed-rooms.example.csv
excer\scripts\seed-csv.ts
excer\README.md
excer\src\lib\db\fixtures.ts
excer\src\lib\db\schema.ts
excer\src\lib\db\queries.ts
excer\src\lib\db\index.ts
ACTI\src\content\types.ts
ACTI\src\content\survey.ts
ACTI\src\content\survey.test.ts
ACTI\src\content\schema.ts
ACTI\src\content\questions.ts
ACTI\src\content\content.test.ts
excer\src\hooks\use-filters.ts
comm\src\app\search\page.tsx
comm\src\app\page.tsx
excer\outputs\stage-2\wireframes.md
excer\outputs\stage-2\visual-spec.md
excer\outputs\stage-2\information-architecture.md
excer\outputs\stage-2\design-system.md
excer\outputs\stage-2\design-handoff.md
web\src\server\webRequest.ts
web\src\server\vercelImportCompatibility.test.ts
web\src\server\testCoachAnalyze.ts
web\src\server\storageFactory.ts
web\src\server\storageFactory.test.ts
web\src\server\storage.ts
web\src\server\storage.test.ts
web\src\server\sheetsWebhook.ts
web\src\server\schema.ts
web\src\server\postgresStorage.ts
web\src\server\postgresStorage.test.ts
web\src\server\playScore.ts
web\src\server\playScore.test.ts
web\src\server\playGame.ts
web\src\server\playGame.test.ts
web\src\server\playData.ts
web\src\server\nextApi.ts
web\src\server\lineshotScore.ts
web\src\server\lineshotScore.test.ts
web\src\server\lineshotPrompt.ts
web\src\server\lineshotPrompt.test.ts
web\src\server\fortunePrompt.ts
web\src\server\fortunePrompt.test.ts
web\src\server\fortuneGenerate.ts
web\src\server\fortuneGenerate.test.ts
web\src\server\formReview.ts
web\src\server\formReview.test.ts
web\src\server\formApply.ts
web\src\server\formApply.test.ts
thea\src\app\plays\[id]\page.tsx
thea\src\app\page.tsx
thea\src\app\not-found.tsx
thea\src\app\layout.tsx
thea\src\app\globals.css
thea\src\app\error.tsx
ACTI\src\components\TypeCard.tsx
ACTI\src\components\TypeCard.css
ACTI\src\components\Toast.tsx
ACTI\src\components\Toast.css
ACTI\src\components\StoryCaptureCanvas.tsx
ACTI\src\components\StoryCaptureCanvas.css
ACTI\src\components\ShareSuccessModal.tsx
ACTI\src\components\ShareSuccessModal.css
ACTI\src\components\ShareActionButton.tsx
ACTI\src\components\ShareActionButton.css
ACTI\src\components\SecondaryButton.tsx
ACTI\src\components\SecondaryButton.css
ACTI\src\components\ResultEmailForm.tsx
ACTI\src\components\ResultEmailForm.css
ACTI\src\components\ProgressBar.tsx
ACTI\src\components\ProgressBar.css
ACTI\src\components\PrimaryButton.tsx
ACTI\src\components\PrimaryButton.css
ACTI\src\components\ChoiceCard.tsx
ACTI\src\components\ChoiceCard.css
ACTI\src\components\CharacterAvatar.tsx
ACTI\src\components\CharacterAvatar.css
ACTI\src\components\CaptureCard.tsx
ACTI\src\components\CaptureCard.css
ACTI\src\components\BottomCTA.tsx
ACTI\src\components\Badge.tsx
ACTI\src\components\Badge.css
ACTI\src\components\AxisBreakdown.tsx
ACTI\src\components\AxisBreakdown.css
ACTI\src\App.tsx
ACTI\outputs\stage-3\ui-impl.md
ACTI\outputs\stage-3\test-report.md
ACTI\outputs\stage-3\tech-stack.md
ACTI\outputs\stage-3\project-setup.md
ACTI\outputs\stage-3\feature-impl.md
ACTI\outputs\stage-3\design-dev-bridge.md
ACTI\outputs\stage-3\data-model.md
ACTI\outputs\stage-3\build-config.md
excer\outputs\stage-1\user-stories.md
excer\outputs\stage-1\user-flow.md
excer\outputs\stage-1\screen-structure.md
excer\outputs\stage-1\prd.md
excer\outputs\stage-1\feature-priority.md
web\src\server\email\types.ts
web\src\server\email\typeDetails.ts
web\src\server\email\emailTemplate.ts
web\src\server\coachSession.ts
web\src\server\coachSession.test.ts
web\src\server\coachSecondAnalyze.ts
web\src\server\coachSecondAnalyze.test.ts
web\src\server\coachBlobCleanup.ts
web\src\server\coachBlobCleanup.test.ts
web\src\server\coachAnalyze.ts
web\src\server\coachAnalyze.test.ts
web\src\server\blobUpload.ts
web\src\server\blobUpload.test.ts
web\src\server\apiCore.ts
web\src\server\apiCore.test.ts
excer\outputs\stage-0\validation-report.md
excer\outputs\stage-0\solution-outline.md
excer\outputs\stage-0\raw-idea.md
excer\outputs\stage-0\problem-statement.md
excer\outputs\stage-0\idea-brief.md
ACTI\scripts\remove_bg.py
ACTI\README.md
arch\src\app\videos\[id]\page.tsx
comm\src\app\p\[id]\page.tsx
excer\src\components\ui\toggle.tsx
excer\src\components\ui\toggle-group.tsx
excer\src\components\ui\textarea.tsx
excer\src\components\ui\tabs.tsx
excer\src\components\ui\sonner.tsx
excer\src\components\ui\slider.tsx
excer\src\components\ui\skeleton.tsx
excer\src\components\ui\separator.tsx
excer\src\components\ui\popover.tsx
excer\src\components\ui\label.tsx
excer\src\components\ui\input.tsx
excer\src\components\ui\drawer.tsx
excer\src\components\ui\dialog.tsx
excer\src\components\ui\carousel.tsx
excer\src\components\ui\card.tsx
excer\src\components\ui\button.tsx
excer\src\components\ui\badge.tsx
excer\src\components\ui\avatar.tsx
ACTI\outputs\stage-2\animation-spec.md
ACTI\outputs\stage-2\wireframes-web.md
ACTI\outputs\stage-2\screen-analysis.md
ACTI\outputs\stage-2\references.md
ACTI\outputs\stage-2\prototype-web.html
ACTI\outputs\stage-2\platform-selection.md
ACTI\outputs\stage-2\design-tokens.md
ACTI\outputs\stage-2\design-spec-web.md
ACTI\outputs\stage-2\component-spec-web.md
excer\src\app\sitemap.ts
web\src\lib\surveySubmit.ts
web\src\lib\surveySubmit.test.ts
web\src\lib\storage.ts
web\src\lib\storage.test.ts
web\src\lib\share.ts
web\src\lib\sendResult.ts
web\src\lib\scoring.ts
web\src\lib\scoring.test.ts
web\src\lib\kakao.ts
web\src\lib\analytics.ts
web\src\lib\analytics.test.ts
excer\src\components\excer\sort-control.tsx
excer\src\components\excer\search-bar.tsx
excer\src\components\excer\room-photo-carousel.tsx
excer\src\components\excer\room-list.tsx
excer\src\components\excer\room-card.tsx
excer\src\components\excer\map-view.tsx
excer\src\components\excer\map-placeholder.tsx
excer\src\components\excer\last-verified-badge.tsx
excer\src\components\excer\home-content.tsx
excer\src\components\excer\filter-panel.tsx
excer\src\components\excer\external-cta.tsx
excer\src\components\excer\empty-state.tsx
excer\src\components\excer\attribute-table.tsx
excer\src\components\excer\app-header.tsx
excer\src\app\not-found.tsx
excer\src\app\layout.tsx
excer\src\app\globals.css
excer\src\app\page.tsx
excer\src\app\robots.ts
ACTI\public\_redirects
ACTI\public\icons.svg
ACTI\public\favicon.svg
arch\src\app\upload\page.tsx
comm\src\app\p\[id]\edit\page.tsx
ACTI\outputs\stage-1\user-stories.md
ACTI\outputs\stage-1\user-flow.md
ACTI\outputs\stage-1\screen-structure.md
ACTI\outputs\stage-1\prd.md
ACTI\outputs\stage-1\feature-priority.md
web\src\coach\personas.ts
web\src\coach\evaluation.ts
web\src\coach\evaluation.test.ts
web\src\excer\rooms.ts
web\src\excer\excerFilters.ts
web\src\excer\excerFilters.test.ts
ACTI\public\characters\TPNS.png
ACTI\public\characters\TPNB.png
ACTI\public\characters\TPAS.png
ACTI\public\characters\TPAB.png
ACTI\public\characters\TINS.png
ACTI\public\characters\TINB.png
ACTI\public\characters\TIAS.png
ACTI\public\characters\TIAB.png
ACTI\public\characters\MPNS.png
ACTI\public\characters\MPNB.png
ACTI\public\characters\MPAS.png
ACTI\public\characters\MPAB.png
ACTI\public\characters\MINS.png
ACTI\public\characters\MINB.png
ACTI\public\characters\MIAS.png
ACTI\public\characters\MIAB.png
comm\src\app\new\page.tsx
web\src\archive\uploadPolicy.ts
web\src\archive\uploadPolicy.test.ts
web\src\archive\fixtures.ts
web\src\archive\archiveData.ts
web\src\archive\archiveData.test.ts
ACTI\outputs\stage-0\validation-report.md
ACTI\outputs\stage-0\solution-outline.md
ACTI\outputs\stage-0\raw-idea.md
ACTI\outputs\stage-0\problem-statement.md
ACTI\outputs\stage-0\idea-brief.md
ACTI\index.html
ACTI\eslint.config.js
web\eslint.config.js
web\drizzle.config.ts
excer\src\app\rooms\[slug]\page.tsx
web\AGENTS.md
web\.env.example
web\design.md
web\src\content\types.ts
web\src\content\survey.ts
web\src\content\survey.test.ts
web\src\content\schema.ts
web\src\content\questions.ts
web\src\content\content.test.ts
web\src\community\fixtures.ts
web\src\community\communityData.ts
web\src\community\communityData.test.ts
arch\src\app\u\[username]\page.tsx
comm\src\app\me\page.tsx
comm\src\app\layout.tsx
comm\src\app\icon.tsx
comm\src\app\globals.css
comm\src\app\apple-icon.tsx
web\src\app\unifiedRoutes.test.ts
web\src\components\TypeCard.tsx
web\src\components\TypeCard.css
web\src\components\Toast.tsx
web\src\components\Toast.css
web\src\components\StoryCaptureCanvas.tsx
web\src\components\StoryCaptureCanvas.css
web\src\components\ShareSuccessModal.tsx
web\src\components\ShareSuccessModal.css
web\src\components\ShareActionButton.tsx
web\src\components\ShareActionButton.css
web\src\components\SecondaryButton.tsx
web\src\components\SecondaryButton.css
web\src\components\ResultEmailForm.tsx
web\src\components\ResultEmailForm.css
web\src\components\ProgressBar.tsx
web\src\components\ProgressBar.css
web\src\components\PrimaryButton.tsx
web\src\components\PrimaryButton.css
web\src\components\ChoiceCard.tsx
web\src\components\ChoiceCard.css
web\src\components\CharacterAvatar.tsx
web\src\components\CharacterAvatar.css
web\src\components\CaptureCard.tsx
web\src\components\CaptureCard.css
web\src\components\BottomCTA.tsx
web\src\components\Badge.tsx
web\src\components\Badge.css
web\src\components\AxisBreakdown.tsx
web\src\components\AxisBreakdown.css
ACTI\docs\superpowers\specs\2026-05-20-survey-gate-design.md
web\src\coach2\types.ts
web\src\coach2\schemas.ts
web\src\coach2\prompts.ts
web\src\coach2\pipeline.ts
web\src\coach2\pipeline.test.ts
web\src\coach2\dictionaries.ts
arch\next.config.ts
arch\eslint.config.mjs
arch\drizzle.config.ts
web\drizzle\meta\_journal.json
web\drizzle\meta\0003_snapshot.json
web\drizzle\meta\0002_snapshot.json
web\drizzle\meta\0001_snapshot.json
web\drizzle\meta\0000_snapshot.json
web\drizzle\0003_lively_riptide.sql
web\drizzle\0002_organic_hardball.sql
web\drizzle\0001_cooing_umar.sql
web\drizzle\0000_lumpy_edwin_jarvis.sql
ACTI\docs\superpowers\plans\2026-05-20-survey-gate.md
arch\src\app\sign-up\[[...sign-up]]\page.tsx
web\docs\superpowers\specs\2026-05-20-survey-gate-design.md
arch\drizzle\meta\_journal.json
arch\drizzle\meta\0001_snapshot.json
arch\drizzle\meta\0000_snapshot.json
arch\drizzle\0001_giant_retro_girl.sql
arch\drizzle\0000_vengeful_blindfold.sql
arch\components.json
comm\src\app\api\webhooks\clerk\route.ts
web\docs\superpowers\plans\2026-05-20-survey-gate.md
web\src\app\thea\plays\[id]\page.tsx
web\src\app\thea\page.tsx
ACTI\api\_lib\types.ts
ACTI\api\_lib\typeDetails.ts
ACTI\api\_lib\emailTemplate.ts
ACTI\api\send-result.ts
ACTI\AGENTS.md
web\package.json
arch\src\app\api\bookmarks\route.ts
arch\src\app\sign-in\[[...sign-in]]\page.tsx
web\src\app\excer\rooms\[slug]\page.tsx
web\src\app\excer\page.tsx
web\src\app\test\page.tsx
arch\scripts\verify-db.mjs
arch\scripts\verify-clerk.mjs
arch\scripts\verify-blob.mjs
arch\scripts\check-videos.mjs
arch\README.md
arch\src\app\api\videos\[id]\view\route.ts
arch\src\app\api\videos\[id]\route.ts
arch\src\app\api\videos\route.ts
arch\src\app\search\page.tsx
web\src\app\ACTI\survey\page.tsx
web\src\app\team\page.tsx
web\src\app\Providers.tsx
arch\public\window.svg
arch\public\vercel.svg
arch\public\next.svg
arch\public\globe.svg
arch\public\file.svg
arch\postcss.config.mjs
web\outputs\stage-3\ui-impl.md
web\outputs\stage-3\test-report.md
web\outputs\stage-3\tech-stack.md
web\outputs\stage-3\project-setup.md
web\outputs\stage-3\feature-impl.md
web\outputs\stage-3\design-dev-bridge.md
web\outputs\stage-3\data-model.md
web\outputs\stage-3\build-config.md
arch\src\app\api\upload\route.ts
comm\src\app\api\posts\[id]\vote\route.ts
comm\src\app\api\posts\[id]\route.ts
web\src\app\community\write\page.tsx
web\src\app\play\page.tsx
web\src\app\page.tsx
web\src\app\not-found.tsx
arch\src\app\api\share\route.ts
arch\src\app\layout.tsx
arch\src\app\icon.svg
arch\src\app\globals.css
arch\src\app\apple-icon.svg
arch\src\app\page.tsx
arch\src\app\s\[token]\page.tsx
web\outputs\stage-2\wireframes-web.md
web\outputs\stage-2\screen-analysis.md
web\outputs\stage-2\references.md
web\outputs\stage-2\prototype-web.html
web\outputs\stage-2\platform-selection.md
web\outputs\stage-2\design-tokens.md
web\outputs\stage-2\design-spec-web.md
web\outputs\stage-2\component-spec-web.md
web\outputs\stage-2\animation-spec.md
comm\src\app\api\posts\[id]\bookmark\route.ts
comm\src\app\api\posts\route.ts
web\src\app\ACTI\result\[code]\page.tsx
web\src\app\community\search\page.tsx
web\src\app\lineshot\page.tsx
web\src\app\layout.tsx
web\src\app\globals.css
arch\src\app\me\page.tsx
web\outputs\stage-1\user-stories.md
web\outputs\stage-1\user-flow.md
web\outputs\stage-1\screen-structure.md
web\outputs\stage-1\prd.md
web\outputs\stage-1\feature-priority.md
web\src\app\ACTI\quiz\page.tsx
web\src\app\ACTI\page.tsx
web\src\app\fortune\page.tsx
arch\src\app\api\playlists\[id]\videos\route.ts
arch\src\app\api\playlists\[id]\route.ts
arch\src\app\api\playlists\route.ts
arch\src\app\playlists\new\page.tsx
arch\src\app\playlists\[slug]\page.tsx
comm\src\app\api\comments\[id]\route.ts
comm\src\app\api\comments\route.ts
web\outputs\stage-0\problem-statement.md
web\outputs\stage-0\idea-brief.md
web\next.config.ts
web\next-env.d.ts
web\outputs\stage-0\solution-outline.md
web\outputs\stage-0\raw-idea.md
web\outputs\stage-0\validation-report.md
web\scripts\coach2-to-confluence.mjs
web\scripts\coach2-dump.mjs
web\README.md
web\scripts\soma-79-generate-coach-feedback.ts
web\src\app\community\posts\[id]\page.tsx
web\src\app\community\page.tsx
web\src\app\form\page.tsx
arch\src\app\api\comments\route.ts
comm\src\app\api\comments\[id]\vote\route.ts
web\public\favicon.svg
web\src\app\community\me\page.tsx
web\src\app\form\review\page.tsx
arch\src\app\api\comments\[id]\route.ts
web\public\characters\TPNS.png
web\public\characters\TPNB.png
web\public\characters\TPAS.png
web\public\characters\TPAB.png
web\public\characters\TINS.png
web\public\characters\TINB.png
web\public\characters\TIAS.png
web\public\characters\TIAB.png
web\public\characters\MPNS.png
web\public\characters\MPNB.png
web\public\characters\MPAS.png
web\public\characters\MPAB.png
web\public\characters\MINS.png
web\public\characters\MINB.png
web\public\characters\MIAS.png
web\public\characters\MIAB.png
web\public\icons.svg
web\public\thea\theater-hero.png
web\src\app\coach-second\page.tsx
web\src\app\community\p\[id]\page.tsx
web\src\app\archive\page.tsx
web\src\app\community\new\page.tsx
web\src\app\coach\page.tsx
web\src\app\archive\me\page.tsx
web\src\app\archive\playlists\new\page.tsx
web\src\app\archive\search\page.tsx
web\src\app\archive\u\[username]\page.tsx
web\src\app\archive\videos\[id]\page.tsx
web\src\app\archive\upload\page.tsx
web\scripts\out\labeling.csv
web\scripts\out\labeling-v2.csv
web\scripts\out\feedback.csv
web\scripts\out\feedback-v2.csv
web\src\app\api\health\route.ts
web\src\app\api\play\route.ts
web\src\app\api\form\route.ts
web\src\app\api\coach-second\analyze\route.ts
web\src\app\api\fortune\route.ts
web\src\app\api\archive\videos\route.ts
web\src\app\api\acti\survey\route.ts
web\src\app\api\test\analyze\route.ts
web\src\app\api\form\review\route.ts
web\src\app\api\lineshot\route.ts
web\src\app\api\coach\upload\route.ts
web\src\app\api\send-result\route.ts
web\src\app\api\archive\upload\route.ts
web\src\app\api\coach\analyze\route.ts
web\src\app\api\coach\cleanup\route.ts
web\src\app\api\community\comments\route.ts
web\src\app\api\community\posts\route.ts

 succeeded in 2460ms:
 M .gitignore
 M web/src/server/coachSecondAnalyze.ts
 M web/src/server/lineshotPrompt.test.ts
 M web/src/server/lineshotPrompt.ts
 M web/src/server/lineshotScore.test.ts
 M web/src/server/lineshotScore.ts
 M web/src/views/LineshotPage.tsx
?? .omc/
?? web/.omc/
?? web/scripts/

codex
현재 작업트리는 이미 lineshot/coach 관련 미커밋 변경이 있습니다. 이건 하드게이트의 “submodule/우영 lineshot 미커밋 해소 선행”과 충돌 가능성이 있어 별도 blocker 후보로 보겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Raw web\\AGENTS.md" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Raw web\\src\\lib\\analytics.ts" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg -n \"normalizePath|utm_|waitlist|tester|coach|FALLBACK_FEEDBACK|instagram|인스타|upload|record|녹화\" web\\src web\\public web\\scripts" in C:\soma\repos\acttub
 succeeded in 501ms:
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


 succeeded in 525ms:
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type GtagCommand = [command: string, ...args: unknown[]];

/**
 * 寃곌낵 ?섏씠吏???ъ슜???≪뀡. 諛쒖궗 ?쒖젏? ?≪뀡留덈떎 ?ㅻ쫫:
 * - `email_report`: ?쒕쾭 諛쒖넚 ?깃났 ??(?뺤젙)
 * - `instagram_story`: Web Share API媛 `'shared'` 諛섑솚 ??(?뺤젙)
 * - `copy_link`: ?대┰蹂대뱶 ?곌린 ?깃났 ??(?뺤젙)
 * - `kakao_share`: Kakao SDK ?몄텧 ??(?섎룄) ??SDK媛 ?꾨즺 肄쒕갚???쒓났?섏? ?딆븘
 *   ?앹뾽 ?ㅽ뵂 = 異붿쟻. ?ъ슜?먭? ?앹뾽???レ븘???대깽?몃뒗 諛쒖궗??
 */
export type ResultAction = 'email_report' | 'instagram_story' | 'kakao_share' | 'copy_link';

/**
 * /coach ???섏씠吏 ?덉쓽 ?④퀎 吏꾪뻾. ?섏씠吏酉곕쭔?쇰줎 ??蹂댁씠???④퀎蹂??댄깉(drop-off)??
 * GA4 ?좎엯寃쎈줈(funnel) ?먯깋?쇰줈 蹂닿린 ?꾪븿. ?④퀎??1?뚮쭔 諛쒖궗 ???ъ엯?Β룹옱?좏깮?쇰줈
 * ?섏튂媛 遺?吏 ?딄쾶(`error`??留ㅻ쾲 諛쒖궗???대뒓 ?쒕룄媛 ?ㅽ뙣?덈뒗吏 蹂몃떎).
 */
export type CoachStep =
  | 'video_selected'   // ?곸긽 ?낅줈???뱁솕 ?꾨즺
  | 'intent_entered'   // ?곌린 ?섎룄 泥??낅젰
  | 'analyze_clicked'  // 'AI濡?遺꾩꽍' ?대┃(寃利??듦낵)
  | 'upload_done'      // blob ?낅줈???깃났
  | 'result_shown'     // 寃곌낵 移대뱶 ?쒖떆
  | 'error';           // 遺꾩꽍 ?ㅽ뙣 ?댄깉

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: GtagCommand) => void;
  }
}

// 紐⑤뱢 ?ㅼ퐫????React StrictMode dev???쒕??덉씠?섎맂 remount??而댄룷?뚰듃 ref瑜?
// ?ъ큹湲고솕?섎?濡?dedupe ?곹깭??而댄룷?뚰듃 諛뽰뿉 ?ъ빞 ?쒕떎.
let lastTrackedPath: string | null = null;

// coach funnel? '?꾨떖 ?щ?'媛 ?듭떖 ???④퀎??1?뚮쭔 諛쒖궗??以묐났 ?낅젰?쇰줈 ?섏튂媛 遺?吏 ?딄쾶.
const trackedCoachSteps = new Set<CoachStep>();

export function initAnalytics(): void {
  const measurementId = GA_MEASUREMENT_ID;
  if (!measurementId) return;

  const existingScript = document.querySelector(
    `script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`
  );
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  // gtag.js queue consumer expects the native arguments object, not an array ??see google's snippet.
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer?.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });
}

/** ID???ㅼ젙?먮뒗??gtag媛 ?꾩쭅 ?놁쑝硫?self-init ?쒕룄. */
function ensureReady(): boolean {
  if (!GA_MEASUREMENT_ID) return false;
  if (!window.gtag) initAnalytics();
  return Boolean(window.gtag);
}

/**
 * ?낅젰 path瑜??덉쟾??pathname?쇰줈 ?뺢퇋??
 * - 寃곌낵 URL??origin???꾩옱 ?섏씠吏? ?ㅻⅤ硫?嫄곕? (`http://evil.com/x`,
 *   `//evil.com/x` ???몃? origin?쇰줈 ?댁꽍?섎뒗 紐⑤뱺 ?낅젰).
 * - leading slash ?녿뒗 ?곷? path??URL ?뚯꽌媛 蹂댁젙.
 * - `new URL()` ?ㅽ뙣??null.
 */
function normalizePath(path: string): string | null {
  if (path.startsWith('//')) return null;
  try {
    const url = new URL(path, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    return url.pathname;
  } catch {
    return null;
  }
}

/**
 * ?대씪?댁뼵???섏씠吏酉?異붿쟻. `path`??`/`濡??쒖옉?섎뒗 pathname??湲곕??섏?留?
 * 洹몃젃吏 ?딆? ?낅젰???덉쟾?섍쾶 泥섎━. ?숈씪 path ?곗냽 ?몄텧? dedupe.
 */
export function trackPageView(path: string): void {
  if (!ensureReady()) return;

  const pagePath = normalizePath(path);
  if (pagePath === null) return;
  if (lastTrackedPath === pagePath) return;
  lastTrackedPath = pagePath;

  window.gtag?.('event', 'page_view', {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
  });
}

export function trackResultAction(action: ResultAction, resultCode: string): void {
  if (!ensureReady()) return;

  window.gtag?.('event', 'result_action_request', {
    action,
    result_code: resultCode,
  });
}

/**
 * /coach ?④퀎 吏꾪뻾 異붿쟻. `error`瑜?類 ?④퀎???몄뀡 ?숈븞 1?뚮쭔 諛쒖궗(以묐났 dedupe).
 * GA4?먮뒗 `coach_<step>` ?대깽?몃줈 ?ㅼ뼱媛 ?④퀎蹂꾨줈 funnel???≪쓣 ???덈떎.
 */
export function trackCoachStep(step: CoachStep): void {
  if (!ensureReady()) return;
  if (step !== 'error' && trackedCoachSteps.has(step)) return;
  trackedCoachSteps.add(step);

  window.gtag?.('event', `coach_${step}`);
}


 succeeded in 677ms:
web\scripts\soma-79-generate-coach-feedback.ts:2: * SOMA-79 — coach 피드백 대량 생성 (문장 분해)
web\scripts\soma-79-generate-coach-feedback.ts:4: * 목적: acttub.com/coach 가 쓰는 실제 프로덕션 프롬프트(web/src/coach/evaluation.ts 의
web\scripts\soma-79-generate-coach-feedback.ts:16: *   pnpm exec tsx --env-file=.env.local scripts/soma-79-generate-coach-feedback.ts
web\scripts\soma-79-generate-coach-feedback.ts:30:import { buildEvaluationPrompt, parseGeminiFeedback, type CoachFeedback } from '../src/coach/evaluation';
web\scripts\coach2-to-confluence.mjs:1:// coach2-*.json 덤프 → Confluence(html contentFormat) 본문 HTML 생성.
web\scripts\coach2-to-confluence.mjs:2:// 사용: node web/scripts/coach2-to-confluence.mjs <dump-json> <out-html>
web\scripts\coach2-to-confluence.mjs:7:  console.error('사용법: node web/scripts/coach2-to-confluence.mjs <dump-json> <out-html>');
web\scripts\coach2-to-confluence.mjs:75:const body = `<div data-type="panel-info"><p>상태: 참고 · 자동 생성(로컬 덤프)</p><p><strong>【한 줄 요약】</strong> 이 문서는 coach v2(coach-second) 파이프라인이 실제 영상 1건을 분석할 때 Gemini로 보낸 <strong>13개 호출의 input(prompt 원문)과 output(raw 응답)</strong>을 그대로 기록한다.</p><p><strong>【결론】</strong> 13콜 전부 정상(${okCount}/${calls.length}) · 총 ${(
web\scripts\coach2-to-confluence.mjs:77:).toFixed(1)}s(병렬이라 실제 wall-clock은 더 짧음) · body 다수결 3콜 출력 동일(temp 0+seed 멱등 확인) · diagnosis가 사전 id를 선택.</p><p><em>아래는 각 콜의 <strong>output(raw 응답) 전문</strong>이다. input(prompt) 원문은 <a href="https://hiws99.atlassian.net/wiki/spaces/TSSNN/pages/17334281">프롬프트 정본 17334281</a>에 있어 길이만 표기한다(복제 회피). 동적 주입값 포함 완전본은 로컬 덤프 <code>web/.coach-trace/coach2-9bfcbcb8.json</code>.</em></p></div>
web\scripts\coach2-to-confluence.mjs:81:<tr><th>파이프라인</th><td>coach-second (v2 전량 정량화)</td></tr>
web\scripts\coach2-dump.mjs:1:// coach v2(coach-second) 13콜 input/output 덤프용 — 브라우저/업로드 우회.
web\scripts\coach2-dump.mjs:4:// /api/coach-second/analyze 에 multipart 로 직접 POST 한다. blob 업로드·content-type
web\scripts\coach2-dump.mjs:6:// web/.coach-trace/coach2-*.json 에 13콜(prompt=input, rawOutput=output)을 떨군다.
web\scripts\coach2-dump.mjs:9://   node web/scripts/coach2-dump.mjs <video-path> [category] [intent]
web\scripts\coach2-dump.mjs:11://   node web/scripts/coach2-dump.mjs ./sample.mp4 "독백" "분노를 절제해서 표현"
web\scripts\coach2-dump.mjs:22:  console.error('사용법: node web/scripts/coach2-dump.mjs <video-path> [category] [intent]');
web\scripts\coach2-dump.mjs:48:const url = `${base}/api/coach-second/analyze`;
web\scripts\coach2-dump.mjs:63:    ? '\n✅ 13콜 input/output → web/.coach-trace/coach2-*.json (서버 터미널에도 경로 한 줄 찍힘)'
web\scripts\coach2-dump.mjs:64:    : '\n⚠️ 분석은 실패했어도 그때까지 호출한 콜은 web/.coach-trace/ 에 덤프됨 — 거기서 input/output 확인',
web\src\community\fixtures.ts:132:    body: '유튜브, 인스타, 블로그, 형식 상관없이요. 같은 길 가는 사람들 어떻게 자기 작업 기록하는지 궁금해요.',
web\src\content\survey.ts:97:      { value: 'teacher-coach', label: '연기 선생님·코치' },
web\src\coach\evaluation.ts:70:// 블록0.5 — 다축 전경 (선택, coach-second v2만 채움). rev.7: 단일 초점 위에 축별 상태를 얹는다.
web\src\coach\evaluation.ts:95:const FALLBACK_FEEDBACK: CoachFeedback = {
web\src\coach\evaluation.ts:211:function record(value: unknown): Record<string, unknown> {
web\src\coach\evaluation.ts:216:  const data = record(value);
web\src\coach\evaluation.ts:218:  if (!text) return FALLBACK_FEEDBACK.sceneIntent;
web\src\coach\evaluation.ts:226:  const data = record(value);
web\src\coach\evaluation.ts:230:  if (!signal && !why) return FALLBACK_FEEDBACK.strength;
web\src\coach\evaluation.ts:242:  const data = record(value);
web\src\coach\evaluation.ts:248:  if (!prescription) return FALLBACK_FEEDBACK.focus;
web\src\coach\evaluation.ts:261:  const data = record(value);
web\src\coach\evaluation.ts:263:  if (!text) return FALLBACK_FEEDBACK.nextStep;
web\src\coach\evaluation.ts:281:    return FALLBACK_FEEDBACK;
web\src\server\blobUpload.test.ts:4:describe('archive blob upload policy', () => {
web\src\server\apiCore.ts:51:    .record(
web\src\server\apiCore.ts:201:      error: 'blob upload token is not configured in the unified web app yet',
web\src\server\apiCore.ts:202:      next: 'Set BLOB_READ_WRITE_TOKEN in Vercel to enable direct uploads.',
web\src\coach2\types.ts:1:// coach-second(v2) 파이프라인 타입 — 전량 정량화: LLM 출력은 enum·척도·id·인용·필드 경로뿐.
web\src\coach2\types.ts:2:// 설계 정본: Confluence "coach AI 파이프라인 v2"(18153475) · 프롬프트 정본: 17334281 (v2.0-draft.7)
web\src\coach2\types.ts:119:  coachGap: number;
web\src\server\apiCore.test.ts:87:          'feedback-source': ['teacher-coach', 'director'],
web\src\server\apiCore.test.ts:99:          'feedback-source': ['teacher-coach', 'director'],
web\src\server\apiCore.test.ts:139:  it('keeps blob upload explicit until Vercel Blob is configured', async () => {
web\src\server\apiCore.test.ts:140:    const result = await handleArchiveUpload({ method: 'POST', url: '/api/archive/upload' });
web\src\archive\uploadPolicy.test.ts:2:import { ARCHIVE_MULTIPART_UPLOAD_THRESHOLD_BYTES, shouldUseArchiveMultipartUpload } from './uploadPolicy';
web\src\archive\uploadPolicy.test.ts:4:describe('archive upload policy', () => {
web\src\archive\uploadPolicy.test.ts:5:  it('uses 100MB only as a multipart threshold, not as an upload rejection limit', () => {
web\src\coach2\schemas.ts:92:export function coachVerdictSchema(anchorIds: string[]): Schema {
web\src\server\coachBlobCleanup.ts:20:const COACH_BLOB_PREFIX = 'coach/';
web\src\server\coachBlobCleanup.ts:31:function blobAgeMs(blob: Pick<ListBlobResultBlob, 'uploadedAt'>, now: Date) {
web\src\server\coachBlobCleanup.ts:32:  return now.getTime() - new Date(blob.uploadedAt).getTime();
web\src\server\coachBlobCleanup.test.ts:3:import { cleanupOldCoachBlobs, handleCoachBlobCleanup } from './coachBlobCleanup';
web\src\server\coachBlobCleanup.test.ts:5:function blob(pathname: string, uploadedAt: Date) {
web\src\server\coachBlobCleanup.test.ts:11:    uploadedAt,
web\src\server\coachBlobCleanup.test.ts:16:describe('coach Blob cleanup', () => {
web\src\server\coachBlobCleanup.test.ts:17:  it('deletes only expired coach blobs', async () => {
web\src\server\coachBlobCleanup.test.ts:19:    const oldCoachBlob = blob('coach/old.webm', new Date('2026-05-23T11:59:00.000Z'));
web\src\server\coachBlobCleanup.test.ts:20:    const freshCoachBlob = blob('coach/fresh.webm', new Date('2026-05-24T11:00:00.000Z'));
web\src\server\coachBlobCleanup.test.ts:35:      prefix: 'coach/',
web\src\server\coachBlobCleanup.test.ts:43:      deletedPathnames: ['coach/old.webm'],
web\src\server\coachBlobCleanup.test.ts:49:    const result = await handleCoachBlobCleanup(new Request('http://localhost/api/coach/cleanup'), {
web\src\server\coachBlobCleanup.test.ts:63:    const result = await handleCoachBlobCleanup(new Request('http://localhost/api/coach/cleanup', {
web\src\coach2\prompts.ts:1:// coach-second(v2) 프롬프트 — 정본: Confluence "coach v2 프롬프트 명세"(17334281, v2.0-draft.7).
web\src\coach2\pipeline.ts:1:// coach-second(v2) 결정적 코드 단계 — 병합·다수결·집계·카드 조립.
web\src\coach2\pipeline.ts:3:import type { CoachFeedback, FeedbackAxis, FeedbackAxisBand, OverallBand } from '../coach/evaluation';
web\src\coach2\pipeline.ts:169:  const coachByAnchor = new Map<string, CoachVerdict[]>();
web\src\coach2\pipeline.ts:172:      const list = coachByAnchor.get(verdict.anchorId) ?? [];
web\src\coach2\pipeline.ts:174:      coachByAnchor.set(verdict.anchorId, list);
web\src\coach2\pipeline.ts:179:    const coachVerdicts = (coachByAnchor.get(anchor.anchorId) ?? []).filter((verdict) => verdict.relevant);
web\src\coach2\pipeline.ts:180:    const gaps = coachVerdicts.map((verdict) => GAP_VALUE[verdict.gap_bucket]);
web\src\coach2\pipeline.ts:181:    const coachGap = gaps.length > 0 ? Math.max(...gaps) : 0;
web\src\coach2\pipeline.ts:184:    const alignedCount = coachVerdicts.filter((verdict) => verdict.aligned).length;
web\src\coach2\pipeline.ts:188:      coachGap,
web\src\coach2\pipeline.ts:191:      priority: coachGap * 2 + agreeCount + audienceGap,
web\src\server\coachAnalyze.ts:7:import { buildSynthesisPrompt, formatTime, parseGeminiFeedback, type CoachFeedback } from '../coach/evaluation';
web\src\server\coachAnalyze.ts:8:import { buildObserverPrompt, buildPersonaPrompt, PERSONAS } from '../coach/personas';
web\src\server\coachAnalyze.ts:10:import { persistCoachSession, type PersistCoachSessionOptions } from './coachSession';
web\src\server\coachAnalyze.ts:40:// coach 업로드가 100MB 초과 시 multipart를 쓰므로 그보다 넉넉히 잡는다.
web\src\server\coachAnalyze.ts:66:  const record = value as Partial<File>;
web\src\server\coachAnalyze.ts:68:    typeof record.arrayBuffer === 'function'
web\src\server\coachAnalyze.ts:69:    && typeof record.size === 'number'
web\src\server\coachAnalyze.ts:70:    && typeof record.type === 'string'
web\src\server\coachAnalyze.ts:102:    const uploadDir = path.join(tmpdir(), 'acttub-coach');
web\src\server\coachAnalyze.ts:103:    await mkdir(uploadDir, { recursive: true });
web\src\server\coachAnalyze.ts:104:    tempPath = path.join(uploadDir, `${randomUUID()}${fileExtension(input.video)}`);
web\src\server\coachAnalyze.ts:108:    let uploadedFile = await ai.files.upload({
web\src\server\coachAnalyze.ts:116:    geminiFileName = uploadedFile.name ?? '';
web\src\server\coachAnalyze.ts:119:      if (fileStateName(uploadedFile.state) === 'ACTIVE') break;
web\src\server\coachAnalyze.ts:120:      if (!uploadedFile.name) throw new Error('업로드 파일 이름을 확인하지 못했습니다.');
web\src\server\coachAnalyze.ts:123:      uploadedFile = await ai.files.get({ name: uploadedFile.name }) as GeminiFileState;
web\src\server\coachAnalyze.ts:126:    if (fileStateName(uploadedFile.state) !== 'ACTIVE') {
web\src\server\coachAnalyze.ts:130:    if (!uploadedFile.uri || !uploadedFile.mimeType) {
web\src\server\coachAnalyze.ts:135:    const videoPart = createPartFromUri(uploadedFile.uri, uploadedFile.mimeType);
web\src\server\coachAnalyze.ts:171:        console.warn('coach persona analysis skipped', { persona: PERSONAS[index].key });
web\src\server\coachAnalyze.ts:320:          pipeline: 'coach',
web\src\server\coachAnalyze.ts:376:      pipeline: 'coach',
web\src\coach2\pipeline.test.ts:131:  it('priority = coachGap×2 + 동의 코치 수 + audienceGap, focus·strength를 결정적으로 고른다', () => {
web\src\coach2\pipeline.test.ts:136:    // coachGap 1 ×2 + 동의 2 + 관객 안 잡힘 1 = 5
web\src\server\coachAnalyze.test.ts:3:import { handleCoachAnalyze } from './coachAnalyze';
web\src\server\coachAnalyze.test.ts:13:  url: 'https://store.public.blob.vercel-storage.com/coach-sessions/kept.webm',
web\src\server\coachAnalyze.test.ts:14:  pathname: 'coach-sessions/kept.webm',
web\src\server\coachAnalyze.test.ts:34:describe('coach analysis API', () => {
web\src\server\coachAnalyze.test.ts:36:    const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
web\src\server\coachAnalyze.test.ts:48:    const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
web\src\server\coachAnalyze.test.ts:62:    const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
web\src\server\coachAnalyze.test.ts:75:  it('does not reject large uploads before the analyzer receives them', async () => {
web\src\server\coachAnalyze.test.ts:84:    const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
web\src\server\coachAnalyze.test.ts:90:      storage: stubStorage('coach-session-form'),
web\src\server\coachAnalyze.test.ts:96:    expect((result.body as { sessionId?: string }).sessionId).toBe('coach-session-form');
web\src\server\coachAnalyze.test.ts:112:    const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
web\src\server\coachAnalyze.test.ts:116:        videoUrl: 'https://blob.vercel-storage.com/coach/scene.webm',
web\src\server\coachAnalyze.test.ts:128:      storage: stubStorage('coach-session-blob'),
web\src\server\coachAnalyze.test.ts:133:    expect(fetcher).toHaveBeenCalledWith(new URL('https://blob.vercel-storage.com/coach/scene.webm'));
web\src\server\coachAnalyze.test.ts:143:    expect((result.body as { sessionId?: string }).sessionId).toBe('coach-session-blob');
web\src\server\coachAnalyze.test.ts:152:      const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
web\src\server\coachAnalyze.test.ts:188:      const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
web\src\server\coachAnalyze.test.ts:192:          videoUrl: 'https://blob.vercel-storage.com/coach/huge.webm',
web\src\server\coachAnalyze.test.ts:218:      const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
web\src\lib\surveySubmit.test.ts:12:      'feedback-source': ['teacher-coach', 'director'],
web\src\coach2\dictionaries.ts:6:import type { FeedbackAxis, OverallAxisKey, OverallBand } from '../coach/evaluation';
web\src\coach2\dictionaries.ts:279:    const record = cursor as Record<string, unknown>;
web\src\coach2\dictionaries.ts:280:    if ('part' in record && 'change' in record) return changePhrase(String(record.part), String(record.change));
web\src\server\formReview.ts:17: * 전화번호가 신청(tester-apply)과의 매칭 키이자 쿠폰(기프티콘) 발송 키.
web\src\server\formReview.ts:18: * payload kind='tester-review'로 Apps Script가 리뷰 탭에 분기 적재한다(컬럼은 v2 스키마).
web\src\server\formReview.ts:44:  /** 코치 세션 id — /coach 가 리뷰 CTA 에 ?s= 로 실어 보냄. 세션↔리뷰 매칭 키(선택). */
web\src\server\formReview.ts:53:  kind: 'tester-review';
web\src\server\formReview.ts:104:    kind: 'tester-review',
web\src\lib\share.ts:33: * 인스타 스토리 공유 가능 환경인지 판정.
web\src\lib\share.ts:36: *  1. 모바일 (iOS / Android) — 인스타 앱이 OS 공유시트에서 잡혀야 함
web\src\lib\share.ts:60: * 인스타 스토리(또는 OS 공유시트)로 캡처 카드 보내기.
web\src\server\formReview.test.ts:40:      kind: 'tester-review',
web\src\server\formReview.test.ts:62:      input({ ...validBody, sessionId: 'coach-session-abc' }),
web\src\server\formReview.test.ts:67:    expect(send.mock.calls[0][1].sessionId).toBe('coach-session-abc');
web\src\server\formApply.ts:11: * 공유). payload의 kind='tester-apply'로 Apps Script가 다른 탭에 분기 적재한다.
web\src\server\formApply.ts:18:export const CHANNELS = ['DM', '필름메이커스', '오픈카톡', '인스타'] as const;
web\src\server\formApply.ts:50:  kind: 'tester-apply';
web\src\server\formApply.ts:95:    kind: 'tester-apply',
web\src\server\formApply.test.ts:18:  channel: '인스타',
web\src\server\formApply.test.ts:38:      kind: 'tester-apply',
web\src\server\formApply.test.ts:46:      channel: '인스타',
web\src\lib\analytics.ts:8: * - `instagram_story`: Web Share API가 `'shared'` 반환 시 (확정)
web\src\lib\analytics.ts:13:export type ResultAction = 'email_report' | 'instagram_story' | 'kakao_share' | 'copy_link';
web\src\lib\analytics.ts:16: * /coach 한 페이지 안의 단계 진행. 페이지뷰만으론 안 보이는 단계별 이탈(drop-off)을
web\src\lib\analytics.ts:21:  | 'video_selected'   // 영상 업로드/녹화 완료
web\src\lib\analytics.ts:24:  | 'upload_done'      // blob 업로드 성공
web\src\lib\analytics.ts:39:// coach funnel은 '도달 여부'가 핵심 — 단계당 1회만 발사해 중복 입력으로 수치가 부풀지 않게.
web\src\lib\analytics.ts:80:function normalizePath(path: string): string | null {
web\src\lib\analytics.ts:98:  const pagePath = normalizePath(path);
web\src\lib\analytics.ts:120: * /coach 단계 진행 추적. `error`를 뺀 단계는 세션 동안 1회만 발사(중복 dedupe).
web\src\lib\analytics.ts:121: * GA4에는 `coach_<step>` 이벤트로 들어가 단계별로 funnel을 잡을 수 있다.
web\src\lib\analytics.ts:128:  window.gtag?.('event', `coach_${step}`);
web\src\components\StoryCaptureCanvas.tsx:2: * StoryCaptureCanvas — 인스타 스토리(9:16) 전용 캡처 캔버스.
web\src\app\unifiedRoutes.test.ts:18:  'coach/page.tsx',
web\src\app\unifiedRoutes.test.ts:21:  'archive/upload/page.tsx',
web\src\app\unifiedRoutes.test.ts:42:  'api/coach/analyze/route.ts',
web\src\app\unifiedRoutes.test.ts:43:  'api/coach/cleanup/route.ts',
web\src\app\unifiedRoutes.test.ts:44:  'api/coach/upload/route.ts',
web\src\app\unifiedRoutes.test.ts:46:  'api/archive/upload/route.ts',
web\src\app\unifiedRoutes.test.ts:82:  'local:coach',
web\src\app\unifiedRoutes.test.ts:101:  'coach/vercel.json',
web\src\app\unifiedRoutes.test.ts:226:    expect(workspace).not.toContain('- "coach"');
web\src\app\unifiedRoutes.test.ts:275:    expect(rootScriptBody).not.toMatch(/--filter\s+(ACTI|thea|comm|arch|excer|coach|acttub-landing)\b/);
web\src\app\unifiedRoutes.test.ts:276:    expect(rootScriptBody).not.toMatch(/--dir\s+(ACTI|thea|comm|arch|excer|coach|acttub-landing)\b/);
web\src\app\unifiedRoutes.test.ts:346:      path: '/api/coach/cleanup',
web\src\app\unifiedRoutes.test.ts:378:    expect(webReadme).toContain('/api/coach/cleanup');
web\src\app\unifiedRoutes.test.ts:394:  it('keeps public coach docs from naming the analysis provider or model', () => {
web\src\app\unifiedRoutes.test.ts:403:      expect(source).not.toMatch(/Gemini (acting|coach|analysis)|GEMINI_MODEL|gemini-3\.5/i);
web\src\app\unifiedRoutes.test.ts:429:    expect(smokePaths).toContain('/archive/upload');
web\src\app\unifiedRoutes.test.ts:446:    expect(smokePaths).toContain('/api/coach/analyze');
web\src\app\unifiedRoutes.test.ts:457:  it('requires coach smoke checks to reject provider and model leaks', () => {
web\src\lib\analytics.test.ts:124:  it('tracks each coach step once as a coach_<step> event', async () => {
web\src\lib\analytics.test.ts:134:    expect(events).toContainEqual(['event', 'coach_video_selected']);
web\src\lib\analytics.test.ts:135:    expect(events).toContainEqual(['event', 'coach_analyze_clicked']);
web\src\lib\analytics.test.ts:136:    expect(events.filter(([, name]) => name === 'coach_video_selected')).toHaveLength(1);
web\src\lib\analytics.test.ts:139:  it('re-fires the coach error step every time', async () => {
web\src\lib\analytics.test.ts:147:    const errors = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'coach_error');
web\src\lib\analytics.test.ts:151:  it('does not track coach steps when the measurement ID is missing', async () => {
web\src\components\StoryCaptureCanvas.css:1:/* 540x960 = 9:16, pixelRatio 2 적용 시 1080x1920 출력 (인스타 스토리 권장 크기). */
web\src\components\ShareSuccessModal.tsx:2: * ShareSuccessModal — 인스타 스토리 공유 후 안내 모달.
web\src\components\ShareSuccessModal.tsx:4: * 인스타는 외부 앱에서 자동으로 Link Sticker를 박지 못해서, 사용자가
web\src\views\RootLandingPage.tsx:137:          <Link className="root-landing__coach-top-link" href="/coach" aria-label="coach - 연기 연습 피드백">
web\src\views\RootLandingPage.tsx:139:            <span>coach</span>
web\src\views\RootLandingPage.tsx:149:          <section className="root-landing__coach-feature" aria-label="coach 바로가기">
web\src\views\RootLandingPage.tsx:150:            <Link className="root-landing__coach-hero-link" href="/coach" aria-label="coach - 연기 연습 피드백">
web\src\views\RootLandingPage.tsx:151:              <span className="root-landing__coach-hero-copy">
web\src\views\RootLandingPage.tsx:152:                <span className="root-landing__coach-hero-kicker">AI COACH</span>
web\src\views\RootLandingPage.tsx:153:                <span className="root-landing__coach-hero-title">연기 연습 피드백</span>
web\src\views\RootLandingPage.tsx:154:                <span className="root-landing__coach-hero-desc">
web\src\views\RootLandingPage.tsx:158:              <span className="root-landing__coach-hero-icon" aria-hidden="true">
web\src\server\vercelImportCompatibility.test.ts:6:  'src/app/api/archive/upload/route.ts',
web\src\server\vercelImportCompatibility.test.ts:9:  'src/app/api/coach/analyze/route.ts',
web\src\server\vercelImportCompatibility.test.ts:10:  'src/app/api/coach/cleanup/route.ts',
web\src\server\vercelImportCompatibility.test.ts:11:  'src/app/api/coach/upload/route.ts',
web\src\server\vercelImportCompatibility.test.ts:15:  'src/coach/evaluation.ts',
web\src\server\vercelImportCompatibility.test.ts:19:  'src/server/coachAnalyze.ts',
web\src\server\vercelImportCompatibility.test.ts:20:  'src/server/coachBlobCleanup.ts',
web\src\views\RootLandingPage.test.tsx:6:  it('links the coach entry points to the coach route', () => {
web\src\views\RootLandingPage.test.tsx:9:    const coachLinks = screen.getAllByRole('link', { name: 'coach - 연기 연습 피드백' });
web\src\views\RootLandingPage.test.tsx:10:    expect(coachLinks).toHaveLength(2);
web\src\views\RootLandingPage.test.tsx:11:    for (const link of coachLinks) {
web\src\views\RootLandingPage.test.tsx:12:      expect(link).toHaveAttribute('href', '/coach');
web\src\server\testCoachAnalyze.ts:1:// /coach-second 분석 핸들러 — v2 전량 정량화 파이프라인.
web\src\server\testCoachAnalyze.ts:3:// /coach(coachAnalyze.ts)는 건드리지 않는다 — 요청 파싱 헬퍼는 격리를 위해 복제.
web\src\server\testCoachAnalyze.ts:11:import { formatTime, type CoachFeedback } from '../coach/evaluation';
web\src\server\testCoachAnalyze.ts:12:import { PRESCRIPTION_LIBRARY, ROOT_DICTIONARY } from '../testcoach/dictionaries';
web\src\server\testCoachAnalyze.ts:13:import { aggregate, assembleCard, mergeToAnchors, pickMajority } from '../testcoach/pipeline';
web\src\server\testCoachAnalyze.ts:28:} from '../testcoach/prompts';
web\src\server\testCoachAnalyze.ts:32:  coachVerdictSchema,
web\src\server\testCoachAnalyze.ts:39:} from '../testcoach/schemas';
web\src\server\testCoachAnalyze.ts:52:} from '../testcoach/types';
web\src\server\testCoachAnalyze.ts:54:import { persistCoachSession, type PersistCoachSessionOptions } from './coachSession';
web\src\server\testCoachAnalyze.ts:113:  const record = value as Partial<File>;
web\src\server\testCoachAnalyze.ts:115:    typeof record.arrayBuffer === 'function'
web\src\server\testCoachAnalyze.ts:116:    && typeof record.size === 'number'
web\src\server\testCoachAnalyze.ts:117:    && typeof record.type === 'string'
web\src\server\testCoachAnalyze.ts:154:    const uploadDir = path.join(tmpdir(), 'acttub-coach-second');
web\src\server\testCoachAnalyze.ts:155:    await mkdir(uploadDir, { recursive: true });
web\src\server\testCoachAnalyze.ts:156:    tempPath = path.join(uploadDir, `${randomUUID()}${fileExtension(input.video)}`);
web\src\server\testCoachAnalyze.ts:160:    let uploadedFile = await ai.files.upload({
web\src\server\testCoachAnalyze.ts:168:    geminiFileName = uploadedFile.name ?? '';
web\src\server\testCoachAnalyze.ts:171:      if (fileStateName(uploadedFile.state) === 'ACTIVE') break;
web\src\server\testCoachAnalyze.ts:172:      if (!uploadedFile.name) throw new Error('업로드 파일 이름을 확인하지 못했습니다.');
web\src\server\testCoachAnalyze.ts:174:      uploadedFile = await ai.files.get({ name: uploadedFile.name }) as GeminiFileState;
web\src\server\testCoachAnalyze.ts:177:    if (fileStateName(uploadedFile.state) !== 'ACTIVE') {
web\src\server\testCoachAnalyze.ts:181:    if (!uploadedFile.uri || !uploadedFile.mimeType) {
web\src\server\testCoachAnalyze.ts:186:    const videoPart = createPartFromUri(uploadedFile.uri, uploadedFile.mimeType);
web\src\server\testCoachAnalyze.ts:335:    const coachSchema = coachVerdictSchema(anchorIds);
web\src\server\testCoachAnalyze.ts:345:          coachSchema,
web\src\components\ShareActionButton.tsx:8:type ShareType = 'image' | 'link' | 'kakao' | 'instagram';
web\src\views\RootLandingPage.css:15:  --root-coach: #6e4cb8;
web\src\views\RootLandingPage.css:16:  --root-coach-soft: #f0e8ff;
web\src\views\RootLandingPage.css:135:.root-landing__coach-top-link {
web\src\views\RootLandingPage.css:143:  color: var(--root-coach);
web\src\views\RootLandingPage.css:144:  background: var(--root-coach-soft);
web\src\views\RootLandingPage.css:154:.root-landing__coach-top-link:hover {
web\src\views\RootLandingPage.css:159:.root-landing__coach-top-link svg {
web\src\views\RootLandingPage.css:184:.root-landing__coach-hero-link {
web\src\views\RootLandingPage.css:197:    var(--root-coach);
web\src\views\RootLandingPage.css:203:.root-landing__coach-hero-link:hover {
web\src\views\RootLandingPage.css:208:.root-landing__coach-hero-copy {
web\src\views\RootLandingPage.css:217:.root-landing__coach-hero-kicker {
web\src\views\RootLandingPage.css:227:.root-landing__coach-hero-title {
web\src\views\RootLandingPage.css:234:.root-landing__coach-hero-desc {
web\src\views\RootLandingPage.css:242:.root-landing__coach-hero-icon {
web\src\views\RootLandingPage.css:257:.root-landing__coach-hero-icon svg {
web\src\views\RootLandingPage.css:610:  .root-landing__coach-hero-link {
web\src\views\RootLandingPage.css:615:  .root-landing__coach-hero-icon {
web\src\views\RootLandingPage.css:620:  .root-landing__coach-hero-icon svg {
web\src\views\RootLandingPage.css:635:  .root-landing__coach-top-link {
web\src\views\RootLandingPage.css:640:  .root-landing__coach-top-link span {
web\src\components\ShareActionButton.css:35:.share--instagram { background: linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%); }
web\src\components\ShareActionButton.css:36:.share--instagram .share__icon,
web\src\components\ShareActionButton.css:37:.share--instagram .share__label { color: #FFFFFF; }
web\src\components\ShareActionButton.css:39:  .share--instagram:hover { filter: brightness(1.05); background: linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%); }
web\src\server\coachSession.ts:3:import type { CoachFeedback } from '../coach/evaluation';
web\src\server\coachSession.ts:8: * coachSession — 코치 분석 세션(영상·연기 의도·AI 피드백)을 한 행으로 보관한다.
web\src\server\coachSession.ts:11: * 영상은 cleanup 크론(coach/ prefix, 24h)이 지우는 임시 업로드본을, 크론이 건드리지 않는
web\src\server\coachSession.ts:12: * coach-sessions/ prefix 로 복사해 보관한다(분석 성공분만 남긴다). 저장 실패 시 복사본은 회수.
web\src\server\coachSession.ts:15:// cleanupOldCoachBlobs 는 'coach/' prefix 만 청소한다 — 보관본은 'coach-sessions/' 로 분리한다.
web\src\server\coachSession.ts:16:const RETAINED_PREFIX = 'coach-sessions/';
web\src\server\coachSession.ts:21:  /** v2(coach-second) 전 단계 분석 기록. v1 은 생략. */
web\src\server\coachSession.ts:87:    console.warn('coach session persist skipped', {
web\src\views\ResultPage.tsx:80:      trackResultAction('instagram_story', type.code);
web\src\views\ResultPage.tsx:173:                type="instagram"
web\src\server\storage.ts:20:import type { CoachFeedback } from '../coach/evaluation';
web\src\server\storage.ts:70:export type CoachSessionPipeline = 'coach' | 'coach-second' | 'test';
web\src\server\storage.ts:84:  /** v2(coach-second) 전 단계 분석 기록. v1 은 null. */
web\src\server\storage.ts:161:  const coachSessions: CoachSession[] = [];
web\src\server\storage.ts:263:        id: nextId('coach-session'),
web\src\server\storage.ts:278:      coachSessions.unshift(session);
web\src\server\coachSession.test.ts:3:import { persistCoachSession } from './coachSession';
web\src\server\coachSession.test.ts:5:import type { CoachFeedback } from '../coach/evaluation';
web\src\server\coachSession.test.ts:16:    pipeline: 'coach-second' as const,
web\src\server\coachSession.test.ts:35:    const createCoachSession = vi.fn(async (input) => ({ id: 'coach-session-1', ...input } as unknown as CoachSession));
web\src\server\coachSession.test.ts:37:      url: 'https://store.public.blob.vercel-storage.com/coach-sessions/abc.webm',
web\src\server\coachSession.test.ts:38:      pathname: 'coach-sessions/abc.webm',
web\src\server\coachSession.test.ts:44:      baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
web\src\server\coachSession.test.ts:48:    expect(id).toBe('coach-session-1');
web\src\server\coachSession.test.ts:51:    expect(fromUrl).toBe('https://store.public.blob.vercel-storage.com/coach/123-scene.webm');
web\src\server\coachSession.test.ts:52:    expect(toPathname).toMatch(/^coach-sessions\/.+\.webm$/);
web\src\server\coachSession.test.ts:56:        pipeline: 'coach-second',
web\src\server\coachSession.test.ts:57:        blobUrl: 'https://store.public.blob.vercel-storage.com/coach-sessions/abc.webm',
web\src\server\coachSession.test.ts:58:        blobPathname: 'coach-sessions/abc.webm',
web\src\server\coachSession.test.ts:65:    const createCoachSession = vi.fn(async (input) => ({ id: 'coach-session-2', ...input } as unknown as CoachSession));
web\src\server\coachSession.test.ts:70:    expect(id).toBe('coach-session-2');
web\src\server\coachSession.test.ts:79:      url: 'https://store.public.blob.vercel-storage.com/coach-sessions/orphan.webm',
web\src\server\coachSession.test.ts:80:      pathname: 'coach-sessions/orphan.webm',
web\src\server\coachSession.test.ts:88:        baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
web\src\server\coachSession.test.ts:93:      expect(deleteBlob).toHaveBeenCalledWith('https://store.public.blob.vercel-storage.com/coach-sessions/orphan.webm');
web\src\server\coachSession.test.ts:107:        baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
web\src\server\storage.test.ts:52:  it('deduplicates tags and keeps upload metadata separate from display data', () => {
web\src\server\storage.test.ts:58:      blobUrl: 'https://blob.vercel-storage.com/archive/upload.mp4',
web\src\server\storage.test.ts:59:      blobPathname: 'archive/upload.mp4',
web\src\server\storage.test.ts:70:      blobUrl: 'https://blob.vercel-storage.com/archive/upload.mp4',
web\src\server\storage.test.ts:71:      blobPathname: 'archive/upload.mp4',
web\src\server\coachSecondAnalyze.ts:1:// /coach-second 분석 핸들러 — v2 전량 정량화 파이프라인.
web\src\server\coachSecondAnalyze.ts:3:// /coach(coachAnalyze.ts)는 건드리지 않는다 — 요청 파싱 헬퍼는 격리를 위해 복제.
web\src\server\coachSecondAnalyze.ts:11:import { formatTime, type CoachFeedback } from '../coach/evaluation';
web\src\server\coachSecondAnalyze.ts:12:import { PRESCRIPTION_LIBRARY, ROOT_DICTIONARY } from '../coach2/dictionaries';
web\src\server\coachSecondAnalyze.ts:13:import { aggregate, assembleCard, mergeToAnchors, pickMajority } from '../coach2/pipeline';
web\src\server\coachSecondAnalyze.ts:28:} from '../coach2/prompts';
web\src\server\coachSecondAnalyze.ts:32:  coachVerdictSchema,
web\src\server\coachSecondAnalyze.ts:39:} from '../coach2/schemas';
web\src\server\coachSecondAnalyze.ts:52:} from '../coach2/types';
web\src\server\coachSecondAnalyze.ts:54:import { persistCoachSession, type PersistCoachSessionOptions } from './coachSession';
web\src\server\coachSecondAnalyze.ts:109:  const record = value as Partial<File>;
web\src\server\coachSecondAnalyze.ts:111:    typeof record.arrayBuffer === 'function'
web\src\server\coachSecondAnalyze.ts:112:    && typeof record.size === 'number'
web\src\server\coachSecondAnalyze.ts:113:    && typeof record.type === 'string'
web\src\server\coachSecondAnalyze.ts:147:// 로컬(next dev)에서만 13콜 input/output 을 web/.coach-trace/ 에 파일로 떨군다. 프로덕션 빌드에선 미동작.
web\src\server\coachSecondAnalyze.ts:150:  const dir = path.join(process.cwd(), '.coach-trace');
web\src\server\coachSecondAnalyze.ts:152:  const file = path.join(dir, `coach2-${randomUUID().slice(0, 8)}.json`);
web\src\server\coachSecondAnalyze.ts:154:  console.info(`[coach2] ${calls.length} gemini calls → ${file}`);
web\src\server\coachSecondAnalyze.ts:164:    const uploadDir = path.join(tmpdir(), 'acttub-coach-second');
web\src\server\coachSecondAnalyze.ts:165:    await mkdir(uploadDir, { recursive: true });
web\src\server\coachSecondAnalyze.ts:166:    tempPath = path.join(uploadDir, `${randomUUID()}${fileExtension(input.video)}`);
web\src\server\coachSecondAnalyze.ts:170:    let uploadedFile = await ai.files.upload({
web\src\server\coachSecondAnalyze.ts:178:    geminiFileName = uploadedFile.name ?? '';
web\src\server\coachSecondAnalyze.ts:181:      if (fileStateName(uploadedFile.state) === 'ACTIVE') break;
web\src\server\coachSecondAnalyze.ts:182:      if (!uploadedFile.name) throw new Error('업로드 파일 이름을 확인하지 못했습니다.');
web\src\server\coachSecondAnalyze.ts:184:      uploadedFile = await ai.files.get({ name: uploadedFile.name }) as GeminiFileState;
web\src\server\coachSecondAnalyze.ts:187:    if (fileStateName(uploadedFile.state) !== 'ACTIVE') {
web\src\server\coachSecondAnalyze.ts:191:    if (!uploadedFile.uri || !uploadedFile.mimeType) {
web\src\server\coachSecondAnalyze.ts:196:    const videoPart = createPartFromUri(uploadedFile.uri, uploadedFile.mimeType);
web\src\server\coachSecondAnalyze.ts:358:    const coachSchema = coachVerdictSchema(anchorIds);
web\src\server\coachSecondAnalyze.ts:369:          coachSchema,
web\src\server\coachSecondAnalyze.ts:569:          pipeline: 'coach-second',
web\src\server\coachSecondAnalyze.ts:629:      pipeline: 'coach-second',
web\src\server\coachSecondAnalyze.test.ts:3:import { handleCoachSecondAnalyze } from './coachSecondAnalyze';
web\src\server\coachSecondAnalyze.test.ts:5:import type { CoachFeedback } from '../coach/evaluation';
web\src\server\coachSecondAnalyze.test.ts:21:  return new Request('http://localhost/api/coach-second/analyze', {
web\src\server\coachSecondAnalyze.test.ts:25:      videoUrl: 'https://blob.vercel-storage.com/coach/scene.webm',
web\src\server\coachSecondAnalyze.test.ts:36:describe('coach-second analysis API', () => {
web\src\server\coachSecondAnalyze.test.ts:44:    const createCoachSession = vi.fn(async (input) => ({ id: 'coach-session-v2', ...input } as unknown as CoachSession));
web\src\server\coachSecondAnalyze.test.ts:46:      url: 'https://store.public.blob.vercel-storage.com/coach-sessions/kept.webm',
web\src\server\coachSecondAnalyze.test.ts:47:      pathname: 'coach-sessions/kept.webm',
web\src\server\coachSecondAnalyze.test.ts:64:    expect(body.sessionId).toBe('coach-session-v2');
web\src\server\coachSecondAnalyze.test.ts:67:      expect.objectContaining({ pipeline: 'coach-second', trace: { promptVersion: 'v2', failures: [] } }),
web\src\views\QuickTestPage.tsx:4:import { upload as uploadBlob } from '@vercel/blob/client';
web\src\views\QuickTestPage.tsx:17:import { formatTime, type CoachFeedback } from '../coach/evaluation';
web\src\views\QuickTestPage.tsx:18:import { FocusBlock, NextStepBlock, OverallBlock, StrengthBlock } from './coachFeedbackCards';
web\src\views\QuickTestPage.tsx:20:type InputMode = 'upload' | 'record';
web\src\views\QuickTestPage.tsx:23:// 분석 엔진은 /coach 메인과 동일(아래 ANALYZE_URL = v2). 대사·의도만 시스템이 미리 박아 호출한다.
web\src\views\QuickTestPage.tsx:47:// /test 전용 분석 파이프라인(testcoach) — /coach와 분리해 복사한 독립 엔진.
web\src\views\QuickTestPage.tsx:48:// 대사·상황 주입, 대사 안 함 판정 등 /test 고유 동작을 /coach 영향 없이 넣기 위함.
web\src\views\QuickTestPage.tsx:56:  const [mode, setMode] = useState<InputMode>('record');
web\src\views\QuickTestPage.tsx:69:  const [recordingSeconds, setRecordingSeconds] = useState(0);
web\src\views\QuickTestPage.tsx:72:  const recorderRef = useRef<MediaRecorder | null>(null);
web\src\views\QuickTestPage.tsx:76:  const recordStartRef = useRef(0);
web\src\views\QuickTestPage.tsx:101:  // 녹화 중 라이브 프리뷰 — isRecording이 켜져 video가 렌더된 뒤 카메라 stream을 연결한다.
web\src\views\QuickTestPage.tsx:102:  // (없으면 녹화는 돼도 화면에 카메라가 안 보여 "안 켜진" 것처럼 느껴진다.)
web\src\views\QuickTestPage.tsx:144:    // 녹화 webm은 duration이 ∞/0으로 잡히는 브라우저 이슈 — 그 경우 녹화 때 채운 길이를 유지한다.
web\src\views\QuickTestPage.tsx:159:        setError('이 브라우저에서는 직접 녹화를 지원하지 않습니다. 영상 업로드를 사용해 주세요.');
web\src\views\QuickTestPage.tsx:167:      const recorder = new MediaRecorder(stream, { mimeType });
web\src\views\QuickTestPage.tsx:170:      recorderRef.current = recorder;
web\src\views\QuickTestPage.tsx:172:      recorder.ondataavailable = (event) => {
web\src\views\QuickTestPage.tsx:176:      recorder.onstop = () => {
web\src\views\QuickTestPage.tsx:177:        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
web\src\views\QuickTestPage.tsx:178:        // 업로드 허용 목록은 'video/webm'만 — 녹화 mimeType의 ;codecs=… 꼬리를 떼어 정규화한다.
web\src\views\QuickTestPage.tsx:179:        const uploadType = (recorder.mimeType || 'video/webm').split(';')[0] || 'video/webm';
web\src\views\QuickTestPage.tsx:180:        const file = new File([blob], `quick-test-${Date.now()}.webm`, { type: uploadType });
web\src\views\QuickTestPage.tsx:181:        // 녹화 webm은 duration이 ∞/0으로 잡히는 브라우저 이슈 — 녹화 경과 시간을 길이로 직접 채운다.
web\src\views\QuickTestPage.tsx:182:        const recordedSeconds = Math.max(1, Math.round((Date.now() - recordStartRef.current) / 1000));
web\src\views\QuickTestPage.tsx:184:        setDuration(recordedSeconds);
web\src\views\QuickTestPage.tsx:189:      setMode('record');
web\src\views\QuickTestPage.tsx:191:      recordStartRef.current = Date.now();
web\src\views\QuickTestPage.tsx:192:      recorder.start();
web\src\views\QuickTestPage.tsx:203:    recorderRef.current?.stop();
web\src\views\QuickTestPage.tsx:208:    if (!videoFile) return '대사를 연기한 영상을 녹화하거나 업로드해 주세요.';
web\src\views\QuickTestPage.tsx:233:      const blob = await uploadBlob(`coach/${Date.now()}-${videoFile.name}`, videoFile, {
web\src\views\QuickTestPage.tsx:235:        handleUploadUrl: '/api/coach/upload',
web\src\views\QuickTestPage.tsx:286:      className="coach-page mx-auto flex min-h-screen w-full flex-col gap-5 px-4 py-5 sm:px-6"
web\src\views\QuickTestPage.tsx:289:      {/* 폭 제한은 인라인 — coach-page frozen 유틸 set에 max-w-xl/md가 없어 클래스로는 안 먹는다. */}
web\src\views\QuickTestPage.tsx:334:                onClick={() => setMode('record')}
web\src\views\QuickTestPage.tsx:336:                  mode === 'record' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
web\src\views\QuickTestPage.tsx:340:                녹화
web\src\views\QuickTestPage.tsx:344:                onClick={() => setMode('upload')}
web\src\views\QuickTestPage.tsx:346:                  mode === 'upload' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
web\src\views\QuickTestPage.tsx:356:            {mode === 'upload' ? (
web\src\views\QuickTestPage.tsx:383:                      ? `녹화 중 ${formatTime(recordingSeconds)}`
web\src\views\QuickTestPage.tsx:384:                      : '브라우저 녹화'}
web\src\server\lineshotScore.ts:20:// ~10초 음성이라 작다. coach처럼 files.upload + ACTIVE 폴링하지 않고 inline base64 1콜로 끝낸다(심플·빠름).
web\src\server\lineshotScore.ts:37:  const record = value as Partial<File>;
web\src\server\lineshotScore.ts:39:    typeof record.arrayBuffer === 'function'
web\src\server\lineshotScore.ts:40:    && typeof record.size === 'number'
web\src\server\lineshotScore.ts:41:    && typeof record.type === 'string'
web\src\server\schema.ts:12:import type { CoachFeedback } from '../coach/evaluation';
web\src\server\schema.ts:77:export const coachSessionsTable = pgTable('coach_sessions', {
web\src\server\schema.ts:80:  pipeline: text('pipeline').notNull(), // 'coach'(v1) | 'coach-second'(v2)
web\src\server\schema.ts:87:  // 분석 후 cleanup 크론이 지우는 coach/ 임시본이 아니라, coach-sessions/ 로 복사한 보관본 URL.
web\src\server\schema.ts:92:  trace: jsonb('trace'), // v2(coach-second) 전 단계 분석 기록 — v1 은 null
web\src\server\schema.ts:99:export type CoachSessionRow = typeof coachSessionsTable.$inferSelect;
web\src\server\schema.ts:105:export type NewCoachSessionRow = typeof coachSessionsTable.$inferInsert;
web\src\views\PlayPage.tsx:222:            <PrimaryButton as="a" href="/coach">
web\src\server\postgresStorage.ts:9:  coachSessionsTable,
web\src\server\postgresStorage.ts:30:  coachSessionsTable,
web\src\server\postgresStorage.ts:127:export function coachSessionRowToDomain(row: CoachSessionRow): CoachSession {
web\src\server\postgresStorage.ts:308:        .insert(coachSessionsTable)
web\src\server\postgresStorage.ts:310:          id: nextId('coach-session'),
web\src\server\postgresStorage.ts:326:      return coachSessionRowToDomain(row);
web\src\views\CoachPage.css:3:.coach-page {
web\src\views\CoachPage.css:63:.coach-page,
web\src\views\CoachPage.css:64:.coach-page *,
web\src\views\CoachPage.css:65:.coach-page::before,
web\src\views\CoachPage.css:66:.coach-page::after {
web\src\views\CoachPage.css:71:.coach-page * {
web\src\views\CoachPage.css:75:.coach-page a {
web\src\views\CoachPage.css:80:.coach-page ul {
web\src\views\CoachPage.css:85:.coach-page button,
web\src\views\CoachPage.css:86:.coach-page input,
web\src\views\CoachPage.css:87:.coach-page select,
web\src\views\CoachPage.css:88:.coach-page textarea {
web\src\views\CoachPage.css:94:.coach-page svg,
web\src\views\CoachPage.css:95:.coach-page video {
web\src\views\CoachPage.css:126:.animate-spin{animation:coach-spin 1s linear infinite}
web\src\views\CoachPage.css:245:@keyframes coach-spin {
web\src\views\ArchivePage.css:440:.archive-upload-form {
web\src\views\ArchivePage.css:445:.archive-upload-form > div {
web\src\views\ArchivePage.css:450:.archive-upload-form label,
web\src\views\ArchivePage.css:451:.archive-upload-form legend {
web\src\views\ArchivePage.css:457:.archive-upload-form input:not([type="radio"]),
web\src\views\ArchivePage.css:458:.archive-upload-form textarea {
web\src\views\ArchivePage.css:468:.archive-upload-form input:not([type="radio"]) {
web\src\views\ArchivePage.css:473:.archive-upload-form input[type="file"] {
web\src\views\ArchivePage.css:477:.archive-upload-form textarea {
web\src\views\ArchivePage.css:482:.archive-upload-form input:focus,
web\src\views\ArchivePage.css:483:.archive-upload-form textarea:focus {
web\src\views\ArchivePage.css:487:.archive-upload-form p {
web\src\views\ArchivePage.css:493:.archive-upload-form fieldset {
web\src\views\coachFeedbackCards.tsx:7:} from '../coach/evaluation';
web\src\views\coachFeedbackCards.tsx:12:// /coach 와 /test(빠른 테스트)가 같은 결과 카드를 공유한다.
web\src\app\test\page.tsx:8:// acttub.com/test — coach 진입 장벽(대본·의도 준비)을 없앤 체험판.
web\src\app\test\page.tsx:9:// 정해진 대사·의도를 시스템이 주입하고 분석은 /coach 메인과 동일한 v2 파이프라인을 재사용한다.
web\src\views\CoachPage.tsx:4:import { upload as uploadBlob } from '@vercel/blob/client';
web\src\views\CoachPage.tsx:20:} from '../coach/evaluation';
web\src\views\CoachPage.tsx:21:import { FocusBlock, NextStepBlock, OverallBlock, StrengthBlock } from './coachFeedbackCards';
web\src\views\CoachPage.tsx:24:type InputMode = 'upload' | 'record';
web\src\views\CoachPage.tsx:37:  // /coach-second(v2 파이프라인)가 같은 화면을 다른 분석 API로 재사용한다. 기본값 = 기존 /coach 그대로.
web\src\views\CoachPage.tsx:42:export default function CoachPage({ analyzeUrl = '/api/coach/analyze', badge = 'coach' }: CoachPageProps = {}) {
web\src\views\CoachPage.tsx:43:  const [mode, setMode] = useState<InputMode>('upload');
web\src\views\CoachPage.tsx:60:  const [recordingSeconds, setRecordingSeconds] = useState(0);
web\src\views\CoachPage.tsx:63:  const recorderRef = useRef<MediaRecorder | null>(null);
web\src\views\CoachPage.tsx:67:  const recordStartRef = useRef(0);
web\src\views\CoachPage.tsx:114:    // 녹화 webm은 duration이 ∞/0으로 잡히는 브라우저 이슈 — 그 경우 녹화 때 채운 길이를 유지한다.
web\src\views\CoachPage.tsx:132:        setError('이 브라우저에서는 직접 녹화를 지원하지 않습니다. 영상 업로드를 사용해 주세요.');
web\src\views\CoachPage.tsx:140:      const recorder = new MediaRecorder(stream, { mimeType });
web\src\views\CoachPage.tsx:143:      recorderRef.current = recorder;
web\src\views\CoachPage.tsx:145:      recorder.ondataavailable = (event) => {
web\src\views\CoachPage.tsx:149:      recorder.onstop = () => {
web\src\views\CoachPage.tsx:150:        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
web\src\views\CoachPage.tsx:151:        // 업로드 허용 목록은 'video/webm'만 — 녹화 mimeType의 ;codecs=… 꼬리를 떼어 정규화한다.
web\src\views\CoachPage.tsx:152:        const uploadType = (recorder.mimeType || 'video/webm').split(';')[0] || 'video/webm';
web\src\views\CoachPage.tsx:153:        const file = new File([blob], `coach-recording-${Date.now()}.webm`, { type: uploadType });
web\src\views\CoachPage.tsx:154:        // 녹화 webm은 duration이 ∞/0으로 잡히는 브라우저 이슈 — 녹화 경과 시간을 길이로 직접 채운다.
web\src\views\CoachPage.tsx:155:        const recordedSeconds = Math.max(1, Math.round((Date.now() - recordStartRef.current) / 1000));
web\src\views\CoachPage.tsx:157:        setDuration(recordedSeconds);
web\src\views\CoachPage.tsx:158:        setEndTime(recordedSeconds);
web\src\views\CoachPage.tsx:163:      setMode('record');
web\src\views\CoachPage.tsx:165:      recordStartRef.current = Date.now();
web\src\views\CoachPage.tsx:166:      recorder.start();
web\src\views\CoachPage.tsx:169:      setError('카메라와 마이크 권한을 허용해야 직접 녹화할 수 있습니다.');
web\src\views\CoachPage.tsx:176:    recorderRef.current?.stop();
web\src\views\CoachPage.tsx:181:    if (!videoFile) return '분석할 영상을 업로드하거나 녹화해 주세요.';
web\src\views\CoachPage.tsx:208:      const blob = await uploadBlob(`coach/${Date.now()}-${videoFile.name}`, videoFile, {
web\src\views\CoachPage.tsx:210:        handleUploadUrl: '/api/coach/upload',
web\src\views\CoachPage.tsx:214:      trackCoachStep('upload_done');
web\src\views\CoachPage.tsx:249:    <div className="coach-page mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:px-8 lg:py-8">
web\src\views\CoachPage.tsx:269:                onClick={() => setMode('upload')}
web\src\views\CoachPage.tsx:271:                  mode === 'upload' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
web\src\views\CoachPage.tsx:279:                onClick={() => setMode('record')}
web\src\views\CoachPage.tsx:281:                  mode === 'record' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
web\src\views\CoachPage.tsx:285:                녹화
web\src\views\CoachPage.tsx:291:            {mode === 'upload' ? (
web\src\views\CoachPage.tsx:318:                      ? `녹화 중 ${formatTime(recordingSeconds)}`
web\src\views\CoachPage.tsx:319:                      : '브라우저 녹화'}
web\src\views\ArchivePage.tsx:6:import { upload } from '@vercel/blob/client';
web\src\views\ArchivePage.tsx:26:import { shouldUseArchiveMultipartUpload } from '../archive/uploadPolicy';
web\src\views\ArchivePage.tsx:39:type ArchiveView = 'home' | 'search' | 'upload' | 'me' | 'video';
web\src\views\ArchivePage.tsx:49:  else if (view === 'upload') content = <ArchiveUpload />;
web\src\views\ArchivePage.tsx:97:          <Link href="/archive/upload" className="archive-button archive-button--primary archive-button--sm">
web\src\views\ArchivePage.tsx:301:        ? await upload(`archive/${Date.now()}-${selectedFile.name}`, selectedFile, {
web\src\views\ArchivePage.tsx:303:            handleUploadUrl: '/api/archive/upload',
web\src\views\ArchivePage.tsx:335:    <form className="archive-upload-form" onSubmit={submit}>
web\src\views\ArchivePage.tsx:428:      <Link href="/archive/upload" className="archive-button archive-button--primary archive-button--lg">
web\src\views\LineshotPage.tsx:69:  const [recording, setRecording] = useState(false);
web\src\views\LineshotPage.tsx:75:  const recorderRef = useRef<MediaRecorder | null>(null);
web\src\views\LineshotPage.tsx:90:    const recorder = recorderRef.current;
web\src\views\LineshotPage.tsx:91:    if (recorder && recorder.state !== 'inactive') recorder.stop();
web\src\views\LineshotPage.tsx:104:      const recorder = new MediaRecorder(stream);
web\src\views\LineshotPage.tsx:106:      recorder.ondataavailable = (event) => {
web\src\views\LineshotPage.tsx:109:      recorder.onstop = () => {
web\src\views\LineshotPage.tsx:110:        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
web\src\views\LineshotPage.tsx:119:      recorder.start();
web\src\views\LineshotPage.tsx:120:      recorderRef.current = recorder;
web\src\views\LineshotPage.tsx:201:                disabled={recording}
web\src\views\LineshotPage.tsx:204:            <button type="button" className="lineshot__shuffle" onClick={pickRandomLine} disabled={recording}>
web\src\views\LineshotPage.tsx:209:            <div className="lineshot__recorder">
web\src\views\LineshotPage.tsx:210:              {!recording ? (
web\src\views\LineshotPage.tsx:222:                {recording
web\src\views\LineshotPage.tsx:232:            <PrimaryButton onClick={scoreLine} disabled={loading || recording || !hasRecording} size="xl">
web\src\views\LineshotPage.tsx:286:            <Link href="/coach" className="lineshot__bridge">
web\src\views\ArchivePage.test.tsx:31:    expect(screen.getByRole('link', { name: /업로드/ })).toHaveAttribute('href', '/archive/upload');
web\src\views\LineshotPage.css:99:.lineshot__recorder {
web\src\views\FormPage.tsx:25:const CHANNELS = ['DM', '필름메이커스', '오픈카톡', '인스타'] as const;
web\src\views\FormReviewPage.tsx:12: * 제출 시 /api/form/review 로 POST → 구글시트 적재(kind='tester-review').
web\src\views\FormReviewPage.tsx:95:    // /coach 에서 ?s=<코치 세션 id> 로 넘어옴. 마운트 시점(lazy init)엔 soft navigation 직후라
web\src\testcoach\dictionaries.ts:6:import type { FeedbackAxis, OverallAxisKey, OverallBand } from '../coach/evaluation';
web\src\testcoach\dictionaries.ts:279:    const record = cursor as Record<string, unknown>;
web\src\testcoach\dictionaries.ts:280:    if ('part' in record && 'change' in record) return changePhrase(String(record.part), String(record.change));
web\src\app\coach\page.tsx:4:  title: 'acttub coach',
web\src\app\coach\page.tsx:5:  description: '연기 영상을 기준으로 연습 피드백을 받는 acttub coach',
web\src\app\coach\page.tsx:8:// acttub.com/coach 메인을 v2 파이프라인으로 전환(2026-06-13) — 화면 동일, 분석 API만 v2.
web\src\app\coach\page.tsx:9:// 롤백: analyzeUrl prop 제거 시 v1(/api/coach/analyze)로 복귀.
web\src\app\coach\page.tsx:11:  return <CoachPage analyzeUrl="/api/coach-second/analyze" />;
web\src\testcoach\prompts.ts:1:// coach-second(v2) 프롬프트 — 정본: Confluence "coach v2 프롬프트 명세"(17334281, v2.0-draft.7).
web\src\testcoach\prompts.ts:5:// /test 전용(testcoach) — coach-second 복사본에서 대사 게이트·상황 프롬프트로 분기.
web\src\testcoach\types.ts:1:// coach-second(v2) 파이프라인 타입 — 전량 정량화: LLM 출력은 enum·척도·id·인용·필드 경로뿐.
web\src\testcoach\types.ts:2:// 설계 정본: Confluence "coach AI 파이프라인 v2"(18153475) · 프롬프트 정본: 17334281 (v2.0-draft.7)
web\src\testcoach\types.ts:121:  coachGap: number;
web\src\testcoach\schemas.ts:93:export function coachVerdictSchema(anchorIds: string[]): Schema {
web\src\testcoach\pipeline.ts:1:// coach-second(v2) 결정적 코드 단계 — 병합·다수결·집계·카드 조립.
web\src\testcoach\pipeline.ts:3:import type { CoachFeedback, FeedbackAxis, FeedbackAxisBand, OverallBand } from '../coach/evaluation';
web\src\testcoach\pipeline.ts:169:  const coachByAnchor = new Map<string, CoachVerdict[]>();
web\src\testcoach\pipeline.ts:172:      const list = coachByAnchor.get(verdict.anchorId) ?? [];
web\src\testcoach\pipeline.ts:174:      coachByAnchor.set(verdict.anchorId, list);
web\src\testcoach\pipeline.ts:179:    const coachVerdicts = (coachByAnchor.get(anchor.anchorId) ?? []).filter((verdict) => verdict.relevant);
web\src\testcoach\pipeline.ts:180:    const gaps = coachVerdicts.map((verdict) => GAP_VALUE[verdict.gap_bucket]);
web\src\testcoach\pipeline.ts:181:    const coachGap = gaps.length > 0 ? Math.max(...gaps) : 0;
web\src\testcoach\pipeline.ts:184:    const alignedCount = coachVerdicts.filter((verdict) => verdict.aligned).length;
web\src\testcoach\pipeline.ts:188:      coachGap,
web\src\testcoach\pipeline.ts:191:      priority: coachGap * 2 + agreeCount + audienceGap,
web\src\app\api\test\analyze\route.ts:4:// /test 전용 분석 파이프라인(testcoach) — /coach(coach-second)와 분리된 독립 엔진.
web\src\app\coach-second\page.tsx:4:  title: 'acttub coach 2',
web\src\app\coach-second\page.tsx:5:  description: '요소 분해 v2 파이프라인으로 연습 피드백을 받는 acttub coach 2',
web\src\app\coach-second\page.tsx:8:// v2 전량 정량화 파이프라인(coach-second). 화면은 /coach와 동일, 분석 API만 다르다.
web\src\app\coach-second\page.tsx:10:  return <CoachPage analyzeUrl="/api/coach-second/analyze" badge="coach 2" />;
web\src\app\archive\upload\page.tsx:9:  return <ArchivePage view="upload" />;
web\src\app\api\coach-second\analyze\route.ts:1:import { handleCoachSecondAnalyze } from '@/server/coachSecondAnalyze';
web\src\app\api\coach\analyze\route.ts:1:import { handleCoachAnalyze } from '@/server/coachAnalyze';
web\src\app\api\coach\cleanup\route.ts:1:import { handleCoachBlobCleanup } from '@/server/coachBlobCleanup';

codex
analytics.ts 기준으로는 page_view가 query를 버리기 때문에 UTM 소실 사실은 맞습니다. 다음은 `/tester` 실제 라우트/신청 저장 경로와 allowlist를 어디에 붙일 수 있는지 확인합니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg -n \"href=\\\"/(tester|waitlist|form)|'/tester|'/waitlist|'/form|\\\"/tester|\\\"/waitlist|\\\"/form|FormPage|tester-apply|kind: 'tester-apply'|email|utm\" web\\src\\app web\\src\\views web\\src\\server web\\src\\lib web\\src\\components" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-ChildItem -Recurse -Directory web\\src\\app | Select-Object -ExpandProperty FullName" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Raw web\\src\\lib\\analytics.test.ts" in C:\soma\repos\acttub
 succeeded in 489ms:
import { beforeEach, describe, expect, it, vi } from 'vitest';

async function loadAnalytics() {
  vi.resetModules();
  return import('./analytics');
}

function dataLayerEntries() {
  return (window.dataLayer ?? []).map((entry) => Array.from(entry));
}

function expectDataLayerToContain(expected: unknown[]) {
  expect(dataLayerEntries()).toContainEqual(expected);
}

describe('analytics', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    document.head.innerHTML = '';
    delete window.dataLayer;
    delete window.gtag;
    vi.resetModules();
  });

  it('does not load Google Analytics when the measurement ID is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('/ACTI/quiz');

    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')).toHaveLength(0);
    expect(window.gtag).toBeUndefined();
  });

  it('loads the Google tag once and disables automatic page_view', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics } = await loadAnalytics();

    initAnalytics();
    initAnalytics();

    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]')).toHaveLength(1);
    expectDataLayerToContain(['js', expect.any(Date)]);
    expectDataLayerToContain(['config', 'G-TEST123', { send_page_view: false }]);
  });

  it('queues native gtag arguments objects for the Google tag runtime', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics } = await loadAnalytics();

    initAnalytics();

    expect(Array.isArray(window.dataLayer?.[0])).toBe(false);
    expect(Array.from(window.dataLayer?.[0] ?? [])).toEqual(['js', expect.any(Date)]);
  });

  it('tracks explicit client page views', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('/ACTI/result/MINB');

    expectDataLayerToContain([
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/ACTI/result/MINB',
        page_location: 'http://localhost:4000/ACTI/result/MINB',
      }),
    ]);
  });

  it('strips query strings and hashes from page views', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('/ACTI/result/MINB?email=user@example.com#private');

    expectDataLayerToContain([
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/ACTI/result/MINB',
        page_location: 'http://localhost:4000/ACTI/result/MINB',
      }),
    ]);
  });

  it('tracks result action requests without personal data', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackResultAction } = await loadAnalytics();

    initAnalytics();
    trackResultAction('email_report', 'MINB');

    expectDataLayerToContain([
      'event',
      'result_action_request',
      {
        action: 'email_report',
        result_code: 'MINB',
      },
    ]);
    expect(JSON.stringify(window.dataLayer)).not.toContain('@');
  });

  it('lazy-initializes when trackPageView is called before initAnalytics', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { trackPageView } = await loadAnalytics();

    trackPageView('/ACTI/quiz');

    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]')).toHaveLength(1);
    expectDataLayerToContain([
      'event',
      'page_view',
      expect.objectContaining({ page_path: '/ACTI/quiz' }),
    ]);
  });

  it('tracks each coach step once as a coach_<step> event', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackCoachStep } = await loadAnalytics();

    initAnalytics();
    trackCoachStep('video_selected');
    trackCoachStep('video_selected');
    trackCoachStep('analyze_clicked');

    const events = dataLayerEntries().filter(([cmd]) => cmd === 'event');
    expect(events).toContainEqual(['event', 'coach_video_selected']);
    expect(events).toContainEqual(['event', 'coach_analyze_clicked']);
    expect(events.filter(([, name]) => name === 'coach_video_selected')).toHaveLength(1);
  });

  it('re-fires the coach error step every time', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackCoachStep } = await loadAnalytics();

    initAnalytics();
    trackCoachStep('error');
    trackCoachStep('error');

    const errors = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'coach_error');
    expect(errors).toHaveLength(2);
  });

  it('does not track coach steps when the measurement ID is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
    const { trackCoachStep } = await loadAnalytics();

    trackCoachStep('result_shown');

    expect(window.gtag).toBeUndefined();
    expect(window.dataLayer ?? []).toHaveLength(0);
  });

  it('lazy-initializes when trackResultAction is called before initAnalytics', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { trackResultAction } = await loadAnalytics();

    trackResultAction('copy_link', 'MINB');

    expect(window.gtag).toBeDefined();
    expectDataLayerToContain([
      'event',
      'result_action_request',
      { action: 'copy_link', result_code: 'MINB' },
    ]);
  });

  it('normalizes paths without a leading slash', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('ACTI/quiz');

    expectDataLayerToContain([
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/ACTI/quiz',
        page_location: 'http://localhost:4000/ACTI/quiz',
      }),
    ]);
  });

  it('rejects protocol-relative paths that would resolve to a foreign origin', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('//evil.com/leak');

    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');
    expect(pageViews).toHaveLength(0);
  });

  it('rejects absolute URLs that point to a foreign origin', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('http://evil.com/leak');
    trackPageView('https://evil.com/leak');

    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');
    expect(pageViews).toHaveLength(0);
  });

  it('dedupes consecutive page views for the same path', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('/ACTI/quiz');
    trackPageView('/ACTI/quiz');
    trackPageView('/ACTI/result/MINB');
    trackPageView('/ACTI/result/MINB');

    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');
    expect(pageViews).toHaveLength(2);
    expect(pageViews[0][2]).toMatchObject({ page_path: '/ACTI/quiz' });
    expect(pageViews[1][2]).toMatchObject({ page_path: '/ACTI/result/MINB' });
  });
});


2026-07-03T08:48:11.991381Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
At line:2 char:50
+ rg -n "href=\"/(tester|waitlist|form)|'/tester|'/waitlist|'/form|\"/t ...
+                                                  ~
You must provide a value expression following the '/' operator.
At line:2 char:39
+ rg -n "href=\"/(tester|waitlist|form)|'/tester|'/waitlist|'/form|\"/t ...
+                                       ~~~~~~~~~~~
Expressions are only allowed as the first element of a pipeline.
At line:2 char:50
+ rg -n "href=\"/(tester|waitlist|form)|'/tester|'/waitlist|'/form|\"/t ...
+                                                  ~~~~~~~~
Unexpected token 'waitlist' in expression or statement.
At line:2 char:59
+ ... |'/waitlist|'/form|\"/tester|\"/waitlist|\"/form|FormPage|tester-appl ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Expressions are only allowed as the first element of a pipeline.
At line:2 char:137
+ ... tester-apply'|email|utm" web\src\app web\src\views web\src\server web ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The string is missing the terminator: '.
At line:2 char:125
+ ... pply|kind: 'tester-apply'|email|utm" web\src\app web\src\views web\sr ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Unexpected token 'tester-apply'|email|utm" web\src\app web\src\views web\src\server web\src\lib web\src\components' in 
expression or statement.
    + CategoryInfo          : ParserError: (:) [], ParentContainsErrorRecordException
    + FullyQualifiedErrorId : ExpectedValueExpression
 

 exited 1 in 811ms:
At line:2 char:50
+ rg -n "href=\"/(tester|waitlist|form)|'/tester|'/waitlist|'/form|\"/t ...
+                                                  ~
You must provide a value expression following the '/' operator.
At line:2 char:39
+ rg -n "href=\"/(tester|waitlist|form)|'/tester|'/waitlist|'/form|\"/t ...
+                                       ~~~~~~~~~~~
Expressions are only allowed as the first element of a pipeline.
At line:2 char:50
+ rg -n "href=\"/(tester|waitlist|form)|'/tester|'/waitlist|'/form|\"/t ...
+                                                  ~~~~~~~~
Unexpected token 'waitlist' in expression or statement.
At line:2 char:59
+ ... |'/waitlist|'/form|\"/tester|\"/waitlist|\"/form|FormPage|tester-appl ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Expressions are only allowed as the first element of a pipeline.
At line:2 char:137
+ ... tester-apply'|email|utm" web\src\app web\src\views web\src\server web ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The string is missing the terminator: '.
At line:2 char:125
+ ... pply|kind: 'tester-apply'|email|utm" web\src\app web\src\views web\sr ...
+                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Unexpected token 'tester-apply'|email|utm" web\src\app web\src\views web\src\server web\src\lib web\src\components' in 
expression or statement.
    + CategoryInfo          : ParserError: (:) [], ParentContainsErrorRecordException
    + FullyQualifiedErrorId : ExpectedValueExpression
 

 succeeded in 1035ms:
C:\soma\repos\acttub\web\src\app\ACTI
C:\soma\repos\acttub\web\src\app\api
C:\soma\repos\acttub\web\src\app\archive
C:\soma\repos\acttub\web\src\app\coach
C:\soma\repos\acttub\web\src\app\coach-second
C:\soma\repos\acttub\web\src\app\community
C:\soma\repos\acttub\web\src\app\excer
C:\soma\repos\acttub\web\src\app\form
C:\soma\repos\acttub\web\src\app\fortune
C:\soma\repos\acttub\web\src\app\lineshot
C:\soma\repos\acttub\web\src\app\play
C:\soma\repos\acttub\web\src\app\team
C:\soma\repos\acttub\web\src\app\test
C:\soma\repos\acttub\web\src\app\thea
C:\soma\repos\acttub\web\src\app\ACTI\quiz
C:\soma\repos\acttub\web\src\app\ACTI\result
C:\soma\repos\acttub\web\src\app\ACTI\survey
C:\soma\repos\acttub\web\src\app\ACTI\result\[code]
C:\soma\repos\acttub\web\src\app\api\acti
C:\soma\repos\acttub\web\src\app\api\archive
C:\soma\repos\acttub\web\src\app\api\coach
C:\soma\repos\acttub\web\src\app\api\coach-second
C:\soma\repos\acttub\web\src\app\api\community
C:\soma\repos\acttub\web\src\app\api\form
C:\soma\repos\acttub\web\src\app\api\fortune
C:\soma\repos\acttub\web\src\app\api\health
C:\soma\repos\acttub\web\src\app\api\lineshot
C:\soma\repos\acttub\web\src\app\api\play
C:\soma\repos\acttub\web\src\app\api\send-result
C:\soma\repos\acttub\web\src\app\api\test
C:\soma\repos\acttub\web\src\app\api\acti\survey
C:\soma\repos\acttub\web\src\app\api\archive\upload
C:\soma\repos\acttub\web\src\app\api\archive\videos
C:\soma\repos\acttub\web\src\app\api\coach\analyze
C:\soma\repos\acttub\web\src\app\api\coach\cleanup
C:\soma\repos\acttub\web\src\app\api\coach\upload
C:\soma\repos\acttub\web\src\app\api\coach-second\analyze
C:\soma\repos\acttub\web\src\app\api\community\comments
C:\soma\repos\acttub\web\src\app\api\community\posts
C:\soma\repos\acttub\web\src\app\api\form\review
C:\soma\repos\acttub\web\src\app\api\test\analyze
C:\soma\repos\acttub\web\src\app\archive\me
C:\soma\repos\acttub\web\src\app\archive\playlists
C:\soma\repos\acttub\web\src\app\archive\search
C:\soma\repos\acttub\web\src\app\archive\u
C:\soma\repos\acttub\web\src\app\archive\upload
C:\soma\repos\acttub\web\src\app\archive\videos
C:\soma\repos\acttub\web\src\app\archive\playlists\new
C:\soma\repos\acttub\web\src\app\archive\u\[username]
C:\soma\repos\acttub\web\src\app\archive\videos\[id]
C:\soma\repos\acttub\web\src\app\community\me
C:\soma\repos\acttub\web\src\app\community\new
C:\soma\repos\acttub\web\src\app\community\p
C:\soma\repos\acttub\web\src\app\community\posts
C:\soma\repos\acttub\web\src\app\community\search
C:\soma\repos\acttub\web\src\app\community\write
C:\soma\repos\acttub\web\src\app\community\p\[id]
C:\soma\repos\acttub\web\src\app\community\posts\[id]
C:\soma\repos\acttub\web\src\app\excer\rooms
C:\soma\repos\acttub\web\src\app\excer\rooms\[slug]
C:\soma\repos\acttub\web\src\app\form\review
C:\soma\repos\acttub\web\src\app\thea\plays
C:\soma\repos\acttub\web\src\app\thea\plays\[id]

codex
주의: 현재 `web/src/app`에는 `/tester` 디렉터리가 없고 `/form`, `/test`가 보입니다. rename이 아직 코드 라우트에 반영됐는지는 critical 체크 대상으로 봐야 합니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg -n 'tester|waitlist|utm|FormPage|tester-apply|email' web\\src\\app web\\src\\views web\\src\\server web\\src\\lib web\\src\\components" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "if (Test-Path .gitmodules) { Get-Content -Raw .gitmodules } else { 'NO .gitmodules' }; git submodule status --recursive" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Raw web\\src\\app\\form\\page.tsx; Get-Content -Raw web\\src\\views\\FormPage.tsx; Get-Content -Raw web\\src\\server\\formApply.ts; Get-Content -Raw web\\src\\server\\sheetsWebhook.ts" in C:\soma\repos\acttub
 succeeded in 808ms:
web\src\lib\analytics.ts:7: * - `email_report`: 서버 발송 성공 후 (확정)
web\src\lib\analytics.ts:13:export type ResultAction = 'email_report' | 'instagram_story' | 'kakao_share' | 'copy_link';
web\src\lib\analytics.test.ts:80:    trackPageView('/ACTI/result/MINB?email=user@example.com#private');
web\src\lib\analytics.test.ts:97:    trackResultAction('email_report', 'MINB');
web\src\lib\analytics.test.ts:103:        action: 'email_report',
web\src\components\ResultEmailForm.tsx:23:  const emailId = useId();
web\src\components\ResultEmailForm.tsx:26:  const [email, setEmail] = useState('');
web\src\components\ResultEmailForm.tsx:31:  const emailValid = EMAIL_RE.test(email);
web\src\components\ResultEmailForm.tsx:33:  const canSubmit = emailValid && consent && (status === 'idle' || status === 'error');
web\src\components\ResultEmailForm.tsx:41:      await sendResultEmail({ email, code, consent: true });
web\src\components\ResultEmailForm.tsx:56:      <section className="email-form email-form--success" aria-live="polite">
web\src\components\ResultEmailForm.tsx:57:        <div className="email-form__success-icon" aria-hidden="true">
web\src\components\ResultEmailForm.tsx:60:        <h3 className="email-form__title">발송 완료!</h3>
web\src\components\ResultEmailForm.tsx:61:        <p className="email-form__desc">
web\src\components\ResultEmailForm.tsx:62:          <strong>{email}</strong> 으로 상세 결과 리포트를 보냈어요.
web\src\components\ResultEmailForm.tsx:71:    <section className="email-form">
web\src\components\ResultEmailForm.tsx:72:      <h3 className="email-form__title">상세 결과를 이메일로 받기</h3>
web\src\components\ResultEmailForm.tsx:73:      <p className="email-form__desc">
web\src\components\ResultEmailForm.tsx:77:      <form className="email-form__form" onSubmit={handleSubmit} noValidate>
web\src\components\ResultEmailForm.tsx:78:        <label htmlFor={emailId} className="email-form__label">
web\src\components\ResultEmailForm.tsx:82:          id={emailId}
web\src\components\ResultEmailForm.tsx:83:          type="email"
web\src\components\ResultEmailForm.tsx:84:          inputMode="email"
web\src\components\ResultEmailForm.tsx:85:          autoComplete="email"
web\src\components\ResultEmailForm.tsx:87:          className="email-form__input"
web\src\components\ResultEmailForm.tsx:88:          value={email}
web\src\components\ResultEmailForm.tsx:91:          aria-invalid={email.length > 0 && !emailValid}
web\src\components\ResultEmailForm.tsx:95:        <label htmlFor={consentId} className="email-form__consent">
web\src\components\ResultEmailForm.tsx:105:            <span className="email-form__consent-detail">
web\src\components\ResultEmailForm.tsx:113:          <p className="email-form__error" role="alert">
web\src\components\ResultEmailForm.tsx:120:          className="email-form__submit"
web\src\components\ResultEmailForm.tsx:125:              <Loader2 size={18} className="email-form__spin" aria-hidden="true" />
web\src\components\ResultEmailForm.css:1:.email-form {
web\src\components\ResultEmailForm.css:8:.email-form--success {
web\src\components\ResultEmailForm.css:12:.email-form__success-icon {
web\src\components\ResultEmailForm.css:24:.email-form__title {
web\src\components\ResultEmailForm.css:32:.email-form__desc {
web\src\components\ResultEmailForm.css:39:.email-form__form {
web\src\components\ResultEmailForm.css:45:.email-form__label {
web\src\components\ResultEmailForm.css:52:.email-form__input {
web\src\components\ResultEmailForm.css:65:.email-form__input::placeholder {
web\src\components\ResultEmailForm.css:69:.email-form__input:focus {
web\src\components\ResultEmailForm.css:75:.email-form__input[aria-invalid='true'] {
web\src\components\ResultEmailForm.css:79:.email-form__input:disabled {
web\src\components\ResultEmailForm.css:83:.email-form__consent {
web\src\components\ResultEmailForm.css:93:.email-form__consent input[type='checkbox'] {
web\src\components\ResultEmailForm.css:99:.email-form__consent strong {
web\src\components\ResultEmailForm.css:104:.email-form__consent-detail {
web\src\components\ResultEmailForm.css:111:.email-form__error {
web\src\components\ResultEmailForm.css:120:.email-form__submit {
web\src\components\ResultEmailForm.css:138:.email-form__submit:hover:not(:disabled) {
web\src\components\ResultEmailForm.css:142:.email-form__submit:active:not(:disabled) {
web\src\components\ResultEmailForm.css:146:.email-form__submit:disabled {
web\src\components\ResultEmailForm.css:151:.email-form__spin {
web\src\components\ResultEmailForm.css:152:  animation: email-form-spin 1s linear infinite;
web\src\components\ResultEmailForm.css:155:@keyframes email-form-spin {
web\src\lib\sendResult.ts:8:  email: string;
web\src\server\formReview.ts:17: * 전화번호가 신청(tester-apply)과의 매칭 키이자 쿠폰(기프티콘) 발송 키.
web\src\server\formReview.ts:18: * payload kind='tester-review'로 Apps Script가 리뷰 탭에 분기 적재한다(컬럼은 v2 스키마).
web\src\server\formReview.ts:53:  kind: 'tester-review';
web\src\server\formReview.ts:104:    kind: 'tester-review',
web\src\server\formApply.ts:11: * 공유). payload의 kind='tester-apply'로 Apps Script가 다른 탭에 분기 적재한다.
web\src\server\formApply.ts:50:  kind: 'tester-apply';
web\src\server\formApply.ts:95:    kind: 'tester-apply',
web\src\server\formReview.test.ts:40:      kind: 'tester-review',
web\src\server\formApply.test.ts:38:      kind: 'tester-apply',
web\src\views\FormPage.css:1:/* FormPage — acttub.com 톤(Toss풍 연회색 배경 + 흰 카드 + 코랄 액센트).
web\src\views\FormReviewPage.tsx:12: * 제출 시 /api/form/review 로 POST → 구글시트 적재(kind='tester-review').
web\src\views\FormReviewPage.tsx:13: * 스타일은 FormPage.css 의 .form* 클래스를 그대로 재사용한다.
web\src\views\FormPage.tsx:4: * FormPage — 알파 테스터 신청 폼(acttub.com/form).
web\src\views\FormPage.tsx:37:export default function FormPage() {
web\src\views\ResultPage.tsx:131:            onDelivered={() => trackResultAction('email_report', type.code)}
web\src\app\globals.css:31:@import '../views/FormPage.css';
web\src\app\form\page.tsx:1:import FormPage from '../../views/FormPage';
web\src\app\form\page.tsx:10:  return <FormPage />;
web\src\app\api\send-result\route.ts:3:import { renderResultEmail } from '@/server/email/emailTemplate';
web\src\app\api\send-result\route.ts:4:import { TYPE_CODES, getType } from '@/server/email/types';
web\src\app\api\send-result\route.ts:7:  email: z.string().email().max(255),
web\src\app\api\send-result\route.ts:25:  const { email, code } = parsed.data;
web\src\app\api\send-result\route.ts:33:    const { error: sendError } = await resend.emails.send({
web\src\app\api\send-result\route.ts:35:      to: [email],
web\src\app\api\send-result\route.ts:52:          body: JSON.stringify({ email, code, consent: true }),

 succeeded in 767ms:
import FormPage from '../../views/FormPage';

export const metadata = {
  title: '?뚰뙆 ?뚯뒪???좎껌 쨌 acttub',
  description:
    '?곌린 ?곸긽 1媛쒕줈 AI ?곌린 ?쇰뱶諛깆쓣 ?뚯뒪?명빐蹂댁꽭?? ?ъ슜 ??由щ럭瑜??④린硫?而ㅽ뵾 湲고봽?곗퐯???쒕┰?덈떎.',
};

export default function Page() {
  return <FormPage />;
}

'use client';

/**
 * FormPage ???뚰뙆 ?뚯뒪???좎껌 ??acttub.com/form).
 *
 * SOMA-70 紐⑥쭛 源붾븣湲곗쓽 ?앸떒. 紐⑤뜽: ??踰??ъ슜 + 由щ럭(/form/review) ?묒꽦 ??荑좏룿.
 * ???붾㈃??7臾명빆 + 媛쒖씤?뺣낫 ?숈쓽, ?쒖텧 ??/api/form ?쇰줈 POST ??援ш??쒗듃 ?곸옱.
 * ?깃났?섎㈃ ?꾨즺 ?붾㈃?쇰줈 援먯껜?쒕떎. 寃뚯엫/???濡쒖쭅 ?놁쓬.
 * ?ㅼ? acttub.com 猷⑦듃(Toss???고쉶??諛곌꼍 + ??移대뱶 + 肄붾엫 ?≪꽱????留욎텣??
 * CSS??src/app/globals.css ??@import 濡?濡쒕뱶?쒕떎(views 而⑤깽??.
 */

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

const CAREERS = ['?낆떆??, '?꾩뿭쨌?몃??꾨줈', '痍⑤?쨌?낅Ц'] as const;
const FEEDBACK_SOURCES = [
  '?숈썝 ?좎깮??,
  '?숆탳쨌援먯닔',
  '?ㅽ꽣?붋룸룞猷?,
  '???紐⑤땲?곕쭅',
  '嫄곗쓽 紐?諛쏆쓬',
] as const;
const CONCERNS = ['媛먯젙 ?쒗쁽', '???룸컻??, '?쒖젙', '?吏곸엫쨌?숈꽑', '湲고?'] as const;
const CHANNELS = ['DM', '?꾨쫫硫붿씠而ㅼ뒪', '?ㅽ뵂移댄넚', '?몄뒪?'] as const;

type Career = (typeof CAREERS)[number];
type FeedbackSource = (typeof FEEDBACK_SOURCES)[number];
type Concern = (typeof CONCERNS)[number];
type Channel = (typeof CHANNELS)[number];

/** ?쒕쾭(zod phoneSchema)? 媛숈? 湲곗? ???レ옄留??④꺼 01濡??쒖옉?섎뒗 10~11?먮━. */
function isPhone(value: string): boolean {
  return /^01\d{8,9}$/.test(value.replace(/\D/g, ''));
}

export default function FormPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [career, setCareer] = useState<Career | ''>('');
  const [feedbackSource, setFeedbackSource] = useState<FeedbackSource | ''>('');
  const [concern, setConcern] = useState<Concern | ''>('');
  const [q1, setQ1] = useState<boolean | null>(null);
  const [channel, setChannel] = useState<Channel | ''>('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const ready =
    name.trim().length > 0 &&
    isPhone(phone) &&
    career !== '' &&
    feedbackSource !== '' &&
    concern !== '' &&
    q1 !== null &&
    channel !== '' &&
    consent;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          career,
          feedbackSource,
          concern,
          q1,
          channel,
          consent,
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        setDone(true);
      } else {
        setError(data.error ?? '?좎껌???묒닔?섏? 紐삵뻽?댁슂. ?좎떆 ???ㅼ떆 ?쒕룄??二쇱꽭??');
      }
    } catch {
      setError('?ㅽ듃?뚰겕 ?ㅻ쪟濡??묒닔?섏? 紐삵뻽?댁슂. ?좎떆 ???ㅼ떆 ?쒕룄??二쇱꽭??');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="form form--done container">
        <header className="form__topbar">
          <Link href="/" className="form__brand" aria-label="acttub ??>
            act<span>tub</span>
          </Link>
          <span className="form__badge">?뚰뙆 ?뚯뒪??/span>
        </header>

        <section className="form__card form__card--done">
          <div className="form__done-mark" aria-hidden="true">?렚</div>
          <h1 className="form__title">?좎껌 ?꾨즺!</h1>
          <p className="form__lead">
            ?뚰뙆 ?뚯뒪?곕줈 ?좎껌?댁＜?붿꽌 怨좊쭏?뚯슂. ?곸뼱二쇱떊 踰덊샇濡?怨??덈궡?쒕┫寃뚯슂.
          </p>
          <p className="form__note">
            ?쇰뱶諛깆쓣 ??踰??ъ슜?대낫怨?由щ럭瑜??④꺼二쇱떆硫? 而ㅽ뵾 湲고봽?곗퐯??蹂대궡?쒕┰?덈떎.
          </p>
          <Link href="/" className="form__home">
            acttub ?섎윭蹂닿린
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="form container">
      <header className="form__topbar">
        <Link href="/" className="form__brand" aria-label="acttub ??>
          act<span>tub</span>
        </Link>
        <span className="form__badge">?뚰뙆 ?뚯뒪??/span>
      </header>

      <form className="form__card" onSubmit={handleSubmit}>
        <div className="form__intro">
          <span className="form__kicker">AI ?곌린 ?쇰뱶諛?쨌 ?뚰뙆 ?뚯뒪??/span>
          <h1 className="form__title">?뚰뙆 ?뚯뒪???좎껌</h1>
          <p className="form__lead">
            ?곌린 ?곸긽 1媛쒕? ?щ━硫??뚯옒????+ ???섎굹 怨좎튌 ??+ ?ㅼ쓬 ??嫄몄쓬?띿쓣 移대뱶濡?
            吏싳뼱二쇰뒗 AI ?곌린 ?쇰뱶諛깆쓣 ?뚯뒪?명빐?? ??踰??ъ슜?섍퀬 吏㏃? 由щ럭瑜??④꺼二쇱떆硫?
            而ㅽ뵾 湲고봽?곗퐯???쒕┰?덈떎. <strong>(?ㅻ뵒???꾨떂 쨌 ???뚯뒪??</strong>
          </p>
        </div>

        <label className="form__field">
          <span className="form__label">?깊븿</span>
          <input
            className="form__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoComplete="name"
            required
          />
        </label>

        <label className="form__field">
          <span className="form__label">?꾪솕踰덊샇 (荑좏룿 諛쏆쑝??踰덊샇)</span>
          <input
            className="form__input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            maxLength={20}
            autoComplete="tel"
            required
          />
        </label>

        <fieldset className="form__field">
          <legend className="form__label">?곌린 寃쎈젰</legend>
          <div className="form__choices">
            {CAREERS.map((c) => (
              <button
                type="button"
                key={c}
                className={['form__chip', career === c && 'form__chip--on'].filter(Boolean).join(' ')}
                aria-pressed={career === c}
                onClick={() => setCareer(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">吏湲??곌린 ?쇰뱶諛깆? 二쇰줈 ?대뵒??諛쏅굹??</legend>
          <div className="form__choices">
            {FEEDBACK_SOURCES.map((s) => (
              <button
                type="button"
                key={s}
                className={['form__chip', feedbackSource === s && 'form__chip--on']
                  .filter(Boolean)
                  .join(' ')}
                aria-pressed={feedbackSource === s}
                onClick={() => setFeedbackSource(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">?곌린?먯꽌 媛??怨좊???遺遺??섎굹瑜?怨⑤씪二쇱꽭??/legend>
          <div className="form__choices">
            {CONCERNS.map((c) => (
              <button
                type="button"
                key={c}
                className={['form__chip', concern === c && 'form__chip--on'].filter(Boolean).join(' ')}
                aria-pressed={concern === c}
                onClick={() => setConcern(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">
            理쒓렐 1二??덉뿉 ?곌린 ?곸긽 1媛쒕? 李띿뼱 ?щ┫ ???덈굹??
          </legend>
          <div className="form__choices">
            <button
              type="button"
              className={['form__chip', q1 === true && 'form__chip--on'].filter(Boolean).join(' ')}
              aria-pressed={q1 === true}
              onClick={() => setQ1(true)}
            >
              ??
            </button>
            <button
              type="button"
              className={['form__chip', q1 === false && 'form__chip--on'].filter(Boolean).join(' ')}
              aria-pressed={q1 === false}
              onClick={() => setQ1(false)}
            >
              ?꾨땲??
            </button>
          </div>
        </fieldset>

        <fieldset className="form__field">
          <legend className="form__label">?대뼡 寃쎈줈濡??ㅼ뀲?섏슂?</legend>
          <div className="form__choices">
            {CHANNELS.map((c) => (
              <button
                type="button"
                key={c}
                className={['form__chip', channel === c && 'form__chip--on'].filter(Boolean).join(' ')}
                aria-pressed={channel === c}
                onClick={() => setChannel(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="form__consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>
            <strong>媛쒖씤?뺣낫 ?섏쭛쨌?댁슜 ?숈쓽 (?꾩닔)</strong> ???깊븿쨌?꾪솕踰덊샇???뚯뒪???덈궡?
            荑좏룿 諛쒖넚?먮쭔 ?ъ슜?섍퀬, 吏湲??꾨즺 ???뚭린?⑸땲??
          </span>
        </label>

        {/* honeypot: ?щ엺 ?덉뿉 ??蹂댁씠??遊??몃옪 */}
        <input
          className="form__hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        {error ? (
          <p className="form__error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="form__submit" type="submit" disabled={!ready || submitting}>
          {submitting ? '?묒닔 以묅? : '?좎껌?섍린'}
        </button>
      </form>
    </main>
  );
}

import { z } from 'zod';
import type { ApiRequestInput, ApiResult } from './apiCore';
import { sendToSheetsWebhook } from './sheetsWebhook';

/**
 * formApply ???뚰뙆 ?뚯뒪???좎껌(acttub.com/form) ?묒닔.
 *
 * SOMA-70 紐⑥쭛 源붾븣湲곗쓽 ?앸떒. 紐⑤뜽: ??踰??ъ슜 + 由щ럭 ?묒꽦 ??荑좏룿(湲고봽?곗퐯) 吏湲?
 * 7臾명빆 + 媛쒖씤?뺣낫 ?숈쓽瑜?寃利앺빐 援ш??쒗듃(Apps Script ?뱀빋 webhook)濡?????
 * append ?쒕떎. webhook URL? 湲곗〈 ?섍꼍蹂??SHEETS_WEBHOOK_URL ?ъ궗??send-result?
 * 怨듭쑀). payload??kind='tester-apply'濡?Apps Script媛 ?ㅻⅨ ??뿉 遺꾧린 ?곸옱?쒕떎.
 * 寃뚯엫 濡쒖쭅 ?녿뒗 ?⑥닚 ?섏쭛湲곕씪 storage/DB瑜??곗? ?딅뒗??
 *
 * ?꾪솕踰덊샇??荑좏룿(湲고봽?곗퐯) 諛쒖넚 ?????レ옄留??④꺼 ?뺢퇋?뷀빐 ?곸옱?쒕떎.
 */

export const CAREERS = ['?낆떆??, '?꾩뿭쨌?몃??꾨줈', '痍⑤?쨌?낅Ц'] as const;
export const CHANNELS = ['DM', '?꾨쫫硫붿씠而ㅼ뒪', '?ㅽ뵂移댄넚', '?몄뒪?'] as const;
export const FEEDBACK_SOURCES = [
  '?숈썝 ?좎깮??,
  '?숆탳쨌援먯닔',
  '?ㅽ꽣?붋룸룞猷?,
  '???紐⑤땲?곕쭅',
  '嫄곗쓽 紐?諛쏆쓬',
] as const;
export const CONCERNS = ['媛먯젙 ?쒗쁽', '???룸컻??, '?쒖젙', '?吏곸엫쨌?숈꽑', '湲고?'] as const;

/** ?섏씠?댟룰났諛??욎씤 ?낅젰???レ옄留??④린怨?01濡??쒖옉?섎뒗 10~11?먮━留??듦낵?쒗궓?? */
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => /^01\d{8,9}$/.test(v), '?꾪솕踰덊샇 ?뺤떇???뺤씤??二쇱꽭??');

const applySchema = z.object({
  name: z.string().trim().min(1).max(40),
  phone: phoneSchema,
  career: z.enum(CAREERS),
  feedbackSource: z.enum(FEEDBACK_SOURCES),
  concern: z.enum(CONCERNS),
  q1: z.boolean(),
  channel: z.enum(CHANNELS),
  // 媛쒖씤?뺣낫 ?섏쭛쨌?댁슜 ?숈쓽 ??誘몃룞???쒖텧? 400.
  consent: z.literal(true),
  // honeypot ???щ엺? 鍮꾩썙?? 遊뉗씠 梨꾩슦硫?議곗슜??臾댁떆(200)?쒕떎.
  website: z.string().max(200).optional(),
});

export type FormApplyPayload = {
  kind: 'tester-apply';
  ts: string;
  name: string;
  phone: string;
  career: string;
  feedbackSource: string;
  concern: string;
  q1: string;
  channel: string;
  consent: string;
};

export type FormApplyOptions = {
  webhookUrl?: string;
  /** ?쒗듃 ?꾩넚湲??뚯뒪??二쇱엯??. true=?깃났. */
  send?: (url: string, payload: FormApplyPayload) => Promise<boolean>;
  /** ?쒖텧 ?쒓컖 二쇱엯(?뚯뒪??寃곗젙??. 湲곕낯 now. */
  now?: () => Date;
};

const FAILURE = '?좎껌???묒닔?섏? 紐삵뻽?댁슂. ?좎떆 ???ㅼ떆 ?쒕룄??二쇱꽭??';
const INVALID = '?낅젰媛믪쓣 ?뺤씤??二쇱꽭??';

export async function handleFormApply(
  input: ApiRequestInput,
  options: FormApplyOptions = {}
): Promise<ApiResult> {
  const parsed = applySchema.safeParse(input.body);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: INVALID } };
  }
  const data = parsed.data;

  // 遊? honeypot??梨꾩썙議뚯쑝硫??깃났??泥?議곗슜??踰꾨┛???쒗듃?????볦쓬).
  if (data.website && data.website.length > 0) {
    return { status: 200, body: { ok: true } };
  }

  const webhookUrl = options.webhookUrl ?? process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return { status: 500, body: { ok: false, error: FAILURE } };
  }

  const now = options.now ?? (() => new Date());
  const payload: FormApplyPayload = {
    kind: 'tester-apply',
    ts: now().toISOString(),
    name: data.name,
    phone: data.phone,
    career: data.career,
    feedbackSource: data.feedbackSource,
    concern: data.concern,
    q1: data.q1 ? 'Y' : 'N',
    channel: data.channel,
    consent: 'Y',
  };

  const send = options.send ?? sendToSheetsWebhook;
  let ok: boolean;
  try {
    ok = await send(webhookUrl, payload);
  } catch {
    ok = false;
  }
  if (!ok) {
    return { status: 502, body: { ok: false, error: FAILURE } };
  }
  return { status: 200, body: { ok: true } };
}

/**
 * sheetsWebhook ??援ш??쒗듃(Apps Script ?뱀빋) webhook 怨듭슜 ?꾩넚湲?
 *
 * /form(?좎껌)쨌/form/review(由щ럭)媛 媛숈? SHEETS_WEBHOOK_URL 濡?payload 瑜?蹂대궡怨?
 * Apps Script 媛 payload.kind 濡???쓣 遺꾧린??append ?쒕떎.
 */

export async function sendToSheetsWebhook(url: string, payload: unknown): Promise<boolean> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  // Apps Script(?뱀빋)???대??먯꽌 ?ㅽ뙣?대룄 ??긽 HTTP 200???뚮젮以??
  // 洹몃옒??status(res.ok)留뚯쑝濡쒕뒗 ?곸옱 ?깃났???????녾퀬, body??{ ok: true }源뚯? ?뺤씤?댁빞
  // ?쒗듃 ?곸옱 ?ㅽ뙣瑜?議곗슜???깃났?쇰줈 泥섎━?섎뒗 ?곗씠???좎떎??留됰뒗??
  if (!res.ok) return false;
  const body = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  return body?.ok === true;
}


 succeeded in 2088ms:
NO .gitmodules

codex
`/form`은 아직 신청 라우트 이름으로 남아 있고 API payload도 `tester-apply`입니다. dedupe를 unique email로 하려면 현 신청 폼이 phone-key 구조인 점도 게이트에 포함해야 합니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Raw web\\package.json" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'Get-Content -Raw package.json' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Raw web\\src\\views\\RootLandingPage.tsx; Get-Content -Raw web\\src\\views\\LandingPage.tsx; Get-Content -Raw web\\src\\views\\CoachPage.tsx; Get-Content -Raw web\\src\\app\\layout.tsx; Get-Content -Raw web\\src\\app\\Providers.tsx" in C:\soma\repos\acttub
 succeeded in 606ms:
{
  "name": "acttub-monorepo",
  "private": true,
  "packageManager": "pnpm@11.1.2",
  "scripts": {
    "local": "corepack pnpm --dir web dev --hostname 127.0.0.1 --port 4000",
    "local:web": "corepack pnpm --dir web dev --hostname 127.0.0.1 --port 4000",
    "local:lan": "corepack pnpm --dir web dev --hostname 0.0.0.0 --port 4000",
    "prod": "corepack pnpm prod:web",
    "prod:web": "corepack pnpm --dir web build",
    "start": "corepack pnpm --dir web start --hostname 127.0.0.1 --port 4000",
    "start:lan": "corepack pnpm --dir web start --hostname 0.0.0.0 --port 4000",
    "smoke": "node scripts/smoke-routes.mjs",
    "lint": "corepack pnpm --dir web lint",
    "build": "corepack pnpm prod",
    "test": "corepack pnpm --dir web test",
    "db:generate": "corepack pnpm --dir web db:generate",
    "db:migrate": "corepack pnpm --dir web db:migrate",
    "db:push": "corepack pnpm --dir web db:push",
    "verify": "corepack pnpm install --frozen-lockfile && corepack pnpm lint && corepack pnpm test && corepack pnpm prod",
    "verify:runtime": "corepack pnpm smoke",
    "verify:prod-runtime": "node scripts/verify-prod-runtime.mjs",
    "verify:preview": "corepack pnpm verify && PROD_VERIFY_PORT=4010 corepack pnpm verify:prod-runtime",
    "pr:preview": "node scripts/create-preview-pr.mjs"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "@google/genai",
      "esbuild",
      "protobufjs",
      "sharp",
      "unrs-resolver"
    ]
  }
}


 succeeded in 618ms:
{
  "name": "acttub-web",
  "private": true,
  "version": "0.0.0",
  "packageManager": "pnpm@11.1.2",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "lint": "eslint .",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@google/genai": "^1.52.0",
    "@neondatabase/serverless": "^1.1.0",
    "@vercel/blob": "^2.4.0",
    "drizzle-orm": "^0.45.2",
    "html-to-image": "^1.11.13",
    "lucide-react": "^1.14.0",
    "next": "16.2.6",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "resend": "^6.12.3",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^24.12.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitest/ui": "^4.1.6",
    "drizzle-kit": "^0.31.10",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "globals": "^17.6.0",
    "jsdom": "^29.1.1",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.59.2",
    "vitest": "^4.1.6"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "esbuild"
    ]
  }
}


 succeeded in 563ms:
import Link from 'next/link';
import {
  Bell,
  ChevronRight,
  Clapperboard,
  Eye,
  Heart,
  MessageCircle,
  Music2,
  Plus,
  Search,
  Sparkles,
  Ticket,
} from 'lucide-react';

const shortcuts = [
  {
    href: '/ACTI',
    label: 'ACTI 吏꾨떒',
    ariaLabel: 'ACTI - ?곌린 ?ㅽ???吏꾨떒',
    className: '',
    Icon: Sparkles,
  },
  {
    href: '/archive',
    label: 'archive',
    ariaLabel: 'archive - ?곌린 ?곸긽 ?꾩뭅?대툕',
    className: 'is-archive',
    Icon: Clapperboard,
  },
  {
    href: '/thea',
    label: 'thea',
    ariaLabel: 'thea - ?곌레 異붿쿇',
    className: 'is-thea',
    Icon: Ticket,
  },
  {
    href: '/excer',
    label: 'excer',
    ariaLabel: 'excer - ?곌린 ?곗뒿??,
    className: 'is-excer',
    Icon: Music2,
  },
];

const hotPosts = [
  {
    id: 1024,
    title: '?ㅻ뵒??吏곸쟾??湲댁옣 ?몃뒗 猷⑦떞 怨듭쑀?⑸땲??,
    board: '?먯쑀寃뚯떆??,
    time: '5遺???,
    likes: 42,
    comments: 18,
  },
  {
    id: 1019,
    title: '諛쒖꽦 ?곗뒿 1???대낫怨??먮? 寃껊뱾 (?λЦ)',
    board: '?먯쑀寃뚯떆??,
    time: '32遺???,
    likes: 31,
    comments: 12,
  },
  {
    id: 1011,
    title: 'ACTI 寃곌낵 ENFP-A濡??섏솕?붾뜲 吏꾩쭨 留욌뒗 ???뗣뀑',
    board: '?먯쑀寃뚯떆??,
    time: '1?쒓컙 ??,
    likes: 28,
    comments: 9,
  },
];

const freePosts = [
  {
    id: 1031,
    title: '??숇줈 ?뚭레??異붿쿇 醫 諛쏆쓣 ???덉쓣源뚯슂?',
    comments: 7,
    snippet: '?대쾲 二쇰쭚??泥섏쓬 媛蹂대젮怨??섎뒗??遺꾩쐞湲?醫뗪퀬 醫뚯꽍 ?명븳 怨??뚮젮二쇱꽭??',
    time: '10遺???,
    views: 124,
  },
  {
    id: 1030,
    title: '?낅갚 ?곗뒿 ?대뵒???섏떆?섏슂',
    comments: 12,
    snippet: '吏묒뿉??媛議??덉튂 蹂댁씠怨? ?곗뒿?ㅼ? 鍮꾩떥怨졻??ㅻ뱾 ?대뼸寃??닿껐?섏떆?붿? 沅곴툑?댁꽌??',
    time: '34遺???,
    views: 286,
  },
  {
    id: 1029,
    title: '媛먯젙 ?뚯뼱?щ━??嫄?留ㅻ쾲 ?대졄?ㅼ슂',
    comments: 5,
    snippet: '?蹂??몄슦??嫄??섎뒗?? 留됱긽 移대찓??耳쒕㈃ ?ㅼ씠 ?됲깂?댁졇?? ?ㅻ뱾 ?대뼸寃??몄꽭??',
    time: '1?쒓컙 ??,
    views: 192,
  },
  {
    id: 1028,
    title: 'archive???곸긽 ?щ━硫?鍮꾧났媛?吏꾩쭨濡?蹂댁옣?섎굹??',
    comments: 3,
    snippet: '誘쇨컧???곸긽?대씪?쒖슂. ?댁쁺吏꾩씠 蹂??섎룄 ?덈뒗 嫄댁? 沅곴툑?⑸땲??',
    time: '2?쒓컙 ??,
    views: 98,
  },
  {
    id: 1027,
    title: '?ㅻ뵒???먯쑀?곌린 1遺?30珥?異붿쿇 ?묓뭹 ?덉쓣源뚯슂',
    comments: 9,
    snippet: '?덈Т ?뷀븳 嫄?留먭퀬, 20? 珥덈컲 ?ъ옄 罹먮┃?곕줈 遺?댁뒪?쎌? ?딆? 嫄곕㈃ 醫뗪쿋?댁슂.',
    time: '3?쒓컙 ??,
    views: 421,
  },
  {
    id: 1026,
    title: '?곌린 ?숈썝 ???ㅻ땲怨??쇱옄 ?섎뒗 遺?怨꾩꽭??',
    comments: 18,
    snippet: '?낇븰?쇰줈 ?대뵒源뚯? 媛????덉쓣吏 沅곴툑?댁꽌?? 寃쏀뿕??遺?곷뱶?ㅼ슂.',
    time: '5?쒓컙 ??,
    views: 733,
  },
];

export default function RootLandingPage() {
  return (
    <div className="root-landing">
      <header className="root-landing__topbar">
        <div className="root-landing__topbar-inner">
          <Link href="/" className="root-landing__brand" aria-label="acttub ??>
            act<span className="root-landing__brand-accent">tub</span>
          </Link>
          <form className="root-landing__search" role="search">
            <Search aria-hidden="true" />
            <input type="search" placeholder="寃?됱뼱瑜??낅젰?섏꽭?? aria-label="寃?? />
          </form>
          <Link className="root-landing__coach-top-link" href="/coach" aria-label="coach - ?곌린 ?곗뒿 ?쇰뱶諛?>
            <Sparkles aria-hidden="true" strokeWidth={2.2} />
            <span>coach</span>
          </Link>
          <Link className="root-landing__icon-btn" href="/team" aria-label="?뚮┝" prefetch={false}>
            <Bell aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="root-landing__main">
        <div className="root-landing__container">
          <section className="root-landing__coach-feature" aria-label="coach 諛붾줈媛湲?>
            <Link className="root-landing__coach-hero-link" href="/coach" aria-label="coach - ?곌린 ?곗뒿 ?쇰뱶諛?>
              <span className="root-landing__coach-hero-copy">
                <span className="root-landing__coach-hero-kicker">AI COACH</span>
                <span className="root-landing__coach-hero-title">?곌린 ?곗뒿 ?쇰뱶諛?/span>
                <span className="root-landing__coach-hero-desc">
                  ?곸긽 援ш컙怨??섎룄瑜?湲곗??쇰줈 ?ㅼ쓬 ?곗뒿 ?ъ씤?몃? ?뺣━?⑸땲??
                </span>
              </span>
              <span className="root-landing__coach-hero-icon" aria-hidden="true">
                <Sparkles strokeWidth={2.2} />
              </span>
            </Link>
          </section>

          <section className="root-landing__shortcuts" aria-label="acttub ?쒕퉬??諛붾줈媛湲?>
            <div className="root-landing__shortcuts-grid">
              {shortcuts.map(({ href, label, ariaLabel, className, Icon }) => (
                <Link key={href} className="root-landing__shortcut" href={href} aria-label={ariaLabel}>
                  <span className={`root-landing__shortcut-icon ${className}`} aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="root-landing__shortcut-label">{label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="root-landing__card" aria-label="?ㅼ떆媛??멸린湲">
            <div className="root-landing__card-header">
              <div className="root-landing__card-header-left">
                <span className="root-landing__card-badge">HOT</span>
                <h2 className="root-landing__card-title">?ㅼ떆媛??멸린湲</h2>
              </div>
              <Link className="root-landing__card-more" href="/community?sort=hot">
                ?붾낫湲?
                <ChevronRight aria-hidden="true" />
              </Link>
            </div>
            <div className="root-landing__hot-list">
              {hotPosts.map((post, index) => (
                <Link key={post.id} className="root-landing__hot-item" href={`/community/posts/${post.id}`}>
                  <span className="root-landing__hot-rank">{index + 1}</span>
                  <span className="root-landing__hot-item-body">
                    <span className="root-landing__hot-item-title">{post.title}</span>
                    <span className="root-landing__hot-item-meta">
                      <span>{post.board}</span>
                      <span>{post.time}</span>
                    </span>
                  </span>
                  <span className="root-landing__hot-stats" aria-label="醫뗭븘?붋룸뙎湲">
                    <Heart aria-hidden="true" fill="currentColor" strokeWidth={0} />
                    {post.likes}
                    <span aria-hidden="true">쨌</span>
                    <MessageCircle aria-hidden="true" />
                    {post.comments}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="root-landing__card" aria-label="?먯쑀寃뚯떆??理쒖떊湲">
            <div className="root-landing__card-header">
              <div className="root-landing__card-header-left">
                <h2 className="root-landing__card-title">?먯쑀寃뚯떆??/h2>
              </div>
              <Link className="root-landing__card-more" href="/community?board=free">
                ?붾낫湲?
                <ChevronRight aria-hidden="true" />
              </Link>
            </div>
            <div className="root-landing__post-list">
              {freePosts.map((post) => (
                <Link key={post.id} className="root-landing__post" href={`/community/posts/${post.id}`}>
                  <div className="root-landing__post-title-row">
                    <span className="root-landing__post-title">{post.title}</span>
                  </div>
                  <span className="root-landing__post-comments">[{post.comments}]</span>
                  <p className="root-landing__post-snippet">{post.snippet}</p>
                  <div className="root-landing__post-meta">
                    <span>?듬챸</span>
                    <span className="root-landing__dot" aria-hidden="true" />
                    <span>{post.time}</span>
                    <span className="root-landing__dot" aria-hidden="true" />
                    <span className="root-landing__stat" aria-label="議고쉶??>
                      <Eye aria-hidden="true" />
                      {post.views}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Link className="root-landing__fab" href="/community/write" aria-label="??湲 ?묒꽦">
        <Plus aria-hidden="true" />
      </Link>

      <footer className="root-landing__footer">
        <Link href="/team" prefetch={false}>
          ?곕━ ? ?뚭컻
        </Link>
        <span>짤 acttub</span>
      </footer>
    </div>
  );
}

/**
 * S1 ???쒕뵫 (v3: ?좎뒪 誘몃땲硫 ??+ BottomCTA + 紐⑤컮?????.
 */

import { ArrowRight, Clock4 } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';
import BottomCTA from '../components/BottomCTA';
import CharacterAvatar from '../components/CharacterAvatar';
import { getAllTypes } from '../content/types';

export default function LandingPage() {
  const all = getAllTypes();
  const hero = all[0]; // MINB

  return (
    <main className="page page-enter page-landing">
      <div className="page-landing__top">
        <p className="page-landing__brand">?곌린?ㅽ???李얘린</p>
      </div>

      <section className="page-landing__hero">
        <div className="page-landing__hero-avatar avatar--idle">
          <CharacterAvatar
            typeIndex={hero.index}
            accessory={hero.accessory}
            face={hero.face}
            size="xl"
            label={`${hero.code} 罹먮┃??}
          />
        </div>

        <h1 className="page-landing__title">
          ?곌린 ?ㅽ??쇱쓣<br />
          李얠븘遊먯슂!
        </h1>
        <p className="page-landing__sub">
          4異?16?좏삎?쇰줈 ?뺣━??br />
          ???곌린 ?ㅽ???
        </p>

        <div className="page-landing__meta">
          <Clock4 size={14} aria-hidden="true" />
          <span>??2~3遺?쨌 14臾명빆</span>
        </div>
      </section>

      <section className="page-landing__gallery">
        <h2 className="page-landing__gallery-title">16媛吏 罹먮┃??/h2>
        <p className="page-landing__gallery-sub">?덈뒗 ?대뵒??媛源뚯슱源?</p>
        <div className="page-landing__grid">
          {all.map((t) => (
            <div key={t.code} className="page-landing__cell" title={t.name}>
              <CharacterAvatar
                typeIndex={t.index}
                accessory={t.accessory}
                face={t.face}
                size="sm"
              />
              <span className="page-landing__cell-code">{t.code}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="page-landing__bottom-pad" aria-hidden="true" />

      <BottomCTA>
        <PrimaryButton size="xl" fullWidth as="a" href="/ACTI/quiz">
          ?쒖옉?섍린
          <ArrowRight size={20} aria-hidden="true" />
        </PrimaryButton>
      </BottomCTA>
    </main>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { upload as uploadBlob } from '@vercel/blob/client';
import Link from 'next/link';
import {
  Camera,
  CircleStop,
  FileVideo,
  Loader2,
  Mic,
  PencilLine,
  Sparkles,
  Upload,
} from 'lucide-react';
import {
  ACTING_CATEGORIES,
  formatTime,
  type CoachFeedback,
} from '../coach/evaluation';
import { FocusBlock, NextStepBlock, OverallBlock, StrengthBlock } from './coachFeedbackCards';
import { trackCoachStep } from '../lib/analytics';

type InputMode = 'upload' | 'record';

// ?섎룞 援ш컙 ?좏깮 ?쒓굅 ???곸긽 ?꾩껜瑜??щ━硫?AI媛 ?곌린 援ш컙???먮룞 媛먯??쒕떎. 鍮꾩슜쨌?덉젙???꾪빐 10遺??곹븳.
const MAX_DURATION_SECONDS = 600;

// ?섎룄 ?섏씫湲?IntentEcho) 釉붾줉? ?쒓굅 ???낅젰???섎룄瑜??ㅼ떆 蹂댁뿬二쇱? ?딅뒗??2026-06-12).
// ?곗씠??sceneIntent)???묐떟??洹몃?濡??⑥븘 ?덉뼱 ?섏궡由ш린 ?쎈떎.

function fieldClass() {
  return 'w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15';
}

type CoachPageProps = {
  // /coach-second(v2 ?뚯씠?꾨씪??媛 媛숈? ?붾㈃???ㅻⅨ 遺꾩꽍 API濡??ъ궗?⑺븳?? 湲곕낯媛?= 湲곗〈 /coach 洹몃?濡?
  analyzeUrl?: string;
  badge?: string;
};

export default function CoachPage({ analyzeUrl = '/api/coach/analyze', badge = 'coach' }: CoachPageProps = {}) {
  const [mode, setMode] = useState<InputMode>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState<string>(ACTING_CATEGORIES[0]);
  const [intent, setIntent] = useState('');
  const [memo, setMemo] = useState('');
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  // ??λ맂 肄붿튂 ?몄뀡 id ??由щ럭 ?쇱쑝濡??섍꺼 ?몄뀡?붾━酉곕? ?뉖뒗???놁쑝硫?留곹겕留?.
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStartingRecording, setIsStartingRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const inputSectionRef = useRef<HTMLElement | null>(null);
  const recordStartRef = useRef(0);

  // ?ㅼ쓬 ??嫄몄쓬 ??媛숈? 援ш컙???ㅼ떆 李띿뼱 鍮꾧탳?섎룄濡??낅젰 ?곸뿭?쇰줈 ?대룞.
  function handleRetake() {
    inputSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const selectedVideoLabel = videoFile
    ? `${videoFile.name} 쨌 ${(videoFile.size / 1024 / 1024).toFixed(1)}MB`
    : 'mp4, mov, webm';

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [videoUrl]);

  useEffect(() => {
    if (!isRecording) return undefined;

    const timer = window.setInterval(() => {
      setRecordingSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRecording]);

  function setSelectedVideo(file: File) {
    if (videoUrl) URL.revokeObjectURL(videoUrl);

    const objectUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(objectUrl);
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setFeedback(null);
    setSessionId(null);
    setMemo('');
    setError('');
    trackCoachStep('video_selected');
  }

  function onVideoMetadata() {
    const raw = videoRef.current?.duration ?? 0;
    // ?뱁솕 webm? duration????0?쇰줈 ?≫엳??釉뚮씪?곗? ?댁뒋 ??洹?寃쎌슦 ?뱁솕 ??梨꾩슫 湲몄씠瑜??좎??쒕떎.
    if (!Number.isFinite(raw) || raw <= 0) return;
    // 遺꾩꽍 踰붿쐞 = ?곸긽 ?꾩껜. ?ㅼ젣 ?곌린 援ш컙? 遺꾩꽍 ?④퀎?먯꽌 AI媛 ?먮룞?쇰줈 醫곹엺??
    setDuration(raw);
    setStartTime(0);
    setEndTime(raw);
    setError(raw > MAX_DURATION_SECONDS
      ? `?곸긽???덈Т 湲몄뼱??理쒕? ${MAX_DURATION_SECONDS / 60}遺?. ??吏㏃? ?곸긽?쇰줈 ?щ젮 二쇱꽭??`
      : '');
  }

  async function startRecording() {
    setError('');
    setFeedback(null);
    setIsStartingRecording(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('??釉뚮씪?곗??먯꽌??吏곸젒 ?뱁솕瑜?吏?먰븯吏 ?딆뒿?덈떎. ?곸긽 ?낅줈?쒕? ?ъ슜??二쇱꽭??');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      streamRef.current = stream;
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
        // ?낅줈???덉슜 紐⑸줉? 'video/webm'留????뱁솕 mimeType??;codecs=??瑗щ━瑜??쇱뼱 ?뺢퇋?뷀븳??
        const uploadType = (recorder.mimeType || 'video/webm').split(';')[0] || 'video/webm';
        const file = new File([blob], `coach-recording-${Date.now()}.webm`, { type: uploadType });
        // ?뱁솕 webm? duration????0?쇰줈 ?≫엳??釉뚮씪?곗? ?댁뒋 ???뱁솕 寃쎄낵 ?쒓컙??湲몄씠濡?吏곸젒 梨꾩슫??
        const recordedSeconds = Math.max(1, Math.round((Date.now() - recordStartRef.current) / 1000));
        setSelectedVideo(file);
        setDuration(recordedSeconds);
        setEndTime(recordedSeconds);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      setMode('record');
      setRecordingSeconds(0);
      recordStartRef.current = Date.now();
      recorder.start();
      setIsRecording(true);
    } catch {
      setError('移대찓?쇱? 留덉씠??沅뚰븳???덉슜?댁빞 吏곸젒 ?뱁솕?????덉뒿?덈떎.');
    } finally {
      setIsStartingRecording(false);
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setIsRecording(false);
  }

  function validateForm() {
    if (!videoFile) return '遺꾩꽍???곸긽???낅줈?쒗븯嫄곕굹 ?뱁솕??二쇱꽭??';
    if (!fileName.trim()) return '?뚯씪 ?대쫫???낅젰??二쇱꽭??';
    if (!intent.trim()) return '?대쾲 ?곗뒿???섎룄??紐⑺몴瑜??낅젰??二쇱꽭??';
    if (duration <= 0) return '?곸긽 ?뺣낫瑜??쎌? ???ㅼ떆 ?쒕룄??二쇱꽭??';
    if (duration > MAX_DURATION_SECONDS) {
      return `?곸긽???덈Т 湲몄뼱??理쒕? ${MAX_DURATION_SECONDS / 60}遺?. ??吏㏃? ?곸긽?쇰줈 ?щ젮 二쇱꽭??`;
    }

    return '';
  }

  async function analyzeVideo() {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!videoFile) return;

    trackCoachStep('analyze_clicked');
    setIsAnalyzing(true);
    setError('');
    setFeedback(null);
    setSessionId(null);

    try {
      const blob = await uploadBlob(`coach/${Date.now()}-${videoFile.name}`, videoFile, {
        access: 'public',
        handleUploadUrl: '/api/coach/upload',
        contentType: videoFile.type || undefined,
        multipart: videoFile.size > 100 * 1024 * 1024,
      });
      trackCoachStep('upload_done');

      const response = await fetch(analyzeUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: blob.url,
          fileName: fileName.trim(),
          mimeType: videoFile.type || 'video/mp4',
          category,
          intent: intent.trim(),
          startTime,
          endTime,
        }),
      });
      const payload = (await response.json()) as { feedback?: CoachFeedback; sessionId?: string; error?: string };

      if (!response.ok || !payload.feedback) {
        throw new Error(payload.error ?? '遺꾩꽍 ?붿껌???ㅽ뙣?덉뒿?덈떎.');
      }

      setFeedback(payload.feedback);
      setSessionId(payload.sessionId ?? null);
      trackCoachStep('result_shown');
    } catch (caught) {
      trackCoachStep('error');
      setError(caught instanceof Error ? caught.message : '遺꾩꽍 ?붿껌???ㅽ뙣?덉뒿?덈떎.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="coach-page mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:px-8 lg:py-8">
      <section ref={inputSectionRef} className="flex flex-col gap-5">
        <header className="flex items-center justify-between border-b border-line/80 pb-4">
          <Link href="/" className="text-xl font-black tracking-tight text-ink" aria-label="acttub ??>
            act<span className="text-primary">tub</span>
          </Link>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary-deep">
            {badge}
          </span>
        </header>

        <section className="rounded-2xl border border-line bg-white/88 p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">?곌린 ?곗뒿 ?쇰뱶諛?/h1>
              <p className="mt-1 text-sm font-medium text-muted">?곸긽 援ш컙怨??섎룄瑜?湲곗??쇰줈 AI媛 ?곗뒿 ?쇰뱶諛깆쓣 留뚮벊?덈떎.</p>
            </div>
            <div className="flex rounded-xl border border-line bg-surface-muted p-1">
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  mode === 'upload' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                <Upload size={16} />
                ?낅줈??
              </button>
              <button
                type="button"
                onClick={() => setMode('record')}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  mode === 'record' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                <Camera size={16} />
                ?뱁솕
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {mode === 'upload' ? (
              <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-primary/50 bg-primary-soft/55 p-5 text-center transition hover:bg-primary-soft">
                <FileVideo className="text-primary-deep" size={28} />
                <span className="mt-3 text-sm font-bold text-ink">
                  {videoFile ? '?낅줈???꾨즺' : '?곸긽 ?뚯씪 ?좏깮'}
                </span>
                <span className="mt-1 max-w-full truncate text-xs text-muted">{selectedVideoLabel}</span>
                <span className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary-deep">
                  {videoFile ? '?ㅻⅨ ?곸긽 ?좏깮' : '?뚯씪 怨좊Ⅴ湲?}
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="video/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setSelectedVideo(file);
                  }}
                />
              </label>
            ) : (
              <div className="flex min-h-32 flex-col justify-center rounded-xl border border-line bg-surface-muted p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-ink">
                  <Mic size={18} />
                  {isStartingRecording
                    ? '沅뚰븳 ?붿껌 以?
                    : isRecording
                      ? `?뱁솕 以?${formatTime(recordingSeconds)}`
                      : '釉뚮씪?곗? ?뱁솕'}
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">
                  ?쒖옉???꾨Ⅴ硫?釉뚮씪?곗???移대찓??留덉씠??沅뚰븳 李쎌씠 ?대┰?덈떎.
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={isRecording || isStartingRecording}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-sm font-bold text-white transition hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isStartingRecording ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                    {isStartingRecording ? '沅뚰븳 ?뺤씤' : '?쒖옉'}
                  </button>
                  <button
                    type="button"
                    onClick={stopRecording}
                    disabled={!isRecording}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CircleStop size={16} />
                    ?뺤?
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-line bg-white p-4">
              <label className="text-xs font-bold uppercase tracking-wide text-muted">?뚯씪 ?대쫫</label>
              <input
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                className={`mt-2 ${fieldClass()}`}
                placeholder="?? ?꾨┸ 3留??낅갚"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label>
                  <span className="text-xs font-bold uppercase tracking-wide text-muted">遺꾨쪟</span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className={`mt-2 ${fieldClass()}`}
                  >
                    {ACTING_CATEGORIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-muted">?곸긽 湲몄씠</span>
                  <div className="mt-2 rounded-xl border border-line bg-surface-muted px-3 py-2.5 text-sm font-bold text-ink">
                    {duration > 0 ? formatTime(duration) : '??}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-2 text-sm font-black text-ink">
            <Sparkles size={18} />
            ?곸긽 誘몃━蹂닿린
          </div>
          <p className="mt-2 text-xs font-medium text-muted">
            {videoFile
              ? `${videoFile.name} ?낅줈?쒕맖 ??援ш컙???곕줈 ?먮? ?꾩슂 ?놁뼱?? AI媛 ?곌린 ?쒖옉쨌?앹쓣 ?먮룞?쇰줈 李얠븘 遺꾩꽍?댁슂.`
              : '?곸긽留??щ━硫?AI媛 ?곌린 援ш컙???먮룞?쇰줈 李얠븘 遺꾩꽍?댁슂. ?곕줈 援ш컙???먮Ⅴ吏 ?딆븘???쇱슂. (理쒕? 10遺?'}
          </p>

          <div className="mt-4 overflow-hidden rounded-xl bg-black">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                playsInline
                onLoadedMetadata={onVideoMetadata}
                className="aspect-video w-full bg-black object-contain"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center text-sm font-semibold text-white/70">
                ?곸긽 ?湲?以?
              </div>
            )}
          </div>

          {duration > 0 ? (
            <p className="mt-3 text-xs font-medium text-muted">
              ?곸긽 湲몄씠 {formatTime(duration)} 쨌 ?꾩껜?먯꽌 ?곌린 援ш컙???먮룞?쇰줈 ?≪븘 遺꾩꽍?댁슂.
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
          <label className="text-sm font-black text-ink">?곌린 ?섎룄</label>
          <textarea
            value={intent}
            onChange={(event) => {
              if (!intent.trim() && event.target.value.trim()) trackCoachStep('intent_entered');
              setIntent(event.target.value);
            }}
            className={`mt-3 min-h-28 resize-y ${fieldClass()}`}
            placeholder="?? 寃됱쑝濡쒕뒗 移⑥갑?섏?留??띿쑝濡쒕뒗 臾대꼫吏???몃Ъ??蹂댁뿬二쇨퀬 ?띕떎."
          />

          {error ? (
            <div className="mt-4 rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={analyzeVideo}
            disabled={isAnalyzing}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {isAnalyzing ? '遺꾩꽍 以? : 'AI濡?遺꾩꽍'}
          </button>
        </section>
      </section>

      <aside className="flex flex-col gap-5 lg:sticky lg:top-8 lg:max-h-[calc(100dvh-4rem)] lg:overflow-auto">
        {feedback ? (
          <>
            <OverallBlock overall={feedback.overall} />
            <StrengthBlock strength={feedback.strength} />
            <FocusBlock focus={feedback.focus} />
            <NextStepBlock nextStep={feedback.nextStep} onRetake={handleRetake} />
            <Link
              href={sessionId ? `/form/review?s=${encodeURIComponent(sessionId)}` : '/form/review'}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-surface-muted"
            >
              <PencilLine size={18} />
              ?쇰뱶諛??대븷?섏슂? 由щ럭 ?④린湲?
            </Link>
          </>
        ) : (
          <section className="rounded-2xl border border-dashed border-line bg-white/70 p-5 text-sm leading-6 text-muted">
            ?곸긽怨??섎룄瑜??낅젰????遺꾩꽍?섎㈃, ?섎맂 ?쒓컙 ?섎굹? ?대쾲?????섎굹 怨좎튌 ?? 洹몃━怨??ㅼ쓬 ??嫄몄쓬??移대뱶濡??쒖떆?⑸땲??
          </section>
        )}

        <section className="rounded-2xl border border-line bg-white p-4 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-black text-ink">
            <PencilLine size={18} />
            硫붾え
          </label>
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            className={`mt-3 min-h-36 resize-y ${fieldClass()}`}
            placeholder="遺꾩꽍??蹂닿퀬 ?좎삤瑜??ㅼ쓬 ?곗뒿 硫붾え"
          />
        </section>
      </aside>
    </div>
  );
}

import type { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';
import Providers from './Providers';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:4000'),
  title: 'acttub',
  description: '?곌린?섎뒗 ?щ엺?ㅼ쓽 而ㅻ??덊떚? ?꾧뎄??',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { initAnalytics, trackPageView } from '../lib/analytics';

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (pathname) trackPageView(pathname);
  }, [pathname]);

  return <>{children}</>;
}


codex
보조증거는 coach 엔진/샘플 생성 코드를 건드리면 바로 capacity 침범입니다. 기존 정적 이미지 자산이 있는지 확인해서 “재사용만” 가능한지 보겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-ChildItem -Recurse -File web\\public | Select-Object -ExpandProperty FullName" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg -n 'FALLBACK_FEEDBACK|fallback|Feedback|coachFeedbackCards|인스타|instagram|StoryCapture|scene|장면|sample|샘플|image|png|jpg|webp' web\\src web\\public web\\scripts" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Raw web\\src\\coach\\evaluation.ts; Get-Content -Raw web\\src\\views\\coachFeedbackCards.tsx; Get-Content -Raw web\\src\\components\\StoryCaptureCanvas.tsx" in C:\soma\repos\acttub
 succeeded in 639ms:
export const ACTING_CATEGORIES = [
  '?낅갚',
  '???,
  '?ㅻ뵒??,
  '媛먯젙?곌린',
  '諛쒖꽦/諛쒖쓬',
  '利됲씎',
] as const;

export type ActingCategory = (typeof ACTING_CATEGORIES)[number];

export type EvaluationInput = {
  fileName: string;
  category: string;
  intent: string;
  startTime: number;
  endTime: number;
};

// SOMA-60/62 ?⑥씪 珥덉젏 移대뱶. 諛곗슦媛 蹂대뒗 ?쒕㈃? ??踰덉뿉 ?섎굹(???섎굹)留?吏싲뒗??
// ?대? ?쇰꺼(axis/tier/root)? ?곗씠?곗뿏 ?덈릺 ?붾㈃??諛곗슦 ?몄뼱濡쒕쭔 ?몄텧?쒕떎.

// SOMA-59 4異???肄붾뱶媛?(SOMA-62 짠3)
export type FeedbackAxis = 'emotion' | 'speech' | 'face' | 'movement';

// ?섎룄 異쒖쿂 ??諛곗슦 ?낅젰 / AI 異붿젙 / 諛곗슦 ?뺤씤 (SOMA-60 釉붾줉0)
export type IntentSource = 'actor_input' | 'ai_inferred' | 'actor_confirmed';

// 媛뺤젏 怨꾨떒???대갚 ???ㅽ뻾 媛뺤젏 ???쒕룄쨌?좏깮 ???뺤쭅??寃⑸젮 (SOMA-60)
export type StrengthTier = 'execution' | 'attempt' | 'encouragement';

// ?ㅼ쓬 ??嫄몄쓬 ?됰룞 醫낅쪟 (SOMA-62)
export type NextAction = 'retake_selected_range';

const FEEDBACK_AXES: readonly FeedbackAxis[] = ['emotion', 'speech', 'face', 'movement'];
const INTENT_SOURCES: readonly IntentSource[] = ['actor_input', 'ai_inferred', 'actor_confirmed'];
const STRENGTH_TIERS: readonly StrengthTier[] = ['execution', 'attempt', 'encouragement'];

// 釉붾줉0 ???섎룄 ?섏쭦湲?
export type SceneIntent = {
  text: string;
  source: IntentSource;
};

// 釉붾줉1 ???섎맂 ?쒓컙 (?꾩닔 1媛? ?대갚 tier?쇰룄 梨꾩?)
export type FeedbackStrength = {
  timecode: string;
  axis: FeedbackAxis;
  signal: string; // 臾댁뾿??蹂댁???(愿李?
  why: string; // ??醫뗭븯??(?섎룄?濡??묐룞??吏??
  tier: StrengthTier;
};

// 釉붾줉2 ???대쾲?????섎굹 (?뺥솗??1媛? ?섎룄 寃⑹감濡??좎젙)
export type FeedbackFocus = {
  timecode: string;
  axes: FeedbackAxis[];
  observedSignal: string; // ?대뵒?쑣룸Т?뉗씠
  rootCause: string; // ??(root, ?섎룄 寃⑹감濡?
  intentGap: string; // ?섎젮??寃??鍮??대젃寃?蹂댁???
  prescription: string; // 臾댁뾿?꽷룹뼱?산쾶 怨좎튂??(?뱀옣 1以?
};

// 釉붾줉3 ???ㅼ쓬 ??嫄몄쓬 (?됰룞쨌踰붿쐞留? 泥섎갑 諛섎났 湲덉?)
export type FeedbackNextStep = {
  text: string;
  action: NextAction;
};

// 釉붾줉0.5 ???ㅼ텞 ?꾧꼍 (?좏깮, coach-second v2留?梨꾩?). rev.7: ?⑥씪 珥덉젏 ?꾩뿉 異뺣퀎 ?곹깭瑜??밸뒗??
// 肄붿튂???ㅼ텞?쇰줈 ??蹂???1?명듃留?以????蹂?寃껋쓣 諛곗슦?먭쾶 ?뚮젮二쇰뒗 痢?(Confluence 18153475 짠3-1).
export type OverallBand = 'good' | 'mid' | 'weak';
export type OverallAxisKey = 'emotion' | 'speech' | 'movement' | 'audience';

export type FeedbackAxisBand = {
  axis: OverallAxisKey;
  label: string; // 諛곗슦 ?몄뼱 ?쇰꺼(媛먯젙쨌????꾨떖쨌?쒖젙쨌紐몄쭞쨌愿媛?諛섏쓳) ???대? ?ㅻ뒗 ?몄텧?섏? ?딅뒗??
  band: OverallBand; // good=?섎룄?濡?/ mid=?붾뱾由?/ weak=?닿툔??
  text: string; // ?뚯텞횞諛대뱶 臾멸뎄???ъ쟾?먯꽌 ??媛숈? 諛대뱶 ??媛숈? 臾멸뎄(硫깅벑)
};

export type FeedbackOverall = {
  axisBands?: FeedbackAxisBand[]; // rev.7 4異??곹깭 ?꾧꼍 (UI 二쇰젰)
  text?: string; // ?섏쐞?명솚 ????臾몃떒 ?붿빟(?덉쑝硫?fallback)
};

export type CoachFeedback = {
  sceneIntent: SceneIntent;
  overall?: FeedbackOverall;
  strength: FeedbackStrength;
  focus: FeedbackFocus;
  nextStep: FeedbackNextStep;
};

const FALLBACK_FEEDBACK: CoachFeedback = {
  sceneIntent: {
    text: '?섎룄瑜??ㅼ떆 ?쎌? 紐삵뻽?댁슂. ?섎룄 ?ㅻ챸????援ъ껜?곸쑝濡??낅젰?섍퀬 ?ㅼ떆 遺꾩꽍??二쇱꽭??',
    source: 'ai_inferred',
  },
  strength: {
    timecode: '0:00',
    axis: 'emotion',
    signal: '?묐떟 ?뺤떇??源⑥졇 ?섎맂 ?쒓컙??遺꾨━?섏? 紐삵뻽?댁슂.',
    why: '???λ㈃???앷퉴吏 ?대낯 ?쒕룄 ?먯껜???ㅼ쓬 遺꾩꽍??異쒕컻?먯씠 ?쇱슂.',
    tier: 'encouragement',
  },
  focus: {
    timecode: '0:00',
    axes: ['emotion'],
    observedSignal: '遺꾩꽍 寃곌낵瑜?援ъ“?뷀븯吏 紐삵뻽?댁슂.',
    rootCause: '?묐떟 ?뺤떇??留욎? ?딆븯?댁슂. ?곸긽怨??섎룄???꾨떖?먯뼱??',
    intentGap: '',
    prescription: '媛숈? ?곸긽?쇰줈 ?ㅼ떆 遺꾩꽍???붿껌?섍굅?? ?섎룄 ?ㅻ챸????援ъ껜?곸쑝濡??곸뼱 二쇱꽭??',
  },
  nextStep: {
    text: '媛숈? 援ш컙?쇰줈 ?ㅼ떆 遺꾩꽍??蹂닿린',
    action: 'retake_selected_range',
  },
};

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';

  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;

  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

// L2 醫낇빀(Synthesizer): ?섎Ⅴ?뚮굹 ?좏샇 ??諛곗슦媛 諛붾줈 ?쎌쓣 ?⑥씪 珥덉젏 移대뱶.
// ?덉쭏???遺遺꾩씠 ?ш린??媛덈┛?? (SOMA-60 移대뱶 援ъ“ + SOMA-63 ??
export function buildSynthesisPrompt(input: {
  category: string;
  intent: string;
  signals: string;
}) {
  return `
?뱀떊? ?섏꽍 ?곌린 肄붿튂?낅땲?? ?꾨옒??媛먯젙쨌?붿닠쨌?좎껜 肄붿튂? 愿媛앹씠 媛숈? ?곸긽??蹂닿퀬 ???좏샇?낅땲??
?닿쾬?ㅼ쓣 諛곗슦媛 諛붾줈 ?쎌쓣 "?⑥씪 珥덉젏 ?쇰뱶諛?移대뱶" ?섎굹濡?醫낇빀?섏꽭?? ??踰덉뿉 ?섎굹留?吏싳뒿?덈떎.

遺꾨쪟: ${input.category}
諛곗슦媛 諛앺엺 ?곌린 ?섎룄: ${input.intent}

?섎Ⅴ?뚮굹 ?좏샇(JSON):
${input.signals}

移대뱶 援ъ꽦(諛섎뱶????4釉붾줉):
0. scene_intent ??諛곗슦 ?섎룄瑜???臾몄옣?쇰줈 ?섏쭦?붾떎. ?섎룄媛 二쇱뼱議뚯쑝硫?source??"actor_input".
1. strength ???섎룄?濡??묐룞??"?섎맂 ?쒓컙" 1媛? timecode + 臾댁뾿??蹂댁???signal) + ??醫뗭븯??why).
   - 吏꾩쭨 ?ㅽ뻾 媛뺤젏???덉쑝硫?tier="execution".
   - ?ㅽ뻾 媛뺤젏???놁쑝硫?援ъ껜???쒕룄쨌?좏깮??tier="attempt"濡? 洹멸쾬???놁쑝硫??뺤쭅??寃⑸젮瑜?tier="encouragement"濡?
   - ?덈? 嫄곗쭞쨌異붿긽 移?갔("醫뗭븯?댁슂") 湲덉?. 媛뺤젏? 諛섎뱶??1媛?梨꾩슫??
2. focus ??"?대쾲?????섎굹". root ?먯씤??1媛쒕쭔 怨좊Ⅸ??
   - 怨좊Ⅴ??湲곗?: "?쒖씪 紐삵븳 寃????꾨땲??"諛곗슦媛 ?섎젮??嫄?媛??留됱? 寃?(?섎룄 寃⑹감 理쒕?).
   - observed_signal(?대뵒?쑣룸Т?뉗씠) ??root_cause(?? ?쒕㈃ 利앹긽 留먭퀬 肉뚮━) ??intent_gap(?섎젮??寃??鍮??대젃寃?蹂댁??? ??prescription(臾댁뾿???대뼸寃? ?뱀옣 ?대낵 ??以?.
3. next_step ??洹?泥섎갑??吏湲?諛붾줈 ?섍쾶 留뚮뱶???됰룞 1媛? ?됰룞쨌踰붿쐞留??? "?꾩엯遺留??ㅼ떆"). 泥섎갑 臾몄옣??諛섎났?섏? ?딅뒗??

醫낇빀 洹쒖튃(諛섎뱶??吏??寃?:
0. ?쇰? 肄붿튂 ?좏샇媛 鍮꾩뼱 ?덇굅???꾨씫?????덈떎. ?녿뒗 ?좏샇??吏?대궡吏 留먭퀬, 二쇱뼱吏??좏샇留뚯쑝濡?醫낇빀?쒕떎.
1. 媛숈? timecode???щ윭 ?섎Ⅴ?뚮굹媛 紐곕┛ 吏?먯쓣 ?곗꽑?쒕떎(?щ윭 ?뚯쫰媛 ?숈쓽 = 以묒슂).
2. 肄붿튂 ?섍껄怨?愿媛??몄긽??媛덈━??吏???섎룄 ???몄긽)??focus??root濡??щ┛?? 諛곗슦媛 媛??紐⑤Ⅴ???뺣낫??
3. 紐⑤뱺 釉붾줉? timecode ?먮뒗 ????몄슜?쇰줈 "?대뵒??瑜?諛뺣뒗?? 異붿긽 湲덉?.
4. 諛곗슦 ?몄뼱濡??대떎. 2?몄묶 議대뙎留?~?덉뼱?? ~?대킄??, ?쒖븞??~?대낫硫??대븣??. ?됯?愿쨌?ъ궗 ??湲덉?.
5. 愿李곗? ?⑥젙?대룄 ?섏?留?援녹뼱 ?덉뿀?댁슂), 異붿젙? "~媛숈븘??濡??ъ?瑜??④릿??
6. ?대? ?쇰꺼? text??洹몃?濡??곗? ?딅뒗?? axis/tier/axes??遺꾨쪟 ?꾨뱶濡쒕쭔 梨꾩슦怨? signal/why/root_cause/prescription 媛숈? 臾몄옣??諛곗슦 ?몄뼱濡?????대떎.
7. 異붿긽?겶룸Ц?숈쟻 ?쒗쁽('?ㅻŉ?좊떎','?뱀븘?좊떎') 湲덉?. 移대찓?쇱뿉 ???≫엺 遺遺꾩? ?ㅻ（吏 ?딅뒗??

axis/axes 媛믪? emotion(媛먯젙 ?쒗쁽) 쨌 speech(????꾨떖?? 쨌 face(?쒖젙쨌?쒖꽑) 쨌 movement(?吏곸엫) 以묒뿉?쒕쭔 怨좊Ⅸ??

諛섎뱶???꾨옒 JSON留?諛섑솚?섏꽭?? 留덊겕?ㅼ슫 肄붾뱶釉붾줉? ?곗? 留덉꽭??
{
  "scene_intent": { "text": "???λ㈃?먯꽌 ?대젃寃??섎젮 ?섏뀲二?, "source": "actor_input" },
  "strength": { "timecode": "0:48", "axis": "emotion", "signal": "愿李곕맂 ?섎맂 ?쒓컙(????몄슜/?됰룞)", "why": "?닿쾶 ???섎룄?濡쒖???, "tier": "execution" },
  "focus": { "timecode": "0:00-0:15", "axes": ["emotion"], "observed_signal": "?대뵒??臾댁뾿??, "root_cause": "??肉뚮━)", "intent_gap": "?섎젮??寃??鍮??대젃寃?蹂댁???, "prescription": "臾댁뾿???대뼸寃??뱀옣 ??以?" },
  "next_step": { "text": "?꾩엯遺留??ㅼ떆", "action": "retake_selected_range" }
}
`.trim();
}

function extractJson(rawText: string) {
  const trimmed = rawText.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);

  return trimmed;
}

function textField(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function enumField<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function axesField(value: unknown): FeedbackAxis[] {
  if (!Array.isArray(value)) return [];
  const axes = value
    .map((item) => (typeof item === 'string' && (FEEDBACK_AXES as readonly string[]).includes(item) ? (item as FeedbackAxis) : null))
    .filter((item): item is FeedbackAxis => item !== null);
  return Array.from(new Set(axes));
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function parseSceneIntent(value: unknown): SceneIntent {
  const data = record(value);
  const text = textField(data.text);
  if (!text) return FALLBACK_FEEDBACK.sceneIntent;
  return {
    text,
    source: enumField(data.source, INTENT_SOURCES, 'actor_input'),
  };
}

function parseStrength(value: unknown): FeedbackStrength {
  const data = record(value);
  const signal = textField(data.signal);
  const why = textField(data.why);
  // 媛뺤젏? ?꾩닔 ??愿李곕룄 ?댁쑀??鍮꾨㈃ ?대갚?쇰줈 梨꾩슫??
  if (!signal && !why) return FALLBACK_FEEDBACK.strength;
  return {
    timecode: textField(data.timecode) || '0:00',
    axis: enumField(data.axis, FEEDBACK_AXES, 'emotion'),
    // ?쒖そ留??ㅻ㈃ 洹?臾몄옣??signal濡??곌퀬 why??鍮꾩슫????媛숈? 臾몄옣 以묐났 ?몄텧 諛⑹?.
    signal: signal || why,
    why: signal ? why : '',
    tier: enumField(data.tier, STRENGTH_TIERS, 'attempt'),
  };
}

function parseFocus(value: unknown): FeedbackFocus {
  const data = record(value);
  const observedSignal = textField(data.observed_signal);
  const rootCause = textField(data.root_cause);
  const prescription = textField(data.prescription);
  // 泥섎갑 ?녿뒗 移대뱶??諛섎젮(SOMA-60 遺덊빀寃?湲곗? "泥섎갑????) ???대갚.
  // root ?꾨씫? ?꾨＼?꾪듃媛 留됯퀬, ?뚯꽌??理쒖냼??泥섎갑)留?媛뺤젣?쒕떎.
  if (!prescription) return FALLBACK_FEEDBACK.focus;
  const axes = axesField(data.axes);
  return {
    timecode: textField(data.timecode) || '0:00',
    axes: axes.length > 0 ? axes : ['emotion'],
    observedSignal,
    rootCause,
    intentGap: textField(data.intent_gap),
    prescription,
  };
}

function parseNextStep(value: unknown): FeedbackNextStep {
  const data = record(value);
  const text = textField(data.text);
  if (!text) return FALLBACK_FEEDBACK.nextStep;
  return {
    text,
    action: enumField(data.action, ['retake_selected_range'] as const, 'retake_selected_range'),
  };
}

export function parseGeminiFeedback(rawText: string): CoachFeedback {
  try {
    const parsed = JSON.parse(extractJson(rawText)) as Record<string, unknown>;

    return {
      sceneIntent: parseSceneIntent(parsed.scene_intent),
      strength: parseStrength(parsed.strength),
      focus: parseFocus(parsed.focus),
      nextStep: parseNextStep(parsed.next_step),
    };
  } catch {
    return FALLBACK_FEEDBACK;
  }
}

import {
  type FeedbackFocus,
  type FeedbackNextStep,
  type FeedbackOverall,
  type FeedbackStrength,
  type OverallBand,
} from '../coach/evaluation';

// SOMA-60 ?⑥씪 珥덉젏 移대뱶 ???꾟넂?꾨옒 ?뺤꽌 ?ㅺ퀎:
// ?섎룄 ?뺤씤 ??媛뺤젏(?덉떖) ?????섎굹(?듭떖) ???ㅼ쓬 ??嫄몄쓬.
// ?대? ?쇰꺼(axis/tier/axes enum)? ?몄텧?섏? ?딄퀬, 諛곗슦 ?몄뼱 臾몄옣留?蹂댁뿬以??
// /coach ? /test(鍮좊Ⅸ ?뚯뒪??媛 媛숈? 寃곌낵 移대뱶瑜?怨듭쑀?쒕떎.

// ?ㅼ텞 ?꾧꼍(rev.7) ???⑥씪 珥덉젏 ?꾩뿉 4異??곹깭瑜??쒕늿?? 肄붿튂媛 ??蹂???1?명듃瑜?二쇰벏,
// 諛곗슦?먭쾶 "?꾩껜?곸쑝濡??대뵒媛 醫뗪퀬 ?대뵒媛 ?꾩돩?댁?" 癒쇱? ?뚮젮以??泥섎갑 移대뱶媛 ?쒓컖 二쇱씤怨듭? ?좎?).
const BAND_WORD: Record<OverallBand, string> = { good: '醫뗭쓬', mid: '蹂댄넻', weak: '?꾩돩?' };
const BAND_TONE: Record<OverallBand, string> = {
  good: 'text-success',
  mid: 'text-muted',
  weak: 'text-danger',
};

export function OverallBlock({ overall }: { overall?: FeedbackOverall }) {
  const bands = overall?.axisBands ?? [];

  if (bands.length === 0) {
    if (!overall?.text) return null;
    return (
      <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span aria-hidden="true">?렗</span>
          <h3 className="text-sm font-black text-ink">?꾩껜?곸쑝濡?蹂대㈃</h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-foreground">{overall.text}</p>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">?렗</span>
        <h3 className="text-sm font-black text-ink">?꾩껜?곸쑝濡?蹂대㈃</h3>
      </div>
      <ul className="mt-3 grid gap-2">
        {bands.map((band) => (
          <li key={band.axis} className="grid grid-cols-[5.5rem_auto_1fr] items-baseline gap-x-2 text-sm leading-6">
            <span className="font-bold text-ink">{band.label}</span>
            <span className={`text-xs font-bold ${BAND_TONE[band.band]}`}>{BAND_WORD[band.band]}</span>
            <span className="text-muted">{band.text}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function StrengthBlock({ strength }: { strength: FeedbackStrength }) {
  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">?몡</span>
        <h3 className="text-sm font-black text-ink">?섎맂 ?쒓컙</h3>
        <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold text-ink">
          {strength.timecode}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-foreground">{strength.signal}</p>
      {strength.why ? (
        <p className="mt-1 text-sm leading-6 text-primary-deep">{strength.why}</p>
      ) : null}
    </article>
  );
}

export function FocusBlock({ focus }: { focus: FeedbackFocus }) {
  const rows: { label: string; value: string; emphasis?: boolean }[] = [
    { label: '?대뵒??, value: focus.observedSignal },
    { label: '??, value: focus.rootCause },
    { label: '?대젃寃?蹂댁??댁슂', value: focus.intentGap },
    { label: '?대젃寃??대킄??, value: focus.prescription, emphasis: true },
  ];

  return (
    <article className="rounded-xl border border-primary/40 bg-primary-soft/40 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">?렞</span>
        <h3 className="text-sm font-black text-ink">?대쾲?????섎굹</h3>
        {focus.timecode ? (
          <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-bold text-primary-deep">
            {focus.timecode}
          </span>
        ) : null}
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6">
        {rows
          .filter((row) => row.value)
          .map((row) => (
            <div key={row.label} className="grid grid-cols-[6rem_1fr] gap-2">
              <dt className={`font-bold ${row.emphasis ? 'text-primary-deep' : 'text-muted'}`}>
                {row.label}
              </dt>
              <dd className={row.emphasis ? 'font-semibold text-ink' : 'text-foreground'}>{row.value}</dd>
            </div>
          ))}
      </dl>
    </article>
  );
}

export function NextStepBlock({ nextStep, onRetake }: { nextStep: FeedbackNextStep; onRetake: () => void }) {
  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">??/span>
        <h3 className="text-sm font-black text-ink">?ㅼ쓬 ??嫄몄쓬</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-foreground">{nextStep.text}</p>
      <button
        type="button"
        onClick={onRetake}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-deep"
      >
        ?ъ눋?곹븯怨?鍮꾧탳諛쏄린
      </button>
    </article>
  );
}

/**
 * StoryCaptureCanvas ???몄뒪? ?ㅽ넗由?9:16) ?꾩슜 罹≪쿂 罹붾쾭??
 *
 * ?붾㈃????蹂댁씠??540x960 ?ㅽ봽?ㅽ겕由?DOM. 怨듭쑀 ??html-to-image濡?
 * ???몃뱶瑜?PNG濡?蹂????pixelRatio 2 ?곸슜??理쒖쥌 1080x1920 異쒕젰.
 * Story 鍮꾩쑉??留욎떠 ?섎┝/?щ갚 ?놁씠 源붾걫?섍쾶 ?щ씪媛?꾨줉.
 */

import { forwardRef } from 'react';
import type { TypeContent } from '../content/schema';

type Props = {
  type: TypeContent;
};

const StoryCaptureCanvas = forwardRef<HTMLElement, Props>(function StoryCaptureCanvas(
  { type },
  ref
) {
  return (
    <div className="story-canvas-wrapper" aria-hidden="true">
    <section
      ref={ref}
      className="story-canvas"
      data-type={String(type.index).padStart(2, '0')}
    >
      <header className="story-canvas__header">
        <span className="story-canvas__brand">acttub.com</span>
        <span className="story-canvas__dot">쨌</span>
        <span className="story-canvas__tag">?곌린 ?ㅽ???MBTI</span>
      </header>

      <div className="story-canvas__hero">
        <img
          src={`/characters/${type.code}.png`}
          alt=""
          className="story-canvas__avatar"
        />
        <div className="story-canvas__badge">{type.code}</div>
      </div>

      <div className="story-canvas__body">
        <h1 className="story-canvas__name">{type.name}</h1>
        <p className="story-canvas__tagline">"{type.tagline}"</p>
        <ul className="story-canvas__traits">
          {type.traits.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      <footer className="story-canvas__footer">
        <div className="story-canvas__cta-url">acttub.com</div>
        <div className="story-canvas__cta-sub">?덉쓽 ?곌린 寃? 1遺?吏꾨떒</div>
      </footer>
    </section>
    </div>
  );
});

export default StoryCaptureCanvas;


 succeeded in 733ms:
web\scripts\coach2-dump.mjs:11://   node web/scripts/coach2-dump.mjs ./sample.mp4 "독백" "분노를 절제해서 표현"
web\scripts\soma-79-generate-coach-feedback.ts:30:import { buildEvaluationPrompt, parseGeminiFeedback, type CoachFeedback } from '../src/coach/evaluation';
web\scripts\soma-79-generate-coach-feedback.ts:41:// ⚠ C08·C10 은 "모음" — 단일 장면 구간으로 startSec/endSec 좁혀야 정상 분석.
web\scripts\soma-79-generate-coach-feedback.ts:83:function feedbackToRows(caseId: string, feedbackId: string, fb: CoachFeedback): (string | number)[][] {
web\scripts\soma-79-generate-coach-feedback.ts:108:async function readDoneFeedbackIds(): Promise<Set<string>> {
web\scripts\soma-79-generate-coach-feedback.ts:150:  const done = await readDoneFeedbackIds();
web\scripts\soma-79-generate-coach-feedback.ts:156:  const newFeedback: (string | number)[][] = [];
web\scripts\soma-79-generate-coach-feedback.ts:197:        const fb = parseGeminiFeedback(raw);
web\scripts\soma-79-generate-coach-feedback.ts:199:          console.warn(`[skip] ${feedbackId}: 응답 파싱 실패(fallback)`);
web\scripts\soma-79-generate-coach-feedback.ts:205:          newFeedback.push([feedbackId, c.caseId, PROMPT_VERSION, JSON.stringify(fb), rows.length, fb.alignedMoments.length > 0 ? 'Y' : 'N', axes]);
web\scripts\soma-79-generate-coach-feedback.ts:223:  await appendCsv(FEEDBACK_PATH, FEEDBACK_HEADERS, newFeedback);
web\scripts\soma-79-generate-coach-feedback.ts:225:  console.log(`\n이번 실행: 문장 +${newLabeling.length} / 피드백 +${newFeedback.length}건${quotaHit ? ' (quota 중단)' : ''}`);
web\scripts\out\feedback.csv:3:C01-r02,C01,v1-prod,"{""summary"":""대상의 감정적 변화를 호흡과 한숨으로 표현하려 노력했으나, 인물의 내면 깊은 불안감보다는 단순한 불평과 짜증에 가깝게 보입니다. 떨리는 호흡이 대사 전반에 스며들어 불안한 상태가 입체적으로 드러나도록 디테일을 살리는 연습이 필요합니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":72,""note"":""짜증과 억울함은 잘 느껴지나, 불안감이라는 감정의 깊이가 다소 얕게 전달됩니다.""},{""label"":""대사 전달"",""score"":78,""note"":""발음이 명확하고 대사의 속도 조절이 좋아 말하고자 하는 바가 잘 들립니다.""},{""label"":""신체 표현"",""score"":70,""note"":""움직임이 거의 없어 경직되어 보이며, 시선 처리가 단조로워 감정의 변화가 시각적으로 크게 와닿지 않습니다.""},{""label"":""의도 부합"",""score"":74,""note"":""한숨과 같은 호흡을 적극적으로 활용했으나, 의도했던 '떨리는 호흡을 통한 불안감'보다는 단순히 한탄하는 어조로 연출되었습니다.""}],""weaknesses"":[""대사와 호흡이 분리되어 인물의 불안한 내면이 대사 자체에 묻어나지 않음"",""시선이 한곳에만 고정되어 가상의 상대방(아빠)과의 상호작용이 약해 보임"",""감정이 고조될 때 몸의 움직임이나 어깨의 긴장도 변화가 부족하여 정적인 느낌을 줌""],""alignedMoments"":[""00:00~00:03 도입부에서 한숨을 크게 쉬며 답답하고 불안한 인물의 심리 상태를 직관적으로 예고한 장면"",""00:39~00:45 억울함을 토로하다가 고개를 떨구며 허탈해하는 순간의 신체 반응""],""practiceRecommendations"":[""문장 사이에만 호흡을 넣지 말고, 말을 하면서도 호흡이 불규칙하게 떨리도록 '말 속의 호흡'을 훈련하세요."",""상대방의 가상 반응을 더 구체적으로 상상하여, 그에 맞춰 시선을 미세하게 이동하거나 몸을 들썩이는 리액션을 추가해 보세요."",""불안할 때 몸이 떨리거나 손을 꼼지락거리는 등의 신체적 습관(버릇)을 설정하여 연기해 보세요.""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:4:C01-r03,C01,v1-prod,"{""summary"":""인물이 가진 답답함과 억울함을 자연스러운 구어체 톤과 호흡으로 소화해낸 점이 돋보입니다. 다만 단순한 투정이나 짜증을 넘어선 내면의 깊은 불안감을 신체와 시선, 그리고 보다 정교한 떨림 호흡으로 확장시킨다면 장면의 몰입도가 훨씬 높아질 것입니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":76,""note"":""억울함과 속상한 감정은 잘 드러나지만, 성적이 오르지 않아 느끼는 근본적인 불안과 두려움의 감정선이 더 깊게 표현되면 좋겠습니다.""},{""label"":""대사 전달"",""score"":83,""note"":""일상적인 독백에 어울리는 자연스러운 발음과 어조를 가지고 있으며, 대사의 끝처리가 흐려지지 않고 명확하게 들립니다.""},{""label"":""신체 표현"",""score"":68,""note"":""상반신과 어깨가 지나치게 경직되어 있어 인물의 심리적 동요가 신체적 움직임이나 자세 변화로 충분히 시각화되지 못했습니다.""},{""label"":""의도 부합"",""score"":74,""note"":""첫 한숨과 고조되는 감정에서의 호흡 떨림은 의도대로 적용되었으나, 불안이라는 정서가 더 다채로운 호흡의 리듬으로 분화될 필요가 있습니다.""}],""weaknesses"":[""불안이라는 감정이 입체적이지 않고, 단순히 짜증을 내거나 아빠에게 투정을 부리는 일차원적인 톤에 머무르는 경향이 있습니다."",""카메라를 정면으로 정직하게 응시하는 시선 처리가 지속되어, 인물이 처한 상황의 공간감이나 상대방(아빠)과의 관계 설정이 평면적으로 보입니다."",""호흡이 가슴 윗선에 머물러 있어 몸 전체를 활용한 유기적인 떨림이나 신체 반응으로 이어지지 못하고 있습니다.""],""alignedMoments"":[""0:00~0:04 구간에서 대사를 시작하기 전 내쉬는 무거운 한숨을 통해 인물이 가진 답답한 전사(前史)를 직관적으로 잘 보여주었습니다."",""0:40~0:44 구간에서 '왜 맨날 나만 그대로냐고'라며 감정이 극에 달할 때 목소리와 호흡이 자연스럽게 떨리며 인물의 억울한 내면을 잘 살렸습니다.""],""practiceRecommendations"":[""불안을 느낄 때 나타나는 자신만의 신체적 버릇(손가락 꼼지락거리기, 옷자락 만지기, 입술 깨물기 등)을 설정하여 정적인 신체에 미세한 움직임을 부여해 보세요."",""상대방(아빠)의 대답을 듣는 리액션 구간(예: 0:21~0:25)에서 시선을 아래나 옆으로 미세하게 떨어뜨리며 생각을 정리하는 멈춤(Pause)을 훈련해 보세요."",""말을 뱉을 때뿐만 아니라 말을 참거나 삼킬 때의 떨리는 흡기(들이마시는 호흡)를 의식적으로 연습하여 불안의 정서를 소리 외적인 부분에서도 전달해 보세요.""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:5:C01-r04,C01,v1-prod,"{""summary"":""불안하고 답답한 감정을 떨리는 호흡과 한숨을 통해 효과적으로 표현하려 노력한 독백이었습니다. 다만, 대사의 리듬감과 신체의 움직임을 조금 더 다양하게 활용한다면 인물의 감정이 더욱 입체적으로 전달될 것입니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":78,""note"":""답답함과 억울함이라는 주된 감정은 잘 전달되었으나, 감정의 고조와 변화가 다소 단조롭게 느껴집니다.""},{""label"":""대사 전달"",""score"":75,""note"":""기본적인 발음은 명확하나, 한숨을 쉬거나 말을 흐릴 때 대사의 끝부분이 다소 뭉개지는 아쉬움이 있습니다.""},{""label"":""신체 표현"",""score"":70,""note"":""정적인 자세가 인물의 답답한 심정을 대변하기도 하지만, 신체적 긴장이나 미세한 움직임이 부족하여 다소 딱딱해 보입니다.""},{""label"":""의도 부합"",""score"":80,""note"":""떨리는 호흡과 한숨을 통해 불안하고 억울한 감정을 표현하려는 연출적 의도는 잘 드러났습니다.""}],""weaknesses"":[""대사 전달 시 어미 처리가 흐려져 중요한 단어가 명확히 들리지 않는 현상"",""신체가 경직되어 있어 감정의 변화가 외적으로 충분히 드러나지 않음"",""감정의 템포가 일정하여 장면의 극적인 흐름이 평평하게 느껴짐""],""alignedMoments"":[""0:01초 부근에서 깊은 한숨으로 인물의 답답한 심리 상태를 즉각적으로 보여준 오프닝"",""0:39초 부근에서 눈을 감고 고개를 저으며 억울함을 호소할 때의 감정적 디테일""],""practiceRecommendations"":[""신체의 긴장감을 다루기 위해 말할 때 어깨와 목의 힘을 풀고 손짓이나 가벼운 몸의 기울임을 섞어보는 연습"",""문장마다 '왜 내 성적만 그대로일까' 등 핵심 단어에 강세를 두어 대사의 억양과 리듬감을 살리는 연습"",""호흡을 뱉는 타이밍과 멈추는 타이밍을 대사 사이에 명확히 구분하여 불안함의 긴장감을 극대화하는 호흡 조절 연습""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:8:C01-r07,C01,v1-prod,"{""summary"":""불안해하고 답답해하는 고등학생의 심정을 한숨과 자연스러운 구어체로 잘 표현하였으나, 단순한 투정처럼 보이지 않도록 불안의 내적 깊이를 더하는 호흡 조절이 필요합니다. 대사의 끝처리를 명확히 하고 감정의 기승전결을 살린다면 훨씬 더 입체적인 연기가 완성될 것입니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":78,""note"":""아빠에게 투정을 부리며 느끼는 답답함과 억울함은 잘 전달되나, 인물이 가진 불안이라는 감정의 깊이가 다소 얕게 표현되었습니다.""},{""label"":""대사 전달"",""score"":74,""note"":""자연스러운 구어체 톤은 좋으나, 대사 끝처리가 흐려지거나 음량이 작아져 대사의 명확한 전달력이 다소 아쉽습니다.""},{""label"":""신체 표현"",""score"":76,""note"":""초반 한숨이나 고개를 떨구는 등 지친 인물의 상태를 신체적으로 영리하게 표현하였으나 전체적인 움직임은 다소 경직되어 있습니다.""},{""label"":""의도 부합"",""score"":75,""note"":""호흡을 활용하려는 시도는 보이나, 불안함보다는 신경질적이거나 짜증 섞인 반항심이 더 도드라져 보입니다.""}],""weaknesses"":[""말끝을 흐리는 습관으로 인해 대사 후반부의 정확한 정보 전달력이 떨어짐"",""불안이라는 핵심 감정보다 아빠에 대한 짜증과 짜증 섞인 투정이 더 부각됨"",""벽에 갇힌 듯한 좁은 프레임 안에서 신체 활용이 다소 제한적이고 단조로움""],""alignedMoments"":[""0:00~0:02 초반부에 깊은 한숨을 쉬며 인물의 무겁고 답답한 심리적 상태를 직관적으로 설정한 순간"",""0:39~0:45 성적이 오르지 않는 자신에 대한 답답함을 눈을 감고 고개를 흔드는 신체 반응과 떨리는 호흡으로 표현한 장면""],""practiceRecommendations"":[""호흡을 단순히 내뱉는 것에 그치지 말고, 불안함으로 인해 목이 메거나 호흡이 불규칙해지는 구체적인 신체 반응을 연결하여 연습하세요."",""대사의 끝음까지 소리를 일정하게 밀어내는 발성 연습을 통해 웅얼거리는 듯한 발음을 개선해 보세요."",""단순한 성적 투정을 넘어 '내가 정말 뒤처지면 어쩌지'라는 인물의 근원적인 불안감(서브텍스트)을 명확히 설정하고 대사 사이에 멈춤(Pause)을 활용해 표현해 보세요.""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:25:C04-r03,C04,v1-prod,"{""summary"":""억눌린 분노가 폭발하는 순간의 감정 변화를 날카로운 눈빛과 안정적인 대사 톤으로 훌륭히 소화했습니다. 감정이 격해질 때 목과 어깨의 긴장을 조금만 더 풀고 호흡을 안정시키면 더욱 깊이 있는 연기가 완성될 것입니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":90,""note"":""차분함 속에 숨겨진 광기와 억눌린 분노가 폭발하는 감정의 점진적 변화를 눈빛과 미세한 표정으로 훌륭히 전달했습니다.""},{""label"":""대사 전달"",""score"":88,""note"":""딕션과 어조의 끝처리가 명확하여 강한 대사 전달력을 보여주며, 적절한 멈춤(pause)을 사용해 긴장감을 유도했습니다.""},{""label"":""신체 표현"",""score"":85,""note"":""시선의 고정과 미세한 안면 근육의 움직임이 돋보이나, 감정이 폭발할 때 상체의 과도한 긴장으로 움직임이 다소 경직되어 보입니다.""},{""label"":""의도 부합"",""score"":92,""note"":""참았던 분노를 한순간에 터트리는 독백의 의도에 걸맞게 에너지를 집중시켜 몰입감 높은 명장면을 만들어냈습니다.""}],""weaknesses"":[""감정이 최고조에 달하는 순간 호흡이 다소 가빠져 발성이 목에 무리를 주는 톤으로 좁아지는 경향이 있음"",""분노를 표출할 때 어깨와 목 주변 근육에 긴장이 들어가 신체 움직임의 자연스러움이 다소 감소함"",""감정 변화가 일어나는 찰나의 순간에 템포가 빨라져 대사의 여운을 충분히 보여주지 못한 점""],""alignedMoments"":[""0:17 지점에서 정적인 태도에서 순식간에 서늘한 눈빛과 표정으로 전환되며 내면의 분노를 암시하는 순간"",""0:25 부근에서 가라앉은 호흡 뒤에 폭발적인 에너지를 뿜어내며 상대를 압도하는 대사 처리 구간""],""practiceRecommendations"":[""신체 이완 훈련: 분노가 폭발하기 직전 상체(목과 어깨)의 힘을 의도적으로 빼고 복부의 압력만으로 소리를 내지르는 신체 분리 훈련을 진행하세요."",""호흡 조절 연습: 대사가 격해질수록 대사 사이사이 '하프 브레스(Half-breath)'를 채워 넣어 소리의 끝 음까지 일정한 에너지를 유지하는 연습이 필요합니다."",""포즈(Pause) 활용 극대화: 분노를 터트리기 직전에 2~3초간의 완전한 침묵과 시선 고정을 통해 관객이 숨을 죽이게 만드는 템포 컨트롤을 시도해 보세요.""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:35:C05-r06,C05,v1-prod,"{""summary"":""장면의 감정 변화와 대사 전달력은 자연스럽고 생동감 있으나, '전신 움직임'을 통해 불안감을 표현하겠다는 의도에 비해 실제 신체 활용이 상반신 위주로 제한되어 아쉬움이 남습니다. 다음 연습에서는 앉아있는 상태에서도 척추의 긴장감이나 하체의 초조함을 유기적으로 연결해 불안감을 전신으로 표현해 보시기 바랍니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":80,""note"":""설득, 초조함, 안도와 기쁨 등 짧은 순간 동안 다채로운 감정 스펙트럼을 자연스럽게 보여주었습니다.""},{""label"":""대사 전달"",""score"":85,""note"":""발음과 발성이 매우 정확하고 대사의 리듬감이 살아있어 감정선이 또렷하게 귀에 들어옵니다.""},{""label"":""신체 표현"",""score"":68,""note"":""카메라 구도의 한계도 있겠으나 상반신과 손동작 위주의 단편적인 움직임에 머물러 전신의 에너지를 쓰지 못했습니다.""},{""label"":""의도 부합"",""score"":72,""note"":""심리적인 불안함은 눈빛과 호흡으로 잘 표현되었으나, 이를 '전신 움직임'으로 시각화하겠다는 목표에는 다소 못 미쳤습니다.""}],""weaknesses"":[""앉은 자세에서 하체나 척추의 긴장감을 활용하지 못해 불안해하는 인물의 전체적인 신체 템포가 정적인 편입니다."",""손을 좌우로 흔드는 제스처가 다소 기계적으로 반복되어 내면의 불안을 효과적으로 드러내지 못합니다."",""감정이 최고조에 달하는 '계약금' 언급 부분에서 신체적 에너지가 앞으로 치고 나가는 힘이 부족합니다.""],""alignedMoments"":[""0:42 부근에서 계약금을 몰래 걸었다고 실토하며 다급하게 상대방을 설득하려 제스처가 커지는 순간의 몰입력이 좋습니다."",""1:00 부근에서 상대방의 동의를 얻어내고 급격히 안도하며 기쁨을 표현하는 감정의 빠른 전환이 매끄럽습니다.""],""practiceRecommendations"":[""앉은 상태에서 발끝을 세우거나 허벅지를 꼬는 등 하체에서 시작되는 미세한 불안의 긴장감을 몸 전체로 연결하는 연습을 하세요."",""대사 중 '불안에 쫓기는 타이밍'에 의자에서 엉덩이를 떼며 상체를 앞으로 크게 기울이는 등 무게중심의 역동적인 이동을 시도해 보세요."",""정형화된 손짓 대신 머리를 쓸어 넘기거나 옷자락을 꽉 쥐는 등 인물의 초조함을 대변할 수 있는 구체적인 신체 디테일(Physcalization)을 개발해 보세요.""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:51:C08-r01,C08,v1-prod,"{""summary"":""인물의 광기 어린 긴장감과 불안정한 심리 상태를 독특한 리듬의 대사와 신체 동작으로 흥미롭게 표현해 주셨습니다. 다만, 설정하신 '공포에 짓눌린 긴장'이라는 의도보다는 상대방을 조롱하고 위협하는 지배적인 광기가 더 두드러져 정서의 본질을 조금 더 명확히 다듬을 필요가 있습니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":74,""note"":""불안하고 폭주하는 인물의 내면은 잘 표현되었으나, 공포에 압도당해 발생하는 원초적인 긴장감보다는 광기 어린 위악적 태도가 더 강하게 전달됩니다.""},{""label"":""대사 전달"",""score"":80,""note"":""딕션과 성량이 안정적이어서 대사 전달력이 높으나, 감정의 변화에 따른 말의 템포나 톤의 변주가 다소 일정한 편입니다.""},{""label"":""신체 표현"",""score"":78,""note"":""상처를 닦아내는 오프닝의 신체 동작과 웅크린 자세를 통해 인물의 피폐하고 불안정한 상태를 효과적으로 시각화했습니다.""},{""label"":""의도 부합"",""score"":72,""note"":""사용자가 의도한 '공포'가 웃음과 도발 뒤에 숨겨진 나약한 방어기제로서 조금 더 입체적으로 느껴졌다면 장면의 깊이가 살았을 것입니다.""}],""weaknesses"":[""공포라는 일차적 정서가 광기와 폭발적인 도발에 묻혀 본래 의도했던 '짓눌린 긴장감'의 결이 흐려집니다."",""0:42 부근의 광기 어린 웃음 이후 대사로 돌아올 때 호흡의 정리가 너무 빨라 감정의 연속성이 부자연스럽게 끊깁니다."",""수화기 너머 상대방의 말을 듣고 반응하는 침묵의 순간에 인물의 신체적인 떨림이나 미세한 호흡 반응이 부족하여 독백처럼 보입니다.""],""alignedMoments"":[""0:14~0:20 부근에서 거친 숨소리와 함께 신경질적으로 첫 대사를 뱉는 순간에 인물의 팽팽한 신경증이 잘 살아났습니다."",""0:52~0:58 부근에서 카메라를 정면으로 응시하며 나직하게 속삭일 때 흐르는 서늘한 긴장감이 훌륭했습니다.""],""practiceRecommendations"":[""상대방에 대한 원초적인 '공포'를 몸이 먼저 기억하도록 유도하기 위해, 대사 없이 오직 호흡과 신체 떨림만으로 두려움을 표현하는 호흡 훈련을 선행해 보세요."",""0:42의 폭발적인 웃음 전후로 에너지를 급격히 전환하는 '스톱앤고(Stop & Go)' 연습을 통해 정서적 스펙트럼의 대비를 극대화해 보세요."",""상대방이 수화기 너머로 실제로 무슨 말을 하는지 텍스트로 가상 대본을 작성한 뒤, 그 말을 들을 때 느끼는 공포의 서브텍스트를 리액션 호흡으로 채우는 연습을 추천합니다.""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:54:C08-r04,C08,v1-prod,"{""summary"":""서늘하고 광기 어린 인물의 냉소적인 면모는 훌륭하게 표현되었으나, 당초 의도한 '공포에 짓눌린 인물의 긴장감'과는 다소 거리가 있었습니다. 인물이 느끼는 본질적인 위협과 두려움이 대사와 신체 리액션에 스며들도록 보완하는 연습이 필요합니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":72,""note"":""상대를 조롱하는 광기 서린 조소는 매력적이었으나, 인물 내면에 깔려 있어야 할 공포와 위축감이 다소 부족했습니다.""},{""label"":""대사 전달"",""score"":78,""note"":""전반적인 발음이 명확하고 독백의 대사 처리가 깔끔했으나, 대사 톤이 상황의 절박함에 비해 지나치게 여유로운 편입니다.""},{""label"":""신체 표현"",""score"":75,""note"":""상처를 닦아내거나 전화기를 쥔 손동작은 자연스러웠으나, 공포 상황 특유의 미세한 떨림이나 호흡의 경직 등이 더 강조되면 좋겠습니다.""},{""label"":""의도 부합"",""score"":65,""note"":""의도한 '공포에 짓눌린 긴장'보다는 오히려 상황을 장악하고 상대를 위협하는 광기 어린 주도자의 느낌이 강하게 풍겼습니다.""}],""weaknesses"":[""공포라는 핵심 감정보다 조롱, 분노, 광기의 감정이 전면에 드러나 의도와의 불일치 발생"",""0:43 부근의 폭소 장면에서 절박한 히스테리가 아닌 여유로운 가해자처럼 보이는 톤 설정"",""극심한 불안과 공포를 나타낼 수 있는 신체적 위축감(움츠러든 어깨, 떨리는 손끝 등)의 부재""],""alignedMoments"":[""0:17 - 전화를 받으며 굳어지는 표정에서 순간적으로 발생하는 예민하고 날카로운 긴장감"",""0:55 - 상대방이 지금 이곳에 있음을 직감하는 순간 시선이 고정되며 몰입도가 높아지는 장면""],""practiceRecommendations"":[""상대방의 물리적 위협이 내 목을 죄어오는 구체적인 전사를 상정하고, 공포로 인해 온몸이 떨리는 신체 이완 및 긴장 훈련 병행하기"",""0:43의 웃음소리를 상대에 대한 비웃음이 아닌, 공포가 극에 달해 이성을 잃고 터져 나오는 히스테릭하고 슬픈 실소로 바꾸어 표현해보기"",""대사 사이사이에 불규칙하고 얕은 호흡(숨을 들이마시지 못하고 멈추는 상태)을 배치하여 듣는 이에게도 인물의 질식할 것 같은 공포감을 전달하기""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:60:C09-r03,C09,v1-prod,"{""summary"":""영상 속 연기는 공허하면서도 신비로운 인물의 내면과 섬세한 판토마임을 매우 훌륭하게 표현했으나, 제출하신 '분노를 눌러 담은 위협적 대사'라는 의도와는 완전히 상반된 톤입니다. 인물의 독특한 매력은 잘 살았지만, 설정하신 목표 감정에 부합하도록 긴장감과 날카로운 에너지를 채워넣는 재정비가 필요합니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":85,""note"":""삶의 쓸쓸함과 갈망을 담은 몽환적인 감정선은 매우 깊이 있게 전달되었으나, 분노의 감정은 찾아보기 어렵습니다.""},{""label"":""대사 전달"",""score"":80,""note"":""일상적이고 자연스러운 대사 처리는 훌륭하지만, 위협적인 서브텍스트를 전달하기에는 말의 무게감이 가볍습니다.""},{""label"":""신체 표현"",""score"":92,""note"":""손끝의 움직임과 시선 처리를 활용한 귤 판토마임 연기는 인물의 성격을 대변할 만큼 매우 섬세하고 자연스럽습니다.""},{""label"":""의도 부합"",""score"":25,""note"":""사용자의 의도인 '억눌린 분노와 위협' 대신, 나른하고 자유로운 인물의 성격이 전면에 드러나 괴리가 큽니다.""}],""weaknesses"":[""의도하신 '억눌린 분노'나 '위협'의 감정선이 인물의 나른하고 풀어진 연기 톤에 묻혀 전혀 느껴지지 않음"",""상대방을 압도하거나 긴장감을 조성해야 하는 서브텍스트가 부재하여 장면의 갈등 구조가 느슨함"",""대사 말끝이 흐려지거나 애교 섞인 톤으로 마무리되어 위협적인 인물로서의 무게감이 부족함""],""alignedMoments"":[""00:32 - 00:55 구간에서 귤을 정성스럽게 까서 입에 넣는 디테일한 판토마임 표현과 뛰어난 신체 통제력"",""01:08 - 01:25 구간에서 상대방의 시선을 붙잡고 속삭이듯 말하며 묘한 몰입감을 선사하는 순간""],""practiceRecommendations"":[""억눌린 분노를 표현하기 위해 턱과 횡격막에 단단한 긴장을 유지하고, 소리를 낮게 눌러 담아 발성하는 훈련을 하세요."",""상대방을 응시하는 시선을 흔들림 없이 고정하고, 대사 사이의 멈춤(Pause) 동안 거친 호흡을 섞어 위협적인 분위기를 조성해 보세요."",""선택한 대본이 가진 본래의 정서와 본인이 표현하고자 하는 감정적 목표가 일치하는지 텍스트 분석 단계를 재점검해 보세요.""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:61:C09-r04,C09,v1-prod,"{""summary"":""일상적이고 자연스러운 대사 처리와 매혹적인 팬터마임 표현이 돋보이는 매우 훌륭한 연기입니다. 다만, 사용자가 설정한 '분노를 눌러 담은 위협적 대사'라는 의도와는 정반대로 자유롭고 몽환적인 인물의 매력이 강조되었습니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":85,""note"":""인물의 독특한 감수성과 천진난만하면서도 어딘가 쓸쓸한 정서가 표정과 목소리 톤을 통해 매력적으로 전달됩니다.""},{""label"":""대사 전달"",""score"":88,""note"":""자연스러운 구어체의 리듬을 잘 살려 조근조근 이야기하듯 대사를 내뱉으며, 말의 끝처리도 흐르듯 부드럽습니다.""},{""label"":""신체 표현"",""score"":92,""note"":""귤을 까서 먹는 팬터마임 동작이 매우 섬세하며, 손끝의 감각과 시선 처리, 호흡이 완벽하게 일치합니다.""},{""label"":""의도 부합"",""score"":30,""note"":""작성하신 '분노와 위협'의 감정은 전혀 느껴지지 않으며, 오히려 인물의 사랑스러움과 신비로움이 부각된 연기입니다.""}],""weaknesses"":[""작성된 연기 의도(분노, 위협)와 실제 수행된 연기의 정서적 톤앤매너가 완전히 불일치합니다."",""상대방과의 교감보다는 혼자만의 독백처럼 대사를 이어가는 경향이 있어 쌍방향 소통의 리액션이 다소 아쉽습니다."",""몽환적인 분위기를 잡는 과정에서 대사의 일부분이 다소 흐릿하게 웅얼거리듯 들리는 구간이 있습니다.""],""alignedMoments"":[""0:32 - 0:47 구간에서 보이지 않는 귤의 촉감을 손끝으로 느끼며 시선을 고정하는 섬세한 마임 연기"",""1:07 - 1:15 구간에서 '귤이 없다는 걸 잊어먹으면 돼'라고 속삭이듯 말하며 철학적이고 몽환적인 눈빛을 보여준 순간""],""practiceRecommendations"":[""장면의 정서 재설정: 이 독백은 분노가 아닌 인물의 내면적 결핍과 동경을 드러내는 신이므로, '호기심'과 '쓸쓸함'을 메인 정서로 잡고 다시 연습해 보세요."",""상대 배우와의 호흡 연습: 대사 중간중간 상대방의 표정을 살피고, 상대의 반응(예: 어리둥절함, 신기함)을 흡수하여 다음 대사의 템포와 음량을 조절하는 연습을 하세요."",""의도적 위협 톤 적용(서브텍스트 변형): 만약 이 대사로 정말 '위협'을 표현하고 싶다면, 마임을 장난스럽게 하는 것이 아니라 상대방을 똑바로 응시하며 매우 느리고 서늘한 톤으로 귤을 씹어 먹는 듯한 기괴한 서브텍스트를 시도해 보세요.""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:62:C09-r05,C09,v1-prod,"{""summary"":""일상적이고 몽환적인 대화 속에서 판토마임을 섬세하게 표현한 자연스러운 연기이지만, 제출하신 분노와 위협의 연기 의도와는 큰 차이가 있습니다. 의도를 살리기 위해서는 대사 속 서브텍스트에 긴장감을 부여하고 신체적인 압박감을 주는 방향으로의 수정이 필요합니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":40,""note"":""장면 고유의 신비롭고 몽환적인 감정은 잘 전달되나, 의도하신 분노나 위협적인 긴장감은 전혀 느껴지지 않습니다.""},{""label"":""대사 전달"",""score"":75,""note"":""술자리에서의 일상적인 대화 톤으로 자연스럽게 흘러가며, 판토마임을 설명하는 목소리의 조절이 안정적입니다.""},{""label"":""신체 표현"",""score"":85,""note"":""손가락 끝을 세밀하게 사용하는 판토마임 동작과 자연스러운 호흡 처리가 돋보입니다.""},{""label"":""의도 부합"",""score"":30,""note"":""선택하신 연기 의도인 '분노를 눌러 담은 위협'과 실제 연기의 톤이 완전히 불일치합니다.""}],""weaknesses"":[""연기 의도로 제시한 분노와 위협의 정서가 대사나 표정에서 전혀 드러나지 않아 의도 전달에 실패했습니다."",""판토마임을 하는 신체 움직임이 너무 부드럽고 가벼워 위협적인 상황의 팽팽한 긴장감을 저해합니다."",""상대방을 바라보는 시선에 날카로움이나 억압된 감정 대신 친근함과 호기심이 더 크게 느껴집니다.""],""alignedMoments"":[""00:20 - 00:55 구간에서 귤을 까서 먹는 판토마임 동작의 디테일과 몰입감이 뛰어납니다."",""01:05 - 01:25 구간에서 진지하게 자신의 철학을 설명할 때의 나지막하고 집중력 있는 대사 톤이 좋습니다.""],""practiceRecommendations"":[""동일한 대사를 유지하되, 속으로는 상대방에게 복수나 경고를 하는 서브텍스트를 품고 대사를 한 자 한 자 씹어 뱉듯 연습해 보세요."",""판토마임 동작(귤을 까는 행동)을 할 때, 손에 강한 악력을 주거나 거칠게 움직여 행동 자체에 위협적인 서브텍스트를 담아보세요."",""말과 말 사이의 침묵(포즈)을 더 길게 가져가며, 그 빈틈에 상대방을 압도하는 무거운 호흡을 불어넣는 연습을 추천합니다.""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:63:C09-r06,C09,v1-prod,"{""summary"":""배우의 섬세한 판토마임과 몽환적인 대사 전달은 인물의 신비로움을 잘 살렸으나, 사용자가 제시한 '분노를 눌러 담은 위협적 대사'라는 의도와는 상반된 톤으로 진행되었습니다. 장면 본연의 외롭고 쓸쓸한 정서는 훌륭하게 표현되었으나, 설정한 연기 의도인 분노의 긴장감을 느끼기는 어려웠습니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":65,""note"":""쓸쓸함과 호기심이 섞인 몽환적인 감정은 훌륭히 전달했으나, 억눌린 분노나 위협의 정서는 찾아보기 어렵습니다.""},{""label"":""대사 전달"",""score"":85,""note"":""조용하고 나긋나긋한 어조 속에서 호흡의 완급 조절과 독특한 말끝 처리가 캐릭터의 색깔을 아주 잘 살렸습니다.""},{""label"":""신체 표현"",""score"":92,""note"":""실제 귤을 까서 먹는 듯한 정교하고 유려한 판토마임 신체 동작이 인물의 몰입도를 극대화합니다.""},{""label"":""의도 부합"",""score"":30,""note"":""입력하신 '위협과 분노'라는 연기 목표와 실제 발현된 '일상적이고 신비로운' 연기 톤 사이에 큰 불일치가 있습니다.""}],""weaknesses"":[""기재된 연기 의도(분노, 위협)를 뒷받침할 만한 날카로운 시선 처리나 단호한 호흡의 부재"",""인물의 대사 톤이 전반적으로 나른하고 몽환적으로 유지되어 갈등 상황에서의 팽팽한 긴장감이 형성되지 않음"",""상대방을 압도하거나 경고하려는 서브텍스트(속뜻)의 결여""],""alignedMoments"":[""00:23 - 시선을 허공에 둔 채 섬세하게 판토마임을 시작하며 관객의 호기심을 자극하는 순간"",""01:08 - '여기에 귤이 없다는 걸 잊어버리면 돼'라며 상대방의 눈을 빤히 응시해 대사의 철학적 메시지에 흡입력을 더하는 장면""],""practiceRecommendations"":[""판토마임 동작 자체에 '분노'의 에너지를 담아, 귤을 껍질째 찢어발기거나 으깨는 듯한 다소 거칠고 위협적인 신체 언어로 변형해 연습해 보세요."",""목소리의 톤을 한 옥타브 낮추고 어미를 흐리지 않고 단호하게 맺음으로써 상대방에게 경고하는 듯한 서브텍스트를 대사에 실어보세요."",""대사 사이사이의 침묵(Pause) 동안 숨을 깊이 들이마시고 참는 아포지오(Appoggio) 기법을 활용해 억압된 분노의 신체적 긴장감을 시각적으로 표현해 보세요.""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:64:C09-r07,C09,v1-prod,"{""summary"":""일상적인 대화 속에서 판토마임을 통해 인물의 신비롭고 자유로운 매력을 훌륭하게 표현했으나, 신청하신 '분노를 눌러 담은 위협적 대사'라는 연기 의도와는 정반대의 톤입니다. 신체 표현과 정서적 몰입감은 매우 뛰어나지만, 설정한 연기 목표에 부합하는 정서적 톤앤매너 재조정이 필요합니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":85,""note"":""몽환적이고 천진난만한 인물의 정서는 깊이 있게 전달했으나, 분노나 위협 같은 어두운 감정선은 나타나지 않습니다.""},{""label"":""대사 전달"",""score"":80,""note"":""구어체의 자연스러운 흐름과 호흡은 좋으나, 목소리 톤이 가볍고 나긋나긋하여 억눌린 분노를 담아내기에는 긴장감이 부족합니다.""},{""label"":""신체 표현"",""score"":92,""note"":""손끝의 미세한 움직임과 시선 처리를 활용한 귤 판토마임 연기는 대단히 섬세하고 몰입도가 높습니다.""},{""label"":""의도 부합"",""score"":20,""note"":""제시하신 '분노와 위협'이라는 연기 의도와 달리, 실제 연기는 천진난만하고 철학적인 분위기로 일관되었습니다.""}],""weaknesses"":[""선택한 연기 의도(억눌린 분노, 위협)와 대사 및 장면이 가진 본래의 정서(신비로움, 방랑벽) 사이에 괴리가 있습니다."",""호흡이 너무 편안하고 부드럽게 풀려 있어, 위협적인 대사 특유의 서늘한 서스펜스나 팽팽한 긴장감이 형성되지 않습니다.""],""alignedMoments"":[""0:32~0:47 구간에서 실제 귤이 있는 것처럼 정교하게 손동작을 구사하며 상대의 주의를 끄는 집중력이 매우 좋습니다."",""1:08~1:25 구간에서 '귤이 없다는 걸 잊어버리면 된다'며 나직하게 속삭이는 눈빛과 표정 연기가 묘한 몰입감을 선사합니다.""],""practiceRecommendations"":[""진짜 '위협적인 연기'를 연습하려면, 대사의 서브텍스트(속뜻)에 상대방을 압박하거나 경고하는 정서를 담아 대사 톤을 한층 무겁고 차갑게 가라앉히는 연습을 하세요."",""말의 끝처리를 흐리거나 어물거리지 않고 단호하게 맺음으로써 대사에 위압감과 무게감을 싣는 발성 훈련을 병행하세요."",""판토마임처럼 큰 신체 움직임을 줄이고, 정적인 자세에서 상대를 꿰뚫어 보는 듯한 강렬한 시선 고정(Eye contact)을 통해 정적 속의 분노를 표현해 보세요.""]}",13,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:68:C10-r04,C10,v1-prod,"{""summary"":""잔잔하게 억누르던 깊은 슬픔에서 시작하여 후반부의 격정적인 감정 폭발까지의 빌드업이 매우 훌륭하며, 인물의 절박한 상황과 서러움을 완벽하게 전달했습니다. 특히 눈물과 호흡, 대사의 템포 조절이 조화롭게 어우러져 관객의 몰입도를 극대화하는 깊이 있는 연기를 선보였습니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":95,""note"":""감정의 점층적인 고조와 마지막 폭발적인 오열이 인물의 절박함과 원망을 고스란히 느끼게 합니다.""},{""label"":""대사 전달"",""score"":92,""note"":""슬픔으로 목이 메이는 와중에도 대사의 딕션과 톤이 뭉개지지 않고 선명하게 전달됩니다.""},{""label"":""신체 표현"",""score"":90,""note"":""눈빛의 변화, 호흡의 미세한 떨림, 얼굴 근육의 움직임을 통해 인물의 내면적 고통을 훌륭히 시각화했습니다.""},{""label"":""의도 부합"",""score"":96,""note"":""깊은 슬픔에서 터져 나오는 눈물 연기라는 의도에 걸맞게 감정의 깊이와 해소 과정이 완벽히 일치합니다.""}],""weaknesses"":[""감정이 최고조에 달해 소리를 지르는 구간(1:52)에서 급격한 발성 변화로 인해 목에 과도한 무리가 갈 우려가 있습니다."",""상대 대사를 받아들이는 침묵의 순간에 미세한 시선 처리나 표정 변화가 조금 더 디테일했다면 정적인 순간의 텐션이 더 살았을 것입니다.""],""alignedMoments"":[""0:41~0:53 구간에서 아들의 아픈 소식을 전하며 눈물이 차오르고 호흡이 떨리는 감정 고조 단계"",""1:51~1:56 구간에서 그동안 참아왔던 독박 육아의 설움과 남편에 대한 원망을 폭발적인 소리와 오열로 뿜어내는 장면""],""practiceRecommendations"":[""감정이 폭발하여 소리를 지를 때 목 아랫부분을 조이기보다, 깊은 복식 호흡의 지탱을 통해 성대 충격을 줄이면서 슬픈 소리를 내는 발성 훈련을 하십시오."",""대사 사이의 서브텍스트(속마음)를 정리하여, 말을 하지 않는 정묵 상태에서도 인물의 호흡과 시선이 끊기지 않는 훈련을 진행해 보세요."",""말을 뱉기 직전 호흡을 참았다가 내뱉는 한숨과 울음 섞인 호흡의 강약을 조절하여 슬픔의 결을 더 다양하게 표현해 보시기 바랍니다.""]}",13,Y,감정|대사|움직임|기타
web\scripts\out\feedback.csv:70:C10-r06,C10,v1-prod,"{""summary"":""억누르던 깊은 슬픔이 분노와 결합하여 후반부에 강력하게 폭발하는 감정의 흐름을 훌륭하게 연기했습니다. 다만, 대사가 최고조에 달할 때 감정에 휩쓸려 일부 발음이 뭉개지는 점은 보완이 필요합니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":88,""note"":""차분한 억제에서 극적인 오열로 이어지는 감정의 점진적 고조가 관객의 몰입을 극대화합니다.""},{""label"":""대사 전달"",""score"":80,""note"":""초중반의 절제된 독백은 전달력이 우수하나, 후반부 감정 폭발 시 일부 단어의 발음이 다소 흐려집니다.""},{""label"":""신체 표현"",""score"":84,""note"":""호흡의 변화와 미세한 눈빛 흔들림을 통해 인물의 깊은 절망감을 효과적으로 시각화했습니다.""},{""label"":""의도 부합"",""score"":90,""note"":""슬픔과 억울함이 극에 달해 눈물을 터뜨리는 배우의 연기 의도가 완벽하게 구현되었습니다.""}],""weaknesses"":[""감정이 최고조에 달하는 후반부 절규 장면에서 일부 대사의 명확성이 떨어짐"",""상대방의 격앙된 대사를 받아치는 타이밍의 템포 조절이 약간 정형화됨"",""소리를 지를 때 목에 힘이 많이 들어가 성대에 무리를 줄 수 있는 발성법""],""alignedMoments"":[""0:45 - 아들의 투병 소식을 전하며 눈시울이 붉어지고 호흡이 가빠지는 디테일한 감정 제어"",""1:52 - 억울함과 슬픔을 담아 '혼자서 자식 새끼 키워내느라고'라며 울부짖는 감정의 절정""],""practiceRecommendations"":[""격정적인 대사 중에도 딕션이 깨지지 않도록 자음과 모음을 정확히 쪼개어 발음하는 복식 발성 훈련"",""감정 폭발 직전의 정적(Pause)과 호흡을 더 길게 가져가 긴장감을 극대화하는 템포 연습"",""목의 긴장을 풀고 소리를 멀리 던지는 느낌으로 지르는 올바른 발성법 체득""]}",14,Y,감정|대사|움직임|기타
web\scripts\out\labeling.csv:25:C01-r02-s10,C01-r02,C01,v1-prod,,,00:00~00:03 도입부에서 한숨을 크게 쉬며 답답하고 불안한 인물의 심리 상태를 직관적으로 예고한 장면,,,,,강점
web\scripts\out\labeling.csv:31:C01-r03-s02,C01-r03,C01,v1-prod,기타,,"다만 단순한 투정이나 짜증을 넘어선 내면의 깊은 불안감을 신체와 시선, 그리고 보다 정교한 떨림 호흡으로 확장시킨다면 장면의 몰입도가 훨씬 높아질 것입니다.",,,,,요약
web\scripts\out\labeling.csv:52:C01-r04-s09,C01-r04,C01,v1-prod,,,감정의 템포가 일정하여 장면의 극적인 흐름이 평평하게 느껴짐,,,,,약점
web\scripts\out\labeling.csv:96:C01-r07-s11,C01-r07,C01,v1-prod,,,0:39~0:45 성적이 오르지 않는 자신에 대한 답답함을 눈을 감고 고개를 흔드는 신체 반응과 떨리는 호흡으로 표현한 장면,,,,,강점
web\scripts\out\labeling.csv:329:C04-r03-s06,C04-r03,C04,v1-prod,기타,의도 부합,참았던 분노를 한순간에 터트리는 독백의 의도에 걸맞게 에너지를 집중시켜 몰입감 높은 명장면을 만들어냈습니다.,,,,,지표
web\scripts\out\labeling.csv:464:C05-r06-s01,C05-r06,C05,v1-prod,기타,,"장면의 감정 변화와 대사 전달력은 자연스럽고 생동감 있으나, '전신 움직임'을 통해 불안감을 표현하겠다는 의도에 비해 실제 신체 활용이 상반신 위주로 제한되어 아쉬움이 남습니다.",,,,,요약
web\scripts\out\labeling.csv:693:C08-r01-s06,C08-r01,C08,v1-prod,기타,의도 부합,사용자가 의도한 '공포'가 웃음과 도발 뒤에 숨겨진 나약한 방어기제로서 조금 더 입체적으로 느껴졌다면 장면의 깊이가 살았을 것입니다.,,,,,지표
web\scripts\out\labeling.csv:737:C08-r04-s08,C08-r04,C08,v1-prod,,,0:43 부근의 폭소 장면에서 절박한 히스테리가 아닌 여유로운 가해자처럼 보이는 톤 설정,,,,,약점
web\scripts\out\labeling.csv:740:C08-r04-s11,C08-r04,C08,v1-prod,,,0:55 - 상대방이 지금 이곳에 있음을 직감하는 순간 시선이 고정되며 몰입도가 높아지는 장면,,,,,강점
web\scripts\out\labeling.csv:819:C09-r03-s08,C09-r03,C09,v1-prod,,,상대방을 압도하거나 긴장감을 조성해야 하는 서브텍스트가 부재하여 장면의 갈등 구조가 느슨함,,,,,약점
web\scripts\out\labeling.csv:837:C09-r04-s12,C09-r04,C09,v1-prod,,,"장면의 정서 재설정: 이 독백은 분노가 아닌 인물의 내면적 결핍과 동경을 드러내는 신이므로, '호기심'과 '쓸쓸함'을 메인 정서로 잡고 다시 연습해 보세요.",,,,,처방
web\scripts\out\labeling.csv:842:C09-r05-s03,C09-r05,C09,v1-prod,감정,감정 전달,"장면 고유의 신비롭고 몽환적인 감정은 잘 전달되나, 의도하신 분노나 위협적인 긴장감은 전혀 느껴지지 않습니다.",,,,,지표
web\scripts\out\labeling.csv:855:C09-r06-s02,C09-r06,C09,v1-prod,기타,,"장면 본연의 외롭고 쓸쓸한 정서는 훌륭하게 표현되었으나, 설정한 연기 의도인 분노의 긴장감을 느끼기는 어려웠습니다.",,,,,요약
web\scripts\out\labeling.csv:864:C09-r06-s11,C09-r06,C09,v1-prod,,,01:08 - '여기에 귤이 없다는 걸 잊어버리면 돼'라며 상대방의 눈을 빤히 응시해 대사의 철학적 메시지에 흡입력을 더하는 장면,,,,,강점
web\scripts\out\labeling.csv:874:C09-r07-s07,C09-r07,C09,v1-prod,,,"선택한 연기 의도(억눌린 분노, 위협)와 대사 및 장면이 가진 본래의 정서(신비로움, 방랑벽) 사이에 괴리가 있습니다.",,,,,약점
web\scripts\out\labeling.csv:931:C10-r04-s10,C10-r04,C10,v1-prod,,,1:51~1:56 구간에서 그동안 참아왔던 독박 육아의 설움과 남편에 대한 원망을 폭발적인 소리와 오열로 뿜어내는 장면,,,,,강점
web\scripts\out\labeling.csv:954:C10-r06-s07,C10-r06,C10,v1-prod,,,감정이 최고조에 달하는 후반부 절규 장면에서 일부 대사의 명확성이 떨어짐,,,,,약점
web\scripts\out\labeling-v2.csv:112:C09-r01-s02,C09-r01,C09,v2-prod,기타,,"정교한 판토마임 신체 표현과 자연스러운 구어체 대사 톤은 매우 탁월하나, 의도한 캐릭터 서브텍스트를 장면에 녹여내기 위한 정합성 수정이 필요합니다.",,,,,요약
web\scripts\out\labeling-v2.csv:121:C09-r01-s11,C09-r01,C09,v2-prod,,,"만약 '분노와 위협'이라는 의도를 이 장면에 기어이 이식하고자 한다면, 1:15~1:25 구간에서 가상의 귤을 쥔 손을 강하게 쥐어짜 으깨는 듯한 신체적 저항을 추가하고 상대방을 정면으로 쏘아보는 안구 고정 연습을 하십시오.",,,,,처방
web\scripts\out\feedback-v2.csv:10:C09-r01,C09,v2-prod,"{""summary"":""배우가 제시한 '분노와 위협'이라는 연기 의도와 달리, 실제 영상에서는 쓸쓸함과 몽환적인 정서가 담긴 일상 연기가 사실감 있게 펼쳐집니다. 정교한 판토마임 신체 표현과 자연스러운 구어체 대사 톤은 매우 탁월하나, 의도한 캐릭터 서브텍스트를 장면에 녹여내기 위한 정합성 수정이 필요합니다."",""evaluationMetrics"":[{""label"":""감정 전달"",""score"":70,""note"":""0:53~1:01에서 가상의 귤을 삼키며 짓는 쓸쓸한 미소 등 정서적 결은 훌륭하게 표현되었으나, 계획한 '분노'의 정서는 전혀 전달되지 않습니다.""},{""label"":""대사 전달"",""score"":82,""note"":""0:34~0:47 대사에서 일상적인 술자리의 자연스러운 리듬을 잘 살렸으나, '판토마임 배우고 있잖아' 부분에서 말끝이 다소 흐려집니다.""},{""label"":""신체 표현"",""score"":92,""note"":""0:21~0:53까지 가상의 귤을 까고 만지는 정교한 손가락의 움직임과 시선의 일치감이 대상의 실재감을 완벽하게 만들어냅니다.""},{""label"":""의도 부합"",""score"":15,""note"":""0:00~1:30 전반에 걸쳐 배우가 의도한 '분노를 눌러 담은 위협'의 눈빛, 목소리 톤의 날카로움, 신체적 긴장감은 전혀 관찰되지 않습니다.""}],""weaknesses"":[""배우가 설정한 의도('분노와 위협')와 실제 연기의 정서(쓸쓸함, 천진난만함)가 완전히 불일치하여 0:00~1:30 동안 대사의 서브텍스트가 의도와 다르게 흘러갑니다."",""0:34~0:37 '나 요즘 판토마임 배우고 있잖아' 대사 처리 시 구어체의 자연스러움을 강조하려다 조음 기관의 움직임이 풀어져 발음의 명확성이 다소 떨어집니다.""],""alignedMoments"":[""0:21~0:33에서 가상의 대상을 쥐고 껍질을 까는 손의 압력 조절과 시선 고정이 매우 정교하여 실제 귤이 있는 듯한 착각을 불러일으킵니다."",""1:07~1:14 '여기에 귤이 없다는 걸 잊어버리면 돼'라는 대사에서, 가벼운 태도 속에서도 인물 특유의 깊은 공허함이 눈빛의 미세한 흔들림을 통해 훌륭하게 표현되었습니다.""],""practiceRecommendations"":[""만약 '분노와 위협'이라는 의도를 이 장면에 기어이 이식하고자 한다면, 1:15~1:25 구간에서 가상의 귤을 쥔 손을 강하게 쥐어짜 으깨는 듯한 신체적 저항을 추가하고 상대방을 정면으로 쏘아보는 안구 고정 연습을 하십시오."",""0:34~0:47처럼 일상 톤을 유지하면서도 전달력을 높이기 위해, 입술과 혀의 끝부분에 명확한 힘을 주어 키워드('판토마임', '아프리카')의 자음을 정확히 끊어 발음하는 훈련을 제안합니다."",""대본이 가진 본질적인 상황(쓸쓸한 고백)과 배우의 주관적 의도(위협)가 충돌할 때는 무리하게 감정을 얹기보다 텍스트 자체의 정서에 순응하는 캐릭터 분석 단계를 먼저 선행하십시오.""]}",13,Y,감정|대사|움직임|기타
web\src\testcoach\pipeline.ts:3:import type { CoachFeedback, FeedbackAxis, FeedbackAxisBand, OverallBand } from '../coach/evaluation';
web\src\testcoach\pipeline.ts:242:const PERSONA_AXIS: Record<CoachPersonaKey, FeedbackAxis> = {
web\src\testcoach\pipeline.ts:322:  encouragement: () => '이 장면을 끝까지 해본 것이 다음 분석의 출발점이에요.',
web\src\testcoach\pipeline.ts:368:export function buildAxisBands(aggregation: Aggregation, verdicts: AllVerdicts): FeedbackAxisBand[] {
web\src\testcoach\pipeline.ts:369:  const bands: FeedbackAxisBand[] = [];
web\src\testcoach\pipeline.ts:399:// rev.7: 구조화 전경은 buildAxisBands가 담당, 이 한 문단 요약은 하위호환 fallback으로만 유지.
web\src\testcoach\pipeline.ts:430:}): CoachFeedback {
web\src\testcoach\pipeline.ts:435:  // focus 갭 판정을 sceneIntent보다 먼저 계산한다 — misread로 판정된 인상이 의도 요약에 남으면
web\src\testcoach\pipeline.ts:462:  const sceneIntent = {
web\src\testcoach\pipeline.ts:467:      : '이 장면의 의도를 알려주시면 다음 분석이 더 정확해져요.',
web\src\testcoach\pipeline.ts:482:  let strength: CoachFeedback['strength'];
web\src\testcoach\pipeline.ts:512:      sceneIntent,
web\src\testcoach\pipeline.ts:530:    : (['emotion'] as FeedbackAxis[]);
web\src\testcoach\pipeline.ts:558:    sceneIntent,
web\src\testcoach\prompts.ts:114:   내용에 근거가 있어야 한다. 장면 분위기로 짐작해 없는 인상을 더하지 않는다.
web\src\testcoach\prompts.ts:134:    lens: '표현된 감정이 배우 의도·장면 서브텍스트와 맞는지(과하거나 모자란 것 모두).',
web\src\testcoach\dictionaries.ts:6:import type { FeedbackAxis, OverallAxisKey, OverallBand } from '../coach/evaluation';
web\src\testcoach\dictionaries.ts:132:export const PROGRESSION_LIBRARY: Record<FeedbackAxis, Progression> = {
web\src\testcoach\dictionaries.ts:134:    task: '같은 장면을 감정 강도 절반으로 한 번, 1.5배로 한 번 더 찍어 셋을 나란히 보세요. 지금 강도가 우연이 아니라 선택이었는지 확인할 수 있어요.',
web\src\testcoach\dictionaries.ts:135:    nextStep: '같은 장면을 강도 절반·1.5배로 두 번 더 찍어보기',
web\src\testcoach\dictionaries.ts:142:    task: '같은 장면을 대사 없이 표정만으로 한 번 찍어보세요. 어떤 표정이 실제로 일하고 있었는지 분리해서 볼 수 있어요.',
web\src\testcoach\dictionaries.ts:143:    nextStep: '대사 없이 표정만으로 같은 장면 찍어보기',
web\src\testcoach\dictionaries.ts:146:    task: '같은 장면을 움직임 절반으로 줄여 다시 찍어보세요. 남은 에너지가 시선과 호흡 어디로 가는지 보이면 다음 단계가 잡혀요.',
web\src\testcoach\dictionaries.ts:147:    nextStep: '움직임을 절반으로 줄여 같은 장면 다시 찍어보기',
web\src\content\schema.ts:81:    right: { axis: 'T', label: '테크닉',  desc: '대본의 구조와 인물의 동선을 차분히 분석해, 정확한 기교와 설계로 장면을 빚어낸다.' },
web\src\views\ExcerPage.css:368:  background-image:
web\src\content\questions.ts:36:      { label: '이 장면 비트가 어디서 어긋났는지 분석한다',     axis: 'A', icon: Microscope },
web\src\content\questions.ts:202:      { label: '"오늘 그 장면 진짜 좋았다" 한 컷이 떠오른다',         axis: 'M', icon: Flame },
web\src\views\coachFeedbackCards.tsx:2:  type FeedbackFocus,
web\src\views\coachFeedbackCards.tsx:3:  type FeedbackNextStep,
web\src\views\coachFeedbackCards.tsx:4:  type FeedbackOverall,
web\src\views\coachFeedbackCards.tsx:5:  type FeedbackStrength,
web\src\views\coachFeedbackCards.tsx:23:export function OverallBlock({ overall }: { overall?: FeedbackOverall }) {
web\src\views\coachFeedbackCards.tsx:58:export function StrengthBlock({ strength }: { strength: FeedbackStrength }) {
web\src\views\coachFeedbackCards.tsx:76:export function FocusBlock({ focus }: { focus: FeedbackFocus }) {
web\src\views\coachFeedbackCards.tsx:111:export function NextStepBlock({ nextStep, onRetake }: { nextStep: FeedbackNextStep; onRetake: () => void }) {
web\src\views\ArchivePage.tsx:365:          placeholder="작품, 배역, 장면, 인상적인 포인트 등"
web\src\views\CoachPage.tsx:19:  type CoachFeedback,
web\src\views\CoachPage.tsx:21:import { FocusBlock, NextStepBlock, OverallBlock, StrengthBlock } from './coachFeedbackCards';
web\src\views\CoachPage.tsx:30:// 데이터(sceneIntent)는 응답에 그대로 남아 있어 되살리기 쉽다.
web\src\views\CoachPage.tsx:53:  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
web\src\views\CoachPage.tsx:105:    setFeedback(null);
web\src\views\CoachPage.tsx:127:    setFeedback(null);
web\src\views\CoachPage.tsx:204:    setFeedback(null);
web\src\views\CoachPage.tsx:231:      const payload = (await response.json()) as { feedback?: CoachFeedback; sessionId?: string; error?: string };
web\src\views\CoachPage.tsx:237:      setFeedback(payload.feedback);
web\src\views\TheaPage.tsx:97:          <div className="thea-hero__image" />
web\src\views\TheaPage.tsx:127:        <RecommendationTool plays={buildFallbackPlays()} source="fallback" />
web\src\views\TheaPage.tsx:165:  source: 'kopis' | 'fallback';
web\src\coach\personas.ts:25:    lens: '표현된 감정이 배우 의도·장면 서브텍스트와 맞는지(과하거나 모자란 것 모두).',
web\src\coach\personas.ts:43:    lens: '연기 지식 없이, 이 장면이 보는 사람에게 어떤 인상·감정으로 닿는지.',
web\src\community\fixtures.ts:62:    body: '장면 분석부터 들어가야 할지, 일단 소리 내서 여러 번 읽어보는 게 좋은지 매번 헷갈려요. 본인만의 루틴 공유해주실 분?',
web\src\community\fixtures.ts:132:    body: '유튜브, 인스타, 블로그, 형식 상관없이요. 같은 길 가는 사람들 어떻게 자기 작업 기록하는지 궁금해요.',
web\src\coach\evaluation.ts:24:export type FeedbackAxis = 'emotion' | 'speech' | 'face' | 'movement';
web\src\coach\evaluation.ts:35:const FEEDBACK_AXES: readonly FeedbackAxis[] = ['emotion', 'speech', 'face', 'movement'];
web\src\coach\evaluation.ts:46:export type FeedbackStrength = {
web\src\coach\evaluation.ts:48:  axis: FeedbackAxis;
web\src\coach\evaluation.ts:55:export type FeedbackFocus = {
web\src\coach\evaluation.ts:57:  axes: FeedbackAxis[];
web\src\coach\evaluation.ts:65:export type FeedbackNextStep = {
web\src\coach\evaluation.ts:75:export type FeedbackAxisBand = {
web\src\coach\evaluation.ts:82:export type FeedbackOverall = {
web\src\coach\evaluation.ts:83:  axisBands?: FeedbackAxisBand[]; // rev.7 4축 상태 전경 (UI 주력)
web\src\coach\evaluation.ts:84:  text?: string; // 하위호환 — 한 문단 요약(있으면 fallback)
web\src\coach\evaluation.ts:87:export type CoachFeedback = {
web\src\coach\evaluation.ts:88:  sceneIntent: SceneIntent;
web\src\coach\evaluation.ts:89:  overall?: FeedbackOverall;
web\src\coach\evaluation.ts:90:  strength: FeedbackStrength;
web\src\coach\evaluation.ts:91:  focus: FeedbackFocus;
web\src\coach\evaluation.ts:92:  nextStep: FeedbackNextStep;
web\src\coach\evaluation.ts:95:const FALLBACK_FEEDBACK: CoachFeedback = {
web\src\coach\evaluation.ts:96:  sceneIntent: {
web\src\coach\evaluation.ts:104:    why: '이 장면을 끝까지 해본 시도 자체는 다음 분석의 출발점이 돼요.',
web\src\coach\evaluation.ts:149:0. scene_intent — 배우 의도를 한 문장으로 되짚는다. 의도가 주어졌으면 source는 "actor_input".
web\src\coach\evaluation.ts:173:  "scene_intent": { "text": "이 장면에서 이렇게 하려 하셨죠", "source": "actor_input" },
web\src\coach\evaluation.ts:197:function enumField<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
web\src\coach\evaluation.ts:200:    : fallback;
web\src\coach\evaluation.ts:203:function axesField(value: unknown): FeedbackAxis[] {
web\src\coach\evaluation.ts:206:    .map((item) => (typeof item === 'string' && (FEEDBACK_AXES as readonly string[]).includes(item) ? (item as FeedbackAxis) : null))
web\src\coach\evaluation.ts:207:    .filter((item): item is FeedbackAxis => item !== null);
web\src\coach\evaluation.ts:218:  if (!text) return FALLBACK_FEEDBACK.sceneIntent;
web\src\coach\evaluation.ts:225:function parseStrength(value: unknown): FeedbackStrength {
web\src\coach\evaluation.ts:230:  if (!signal && !why) return FALLBACK_FEEDBACK.strength;
web\src\coach\evaluation.ts:241:function parseFocus(value: unknown): FeedbackFocus {
web\src\coach\evaluation.ts:248:  if (!prescription) return FALLBACK_FEEDBACK.focus;
web\src\coach\evaluation.ts:260:function parseNextStep(value: unknown): FeedbackNextStep {
web\src\coach\evaluation.ts:263:  if (!text) return FALLBACK_FEEDBACK.nextStep;
web\src\coach\evaluation.ts:270:export function parseGeminiFeedback(rawText: string): CoachFeedback {
web\src\coach\evaluation.ts:275:      sceneIntent: parseSceneIntent(parsed.scene_intent),
web\src\coach\evaluation.ts:281:    return FALLBACK_FEEDBACK;
web\src\views\ResultPage.tsx:20:import StoryCaptureCanvas from '../components/StoryCaptureCanvas';
web\src\views\ResultPage.tsx:64:    const images = storyRef.current.querySelectorAll('img');
web\src\views\ResultPage.tsx:66:      Array.from(images).map((img) =>
web\src\views\ResultPage.tsx:76:    const filename = `acti-${type.code}.png`;
web\src\views\ResultPage.tsx:80:      trackResultAction('instagram_story', type.code);
web\src\views\ResultPage.tsx:173:                type="instagram"
web\src\views\ResultPage.tsx:219:      {!isRecipient && <StoryCaptureCanvas ref={storyRef} type={type} />}
web\src\coach\evaluation.test.ts:2:import { buildSynthesisPrompt, parseGeminiFeedback } from './evaluation';
web\src\coach\evaluation.test.ts:18:    expect(prompt).toContain('"scene_intent"');
web\src\coach\evaluation.test.ts:29:  it('requires a strength with a fallback tier and forbids fake praise', () => {
web\src\coach\evaluation.test.ts:46:describe('parseGeminiFeedback', () => {
web\src\coach\evaluation.test.ts:49:      scene_intent: { text: '꾹 참다 무너지는 걸 보여주고 싶었어요', source: 'actor_input' },
web\src\coach\evaluation.test.ts:68:    const parsed = parseGeminiFeedback(raw);
web\src\coach\evaluation.test.ts:69:    expect(parsed.sceneIntent).toMatchObject({ source: 'actor_input' });
web\src\coach\evaluation.test.ts:78:      scene_intent: { text: '의도', source: 'made_up' },
web\src\coach\evaluation.test.ts:91:    const parsed = parseGeminiFeedback(raw);
web\src\coach\evaluation.test.ts:92:    expect(parsed.sceneIntent.source).toBe('actor_input');
web\src\coach\evaluation.test.ts:101:      scene_intent: { text: '의도', source: 'actor_input' },
web\src\coach\evaluation.test.ts:113:    const onlySignal = parseGeminiFeedback(JSON.stringify({
web\src\coach\evaluation.test.ts:120:    const onlyWhy = parseGeminiFeedback(JSON.stringify({
web\src\coach\evaluation.test.ts:130:      scene_intent: { text: '의도', source: 'actor_input' },
web\src\coach\evaluation.test.ts:143:    const parsed = parseGeminiFeedback(raw);
web\src\coach\evaluation.test.ts:147:  it('fills a fallback strength when signal and why are both empty', () => {
web\src\coach\evaluation.test.ts:149:      scene_intent: { text: '의도', source: 'actor_input' },
web\src\coach\evaluation.test.ts:162:    const parsed = parseGeminiFeedback(raw);
web\src\coach\evaluation.test.ts:163:    expect(parsed.strength.tier).toBe('encouragement'); // fallback strength
web\src\coach\evaluation.test.ts:168:    const parsed = parseGeminiFeedback('not json at all');
web\src\coach\evaluation.test.ts:169:    expect(parsed.sceneIntent.text).toContain('의도를 다시 읽지 못했');
web\src\views\TheaPage.css:157:.thea-hero__image {
web\src\views\TheaPage.css:162:    url("/thea/theater-hero.png") center / cover no-repeat;
web\src\server\webRequest.ts:23:export function createWebRequest(request: RequestWithUrl, fallbackPath: string) {
web\src\server\webRequest.ts:28:  const path = request.url && request.url !== '/' ? request.url : fallbackPath;
web\src\views\QuickTestPage.tsx:17:import { formatTime, type CoachFeedback } from '../coach/evaluation';
web\src\views\QuickTestPage.tsx:18:import { FocusBlock, NextStepBlock, OverallBlock, StrengthBlock } from './coachFeedbackCards';
web\src\views\QuickTestPage.tsx:61:  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
web\src\views\QuickTestPage.tsx:121:    setFeedback(null);
web\src\views\QuickTestPage.tsx:137:    setFeedback(null);
web\src\views\QuickTestPage.tsx:154:    setFeedback(null);
web\src\views\QuickTestPage.tsx:229:    setFeedback(null);
web\src\views\QuickTestPage.tsx:259:        feedback?: CoachFeedback;
web\src\views\QuickTestPage.tsx:275:      setFeedback(payload.feedback);
web\src\server\testCoachAnalyze.ts:11:import { formatTime, type CoachFeedback } from '../coach/evaluation';
web\src\server\testCoachAnalyze.ts:75:type CoachSecondResult = { feedback: CoachFeedback; trace: AnalysisTrace };
web\src\server\storageFactory.test.ts:9:      title: '메모리 fallback',
web\src\server\storageFactory.test.ts:14:    expect(await storage.getCommunityPost(post.id)).toMatchObject({ title: '메모리 fallback' });
web\src\archive\fixtures.ts:10:    description: '감정선이 길게 이어지는 독백 장면을 기록한 영상입니다.',
web\src\archive\fixtures.ts:20:    id: 'scene-partner-rehearsal',
web\src\archive\fixtures.ts:21:    title: '상대와 호흡 맞추는 장면 리허설',
web\src\archive\fixtures.ts:28:    tags: ['리허설', '호흡', '장면'],
web\src\server\storage.ts:20:import type { CoachFeedback } from '../coach/evaluation';
web\src\server\storage.ts:83:  feedback: CoachFeedback;
web\src\server\storage.ts:101:  feedback: CoachFeedback;
web\src\coach2\prompts.ts:101:   원문 단어에 근거가 있어야 한다(예: "무서움"→두려움). 장면 분위기로 짐작해
web\src\coach2\prompts.ts:121:    lens: '표현된 감정이 배우 의도·장면 서브텍스트와 맞는지(과하거나 모자란 것 모두).',
web\src\components\StoryCaptureCanvas.tsx:2: * StoryCaptureCanvas — 인스타 스토리(9:16) 전용 캡처 캔버스.
web\src\components\StoryCaptureCanvas.tsx:4: * 화면엔 안 보이는 540x960 오프스크린 DOM. 공유 시 html-to-image로
web\src\components\StoryCaptureCanvas.tsx:16:const StoryCaptureCanvas = forwardRef<HTMLElement, Props>(function StoryCaptureCanvas(
web\src\components\StoryCaptureCanvas.tsx:35:          src={`/characters/${type.code}.png`}
web\src\components\StoryCaptureCanvas.tsx:61:export default StoryCaptureCanvas;
web\src\archive\archiveData.test.ts:24:    title: '장면 호흡 리허설',
web\src\components\StoryCaptureCanvas.css:1:/* 540x960 = 9:16, pixelRatio 2 적용 시 1080x1920 출력 (인스타 스토리 권장 크기). */
web\src\coach2\pipeline.ts:3:import type { CoachFeedback, FeedbackAxis, FeedbackAxisBand, OverallBand } from '../coach/evaluation';
web\src\coach2\pipeline.ts:242:const PERSONA_AXIS: Record<CoachPersonaKey, FeedbackAxis> = {
web\src\coach2\pipeline.ts:322:  encouragement: () => '이 장면을 끝까지 해본 것이 다음 분석의 출발점이에요.',
web\src\coach2\pipeline.ts:368:export function buildAxisBands(aggregation: Aggregation, verdicts: AllVerdicts): FeedbackAxisBand[] {
web\src\coach2\pipeline.ts:369:  const bands: FeedbackAxisBand[] = [];
web\src\coach2\pipeline.ts:399:// rev.7: 구조화 전경은 buildAxisBands가 담당, 이 한 문단 요약은 하위호환 fallback으로만 유지.
web\src\coach2\pipeline.ts:430:}): CoachFeedback {
web\src\coach2\pipeline.ts:435:  // focus 갭 판정을 sceneIntent보다 먼저 계산한다 — misread로 판정된 인상이 의도 요약에 남으면
web\src\coach2\pipeline.ts:462:  const sceneIntent = {
web\src\coach2\pipeline.ts:467:      : '이 장면의 의도를 알려주시면 다음 분석이 더 정확해져요.',
web\src\coach2\pipeline.ts:482:  let strength: CoachFeedback['strength'];
web\src\coach2\pipeline.ts:512:      sceneIntent,
web\src\coach2\pipeline.ts:530:    : (['emotion'] as FeedbackAxis[]);
web\src\coach2\pipeline.ts:558:    sceneIntent,
web\src\views\FormPage.tsx:25:const CHANNELS = ['DM', '필름메이커스', '오픈카톡', '인스타'] as const;
web\src\views\FormPage.tsx:28:type FeedbackSource = (typeof FEEDBACK_SOURCES)[number];
web\src\views\FormPage.tsx:41:  const [feedbackSource, setFeedbackSource] = useState<FeedbackSource | ''>('');
web\src\views\FormPage.tsx:200:                onClick={() => setFeedbackSource(s)}
web\src\components\ShareSuccessModal.tsx:2: * ShareSuccessModal — 인스타 스토리 공유 후 안내 모달.
web\src\components\ShareSuccessModal.tsx:4: * 인스타는 외부 앱에서 자동으로 Link Sticker를 박지 못해서, 사용자가
web\src\coach2\dictionaries.ts:6:import type { FeedbackAxis, OverallAxisKey, OverallBand } from '../coach/evaluation';
web\src\coach2\dictionaries.ts:132:export const PROGRESSION_LIBRARY: Record<FeedbackAxis, Progression> = {
web\src\coach2\dictionaries.ts:134:    task: '같은 장면을 감정 강도 절반으로 한 번, 1.5배로 한 번 더 찍어 셋을 나란히 보세요. 지금 강도가 우연이 아니라 선택이었는지 확인할 수 있어요.',
web\src\coach2\dictionaries.ts:135:    nextStep: '같은 장면을 강도 절반·1.5배로 두 번 더 찍어보기',
web\src\coach2\dictionaries.ts:142:    task: '같은 장면을 대사 없이 표정만으로 한 번 찍어보세요. 어떤 표정이 실제로 일하고 있었는지 분리해서 볼 수 있어요.',
web\src\coach2\dictionaries.ts:143:    nextStep: '대사 없이 표정만으로 같은 장면 찍어보기',
web\src\coach2\dictionaries.ts:146:    task: '같은 장면을 움직임 절반으로 줄여 다시 찍어보세요. 남은 에너지가 시선과 호흡 어디로 가는지 보이면 다음 단계가 잡혀요.',
web\src\coach2\dictionaries.ts:147:    nextStep: '움직임을 절반으로 줄여 같은 장면 다시 찍어보기',
web\src\server\schema.ts:12:import type { CoachFeedback } from '../coach/evaluation';
web\src\server\schema.ts:91:  feedback: jsonb('feedback').$type<CoachFeedback>().notNull(),
web\src\coach2\pipeline.test.ts:189:    expect(card.sceneIntent.text).toContain('슬픔 인상');
web\src\coach2\pipeline.test.ts:192:    expect(card.sceneIntent.source).toBe('actor_input');
web\src\coach2\pipeline.test.ts:195:  it('의도 보강 실패(기대 인상 없음) 시 sceneIntent·intentGap은 원문 기반 문구로 폴백한다', () => {
web\src\coach2\pipeline.test.ts:202:    expect(card.sceneIntent.text).toBe(`${bareIntent.raw} — 이렇게 가려 하셨죠.`);
web\src\coach2\pipeline.test.ts:215:    expect(summarized.sceneIntent.text).toContain('확인하러 간 사람의 절제된 슬픔과 담담함');
web\src\coach2\pipeline.test.ts:216:    expect(summarized.sceneIntent.text).not.toContain('보여주고 싶었어요');
web\src\coach2\pipeline.test.ts:221:    expect(verbatim.sceneIntent.text).toContain(longRaw);
web\src\coach2\pipeline.test.ts:226:    expect(short.sceneIntent.text).toContain(INTENT.raw);
web\src\coach2\pipeline.test.ts:227:    expect(short.sceneIntent.text).not.toContain('다른 요약');
web\src\coach2\pipeline.test.ts:230:  it('misread로 판정된 인상은 sceneIntent 의도 요약에서도 빠진다 — 카드 내 모순 차단', () => {
web\src\coach2\pipeline.test.ts:239:    expect(card.sceneIntent.text).toContain('두려움 인상');
web\src\coach2\pipeline.test.ts:240:    expect(card.sceneIntent.text).not.toContain('슬픔 인상');
web\src\coach2\pipeline.test.ts:241:    expect(card.sceneIntent.text).not.toContain('슬픔·');
web\src\coach2\pipeline.test.ts:428:    expect(card.sceneIntent.text).toBe(`${lowIntent.raw} — 이렇게 가려 하셨죠.`);
web\src\components\ShareActionButton.tsx:8:type ShareType = 'image' | 'link' | 'kakao' | 'instagram';
web\src\components\CharacterAvatar.tsx:4: * - public/characters/{code}.png 를 표시
web\src\components\CharacterAvatar.tsx:38:  const src = `/characters/${resolvedCode}.png`;
web\src\components\ShareActionButton.css:34:.share--image .share__icon { color: var(--text-default); }
web\src\components\ShareActionButton.css:35:.share--instagram { background: linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%); }
web\src\components\ShareActionButton.css:36:.share--instagram .share__icon,
web\src\components\ShareActionButton.css:37:.share--instagram .share__label { color: #FFFFFF; }
web\src\components\ShareActionButton.css:39:  .share--instagram:hover { filter: brightness(1.05); background: linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%); }
web\src\server\lineshotScore.test.ts:5:const sample: Lineshot = {
web\src\server\lineshotScore.test.ts:20:const okScore = async () => sample;
web\src\server\lineshotScore.test.ts:79:  it('level이 임계 이하(무음)면 Gemini를 부르지 않고 fun_fallback 카드를 돌려준다', async () => {
web\src\server\coachAnalyze.ts:7:import { buildSynthesisPrompt, formatTime, parseGeminiFeedback, type CoachFeedback } from '../coach/evaluation';
web\src\server\coachAnalyze.ts:31:  analyze?: (input: CoachAnalyzeInput) => Promise<CoachFeedback>;
web\src\server\coachAnalyze.ts:96:async function defaultAnalyze(input: CoachAnalyzeInput): Promise<CoachFeedback> {
web\src\server\coachAnalyze.ts:189:    return parseGeminiFeedback(synthesis);
web\src\server\formApply.ts:18:export const CHANNELS = ['DM', '필름메이커스', '오픈카톡', '인스타'] as const;
web\src\server\lineshotPrompt.ts:32:      ? `[제시 대사] "${target}"  (의도된 대사. 음성이 이와 다르거나 무음/잡음이면 fun_fallback 처리.)`
web\src\server\lineshotPrompt.ts:33:      : '[제시 대사] (지정 없음. 사용자가 자유롭게 연기했다. 무음/잡음이면 fun_fallback 처리.)',
web\src\server\lineshotPrompt.ts:41:    '6. 음성이 무음/잡음/대사와 무관/명백한 장난이면 fun_fallback=true. 에러 내지 말고 재밌게 받아치되 점수는 그래도 60+ 부여하고 "한 번 제대로 가보자" 톤으로 응원.',
web\src\server\lineshotPrompt.ts:42:    '   ⚠️ 또렷한 발화가 실제로 들리지 않으면(무음·숨소리·잡음만) 절대 들은 척 디테일을 지어내지 마라. 들리지도 않은 발성·감정·호흡을 칭찬하는 것은 금지다. 이 경우 반드시 fun_fallback=true로 하고, 점수는 60~70대, 멘트는 "소리가 거의 안 담겼어요 / 마이크가 비어 있었어요" 톤으로 다시 한 번을 권한다.',
web\src\server\lineshotPrompt.ts:46:    '{"title":"칭호","score":60에서 99 사이 정수,"one_liner":"위트 총평 1~2문장","axes":{"voice":{"score":정수,"comment":"한 줄"},"emotion":{"score":정수,"comment":"한 줄"},"delivery":{"score":정수,"comment":"한 줄"}},"strength":"구체적 강점 1개","tip":"10초 안에 해볼 처방 1개","actor_vibe":"○○ 같은 톤","fun_fallback":false}',
web\src\server\lineshotPrompt.ts:92:    funFallback: parsed.fun_fallback === true,
web\src\server\email\typeDetails.ts:32:      '너의 무대는 폭발이 필요한 곳이다. 광기 어린 로맨틱 안티히어로, 누아르 조연, 사극 비극의 주인공, 옴니버스 단편의 단독 주연 — 짧지만 강렬한 임팩트가 필요한 역할들. 영화에서는 클로즈업이 너의 친구다. 한 컷에 모든 게 담긴다. 연극에서는 한 장면을 통째로 잡아먹는 모놀로그가 너의 영역이다. 매번 1.5배 텐션을 끌어올리고도 그 텐션이 부자연스럽지 않은 것은, 그게 너에게 진짜이기 때문이다.',
web\src\server\email\typeDetails.ts:43:      '즉흥(I) + 내면(S) 조합 덕에, 너의 분석은 무대 위에서 차갑게 굳지 않는다. 시선의 떨림, 호흡의 결처럼 내면에서 새어 나오는 미세한 신호로 분석한 캐릭터를 표현한다. Stella Adler가 강조한 "배우의 상상력은 텍스트보다 크다"는 말이 너에게 가장 잘 맞는다 — 노트에 적은 분석은 출발점일 뿐, 무대 위에서는 그 분석에 너의 상상력과 즉흥이 덧붙는다. 한 장면을 30번 해도 매번 살짝 다르고, 그 다름이 부자연스럽지 않다.',
web\src\server\email\typeDetails.ts:47:      '다음 한 걸음은 "분석을 닫는 시간"을 의식적으로 정하는 것이다. David Mamet과 William H. Macy가 정립한 Practical Aesthetics 학파가 강조하듯, 무대 위에서는 분석을 다 마친 척하고 행동(action)만 남겨야 한다. 노트는 리허설장 밖에 두고 들어가는 연습. "이 장면에서 내가 하고 싶은 단 하나의 행동"으로 모든 분석을 압축해 한 동사로 만들고, 무대 위에서는 그 동사만 따라간다.',
web\src\server\email\typeDetails.ts:81:      '함정은 깊이 부족이라는 비판을 자주 듣는 것 — 기교가 빛나는 만큼, "기교 뒤에 인물이 보이지 않는다"는 말이 따라온다. 직관이 너무 빨라서, 한 인물을 오래 살아본 흔적이 얕아 보일 수 있다. 비극이나 깊은 정서가 요구되는 장면에서는 너의 빠른 회로가 오히려 방해가 된다. 영화에서 클로즈업이 길게 잡힐 때, 너의 결이 약해 보이는 순간이 있다.',
web\src\server\email\typeDetails.ts:83:      '다음 한 걸음은 텍스트를 천천히 읽는 시간이다. 영국 연출가 Mike Alfreds의 텍스트 분석법 — 한 장면을 30번 정독하며 인물의 과거를 상상으로 채우는 작업 — 이나, Stanislavski의 "주어진 상황(given circumstances)" 워크가 너에게 필요한 훈련이다. 인물의 어머니는 누구인지, 어떤 어린 시절을 보냈는지, 이 장면 직전에 뭘 먹었는지 — 사소한 디테일까지 노트에 적어보는 작업. 신체의 빠른 회로 옆에 느린 회로를 하나 더 만드는 것.',
web\src\server\email\typeDetails.ts:91:      '이 결의 강점은 자기 통제력이다. 어떤 장면에서도 무너지지 않고, 디렉터가 요구하는 톤을 정확히 맞춘다. 정서가 폭주하지 않으니 매번 같은 깊이로 인물을 제시할 수 있다. 영화에서는 콘텐츠 시간이 길어져도 균질하고, 무대에서는 시즌 후반에도 첫 공연만큼의 명료함을 유지한다. 너는 감독·연출가가 "한 번에 OK"를 자주 주는 결의 배우다.',
web\src\server\email\typeDetails.ts:95:      '다음 한 걸음은 의외로 메소드 쪽이다. Strasberg의 정서 기억(emotional memory)을 풀세트로 받아들이지 않더라도, Stella Adler의 상상력 훈련 — "만약 이 인물의 어머니가 어제 죽었다면 너는 이 장면에서 어떻게 들어가겠는가" 같은 상상 시나리오 — 만으로도 너의 분석에 체온이 더해진다. 일주일에 한 인물에 대해 30분씩, "이 인물을 사랑할 수 있는 이유"를 노트에 적어보는 작업.',
web\src\server\email\typeDetails.ts:140:      '신체 연극(physical theatre), 데비즈드(devised) 작품, 무용+연극 결합 무대, 가난한 극장 스타일의 실험극 — 신체가 곧 텍스트가 되는 작품들이 너의 영역이다. Grotowski의 후예인 Anne Bogart·Wlodzimierz Staniewski의 작업 결이나, 한국의 극단 골목길·연희단 거리패의 신체극 결. 영화에서는 봉준호의 〈마더〉김혜자처럼, 신체로 정서를 폭발시키는 장면에서 너의 결이 빛난다.',
web\src\server\email\typeDetails.ts:143:      '다음 한 걸음은 Meisner의 반복 연습이다. 두 배우가 마주 앉아 상대의 미세한 신호("너 지금 웃었다" / "너 지금 한숨 쉬었다")만 주고받는 단순한 훈련 — 신체를 거의 쓰지 않고, 시선과 호흡만으로 상대와 연결되는 작업이다. 너의 큰 신체 회로를 일시정지하고, 미세 회로를 따로 만드는 훈련. 또한 영화 카메라 앞에서 한 장면을 신체 동작 없이 시선만으로 표현해 보는 연습.',
web\src\server\email\typeDetails.ts:150:      '메소드(M)와 설계(P)를 직관(N)으로 연결하고 내면(S)으로 표출하는 너의 결은 — 시적이다. Michael Chekhov가 말한 "분위기(atmosphere) 작업"과 가장 가깝다. Chekhov는 스승 Stanislavski를 떠나 자기만의 시스템을 만들었는데, 그 핵심이 바로 "장면의 분위기는 배우의 호흡과 신체에 먼저 들어와 있어야 한다"는 명제였다. 너는 무대에 들어서기 전에 인물의 분위기를 먼저 호흡으로 끌어당기고, 그 분위기 안에서 미리 설계된 동선을 시처럼 풀어낸다.',
web\src\server\email\typeDetails.ts:151:      '이 결의 강점은 무대 전체에 시적 분위기를 까는 능력이다. 객석은 너의 한 장면이 끝난 뒤에도 그 잔향을 오래 기억한다. 한 인물의 슬픔이 너의 호흡으로 무대 전체를 적시고, 그 슬픔이 다음 장면까지 이어진다. 시인 같은 배우. 무대를 떠난 뒤에 사람들이 너의 한 시선을 기억한다.',
web\src\server\email\typeDetails.ts:153:      '함정은 분석(A)이 약하다는 것 — 디렉터가 "왜 이 장면에서 이 선택을 했는가"라고 물을 때, "그냥 그런 느낌이 들어서요"라는 답이 자주 나온다. 직관에 의존하다 보니, 다른 사람과의 협업에서 근거를 공유하기 어려울 수 있다. 또한 너의 분위기 작업은 본인은 명확한데, 옆 배우와 디렉터는 그 분위기를 안 잡힐 때가 있다. "혼자 노는 것 같다"는 인상이 든다.',
web\src\server\email\typeDetails.ts:155:      '다음 한 걸음은 분석 노트 쓰기다. 단, Stanislavski식의 무거운 분석이 아니라, 너의 직관을 사후에 해독하는 가벼운 일지 — "왜 이 호흡이 이 순간에 옳다고 느꼈는가"를 짧게 적어보는 것. 한 장면을 끝내고 3분 동안 노트에 직관의 근거를 정리하는 작업. 또한 Michael Chekhov의 atmosphere 워크북을 읽으면서, 너의 본능적 작업에 이론적 어휘를 부여하는 시간.',
web\src\server\email\typeDetails.ts:175:      '이 결의 강점은 즉흥 안에서의 시선 디테일이다. 코미디에서는 능청 천재로, 멜로에서는 미묘한 내면 캐릭터로 자연스럽게 옮겨간다. 한 장면 안에서 톤이 4번 바뀌어도, 너는 매번 정확히 그 톤에 도착한다. 윙크 한 번, 한숨 한 번에 모든 게 담긴다. 카메라 앞에서 자연스럽고, 무대에서 사랑스럽다. 시청자·관객이 너의 결을 보면 자기도 모르게 미소 짓는다.',
web\src\server\email\typeDetails.ts:177:      '함정은 무게감 부족이라는 인상 — 모든 게 가볍게 흘러가는 것처럼 보일 수 있고, 비극이나 깊은 정서가 요구되는 장면에서 객석이 "이 배우가 진심인가"를 의심하는 순간이 온다. 시상식에서는 자주 후보에서 밀린다 — "사랑스럽지만 무겁지 않다"는 평. 또한 자신의 매력에 갇혀서, 다른 톤의 작품에 도전하기 어려운 결이기도 하다.',
web\src\server\coachAnalyze.test.ts:21:  data.set('video', new File(['video-bytes'], 'scene.webm', { type: 'video/webm' }));
web\src\server\coachAnalyze.test.ts:77:      sceneIntent: { text: '집중을 보여주고 싶었어요', source: 'actor_input' },
web\src\server\coachAnalyze.test.ts:101:      sceneIntent: { text: '집중을 보여주고 싶었어요', source: 'actor_input' },
web\src\server\coachAnalyze.test.ts:116:        videoUrl: 'https://blob.vercel-storage.com/coach/scene.webm',
web\src\server\coachAnalyze.test.ts:133:    expect(fetcher).toHaveBeenCalledWith(new URL('https://blob.vercel-storage.com/coach/scene.webm'));
web\src\server\formApply.test.ts:18:  channel: '인스타',
web\src\server\formApply.test.ts:46:      channel: '인스타',
web\src\server\lineshotPrompt.test.ts:9:    expect(prompt).toContain('fun_fallback');
web\src\server\lineshotPrompt.test.ts:24:  it('들은 적 없는 음성을 칭찬하지 않는 fun_fallback 카드를 만든다', () => {
web\src\server\lineshotPrompt.test.ts:46:  fun_fallback: false,
web\src\server\blobUpload.test.ts:7:    expect(isArchiveVideoContentType('image/png')).toBe(false);
web\src\server\blobUpload.test.ts:9:    const options = await createArchiveUploadTokenOptions('archive/sample.mp4');
web\src\server\blobUpload.test.ts:13:    expect(options.tokenPayload).toBe(JSON.stringify({ pathname: 'archive/sample.mp4' }));
web\src\server\coachSession.ts:3:import type { CoachFeedback } from '../coach/evaluation';
web\src\server\coachSession.ts:20:  feedback: CoachFeedback;
web\src\server\coachSession.test.ts:5:import type { CoachFeedback } from '../coach/evaluation';
web\src\server\coachSession.test.ts:7:const feedback: CoachFeedback = {
web\src\server\coachSession.test.ts:8:  sceneIntent: { text: '집중을 보여주고 싶었어요', source: 'actor_input' },
web\src\server\coachSession.test.ts:44:      baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
web\src\server\coachSession.test.ts:51:    expect(fromUrl).toBe('https://store.public.blob.vercel-storage.com/coach/123-scene.webm');
web\src\server\coachSession.test.ts:88:        baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
web\src\server\coachSession.test.ts:107:        baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
web\src\server\coachSecondAnalyze.ts:11:import { formatTime, type CoachFeedback } from '../coach/evaluation';
web\src\server\coachSecondAnalyze.ts:73:type CoachSecondResult = { feedback: CoachFeedback; trace: AnalysisTrace };
web\src\server\coachSecondAnalyze.test.ts:5:import type { CoachFeedback } from '../coach/evaluation';
web\src\server\coachSecondAnalyze.test.ts:7:const feedback: CoachFeedback = {
web\src\server\coachSecondAnalyze.test.ts:8:  sceneIntent: { text: '집중을 보여주고 싶었어요', source: 'actor_input' },
web\src\server\coachSecondAnalyze.test.ts:25:      videoUrl: 'https://blob.vercel-storage.com/coach/scene.webm',
web\src\server\coachSecondAnalyze.test.ts:61:    const body = result.body as { feedback?: CoachFeedback; trace?: unknown; sessionId?: string };
web\src\server\coachSecondAnalyze.test.ts:91:      const body = result.body as { feedback?: CoachFeedback; sessionId?: string };
web\src\app\globals.css:13:@import '../components/StoryCaptureCanvas.css';
web\src\lib\kakao.ts:45:  const imageUrl = `${appUrl}/og/${type.code}.png`;
web\src\lib\kakao.ts:52:      imageUrl,
web\src\lib\analytics.ts:8: * - `instagram_story`: Web Share API가 `'shared'` 반환 시 (확정)
web\src\lib\analytics.ts:13:export type ResultAction = 'email_report' | 'instagram_story' | 'kakao_share' | 'copy_link';
web\src\lib\share.ts:5:import { toBlob, toPng } from 'html-to-image';
web\src\lib\share.ts:33: * 인스타 스토리 공유 가능 환경인지 판정.
web\src\lib\share.ts:36: *  1. 모바일 (iOS / Android) — 인스타 앱이 OS 공유시트에서 잡혀야 함
web\src\lib\share.ts:50:    const probe = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'probe.png', {
web\src\lib\share.ts:51:      type: 'image/png',
web\src\lib\share.ts:60: * 인스타 스토리(또는 OS 공유시트)로 캡처 카드 보내기.
web\src\lib\share.ts:70:    throw new Error('Failed to render capture as image');
web\src\lib\share.ts:72:  const file = new File([blob], filename, { type: 'image/png' });
web\src\app\ACTI\result\[code]\page.tsx:31:      images: [`/og/${rawCode}.png`],
web\src\app\ACTI\result\[code]\page.tsx:36:      card: 'summary_large_image',

 succeeded in 839ms:
C:\soma\repos\acttub\web\public\favicon.svg
C:\soma\repos\acttub\web\public\icons.svg
C:\soma\repos\acttub\web\public\characters\MIAB.png
C:\soma\repos\acttub\web\public\characters\MIAS.png
C:\soma\repos\acttub\web\public\characters\MINB.png
C:\soma\repos\acttub\web\public\characters\MINS.png
C:\soma\repos\acttub\web\public\characters\MPAB.png
C:\soma\repos\acttub\web\public\characters\MPAS.png
C:\soma\repos\acttub\web\public\characters\MPNB.png
C:\soma\repos\acttub\web\public\characters\MPNS.png
C:\soma\repos\acttub\web\public\characters\TIAB.png
C:\soma\repos\acttub\web\public\characters\TIAS.png
C:\soma\repos\acttub\web\public\characters\TINB.png
C:\soma\repos\acttub\web\public\characters\TINS.png
C:\soma\repos\acttub\web\public\characters\TPAB.png
C:\soma\repos\acttub\web\public\characters\TPAS.png
C:\soma\repos\acttub\web\public\characters\TPNB.png
C:\soma\repos\acttub\web\public\characters\TPNS.png
C:\soma\repos\acttub\web\public\thea\theater-hero.png

codex
`web/public`에는 coach용 이미지가 보이지 않고 ACTI 캐릭터/극장 hero만 있습니다. “기존 인스타 장면해부 이미지”가 repo 밖 캠페인 자산이면, 새 샘플 생성보다 그 파일을 route에서 정적 참조하는 쪽이 맞습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'Get-ChildItem -Recurse -File -Include *.png,*.jpg,*.jpeg,*.webp,*.gif,*.avif | Select-Object -ExpandProperty FullName' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg -n 'useSearchParams|trackPageView\\(|NEXT_PUBLIC_GA|gtag|page_view|utm' web\\src web\\README.md docs scripts" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Raw scripts\\smoke-routes.mjs; Get-Content -Raw scripts\\verify-prod-runtime.mjs" in C:\soma\repos\acttub
 succeeded in 570ms:
web\src\views\SurveyPage.test.tsx:20:  useSearchParams: () => new URLSearchParams(),
web\src\app\Providers.tsx:15:    if (pathname) trackPageView(pathname);
web\src\lib\analytics.ts:1:const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
web\src\lib\analytics.ts:31:    gtag?: (...args: GtagCommand) => void;
web\src\lib\analytics.ts:47:    `script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`
web\src\lib\analytics.ts:52:    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
web\src\lib\analytics.ts:56:  if (window.gtag) return;
web\src\lib\analytics.ts:59:  // gtag.js queue consumer expects the native arguments object, not an array — see google's snippet.
web\src\lib\analytics.ts:61:  window.gtag = function gtag() { window.dataLayer?.push(arguments); };
web\src\lib\analytics.ts:62:  window.gtag('js', new Date());
web\src\lib\analytics.ts:63:  window.gtag('config', measurementId, { send_page_view: false });
web\src\lib\analytics.ts:66:/** ID는 설정됐는데 gtag가 아직 없으면 self-init 시도. */
web\src\lib\analytics.ts:69:  if (!window.gtag) initAnalytics();
web\src\lib\analytics.ts:70:  return Boolean(window.gtag);
web\src\lib\analytics.ts:95:export function trackPageView(path: string): void {
web\src\lib\analytics.ts:103:  window.gtag?.('event', 'page_view', {
web\src\lib\analytics.ts:113:  window.gtag?.('event', 'result_action_request', {
web\src\lib\analytics.ts:128:  window.gtag?.('event', `coach_${step}`);
web\src\lib\analytics.test.ts:21:    delete window.gtag;
web\src\lib\analytics.test.ts:26:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
web\src\lib\analytics.test.ts:30:    trackPageView('/ACTI/quiz');
web\src\lib\analytics.test.ts:32:    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')).toHaveLength(0);
web\src\lib\analytics.test.ts:33:    expect(window.gtag).toBeUndefined();
web\src\lib\analytics.test.ts:36:  it('loads the Google tag once and disables automatic page_view', async () => {
web\src\lib\analytics.test.ts:37:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:43:    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]')).toHaveLength(1);
web\src\lib\analytics.test.ts:45:    expectDataLayerToContain(['config', 'G-TEST123', { send_page_view: false }]);
web\src\lib\analytics.test.ts:48:  it('queues native gtag arguments objects for the Google tag runtime', async () => {
web\src\lib\analytics.test.ts:49:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:59:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:63:    trackPageView('/ACTI/result/MINB');
web\src\lib\analytics.test.ts:67:      'page_view',
web\src\lib\analytics.test.ts:76:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:80:    trackPageView('/ACTI/result/MINB?email=user@example.com#private');
web\src\lib\analytics.test.ts:84:      'page_view',
web\src\lib\analytics.test.ts:93:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:111:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:114:    trackPageView('/ACTI/quiz');
web\src\lib\analytics.test.ts:116:    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]')).toHaveLength(1);
web\src\lib\analytics.test.ts:119:      'page_view',
web\src\lib\analytics.test.ts:125:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:140:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:152:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
web\src\lib\analytics.test.ts:157:    expect(window.gtag).toBeUndefined();
web\src\lib\analytics.test.ts:162:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:167:    expect(window.gtag).toBeDefined();
web\src\lib\analytics.test.ts:176:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:180:    trackPageView('ACTI/quiz');
web\src\lib\analytics.test.ts:184:      'page_view',
web\src\lib\analytics.test.ts:193:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:197:    trackPageView('//evil.com/leak');
web\src\lib\analytics.test.ts:199:    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');
web\src\lib\analytics.test.ts:204:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:208:    trackPageView('http://evil.com/leak');
web\src\lib\analytics.test.ts:209:    trackPageView('https://evil.com/leak');
web\src\lib\analytics.test.ts:211:    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');
web\src\lib\analytics.test.ts:216:    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
web\src\lib\analytics.test.ts:220:    trackPageView('/ACTI/quiz');
web\src\lib\analytics.test.ts:221:    trackPageView('/ACTI/quiz');
web\src\lib\analytics.test.ts:222:    trackPageView('/ACTI/result/MINB');
web\src\lib\analytics.test.ts:223:    trackPageView('/ACTI/result/MINB');
web\src\lib\analytics.test.ts:225:    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');

 succeeded in 483ms:
const baseUrl = (process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:4000').replace(/\/$/, '');

const checks = [
  ['landing', '/', 'root-landing'],
  ['ACTI home', '/ACTI', 'page-landing'],
  ['ACTI quiz', '/ACTI/quiz', 'page-quiz'],
  ['ACTI survey', '/ACTI/survey', 'data-route="acti-survey"'],
  ['ACTI result', '/ACTI/result/MINB', 'MINB'],
  ['coach', '/coach', 'coach-page', {
    forbiddenContent: ['Gemini', 'gemini', 'GEMINI_MODEL', 'Request Entity Too Large'],
  }],
  ['archive', '/archive', 'archive-page'],
  ['archive search', '/archive/search?q=%ED%96%84%EB%A6%BF', 'archive-search-page'],
  ['archive upload', '/archive/upload', 'archive-upload-form'],
  ['archive me', '/archive/me', 'archive-me'],
  ['archive playlist new', '/archive/playlists/new', 'archive-page'],
  ['archive user profile', '/archive/u/minseo01', 'archive-page'],
  ['archive video detail', '/archive/videos/hamlet-monologue', '?꾨┸ 3留??낅갚 ?곗뒿'],
  ['community', '/community', 'community-page'],
  ['community search', '/community/search?q=%EC%97%B0%EA%B8%B0', 'community-search-block'],
  ['community new', '/community/new', 'community-post-form'],
  ['community write', '/community/write', 'community-post-form'],
  ['community me', '/community/me?tab=posts', 'community-page-title'],
  ['community post detail', '/community/posts/1024', '?щ윭遺꾩? ???곌린瑜??쒖옉?섏뀲?댁슂?'],
  ['community post alias', '/community/p/1024', '?щ윭遺꾩? ???곌린瑜??쒖옉?섏뀲?댁슂?'],
  ['excer', '/excer', 'excer-page'],
  ['excer room detail', '/excer/rooms/hyehwa-coral-studio', '?쒗솕 肄붾엫 ?ㅽ뒠?붿삤'],
  ['thea', '/thea', 'thea-page'],
  ['thea play detail', '/thea/plays/finding-mr-destiny', '源醫낆슧 李얘린'],
  ['team', '/team', 'team-page'],
  ['health API', '/api/health', '"ok":true', { expectJson: true }],
  ['archive videos API', '/api/archive/videos?q=%ED%96%84%EB%A6%BF', '"items":', { expectJson: true }],
  ['community posts API', '/api/community/posts?board=free', '"items":', { expectJson: true }],
  ['community comments API', '/api/community/comments?postId=1024', '"items":', { expectJson: true }],
  ['coach analyze invalid API', '/api/coach/analyze', '"error":', {
    method: 'POST',
    formData: {
      category: '?낅갚',
      intent: '?곗뒿 ?섎룄',
      startTime: '0',
      endTime: '1',
    },
    expectedStatuses: [400, 500],
    expectJson: true,
    forbiddenContent: ['Gemini', 'gemini', 'GEMINI_MODEL', 'model', 'Request Entity Too Large'],
  }],
];

const failures = [];

function requestInit(options = {}) {
  const headers = { accept: 'text/html,application/json;q=0.9,*/*;q=0.8' };
  if (!options.formData) {
    return {
      method: options.method ?? 'GET',
      headers,
      signal: AbortSignal.timeout(5000),
    };
  }

  const body = new FormData();
  for (const [key, value] of Object.entries(options.formData)) {
    body.set(key, value);
  }

  return {
    method: options.method ?? 'POST',
    headers,
    body,
    signal: AbortSignal.timeout(5000),
  };
}

for (const [label, path, expectedContent, options = {}] of checks) {
  const url = `${baseUrl}${path}`;
  try {
    const response = await fetch(url, requestInit(options));
    const body = await response.text();
    const expectedStatuses = options.expectedStatuses;
    const ok = expectedStatuses ? expectedStatuses.includes(response.status) : response.status >= 200 && response.status < 400;
    const hasExpectedContent = body.includes(expectedContent);
    const forbiddenContent = options.forbiddenContent ?? [];
    const leakedContent = forbiddenContent.find((content) => body.includes(content));
    const contentType = response.headers.get('content-type') ?? '';
    const hasJsonContentType = !options.expectJson || contentType.includes('application/json');
    let hasValidJson = true;
    if (options.expectJson) {
      try {
        JSON.parse(body);
      } catch {
        hasValidJson = false;
      }
    }
    const marker = ok && hasExpectedContent && !leakedContent && hasJsonContentType && hasValidJson ? 'ok' : 'fail';
    console.log(`${marker} ${response.status} ${label} ${path}`);
    if (!ok) failures.push(`${label} ${path} returned ${response.status}`);
    if (ok && !hasExpectedContent) {
      failures.push(`${label} ${path} did not include expected content: ${expectedContent}`);
    }
    if (ok && leakedContent) {
      failures.push(`${label} ${path} included forbidden content: ${leakedContent}`);
    }
    if (ok && !hasJsonContentType) {
      failures.push(`${label} ${path} did not return application/json content-type`);
    }
    if (ok && !hasValidJson) {
      failures.push(`${label} ${path} did not return valid JSON`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`fail ERR ${label} ${path}`);
    failures.push(`${label} ${path} failed: ${message}`);
  }
}

if (failures.length > 0) {
  console.error('\nSmoke check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`\nSmoke check passed for ${checks.length} routes at ${baseUrl}`);

import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

const host = process.env.PROD_VERIFY_HOST ?? '127.0.0.1';
const port = process.env.PROD_VERIFY_PORT ?? '4000';
const baseUrl = `http://${host}:${port}`;

let server;
let stoppingServer = false;

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: { ...process.env, ...options.env },
      stdio: options.stdio ?? 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with ${signal ?? code}`));
    });
  });
}

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  let lastError = 'server did not respond';

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`, {
        signal: AbortSignal.timeout(1000),
      });

      if (response.ok) return;
      lastError = `health returned ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${baseUrl}: ${lastError}`);
}

async function assertNoExistingServer() {
  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      signal: AbortSignal.timeout(500),
    });

    if (response.ok) {
      throw new Error(`${baseUrl} is already serving the app. Stop the running app before verify:prod-runtime.`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('already serving the app')) {
      throw error;
    }
  }
}

function assertPortAvailable() {
  return new Promise((resolve, reject) => {
    const probe = createServer();

    probe.once('error', (error) => {
      if ('code' in error && error.code === 'EADDRINUSE') {
        reject(new Error(`${host}:${port} is already in use. Stop the running app before verify:prod-runtime.`));
        return;
      }

      reject(error);
    });

    probe.once('listening', () => {
      probe.close(resolve);
    });

    probe.listen(Number(port), host);
  });
}

function startServer() {
  server = spawn('corepack', [
    'pnpm',
    '--dir',
    'web',
    'exec',
    'next',
    'start',
    '--hostname',
    host,
    '--port',
    port,
  ], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });

  server.on('exit', (code, signal) => {
    if (stoppingServer) return;

    if (code !== null && code !== 0) {
      console.error(`Production server exited early with ${signal ?? code}`);
    }
  });
}

async function stopServer() {
  if (!server || server.killed) return;

  stoppingServer = true;
  server.kill('SIGTERM');
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 5000);
    server.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await stopServer();
    process.kill(process.pid, signal);
  });
}

try {
  await assertNoExistingServer();
  await assertPortAvailable();
  await run('corepack', ['pnpm', '--dir', 'web', 'build']);
  startServer();
  await waitForServer();
  await run('corepack', ['pnpm', 'smoke'], {
    env: { SMOKE_BASE_URL: baseUrl },
  });
} finally {
  await stopServer();
}


2026-07-03T08:49:15.753867Z ERROR codex_core::tools::router: error=Exit code: 124
Wall time: 10.1 seconds
Output:
command timed out after 10058 milliseconds
C:\soma\repos\acttub\ACTI\public\characters\MIAB.png
C:\soma\repos\acttub\ACTI\public\characters\MIAS.png
C:\soma\repos\acttub\ACTI\public\characters\MINB.png
C:\soma\repos\acttub\ACTI\public\characters\MINS.png
C:\soma\repos\acttub\ACTI\public\characters\MPAB.png
C:\soma\repos\acttub\ACTI\public\characters\MPAS.png
C:\soma\repos\acttub\ACTI\public\characters\MPNB.png
C:\soma\repos\acttub\ACTI\public\characters\MPNS.png
C:\soma\repos\acttub\ACTI\public\characters\TIAB.png
C:\soma\repos\acttub\ACTI\public\characters\TIAS.png
C:\soma\repos\acttub\ACTI\public\characters\TINB.png
C:\soma\repos\acttub\ACTI\public\characters\TINS.png
C:\soma\repos\acttub\ACTI\public\characters\TPAB.png
C:\soma\repos\acttub\ACTI\public\characters\TPAS.png
C:\soma\repos\acttub\ACTI\public\characters\TPNB.png
C:\soma\repos\acttub\ACTI\public\characters\TPNS.png

 exited 124 in 10058ms:
C:\soma\repos\acttub\ACTI\public\characters\MIAB.png
C:\soma\repos\acttub\ACTI\public\characters\MIAS.png
C:\soma\repos\acttub\ACTI\public\characters\MINB.png
C:\soma\repos\acttub\ACTI\public\characters\MINS.png
C:\soma\repos\acttub\ACTI\public\characters\MPAB.png
C:\soma\repos\acttub\ACTI\public\characters\MPAS.png
C:\soma\repos\acttub\ACTI\public\characters\MPNB.png
C:\soma\repos\acttub\ACTI\public\characters\MPNS.png
C:\soma\repos\acttub\ACTI\public\characters\TIAB.png
C:\soma\repos\acttub\ACTI\public\characters\TIAS.png
C:\soma\repos\acttub\ACTI\public\characters\TINB.png
C:\soma\repos\acttub\ACTI\public\characters\TINS.png
C:\soma\repos\acttub\ACTI\public\characters\TPAB.png
C:\soma\repos\acttub\ACTI\public\characters\TPAS.png
C:\soma\repos\acttub\ACTI\public\characters\TPNB.png
C:\soma\repos\acttub\ACTI\public\characters\TPNS.png

codex
현재 smoke에는 `/coach`가 포함되어 있지만 `/tester`는 없습니다. 캠페인 착수 전에는 `/tester` route 200과 신청 write 검증을 smoke/수동 게이트에 추가해야 합니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Raw web\\src\\app\\coach\\page.tsx; Get-Content -Raw web\\src\\app\\api\\coach\\upload\\route.ts; Get-Content -Raw web\\src\\app\\api\\coach-second\\analyze\\route.ts; Get-Content -Raw web\\src\\server\\blobUpload.ts" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -Raw web\\src\\app\\api\\form\\route.ts; Get-Content -Raw web\\src\\server\\formApply.test.ts; Get-Content -Raw web\\src\\server\\formReview.ts" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'git diff --name-only; git diff --stat' in C:\soma\repos\acttub
 succeeded in 518ms:
import CoachPage from '../../views/CoachPage';

export const metadata = {
  title: 'acttub coach',
  description: '?곌린 ?곸긽??湲곗??쇰줈 ?곗뒿 ?쇰뱶諛깆쓣 諛쏅뒗 acttub coach',
};

// acttub.com/coach 硫붿씤??v2 ?뚯씠?꾨씪?몄쑝濡??꾪솚(2026-06-13) ???붾㈃ ?숈씪, 遺꾩꽍 API留?v2.
// 濡ㅻ갚: analyzeUrl prop ?쒓굅 ??v1(/api/coach/analyze)濡?蹂듦?.
export default function Page() {
  return <CoachPage analyzeUrl="/api/coach-second/analyze" />;
}

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { createCoachUploadTokenOptions } from '@/server/blobUpload';

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: '?곸긽 ?낅줈???섍꼍蹂?섍? ?ㅼ젙?섏뼱 ?덉? ?딆뒿?덈떎.' },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => ({})) as HandleUploadBody;
  const result = await handleUpload({
    request,
    body,
    onBeforeGenerateToken: createCoachUploadTokenOptions,
    onUploadCompleted: async () => {},
  });

  return Response.json(result);
}

import { handleCoachSecondAnalyze } from '@/server/coachSecondAnalyze';
import { jsonResponse } from '@/server/nextApi';

// ?곸긽 ?ㅼ슫濡쒕뱶 + Gemini ?곸긽 6??E1~E3 + E4횞3) + ?띿뒪??6?뚭? 60s瑜??섍만 ???덉뼱 ?곹뼢.
export const maxDuration = 300;

export async function POST(request: Request) {
  return jsonResponse(await handleCoachSecondAnalyze(request));
}

import type { GenerateClientTokenOptions } from '@vercel/blob/client';

export const ARCHIVE_VIDEO_CONTENT_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
  'video/x-msvideo',
] as const;

export function isArchiveVideoContentType(contentType: string) {
  return ARCHIVE_VIDEO_CONTENT_TYPES.includes(contentType as (typeof ARCHIVE_VIDEO_CONTENT_TYPES)[number]);
}

export async function createArchiveUploadTokenOptions(
  pathname: string,
): Promise<
  Pick<
    GenerateClientTokenOptions,
    | 'allowedContentTypes'
    | 'maximumSizeInBytes'
    | 'validUntil'
    | 'addRandomSuffix'
    | 'allowOverwrite'
    | 'cacheControlMaxAge'
    | 'ifMatch'
  > & { tokenPayload?: string }
> {
  return {
    allowedContentTypes: [...ARCHIVE_VIDEO_CONTENT_TYPES],
    addRandomSuffix: true,
    tokenPayload: JSON.stringify({ pathname }),
  };
}

export async function createCoachUploadTokenOptions(pathname: string) {
  return {
    allowedContentTypes: [...ARCHIVE_VIDEO_CONTENT_TYPES],
    addRandomSuffix: true,
    tokenPayload: JSON.stringify({ pathname }),
  };
}


 succeeded in 517ms:
import { handleFormApply } from '@/server/formApply';
import { jsonRequestInput, jsonResponse } from '@/server/nextApi';

export async function POST(request: Request) {
  return jsonResponse(await handleFormApply(await jsonRequestInput(request)));
}

import { describe, expect, it, vi } from 'vitest';
import { handleFormApply, type FormApplyPayload } from './formApply';
import type { ApiRequestInput } from './apiCore';

const FIXED = new Date('2026-06-10T00:00:00.000Z');

function input(body: unknown): ApiRequestInput {
  return { method: 'POST', url: '/api/form', body };
}

const validBody = {
  name: '源吏誘?,
  phone: '010-1234-5678',
  career: '?낆떆??,
  feedbackSource: '?숈썝 ?좎깮??,
  concern: '媛먯젙 ?쒗쁽',
  q1: true,
  channel: '?몄뒪?',
  consent: true,
};

describe('handleFormApply', () => {
  it('?좏슚 ?낅젰??webhook?쇰줈 蹂대궡怨?200 ok 瑜?諛섑솚?쒕떎 (?꾪솕踰덊샇???レ옄留??뺢퇋??', async () => {
    const send = vi
      .fn<(url: string, payload: FormApplyPayload) => Promise<boolean>>()
      .mockResolvedValue(true);

    const result = await handleFormApply(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send,
      now: () => FIXED,
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith('https://example.test/hook', {
      kind: 'tester-apply',
      ts: FIXED.toISOString(),
      name: '源吏誘?,
      phone: '01012345678',
      career: '?낆떆??,
      feedbackSource: '?숈썝 ?좎깮??,
      concern: '媛먯젙 ?쒗쁽',
      q1: 'Y',
      channel: '?몄뒪?',
      consent: 'Y',
    });
  });

  it('?꾩닔媛믪씠 鍮좎?硫?400 ??諛섑솚?섍퀬 ?꾩넚?섏? ?딅뒗??, async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormApply(input({ ...validBody, name: '' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('?꾪솕踰덊샇 ?뺤떇???꾨땲硫?400 ??諛섑솚?쒕떎', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormApply(input({ ...validBody, phone: '02-123-4567' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('媛쒖씤?뺣낫 ?숈쓽(consent)媛 ?놁쑝硫?400 ??諛섑솚?쒕떎', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormApply(input({ ...validBody, consent: false }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('honeypot??梨꾩썙吏硫??꾩넚 ?놁씠 議곗슜??200 ??諛섑솚?쒕떎', async () => {
    const send = vi.fn().mockResolvedValue(true);
    const result = await handleFormApply(input({ ...validBody, website: 'http://spam' }), {
      webhookUrl: 'https://example.test/hook',
      send,
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it('webhook URL ???놁쑝硫?500 ??諛섑솚?쒕떎', async () => {
    const result = await handleFormApply(input(validBody), { webhookUrl: '' });
    expect(result.status).toBe(500);
  });

  it('?쒗듃 ?꾩넚???ㅽ뙣(false)?섎㈃ 502 瑜?諛섑솚?쒕떎', async () => {
    const result = await handleFormApply(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send: async () => false,
    });
    expect(result.status).toBe(502);
  });

  it('?쒗듃 ?꾩넚???덉쇅瑜??섏졇??502 濡??덉쟾?섍쾶 泥섎━?쒕떎', async () => {
    const result = await handleFormApply(input(validBody), {
      webhookUrl: 'https://example.test/hook',
      send: async () => {
        throw new Error('network');
      },
    });
    expect(result.status).toBe(502);
  });

  it('webhook??HTTP 200 ?대씪??body 媛 { ok: false } 硫?502 濡?泥섎━?쒕떎(?곗씠???좎떎 諛⑹?)', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ ok: false, error: 'sheet fail' }) });
    vi.stubGlobal('fetch', fetchMock);
    try {
      const result = await handleFormApply(input(validBody), {
        webhookUrl: 'https://example.test/hook',
      });
      expect(result.status).toBe(502);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('webhook ??HTTP 200 + body { ok: true } 硫?200 ?쇰줈 泥섎━?쒕떎', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetchMock);
    try {
      const result = await handleFormApply(input(validBody), {
        webhookUrl: 'https://example.test/hook',
      });
      expect(result.status).toBe(200);
      expect(result.body).toEqual({ ok: true });
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

import { z } from 'zod';
import type { ApiRequestInput, ApiResult } from './apiCore';
import { phoneSchema } from './formApply';
import { sendToSheetsWebhook } from './sheetsWebhook';

/**
 * formReview ???뚰뙆 ?뚯뒪???ъ슜 ??由щ럭(acttub.com/form/review) ?묒닔.
 *
 * 寃利??좏샇???뺣낯. ??媛吏 ?듭떖 吏?쒕? ?먯닔(1~5 ?먮뒗 Y/N)濡?諛쏄퀬, 媛??먯닔留덈떎
 * "??洹몃젃寃??먭펷?붿?" ??以??댁쑀(理쒖냼 10??瑜??④퍡 諛쏅뒗?????먯닔留뚯쑝濡쒕뒗 紐??쎈뒗
 * '?댁쑀'媛 寃利앹쓽 ?듭떖?대씪 ?뺣웾+?뺤꽦????臾명빆?쇰줈 臾띕뒗??
 *  쨌 rating(?꾩껜 留뚯”?? + ratingWhy
 *  쨌 actionable(?곌린 ?깆옣 ?꾩?) + actionableWhy
 *  쨌 reuse(?ㅼ떆 ???섑뼢) + reuseWhy
 * 留덉?留됱쑝濡??쒕퉬???꾨컲 ?섍껄(serviceOpinion)? ?좏깮(鍮덉뭏 ?덉슜)?쇰줈 諛쏅뒗??
 * ?뺥솗?굿룰퀬誘??곸쨷쨌?ㅒ룰린議??鍮???源딆? 臾명빆? ?명꽣酉곕줈 ?닿?.
 * ?꾪솕踰덊샇媛 ?좎껌(tester-apply)怨쇱쓽 留ㅼ묶 ?ㅼ씠??荑좏룿(湲고봽?곗퐯) 諛쒖넚 ??
 * payload kind='tester-review'濡?Apps Script媛 由щ럭 ??뿉 遺꾧린 ?곸옱?쒕떎(而щ읆? v2 ?ㅽ궎留?.
 * formApply? 媛숈? SHEETS_WEBHOOK_URL ?ъ궗??
 */

const score = z.number().int().min(1).max(5);

/** ?됯? ?ъ쑀 ??荑좏룿 ?대럭吏?1李??꾪꽣: 理쒖냼 10??臾댁꽦???⑤떟 李⑤떒). 理쒖쥌 '愿쒖갖? 由щ럭' ?먮떒? ?섎룞 寃?? */
const reason = z.string().trim().min(10).max(1000);

const reviewSchema = z.object({
  name: z.string().trim().min(1).max(40),
  phone: phoneSchema,
  /** ?꾩껜 留뚯”??1~5 */
  rating: score,
  /** 留뚯”?꾨? 洹몃젃寃?以 ?댁쑀 */
  ratingWhy: reason,
  /** "?곌린 ?깆옣???꾩?????寃?媛숇떎" ?숈쓽 ?뺣룄 1~5 */
  actionable: score,
  /** ?깆옣 ?꾩???洹몃젃寃??먮? ?댁쑀 */
  actionableWhy: reason,
  /** ?ㅼ쓬 ?곗뒿?먮룄 ?ㅼ떆 ???섑뼢 */
  reuse: z.boolean(),
  /** ?ㅼ떆 ???????댁쑀 */
  reuseWhy: reason,
  /** 留덉?留??먯쑀 ?섍껄 ???좏깮(鍮덉뭏 ?덉슜). */
  serviceOpinion: z.string().trim().max(1000).optional(),
  /** 肄붿튂 ?몄뀡 id ??/coach 媛 由щ럭 CTA ???s= 濡??ㅼ뼱 蹂대깂. ?몄뀡?붾━酉?留ㅼ묶 ???좏깮). */
  sessionId: z.string().trim().max(120).optional(),
  // 媛쒖씤?뺣낫 ?섏쭛쨌?댁슜 ?숈쓽 ??誘몃룞???쒖텧? 400.
  consent: z.literal(true),
  // honeypot ???щ엺? 鍮꾩썙?? 遊뉗씠 梨꾩슦硫?議곗슜??臾댁떆(200)?쒕떎.
  website: z.string().max(200).optional(),
});

export type FormReviewPayload = {
  kind: 'tester-review';
  ts: string;
  name: string;
  phone: string;
  rating: number;
  ratingWhy: string;
  actionable: number;
  actionableWhy: string;
  /** 'Y' | 'N' */
  reuse: string;
  reuseWhy: string;
  serviceOpinion: string;
  /** 肄붿튂 ?몄뀡 id(?놁쑝硫?鍮덉뭏) ???쒗듃?먯꽌 ?몄뀡 ?됯낵 ?뉖뒗?? */
  sessionId: string;
  /** 'Y' */
  consent: string;
};

export type FormReviewOptions = {
  webhookUrl?: string;
  /** ?쒗듃 ?꾩넚湲??뚯뒪??二쇱엯??. true=?깃났. */
  send?: (url: string, payload: FormReviewPayload) => Promise<boolean>;
  /** ?쒖텧 ?쒓컖 二쇱엯(?뚯뒪??寃곗젙??. 湲곕낯 now. */
  now?: () => Date;
};

const FAILURE = '由щ럭瑜??묒닔?섏? 紐삵뻽?댁슂. ?좎떆 ???ㅼ떆 ?쒕룄??二쇱꽭??';
const INVALID = '?낅젰媛믪쓣 ?뺤씤??二쇱꽭??';

export async function handleFormReview(
  input: ApiRequestInput,
  options: FormReviewOptions = {}
): Promise<ApiResult> {
  const parsed = reviewSchema.safeParse(input.body);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: INVALID } };
  }
  const data = parsed.data;

  // 遊? honeypot??梨꾩썙議뚯쑝硫??깃났??泥?議곗슜??踰꾨┛???쒗듃?????볦쓬).
  if (data.website && data.website.length > 0) {
    return { status: 200, body: { ok: true } };
  }

  const webhookUrl = options.webhookUrl ?? process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return { status: 500, body: { ok: false, error: FAILURE } };
  }

  const now = options.now ?? (() => new Date());
  const payload: FormReviewPayload = {
    kind: 'tester-review',
    ts: now().toISOString(),
    name: data.name,
    phone: data.phone,
    rating: data.rating,
    ratingWhy: data.ratingWhy,
    actionable: data.actionable,
    actionableWhy: data.actionableWhy,
    reuse: data.reuse ? 'Y' : 'N',
    reuseWhy: data.reuseWhy,
    serviceOpinion: data.serviceOpinion ?? '',
    sessionId: data.sessionId ?? '',
    consent: 'Y',
  };

  const send = options.send ?? sendToSheetsWebhook;
  let ok: boolean;
  try {
    ok = await send(webhookUrl, payload);
  } catch {
    ok = false;
  }
  if (!ok) {
    return { status: 502, body: { ok: false, error: FAILURE } };
  }
  return { status: 200, body: { ok: true } };
}


 succeeded in 782ms:
.gitignore
web/src/server/coachSecondAnalyze.ts
web/src/server/lineshotPrompt.test.ts
web/src/server/lineshotPrompt.ts
web/src/server/lineshotScore.test.ts
web/src/server/lineshotScore.ts
web/src/views/LineshotPage.tsx
 .gitignore                            |  1 +
 web/src/server/coachSecondAnalyze.ts  | 59 ++++++++++++++++++++++++++++-------
 web/src/server/lineshotPrompt.test.ts | 18 ++++++++++-
 web/src/server/lineshotPrompt.ts      | 21 +++++++++++++
 web/src/server/lineshotScore.test.ts  | 38 +++++++++++++++++++++-
 web/src/server/lineshotScore.ts       | 19 +++++++++--
 web/src/views/LineshotPage.tsx        | 36 +++++++++++++++++++--
 7 files changed, 173 insertions(+), 19 deletions(-)

codex
결론: **현 체크리스트 그대로는 반박.** 아래 critical 보강하면 **CONVERGE 가능**.

1. **coach capacity 무접촉**
   부족함. 하드게이트에 `coach diff-free` 필요합니다. 캠페인 착수 브랜치에서 `web/src/app/coach*`, `web/src/app/api/coach*`, `web/src/server/coach*`, `web/src/coach*`, `web/src/coach2*` 변경 0이어야 함.  
   지금 로컬도 `web/src/server/coachSecondAnalyze.ts`가 dirty라 이 상태 착수는 무접촉 보장 안 됩니다.

2. **UTM allowlist**
   가능. `normalizePath` 안 건드리고 `trackPageView()`에서 `window.location.search` 읽어 `utm_source/medium/campaign/content/term/ref`만 event param으로 붙이면 됩니다.  
   규모: `analytics.ts` + test 2~3개, 대략 40~70 LOC. 리스크 낮음. 단, GA4 admin에서 custom dimension 등록 + DebugView/Realtime 실발화 확인은 별도 게이트.

3. **보조증거**
   맞음. `FALLBACK_FEEDBACK`은 에러/파싱 실패 카피라 증거 카드로 쓰면 안 됩니다. 기존 인스타 장면해부 이미지 1장 정적 재사용이 coach 무접촉에 맞음. 단, repo 내 `web/public`에는 해당 자산이 안 보여서 자산 위치 확정 필요.

4. **남은 critical blocker**
   - `/tester` 라우트가 현재 코드에는 없고 `/form`만 있음. `/tester prod 200` 및 write 검증 전 착수 불가.
   - `dedupe=unique email`인데 현재 신청 payload는 `phone` 기준이고 email 필드가 없음. email 수집/저장/중복 기준을 실제 코드나 시트에서 확정해야 함.
   - dirty worktree, 특히 coach 파일 변경 해소 필요.

최종 판정: **조건부 승인. 위 3개 critical 해소 전에는 승인 불가.**
tokens used
109,642

```

## Concise summary

Provider completed successfully. Review the raw output for details.

## Action items

- Review the response and extract decisions you want to apply.
- Capture follow-up implementation tasks if needed.
