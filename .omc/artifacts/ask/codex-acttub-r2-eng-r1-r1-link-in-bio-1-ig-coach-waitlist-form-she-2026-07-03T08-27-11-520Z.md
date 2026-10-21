# codex advisor artifact

- Provider: codex
- Exit code: 0
- Created at: 2026-07-03T08:27:11.530Z

## Original task

acttub 기획 토론 R2. 너는 엔지니어링(eng) 관점 리뷰어. 직전(R1) 합의를 코드 관점에서 확정하라. 한글, 간결.

[R1 합의] 인스타 link-in-bio 유입 랜딩 = "전면 설계"가 아니라 얇은 신규 라우트 1개(/ig 등) + 기존 /coach 링크 + waitlist는 form Sheets-webhook(kind) 재사용, 새 API 0. GA4 analytics.ts trackCoachStep 재사용. 확인된 코드사실: analytics.ts send_page_view:false + normalizePath가 pathname만→UTM 소실. web/src/app에 waitlist 라우트 부재. CoachPage에 샘플/데모 경로 0. acttub-landing=deploymentEnabled:false.

[R2 확정할 것]
1) 착수 전 게이트: ① IG 인앱웹뷰×/coach 카메라/업로드 실기기 검증 절차 ② UTM 소실 최소 수정(normalizePath 손대기 vs gtag page_location에 full URL) 어느 쪽이 저위험 ③ waitlist: form에 kind 추가하는 최소 구현 규모.
2) "정적 샘플 리포트 프리뷰"(코치 제품면 무접촉, 실제 코치카드 1건을 정적으로 히어로에 박기)가 net-new dev를 얼마나 유발? "dev 0시간"과 양립하나.
3) prebuilt 배포(main push만)에서 랜딩 카피/CTA 빠른 반복이 가능한가—대안.

각 항목 판정 + 잔여 위험 critical/major/minor.

## Final prompt

acttub 기획 토론 R2. 너는 엔지니어링(eng) 관점 리뷰어. 직전(R1) 합의를 코드 관점에서 확정하라. 한글, 간결.

[R1 합의] 인스타 link-in-bio 유입 랜딩 = "전면 설계"가 아니라 얇은 신규 라우트 1개(/ig 등) + 기존 /coach 링크 + waitlist는 form Sheets-webhook(kind) 재사용, 새 API 0. GA4 analytics.ts trackCoachStep 재사용. 확인된 코드사실: analytics.ts send_page_view:false + normalizePath가 pathname만→UTM 소실. web/src/app에 waitlist 라우트 부재. CoachPage에 샘플/데모 경로 0. acttub-landing=deploymentEnabled:false.

[R2 확정할 것]
1) 착수 전 게이트: ① IG 인앱웹뷰×/coach 카메라/업로드 실기기 검증 절차 ② UTM 소실 최소 수정(normalizePath 손대기 vs gtag page_location에 full URL) 어느 쪽이 저위험 ③ waitlist: form에 kind 추가하는 최소 구현 규모.
2) "정적 샘플 리포트 프리뷰"(코치 제품면 무접촉, 실제 코치카드 1건을 정적으로 히어로에 박기)가 net-new dev를 얼마나 유발? "dev 0시간"과 양립하나.
3) prebuilt 배포(main push만)에서 랜딩 카피/CTA 빠른 반복이 가능한가—대안.

각 항목 판정 + 잔여 위험 critical/major/minor.

## Raw output

```text
확정: R1 방향은 코드 관점에서 타당. 단, “dev 0시간”과 “운영 카피 빠른 반복”은 그대로는 불가.

1. 착수 전 게이트: `GO with gates`
- IG 인앱웹뷰 검증은 critical. `/coach`가 `getUserMedia`, `MediaRecorder`, `video/*` file input, Vercel Blob upload를 직접 쓰므로 iOS/Android Instagram 인앱에서 실기기 확인 후 시작.
- UTM 최소 수정은 `normalizePath`를 건드리지 말고 `page_location`만 현재 URL 기반으로 보강하는 쪽이 저위험. 단 raw full URL은 PII 위험이 있어 `utm_*` allowlist가 맞음. 현재 Provider는 `usePathname()`만 넘겨 UTM이 이미 소실됨.
- waitlist는 `/api/form` 유지 + `kind` union 추가 + `/form?kind=ig-waitlist` 또는 `/ig` hidden kind 전달이면 최소. 새 API 0 가능. 별도 짧은 waitlist 폼을 만들면 현재 `/api/form` 필수 7문항 스키마와 안 맞아 범위 증가.

2. 정적 샘플 리포트 프리뷰: `dev 0시간과 양립 불가`
- Coach 제품면은 안 건드리고 기존 `coachFeedbackCards` 재사용 가능.
- 그래도 `/ig` route, landing view/CSS, static `CoachFeedback` fixture, CTA, smoke/test는 net-new.
- “0시간”은 샘플 프리뷰를 빼거나 외부 이미지/캡처를 수동으로 쓰는 경우에만 성립.

3. prebuilt 배포와 빠른 반복: `운영 기준 불가`
- PR preview는 가능하지만 production은 `main` push + Actions `vercel deploy --prebuilt --prod`만 가능.
- Vercel Git auto deploy도 `deploymentEnabled:false`.
- 대안: 첫 배포에 `?v=a|b|c` 같은 사전 정의 카피/CTA variant를 심고 Instagram 링크만 바꾸기. 완전 자유 카피 반복은 CMS/Edge Config/외부 link-in-bio 같은 운영 도구가 필요하고, 이는 새 의존성이다.

잔여 위험:
- critical: IG 인앱에서 카메라 권한/녹화/파일 업로드가 막히면 랜딩 전환 자체가 무력화.
- major: raw full URL GA 전송 시 개인정보 query 유출 가능, 샘플 프리뷰를 “dev 0”으로 잡으면 일정 왜곡.
- minor: Sheets Apps Script가 새 `kind`를 실제로 분기 저장하는지 별도 확인 필요.

검증: 코드 조회로 확인. 코드 변경 없음, 테스트 실행 없음.


OpenAI Codex v0.142.5
--------
workdir: C:\soma\repos\acttub
model: gpt-5.5
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: xhigh
reasoning summaries: none
session id: 019f2712-4514-7220-9472-7a5b932fb91b
--------
user
acttub 기획 토론 R2. 너는 엔지니어링(eng) 관점 리뷰어. 직전(R1) 합의를 코드 관점에서 확정하라. 한글, 간결.

[R1 합의] 인스타 link-in-bio 유입 랜딩 = "전면 설계"가 아니라 얇은 신규 라우트 1개(/ig 등) + 기존 /coach 링크 + waitlist는 form Sheets-webhook(kind) 재사용, 새 API 0. GA4 analytics.ts trackCoachStep 재사용. 확인된 코드사실: analytics.ts send_page_view:false + normalizePath가 pathname만→UTM 소실. web/src/app에 waitlist 라우트 부재. CoachPage에 샘플/데모 경로 0. acttub-landing=deploymentEnabled:false.

[R2 확정할 것]
1) 착수 전 게이트: ① IG 인앱웹뷰×/coach 카메라/업로드 실기기 검증 절차 ② UTM 소실 최소 수정(normalizePath 손대기 vs gtag page_location에 full URL) 어느 쪽이 저위험 ③ waitlist: form에 kind 추가하는 최소 구현 규모.
2) "정적 샘플 리포트 프리뷰"(코치 제품면 무접촉, 실제 코치카드 1건을 정적으로 히어로에 박기)가 net-new dev를 얼마나 유발? "dev 0시간"과 양립하나.
3) prebuilt 배포(main push만)에서 랜딩 카피/CTA 빠른 반복이 가능한가—대안.

각 항목 판정 + 잔여 위험 critical/major/minor.
codex
karpathy-guidelines 스킬을 사용해 코드 근거 중심으로 R1 합의를 점검하겠습니다. 먼저 repo 지침과 관련 파일 위치를 확인하겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'CLAUDE.md'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'C:\\Users\\sukpo\\.codex\\skills\\karpathy-guidelines\\SKILL.md'" in C:\soma\repos\acttub
 succeeded in 930ms:
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

 succeeded in 930ms:
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

codex
이제 R1에서 언급된 코드 사실이 실제로 어느 파일에 걸려 있는지 확인합니다. 특히 analytics, form/webhook, coach 페이지, 배포 설정만 좁게 보겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "normalizePath|send_page_view|page_view|gtag|trackCoachStep|page_location" web/src -S' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "deploymentEnabled|vercel" -S .' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "waitlist|webhook|sheets|sheet|kind|FORM|form" web/src -S' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "CoachPage|coach|sample|demo|preview|example" web/src/app web/src/views web/src/components -S' in C:\soma\repos\acttub
 succeeded in 1814ms:
web/src/views\coachFeedbackCards.tsx:7:} from '../coach/evaluation';
web/src/views\coachFeedbackCards.tsx:12:// /coach 와 /test(빠른 테스트)가 같은 결과 카드를 공유한다.
web/src/app\api\test\analyze\route.ts:4:// /test 전용 분석 파이프라인(testcoach) — /coach(coach-second)와 분리된 독립 엔진.
web/src/app\unifiedRoutes.test.ts:18:  'coach/page.tsx',
web/src/app\unifiedRoutes.test.ts:42:  'api/coach/analyze/route.ts',
web/src/app\unifiedRoutes.test.ts:43:  'api/coach/cleanup/route.ts',
web/src/app\unifiedRoutes.test.ts:44:  'api/coach/upload/route.ts',
web/src/app\unifiedRoutes.test.ts:82:  'local:coach',
web/src/app\unifiedRoutes.test.ts:101:  'coach/vercel.json',
web/src/app\unifiedRoutes.test.ts:150:  const source = readFileSync(path.join(root, '.env.example'), 'utf8');
web/src/app\unifiedRoutes.test.ts:226:    expect(workspace).not.toContain('- "coach"');
web/src/app\unifiedRoutes.test.ts:256:    expect(pkg.scripts['verify:preview']).toBe(
web/src/app\unifiedRoutes.test.ts:259:    expect(pkg.scripts['pr:preview']).toBe('node scripts/create-preview-pr.mjs');
web/src/app\unifiedRoutes.test.ts:275:    expect(rootScriptBody).not.toMatch(/--filter\s+(ACTI|thea|comm|arch|excer|coach|acttub-landing)\b/);
web/src/app\unifiedRoutes.test.ts:276:    expect(rootScriptBody).not.toMatch(/--dir\s+(ACTI|thea|comm|arch|excer|coach|acttub-landing)\b/);
web/src/app\unifiedRoutes.test.ts:288:    const previewPrScript = readFileSync(path.join(repoRoot, 'scripts/create-preview-pr.mjs'), 'utf8');
web/src/app\unifiedRoutes.test.ts:294:    expect(readme).toContain('corepack pnpm verify:preview');
web/src/app\unifiedRoutes.test.ts:295:    expect(readme).toContain('Full preview branch check');
web/src/app\unifiedRoutes.test.ts:296:    expect(agents).toContain('corepack pnpm verify:preview');
web/src/app\unifiedRoutes.test.ts:301:    expect(previewPrScript).toContain('gh auth login -h github.com');
web/src/app\unifiedRoutes.test.ts:302:    expect(previewPrScript).toContain('gh');
web/src/app\unifiedRoutes.test.ts:303:    expect(previewPrScript).toContain('experiment/nextjs-preview');
web/src/app\unifiedRoutes.test.ts:304:    expect(previewPrScript).toContain('docs/nextjs-preview-pr-body.md');
web/src/app\unifiedRoutes.test.ts:346:      path: '/api/coach/cleanup',
web/src/app\unifiedRoutes.test.ts:354:    const readiness = readFileSync(path.join(repoRoot, 'docs/nextjs-preview-readiness.md'), 'utf8');
web/src/app\unifiedRoutes.test.ts:355:    const prDraft = readFileSync(path.join(repoRoot, 'docs/nextjs-preview-pr.md'), 'utf8');
web/src/app\unifiedRoutes.test.ts:356:    const prBody = readFileSync(path.join(repoRoot, 'docs/nextjs-preview-pr-body.md'), 'utf8');
web/src/app\unifiedRoutes.test.ts:359:    expect(rootReadme).toContain('docs/nextjs-preview-readiness.md');
web/src/app\unifiedRoutes.test.ts:364:    expect(webReadme).toContain('corepack pnpm verify:preview');
web/src/app\unifiedRoutes.test.ts:365:    expect(readiness).toContain('Branch: `experiment/nextjs-preview`');
web/src/app\unifiedRoutes.test.ts:366:    expect(readiness).toContain('corepack pnpm verify:preview');
web/src/app\unifiedRoutes.test.ts:369:    expect(readiness).toContain('docs/nextjs-preview-pr.md');
web/src/app\unifiedRoutes.test.ts:370:    expect(readiness).toContain('docs/nextjs-preview-pr-body.md');
web/src/app\unifiedRoutes.test.ts:371:    expect(prDraft).toContain('gh pr create --base main --head experiment/nextjs-preview');
web/src/app\unifiedRoutes.test.ts:372:    expect(prDraft).toContain('--body-file docs/nextjs-preview-pr-body.md');
web/src/app\unifiedRoutes.test.ts:373:    expect(prDraft).toContain('corepack pnpm pr:preview');
web/src/app\unifiedRoutes.test.ts:374:    expect(prDraft).toContain('https://github.com/acttub/acttub/compare/main...experiment/nextjs-preview?quick_pull=1');
web/src/app\unifiedRoutes.test.ts:376:    expect(prBody).toContain('corepack pnpm verify:preview');
web/src/app\unifiedRoutes.test.ts:378:    expect(webReadme).toContain('/api/coach/cleanup');
web/src/app\unifiedRoutes.test.ts:391:    expect(webIgnore).toMatch(/(^|\n)!\.env\.example(\n|$)/);
web/src/app\unifiedRoutes.test.ts:394:  it('keeps public coach docs from naming the analysis provider or model', () => {
web/src/app\unifiedRoutes.test.ts:398:      path.join(root, '.env.example'),
web/src/app\unifiedRoutes.test.ts:403:      expect(source).not.toMatch(/Gemini (acting|coach|analysis)|GEMINI_MODEL|gemini-3\.5/i);
web/src/app\unifiedRoutes.test.ts:446:    expect(smokePaths).toContain('/api/coach/analyze');
web/src/app\unifiedRoutes.test.ts:457:  it('requires coach smoke checks to reject provider and model leaks', () => {
web/src/components\TypeCard.tsx:14:  relation?: 'rival' | 'bff' | 'preview';
web/src/components\TypeCard.tsx:26:  preview: '미리보기',
web/src/components\TypeCard.tsx:30:  relation = 'preview',
web/src/app\api\coach-second\analyze\route.ts:1:import { handleCoachSecondAnalyze } from '@/server/coachSecondAnalyze';
web/src/app\test\page.tsx:8:// acttub.com/test — coach 진입 장벽(대본·의도 준비)을 없앤 체험판.
web/src/app\test\page.tsx:9:// 정해진 대사·의도를 시스템이 주입하고 분석은 /coach 메인과 동일한 v2 파이프라인을 재사용한다.
web/src/app\api\coach\cleanup\route.ts:1:import { handleCoachBlobCleanup } from '@/server/coachBlobCleanup';
web/src/components\ResultEmailForm.tsx:86:          placeholder="name@example.com"
web/src/views\FormReviewPage.tsx:95:    // /coach 에서 ?s=<코치 세션 id> 로 넘어옴. 마운트 시점(lazy init)엔 soft navigation 직후라
web/src/views\CoachPage.css:3:.coach-page {
web/src/views\CoachPage.css:63:.coach-page,
web/src/views\CoachPage.css:64:.coach-page *,
web/src/views\CoachPage.css:65:.coach-page::before,
web/src/views\CoachPage.css:66:.coach-page::after {
web/src/views\CoachPage.css:71:.coach-page * {
web/src/views\CoachPage.css:75:.coach-page a {
web/src/views\CoachPage.css:80:.coach-page ul {
web/src/views\CoachPage.css:85:.coach-page button,
web/src/views\CoachPage.css:86:.coach-page input,
web/src/views\CoachPage.css:87:.coach-page select,
web/src/views\CoachPage.css:88:.coach-page textarea {
web/src/views\CoachPage.css:94:.coach-page svg,
web/src/views\CoachPage.css:95:.coach-page video {
web/src/views\CoachPage.css:126:.animate-spin{animation:coach-spin 1s linear infinite}
web/src/views\CoachPage.css:245:@keyframes coach-spin {
web/src/views\QuickTestPage.tsx:17:import { formatTime, type CoachFeedback } from '../coach/evaluation';
web/src/views\QuickTestPage.tsx:18:import { FocusBlock, NextStepBlock, OverallBlock, StrengthBlock } from './coachFeedbackCards';
web/src/views\QuickTestPage.tsx:23:// 분석 엔진은 /coach 메인과 동일(아래 ANALYZE_URL = v2). 대사·의도만 시스템이 미리 박아 호출한다.
web/src/views\QuickTestPage.tsx:47:// /test 전용 분석 파이프라인(testcoach) — /coach와 분리해 복사한 독립 엔진.
web/src/views\QuickTestPage.tsx:48:// 대사·상황 주입, 대사 안 함 판정 등 /test 고유 동작을 /coach 영향 없이 넣기 위함.
web/src/views\QuickTestPage.tsx:233:      const blob = await uploadBlob(`coach/${Date.now()}-${videoFile.name}`, videoFile, {
web/src/views\QuickTestPage.tsx:235:        handleUploadUrl: '/api/coach/upload',
web/src/views\QuickTestPage.tsx:286:      className="coach-page mx-auto flex min-h-screen w-full flex-col gap-5 px-4 py-5 sm:px-6"
web/src/views\QuickTestPage.tsx:289:      {/* 폭 제한은 인라인 — coach-page frozen 유틸 set에 max-w-xl/md가 없어 클래스로는 안 먹는다. */}
web/src/views\LineshotPage.tsx:286:            <Link href="/coach" className="lineshot__bridge">
web/src/views\PlayPage.tsx:222:            <PrimaryButton as="a" href="/coach">
web/src/app\api\coach\analyze\route.ts:1:import { handleCoachAnalyze } from '@/server/coachAnalyze';
web/src/views\RootLandingPage.css:15:  --root-coach: #6e4cb8;
web/src/views\RootLandingPage.css:16:  --root-coach-soft: #f0e8ff;
web/src/views\RootLandingPage.css:135:.root-landing__coach-top-link {
web/src/views\RootLandingPage.css:143:  color: var(--root-coach);
web/src/views\RootLandingPage.css:144:  background: var(--root-coach-soft);
web/src/views\RootLandingPage.css:154:.root-landing__coach-top-link:hover {
web/src/views\RootLandingPage.css:159:.root-landing__coach-top-link svg {
web/src/views\RootLandingPage.css:184:.root-landing__coach-hero-link {
web/src/views\RootLandingPage.css:197:    var(--root-coach);
web/src/views\RootLandingPage.css:203:.root-landing__coach-hero-link:hover {
web/src/views\RootLandingPage.css:208:.root-landing__coach-hero-copy {
web/src/views\RootLandingPage.css:217:.root-landing__coach-hero-kicker {
web/src/views\RootLandingPage.css:227:.root-landing__coach-hero-title {
web/src/views\RootLandingPage.css:234:.root-landing__coach-hero-desc {
web/src/views\RootLandingPage.css:242:.root-landing__coach-hero-icon {
web/src/views\RootLandingPage.css:257:.root-landing__coach-hero-icon svg {
web/src/views\RootLandingPage.css:610:  .root-landing__coach-hero-link {
web/src/views\RootLandingPage.css:615:  .root-landing__coach-hero-icon {
web/src/views\RootLandingPage.css:620:  .root-landing__coach-hero-icon svg {
web/src/views\RootLandingPage.css:635:  .root-landing__coach-top-link {
web/src/views\RootLandingPage.css:640:  .root-landing__coach-top-link span {
web/src/views\RootLandingPage.test.tsx:6:  it('links the coach entry points to the coach route', () => {
web/src/views\RootLandingPage.test.tsx:9:    const coachLinks = screen.getAllByRole('link', { name: 'coach - 연기 연습 피드백' });
web/src/views\RootLandingPage.test.tsx:10:    expect(coachLinks).toHaveLength(2);
web/src/views\RootLandingPage.test.tsx:11:    for (const link of coachLinks) {
web/src/views\RootLandingPage.test.tsx:12:      expect(link).toHaveAttribute('href', '/coach');
web/src/views\RootLandingPage.tsx:137:          <Link className="root-landing__coach-top-link" href="/coach" aria-label="coach - 연기 연습 피드백">
web/src/views\RootLandingPage.tsx:139:            <span>coach</span>
web/src/views\RootLandingPage.tsx:149:          <section className="root-landing__coach-feature" aria-label="coach 바로가기">
web/src/views\RootLandingPage.tsx:150:            <Link className="root-landing__coach-hero-link" href="/coach" aria-label="coach - 연기 연습 피드백">
web/src/views\RootLandingPage.tsx:151:              <span className="root-landing__coach-hero-copy">
web/src/views\RootLandingPage.tsx:152:                <span className="root-landing__coach-hero-kicker">AI COACH</span>
web/src/views\RootLandingPage.tsx:153:                <span className="root-landing__coach-hero-title">연기 연습 피드백</span>
web/src/views\RootLandingPage.tsx:154:                <span className="root-landing__coach-hero-desc">
web/src/views\RootLandingPage.tsx:158:              <span className="root-landing__coach-hero-icon" aria-hidden="true">
web/src/views\CoachPage.tsx:20:} from '../coach/evaluation';
web/src/views\CoachPage.tsx:21:import { FocusBlock, NextStepBlock, OverallBlock, StrengthBlock } from './coachFeedbackCards';
web/src/views\CoachPage.tsx:36:type CoachPageProps = {
web/src/views\CoachPage.tsx:37:  // /coach-second(v2 파이프라인)가 같은 화면을 다른 분석 API로 재사용한다. 기본값 = 기존 /coach 그대로.
web/src/views\CoachPage.tsx:42:export default function CoachPage({ analyzeUrl = '/api/coach/analyze', badge = 'coach' }: CoachPageProps = {}) {
web/src/views\CoachPage.tsx:153:        const file = new File([blob], `coach-recording-${Date.now()}.webm`, { type: uploadType });
web/src/views\CoachPage.tsx:208:      const blob = await uploadBlob(`coach/${Date.now()}-${videoFile.name}`, videoFile, {
web/src/views\CoachPage.tsx:210:        handleUploadUrl: '/api/coach/upload',
web/src/views\CoachPage.tsx:249:    <div className="coach-page mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:px-8 lg:py-8">
web/src/app\globals.css:17:@import '../views/CoachPage.css';
web/src/app\coach\page.tsx:1:import CoachPage from '../../views/CoachPage';
web/src/app\coach\page.tsx:4:  title: 'acttub coach',
web/src/app\coach\page.tsx:5:  description: '연기 영상을 기준으로 연습 피드백을 받는 acttub coach',
web/src/app\coach\page.tsx:8:// acttub.com/coach 메인을 v2 파이프라인으로 전환(2026-06-13) — 화면 동일, 분석 API만 v2.
web/src/app\coach\page.tsx:9:// 롤백: analyzeUrl prop 제거 시 v1(/api/coach/analyze)로 복귀.
web/src/app\coach\page.tsx:11:  return <CoachPage analyzeUrl="/api/coach-second/analyze" />;
web/src/app\coach-second\page.tsx:1:import CoachPage from '../../views/CoachPage';
web/src/app\coach-second\page.tsx:4:  title: 'acttub coach 2',
web/src/app\coach-second\page.tsx:5:  description: '요소 분해 v2 파이프라인으로 연습 피드백을 받는 acttub coach 2',
web/src/app\coach-second\page.tsx:8:// v2 전량 정량화 파이프라인(coach-second). 화면은 /coach와 동일, 분석 API만 다르다.
web/src/app\coach-second\page.tsx:10:  return <CoachPage analyzeUrl="/api/coach-second/analyze" badge="coach 2" />;

 succeeded in 1832ms:
web/src\views\CoachPage.tsx:22:import { trackCoachStep } from '../lib/analytics';
web/src\views\CoachPage.tsx:109:    trackCoachStep('video_selected');
web/src\views\CoachPage.tsx:201:    trackCoachStep('analyze_clicked');
web/src\views\CoachPage.tsx:214:      trackCoachStep('upload_done');
web/src\views\CoachPage.tsx:239:      trackCoachStep('result_shown');
web/src\views\CoachPage.tsx:241:      trackCoachStep('error');
web/src\views\CoachPage.tsx:421:              if (!intent.trim() && event.target.value.trim()) trackCoachStep('intent_entered');
web/src\lib\analytics.test.ts:21:    delete window.gtag;
web/src\lib\analytics.test.ts:32:    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')).toHaveLength(0);
web/src\lib\analytics.test.ts:33:    expect(window.gtag).toBeUndefined();
web/src\lib\analytics.test.ts:36:  it('loads the Google tag once and disables automatic page_view', async () => {
web/src\lib\analytics.test.ts:43:    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]')).toHaveLength(1);
web/src\lib\analytics.test.ts:45:    expectDataLayerToContain(['config', 'G-TEST123', { send_page_view: false }]);
web/src\lib\analytics.test.ts:48:  it('queues native gtag arguments objects for the Google tag runtime', async () => {
web/src\lib\analytics.test.ts:67:      'page_view',
web/src\lib\analytics.test.ts:70:        page_location: 'http://localhost:4000/ACTI/result/MINB',
web/src\lib\analytics.test.ts:84:      'page_view',
web/src\lib\analytics.test.ts:87:        page_location: 'http://localhost:4000/ACTI/result/MINB',
web/src\lib\analytics.test.ts:116:    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]')).toHaveLength(1);
web/src\lib\analytics.test.ts:119:      'page_view',
web/src\lib\analytics.test.ts:126:    const { initAnalytics, trackCoachStep } = await loadAnalytics();
web/src\lib\analytics.test.ts:129:    trackCoachStep('video_selected');
web/src\lib\analytics.test.ts:130:    trackCoachStep('video_selected');
web/src\lib\analytics.test.ts:131:    trackCoachStep('analyze_clicked');
web/src\lib\analytics.test.ts:141:    const { initAnalytics, trackCoachStep } = await loadAnalytics();
web/src\lib\analytics.test.ts:144:    trackCoachStep('error');
web/src\lib\analytics.test.ts:145:    trackCoachStep('error');
web/src\lib\analytics.test.ts:153:    const { trackCoachStep } = await loadAnalytics();
web/src\lib\analytics.test.ts:155:    trackCoachStep('result_shown');
web/src\lib\analytics.test.ts:157:    expect(window.gtag).toBeUndefined();
web/src\lib\analytics.test.ts:167:    expect(window.gtag).toBeDefined();
web/src\lib\analytics.test.ts:184:      'page_view',
web/src\lib\analytics.test.ts:187:        page_location: 'http://localhost:4000/ACTI/quiz',
web/src\lib\analytics.test.ts:199:    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');
web/src\lib\analytics.test.ts:211:    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');
web/src\lib\analytics.test.ts:225:    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');
web/src\lib\analytics.ts:31:    gtag?: (...args: GtagCommand) => void;
web/src\lib\analytics.ts:47:    `script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`
web/src\lib\analytics.ts:52:    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
web/src\lib\analytics.ts:56:  if (window.gtag) return;
web/src\lib\analytics.ts:59:  // gtag.js queue consumer expects the native arguments object, not an array — see google's snippet.
web/src\lib\analytics.ts:61:  window.gtag = function gtag() { window.dataLayer?.push(arguments); };
web/src\lib\analytics.ts:62:  window.gtag('js', new Date());
web/src\lib\analytics.ts:63:  window.gtag('config', measurementId, { send_page_view: false });
web/src\lib\analytics.ts:66:/** ID는 설정됐는데 gtag가 아직 없으면 self-init 시도. */
web/src\lib\analytics.ts:69:  if (!window.gtag) initAnalytics();
web/src\lib\analytics.ts:70:  return Boolean(window.gtag);
web/src\lib\analytics.ts:80:function normalizePath(path: string): string | null {
web/src\lib\analytics.ts:98:  const pagePath = normalizePath(path);
web/src\lib\analytics.ts:103:  window.gtag?.('event', 'page_view', {
web/src\lib\analytics.ts:105:    page_location: `${window.location.origin}${pagePath}`,
web/src\lib\analytics.ts:113:  window.gtag?.('event', 'result_action_request', {
web/src\lib\analytics.ts:123:export function trackCoachStep(step: CoachStep): void {
web/src\lib\analytics.ts:128:  window.gtag?.('event', `coach_${step}`);

 succeeded in 1836ms:
web/src\coach\evaluation.ts:121:export function formatTime(seconds: number) {
web/src\coach\evaluation.test.ts:47:  it('parses a well-formed single-focus card', () => {
web/src\coach\evaluation.test.ts:167:  it('falls back to a structured placeholder on malformed JSON', () => {
web/src\archive\archiveData.ts:26:export function formatArchiveDuration(seconds: number) {
web/src\archive\archiveData.ts:34:export function formatArchiveRelative(date: Date | string | number) {
web/src\archive\archiveData.ts:44:export function formatArchiveBytes(bytes: number) {
web/src\archive\archiveData.test.ts:4:  formatArchiveDuration,
web/src\archive\archiveData.test.ts:37:  it('formats video duration like the original archive app', () => {
web/src\archive\archiveData.test.ts:38:    expect(formatArchiveDuration(75)).toBe('1:15');
web/src\archive\archiveData.test.ts:39:    expect(formatArchiveDuration(3725)).toBe('1:02:05');
web/src\community\communityData.ts:131:export function formatCommunityRelative(date: Date | string | number) {
web/src\content\survey.ts:19:  | { kind: 'section'; id: string; title: string }
web/src\content\survey.ts:21:      kind: 'radio';
web/src\content\survey.ts:30:      kind: 'checkbox';
web/src\content\survey.ts:40:      kind: 'text';
web/src\content\survey.ts:52:    kind: 'radio',
web/src\content\survey.ts:65:    kind: 'radio',
web/src\content\survey.ts:78:    kind: 'radio',
web/src\content\survey.ts:91:    kind: 'checkbox',
web/src\content\survey.ts:106:    kind: 'radio',
web/src\content\survey.ts:119:    kind: 'checkbox',
web/src\content\survey.ts:135:    kind: 'radio',
web/src\content\survey.ts:147:    kind: 'radio',
web/src\content\survey.ts:166:    kind: 'text',
web/src\content\survey.ts:183:  if (item.kind === 'section') return true;
web/src\content\survey.test.ts:7:    expect(SURVEY_ITEMS.some((it) => it.kind !== 'section')).toBe(true);
web/src\content\survey.test.ts:17:      if (item.kind === 'section') continue;
web/src\content\survey.test.ts:27:      if (item.kind !== 'radio' && item.kind !== 'checkbox') continue;
web/src\content\survey.test.ts:40:      if (item.kind !== 'checkbox' || !item.maxSelect) continue;
web/src\content\survey.test.ts:46:    const seenIds = new Map<string, string>(); // id -> kind
web/src\content\survey.test.ts:48:      if (item.kind !== 'section' && 'showIf' in item && item.showIf) {
web/src\content\survey.test.ts:52:      seenIds.set(item.id, item.kind);
web/src\views\CoachPage.css:203:.uppercase{text-transform:uppercase}
web/src\views\CoachPage.css:205:.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:var(--default-transition-timing-function);transition-duration:var(--default-transition-duration)}
web/src\views\CoachPage.css:246:  to { transform: rotate(360deg); }
web/src\views\ArchivePage.tsx:18:  formatArchiveBytes,
web/src\views\ArchivePage.tsx:19:  formatArchiveDuration,
web/src\views\ArchivePage.tsx:20:  formatArchiveRelative,
web/src\views\ArchivePage.tsx:82:        <form onSubmit={submit} className="archive-header-search">
web/src\views\ArchivePage.tsx:90:        </form>
web/src\views\ArchivePage.tsx:159:    <div className="archive-form-page">
web/src\views\ArchivePage.tsx:222:      <div className="archive-form-page">
web/src\views\ArchivePage.tsx:239:          조회 {video.viewCount.toLocaleString()}회 · {formatArchiveRelative(video.createdAt)}
web/src\views\ArchivePage.tsx:269:        {video.durationSec ? <span>{formatArchiveDuration(video.durationSec)}</span> : null}
web/src\views\ArchivePage.tsx:277:            조회 {video.viewCount.toLocaleString()}회 · {formatArchiveRelative(video.createdAt)}
web/src\views\ArchivePage.tsx:335:    <form className="archive-upload-form" onSubmit={submit}>
web/src\views\ArchivePage.tsx:345:            setFileName(file ? `${file.name} · ${formatArchiveBytes(file.size)}` : '');
web/src\views\ArchivePage.tsx:412:    </form>
web/src\views\ArchivePage.test.tsx:40:    fireEvent.submit(screen.getByRole('textbox', { name: 'archive 검색' }).closest('form')!);
web/src\views\ArchivePage.css:86:  text-transform: uppercase;
web/src\views\ArchivePage.css:108:  transform: translateY(-50%);
web/src\views\ArchivePage.css:153:    transform 0.15s ease;
web/src\views\ArchivePage.css:253:    transform 0.2s ease,
web/src\views\ArchivePage.css:259:  transform: translateY(-2px);
web/src\views\ArchivePage.css:266:  transition: transform 0.3s ease;
web/src\views\ArchivePage.css:270:  transform: scale(1.03);
web/src\views\ArchivePage.css:389:.archive-form-page h1 {
web/src\views\ArchivePage.css:428:.archive-form-page {
web/src\views\ArchivePage.css:434:.archive-form-page > p {
web/src\views\ArchivePage.css:440:.archive-upload-form {
web/src\views\ArchivePage.css:445:.archive-upload-form > div {
web/src\views\ArchivePage.css:450:.archive-upload-form label,
web/src\views\ArchivePage.css:451:.archive-upload-form legend {
web/src\views\ArchivePage.css:457:.archive-upload-form input:not([type="radio"]),
web/src\views\ArchivePage.css:458:.archive-upload-form textarea {
web/src\views\ArchivePage.css:468:.archive-upload-form input:not([type="radio"]) {
web/src\views\ArchivePage.css:473:.archive-upload-form input[type="file"] {
web/src\views\ArchivePage.css:477:.archive-upload-form textarea {
web/src\views\ArchivePage.css:482:.archive-upload-form input:focus,
web/src\views\ArchivePage.css:483:.archive-upload-form textarea:focus {
web/src\views\ArchivePage.css:487:.archive-upload-form p {
web/src\views\ArchivePage.css:493:.archive-upload-form fieldset {
web/src\components\ChoiceCard.css:20:    transform var(--duration-fast) var(--ease-out),
web/src\components\ChoiceCard.css:28:    transform: translateY(-1px);
web/src\components\ChoiceCard.css:34:  transform: translateY(0) scale(0.99);
web/src\components\ChoiceCard.css:82:  from { opacity: 0; transform: scale(0.6); }
web/src\components\ChoiceCard.css:83:  to   { opacity: 1; transform: scale(1); }
web/src\components\CharacterAvatar.css:33:    transform: translateY(-3px);
web/src\components\CharacterAvatar.css:43:  0%, 100% { transform: translateY(0); }
web/src\components\CharacterAvatar.css:44:  50%      { transform: translateY(-5px); }
web/src\styles\globals.css:196:  from { opacity: 0; transform: translateY(6px); }
web/src\styles\globals.css:197:  to   { opacity: 1; transform: translateY(0); }
web/src\components\CaptureCard.css:78:  transform: translateX(-50%) rotate(45deg);
web/src\components\CaptureCard.css:161:  transform: scale(0.96);
web/src\components\CaptureCard.css:166:  opacity: 0; transform: translateY(8px) scale(0.92);
web/src\components\CaptureCard.css:172:  opacity: 0; transform: translateY(10px);
web/src\components\CaptureCard.css:184:  opacity: 0; transform: translateY(6px);
web/src\components\CaptureCard.css:193:  to { opacity: 1; transform: scale(1); }
web/src\components\CaptureCard.css:196:  to { opacity: 1; transform: translateY(0) scale(1); }
web/src\components\CaptureCard.css:199:  to { opacity: 1; transform: translateY(0); }
web/src\components\TypeCard.css:14:    transform var(--duration-fast) var(--ease-out);
web/src\components\TypeCard.css:20:    transform: translateY(-1px);
web/src\components\TypeCard.css:23:    transform: translateX(2px);
web/src\components\TypeCard.css:27:.type-card:not(.type-card--static):active { transform: scale(0.99); }
web/src\components\TypeCard.css:55:  text-transform: uppercase;
web/src\components\TypeCard.css:73:  transition: transform var(--duration-fast) var(--ease-out);
web/src\components\AxisBreakdown.css:106:.axes__gauge--left .axes__gauge-fill { left: 0; transform-origin: left; }
web/src\components\AxisBreakdown.css:107:.axes__gauge--right .axes__gauge-fill { right: 0; transform-origin: right; }
web/src\components\AxisBreakdown.css:118:  transform: translate(-50%, -50%);
web/src\components\AxisBreakdown.css:126:  from { transform: scaleX(0); }
web/src\components\AxisBreakdown.css:127:  to   { transform: scaleX(1); }
web/src\components\AxisBreakdown.css:131:  from { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
web/src\components\AxisBreakdown.css:132:  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
web/src\components\Toast.css:5:  transform: translateX(-50%);
web/src\components\Toast.css:24:  from { opacity: 0; transform: translate(-50%, 12px); }
web/src\components\Toast.css:25:  to   { opacity: 1; transform: translate(-50%, 0); }
web/src\components\Toast.css:29:  to { opacity: 0; transform: translate(-50%, 12px); }
web/src\components\ResultEmailForm.tsx:56:      <section className="email-form email-form--success" aria-live="polite">
web/src\components\ResultEmailForm.tsx:57:        <div className="email-form__success-icon" aria-hidden="true">
web/src\components\ResultEmailForm.tsx:60:        <h3 className="email-form__title">발송 완료!</h3>
web/src\components\ResultEmailForm.tsx:61:        <p className="email-form__desc">
web/src\components\ResultEmailForm.tsx:71:    <section className="email-form">
web/src\components\ResultEmailForm.tsx:72:      <h3 className="email-form__title">상세 결과를 이메일로 받기</h3>
web/src\components\ResultEmailForm.tsx:73:      <p className="email-form__desc">
web/src\components\ResultEmailForm.tsx:77:      <form className="email-form__form" onSubmit={handleSubmit} noValidate>
web/src\components\ResultEmailForm.tsx:78:        <label htmlFor={emailId} className="email-form__label">
web/src\components\ResultEmailForm.tsx:87:          className="email-form__input"
web/src\components\ResultEmailForm.tsx:95:        <label htmlFor={consentId} className="email-form__consent">
web/src\components\ResultEmailForm.tsx:105:            <span className="email-form__consent-detail">
web/src\components\ResultEmailForm.tsx:113:          <p className="email-form__error" role="alert">
web/src\components\ResultEmailForm.tsx:120:          className="email-form__submit"
web/src\components\ResultEmailForm.tsx:125:              <Loader2 size={18} className="email-form__spin" aria-hidden="true" />
web/src\components\ResultEmailForm.tsx:135:      </form>
web/src\components\ResultEmailForm.css:1:.email-form {
web/src\components\ResultEmailForm.css:8:.email-form--success {
web/src\components\ResultEmailForm.css:12:.email-form__success-icon {
web/src\components\ResultEmailForm.css:24:.email-form__title {
web/src\components\ResultEmailForm.css:32:.email-form__desc {
web/src\components\ResultEmailForm.css:39:.email-form__form {
web/src\components\ResultEmailForm.css:45:.email-form__label {
web/src\components\ResultEmailForm.css:52:.email-form__input {
web/src\components\ResultEmailForm.css:65:.email-form__input::placeholder {
web/src\components\ResultEmailForm.css:69:.email-form__input:focus {
web/src\components\ResultEmailForm.css:75:.email-form__input[aria-invalid='true'] {
web/src\components\ResultEmailForm.css:79:.email-form__input:disabled {
web/src\components\ResultEmailForm.css:83:.email-form__consent {
web/src\components\ResultEmailForm.css:93:.email-form__consent input[type='checkbox'] {
web/src\components\ResultEmailForm.css:99:.email-form__consent strong {
web/src\components\ResultEmailForm.css:104:.email-form__consent-detail {
web/src\components\ResultEmailForm.css:111:.email-form__error {
web/src\components\ResultEmailForm.css:120:.email-form__submit {
web/src\components\ResultEmailForm.css:135:  transition: opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
web/src\components\ResultEmailForm.css:138:.email-form__submit:hover:not(:disabled) {
web/src\components\ResultEmailForm.css:142:.email-form__submit:active:not(:disabled) {
web/src\components\ResultEmailForm.css:143:  transform: scale(0.98);
web/src\components\ResultEmailForm.css:146:.email-form__submit:disabled {
web/src\components\ResultEmailForm.css:151:.email-form__spin {
web/src\components\ResultEmailForm.css:152:  animation: email-form-spin 1s linear infinite;
web/src\components\ResultEmailForm.css:155:@keyframes email-form-spin {
web/src\components\ResultEmailForm.css:156:  to { transform: rotate(360deg); }
web/src\components\ShareSuccessModal.css:135:  from { opacity: 0; transform: translateY(20px) scale(0.96); }
web/src\components\ShareSuccessModal.css:136:  to { opacity: 1; transform: translateY(0) scale(1); }
web/src\views\LineshotPage.css:46:.lineshot__form {
web/src\views\LineshotPage.css:318:  to { transform: rotate(360deg); }
web/src\components\PrimaryButton.css:14:    transform var(--duration-fast) var(--ease-out),
web/src\components\PrimaryButton.css:33:.btn--fill:active { background: var(--primary-700); transform: translateY(1px); }
web/src\components\PrimaryButton.css:42:.btn--weak:active { background: var(--gray-200); transform: translateY(1px); }
web/src\components\ShareActionButton.css:22:.share:active { transform: scale(0.98); }
web/src\components\ShareActionButton.css:53:  to { transform: rotate(360deg); }
web/src\server\coachAnalyze.ts:7:import { buildSynthesisPrompt, formatTime, parseGeminiFeedback, type CoachFeedback } from '../coach/evaluation';
web/src\server\coachAnalyze.ts:145:        start: formatTime(input.startTime),
web/src\server\coachAnalyze.ts:146:        end: formatTime(input.endTime),
web/src\server\coachAnalyze.ts:338:    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
web/src\server\coachAnalyze.ts:342:    const formData = await request.formData();
web/src\server\coachAnalyze.ts:343:    const video = formData.get('video');
web/src\server\coachAnalyze.ts:353:    const fileName = textFromForm(formData.get('fileName')) || video.name || '연기 연습 영상';
web/src\server\coachAnalyze.ts:354:    const category = textFromForm(formData.get('category'));
web/src\server\coachAnalyze.ts:355:    const intent = textFromForm(formData.get('intent'));
web/src\server\coachAnalyze.ts:356:    const startTime = numberFromForm(formData.get('startTime'));
web/src\server\coachAnalyze.ts:357:    const endTime = numberFromForm(formData.get('endTime'));
web/src\server\coachSecondAnalyze.ts:11:import { formatTime, type CoachFeedback } from '../coach/evaluation';
web/src\server\coachSecondAnalyze.ts:237:      start: formatTime(input.startTime),
web/src\server\coachSecondAnalyze.ts:238:      end: formatTime(input.endTime),
web/src\server\coachSecondAnalyze.ts:591:    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
web/src\server\coachSecondAnalyze.ts:595:    const formData = await request.formData();
web/src\server\coachSecondAnalyze.ts:596:    const video = formData.get('video');
web/src\server\coachSecondAnalyze.ts:606:    const fileName = textFromForm(formData.get('fileName')) || video.name || '연기 연습 영상';
web/src\server\coachSecondAnalyze.ts:607:    const category = textFromForm(formData.get('category'));
web/src\server\coachSecondAnalyze.ts:608:    const intent = textFromForm(formData.get('intent'));
web/src\server\coachSecondAnalyze.ts:609:    const startTime = numberFromForm(formData.get('startTime'));
web/src\server\coachSecondAnalyze.ts:610:    const endTime = numberFromForm(formData.get('endTime'));
web/src\views\LandingPage.css:102:  transition: transform var(--duration-fast) var(--ease-out);
web/src\views\LandingPage.css:106:  .page-landing__cell:hover { transform: translateY(-2px); }
web/src\server\coachAnalyze.test.ts:47:  it('returns JSON validation errors for invalid form data', async () => {
web/src\server\coachAnalyze.test.ts:61:  it('returns a JSON 400 for non-form requests', async () => {
web/src\server\coachAnalyze.test.ts:90:      storage: stubStorage('coach-session-form'),
web/src\server\coachAnalyze.test.ts:96:    expect((result.body as { sessionId?: string }).sessionId).toBe('coach-session-form');
web/src\views\FortunePage.tsx:98:          <div className="fortune__form">
web/src\views\FortunePage.css:49:.fortune__form {
web/src\views\FortunePage.css:306:  to { transform: rotate(360deg); }
web/src\views\FormReviewPage.tsx:4: * FormReviewPage — 알파 테스트 사용 후 리뷰 폼(acttub.com/form/review).
web/src\views\FormReviewPage.tsx:12: * 제출 시 /api/form/review 로 POST → 구글시트 적재(kind='tester-review').
web/src\views\FormReviewPage.tsx:13: * 스타일은 FormPage.css 의 .form* 클래스를 그대로 재사용한다.
web/src\views\FormReviewPage.tsx:30:  return ['form__chip', on && 'form__chip--on'].filter(Boolean).join(' ');
web/src\views\FormReviewPage.tsx:44:    <label className="form__field form__field--reason">
web/src\views\FormReviewPage.tsx:45:      <span className="form__sublabel">왜 그렇게 느끼셨나요? (최소 {REASON_MIN}자)</span>
web/src\views\FormReviewPage.tsx:47:        className="form__input form__input--area form__input--reason"
web/src\views\FormReviewPage.tsx:99:      const res = await fetch('/api/form/review', {
web/src\views\FormReviewPage.tsx:135:      <main className="form form--done container">
web/src\views\FormReviewPage.tsx:136:        <header className="form__topbar">
web/src\views\FormReviewPage.tsx:137:          <Link href="/" className="form__brand" aria-label="acttub 홈">
web/src\views\FormReviewPage.tsx:140:          <span className="form__badge">리뷰</span>
web/src\views\FormReviewPage.tsx:143:        <section className="form__card form__card--done">
web/src\views\FormReviewPage.tsx:144:          <div className="form__done-mark" aria-hidden="true">☕</div>
web/src\views\FormReviewPage.tsx:145:          <h1 className="form__title">리뷰 접수 완료!</h1>
web/src\views\FormReviewPage.tsx:146:          <p className="form__lead">
web/src\views\FormReviewPage.tsx:149:          <Link href="/" className="form__home">
web/src\views\FormReviewPage.tsx:158:    <main className="form container">
web/src\views\FormReviewPage.tsx:159:      <header className="form__topbar">
web/src\views\FormReviewPage.tsx:160:        <Link href="/" className="form__brand" aria-label="acttub 홈">
web/src\views\FormReviewPage.tsx:163:        <span className="form__badge">리뷰</span>
web/src\views\FormReviewPage.tsx:166:      <form className="form__card" onSubmit={handleSubmit}>
web/src\views\FormReviewPage.tsx:167:        <div className="form__intro">
web/src\views\FormReviewPage.tsx:168:          <span className="form__kicker">AI 연기 피드백 · 알파 테스트</span>
web/src\views\FormReviewPage.tsx:169:          <h1 className="form__title">사용 후 리뷰</h1>
web/src\views\FormReviewPage.tsx:170:          <p className="form__lead">
web/src\views\FormReviewPage.tsx:176:        <label className="form__field">
web/src\views\FormReviewPage.tsx:177:          <span className="form__label">성함</span>
web/src\views\FormReviewPage.tsx:179:            className="form__input"
web/src\views\FormReviewPage.tsx:188:        <label className="form__field">
web/src\views\FormReviewPage.tsx:189:          <span className="form__label">전화번호 (쿠폰 받으실 번호)</span>
web/src\views\FormReviewPage.tsx:191:            className="form__input"
web/src\views\FormReviewPage.tsx:202:        <fieldset className="form__field">
web/src\views\FormReviewPage.tsx:203:          <legend className="form__label">전체 만족도 (1 아쉬움 ~ 5 최고)</legend>
web/src\views\FormReviewPage.tsx:204:          <div className="form__choices">
web/src\views\FormReviewPage.tsx:224:        <fieldset className="form__field">
web/src\views\FormReviewPage.tsx:225:          <legend className="form__label">
web/src\views\FormReviewPage.tsx:228:          <div className="form__choices">
web/src\views\FormReviewPage.tsx:248:        <fieldset className="form__field">
web/src\views\FormReviewPage.tsx:249:          <legend className="form__label">다음 연습 때도 다시 쓸 의향이 있나요?</legend>
web/src\views\FormReviewPage.tsx:250:          <div className="form__choices">
web/src\views\FormReviewPage.tsx:275:        <label className="form__field">
web/src\views\FormReviewPage.tsx:276:          <span className="form__label">마지막으로 acttub에 하고 싶은 말이 있다면 (선택)</span>
web/src\views\FormReviewPage.tsx:278:            className="form__input form__input--area"
web/src\views\FormReviewPage.tsx:287:        <label className="form__consent">
web/src\views\FormReviewPage.tsx:302:          className="form__hp"
web/src\views\FormReviewPage.tsx:311:          <p className="form__error" role="alert">
web/src\views\FormReviewPage.tsx:316:        <button className="form__submit" type="submit" disabled={!ready || submitting}>
web/src\views\FormReviewPage.tsx:319:      </form>
web/src\views\TheaPage.css:81:  text-transform: uppercase;
web/src\views\TheaPage.css:369:    transform 0.15s ease,
web/src\views\TheaPage.css:377:  transform: translateY(-2px);
web/src\server\formApply.test.ts:2:import { handleFormApply, type FormApplyPayload } from './formApply';
web/src\server\formApply.test.ts:8:  return { method: 'POST', url: '/api/form', body };
web/src\server\formApply.test.ts:23:  it('유효 입력을 webhook으로 보내고 200 ok 를 반환한다 (전화번호는 숫자만 정규화)', async () => {
web/src\server\formApply.test.ts:29:      webhookUrl: 'https://example.test/hook',
web/src\server\formApply.test.ts:38:      kind: 'tester-apply',
web/src\server\formApply.test.ts:54:      webhookUrl: 'https://example.test/hook',
web/src\server\formApply.test.ts:65:      webhookUrl: 'https://example.test/hook',
web/src\server\formApply.test.ts:76:      webhookUrl: 'https://example.test/hook',
web/src\server\formApply.test.ts:87:      webhookUrl: 'https://example.test/hook',
web/src\server\formApply.test.ts:96:  it('webhook URL 이 없으면 500 을 반환한다', async () => {
web/src\server\formApply.test.ts:97:    const result = await handleFormApply(input(validBody), { webhookUrl: '' });
web/src\server\formApply.test.ts:103:      webhookUrl: 'https://example.test/hook',
web/src\server\formApply.test.ts:111:      webhookUrl: 'https://example.test/hook',
web/src\server\formApply.test.ts:119:  it('webhook이 HTTP 200 이라도 body 가 { ok: false } 면 502 로 처리한다(데이터 유실 방지)', async () => {
web/src\server\formApply.test.ts:122:      .mockResolvedValue({ ok: true, json: async () => ({ ok: false, error: 'sheet fail' }) });
web/src\server\formApply.test.ts:126:        webhookUrl: 'https://example.test/hook',
web/src\server\formApply.test.ts:135:  it('webhook 이 HTTP 200 + body { ok: true } 면 200 으로 처리한다', async () => {
web/src\server\formApply.test.ts:140:        webhookUrl: 'https://example.test/hook',
web/src\views\FormPage.tsx:4: * FormPage — 알파 테스터 신청 폼(acttub.com/form).
web/src\views\FormPage.tsx:6: * SOMA-70 모집 깔때기의 끝단. 모델: 한 번 사용 + 리뷰(/form/review) 작성 → 쿠폰.
web/src\views\FormPage.tsx:7: * 한 화면에 7문항 + 개인정보 동의, 제출 시 /api/form 으로 POST → 구글시트 적재.
web/src\views\FormPage.tsx:68:      const res = await fetch('/api/form', {
web/src\views\FormPage.tsx:101:      <main className="form form--done container">
web/src\views\FormPage.tsx:102:        <header className="form__topbar">
web/src\views\FormPage.tsx:103:          <Link href="/" className="form__brand" aria-label="acttub 홈">
web/src\views\FormPage.tsx:106:          <span className="form__badge">알파 테스터</span>
web/src\views\FormPage.tsx:109:        <section className="form__card form__card--done">
web/src\views\FormPage.tsx:110:          <div className="form__done-mark" aria-hidden="true">🎭</div>
web/src\views\FormPage.tsx:111:          <h1 className="form__title">신청 완료!</h1>
web/src\views\FormPage.tsx:112:          <p className="form__lead">
web/src\views\FormPage.tsx:115:          <p className="form__note">
web/src\views\FormPage.tsx:118:          <Link href="/" className="form__home">
web/src\views\FormPage.tsx:127:    <main className="form container">
web/src\views\FormPage.tsx:128:      <header className="form__topbar">
web/src\views\FormPage.tsx:129:        <Link href="/" className="form__brand" aria-label="acttub 홈">
web/src\views\FormPage.tsx:132:        <span className="form__badge">알파 테스터</span>
web/src\views\FormPage.tsx:135:      <form className="form__card" onSubmit={handleSubmit}>
web/src\views\FormPage.tsx:136:        <div className="form__intro">
web/src\views\FormPage.tsx:137:          <span className="form__kicker">AI 연기 피드백 · 알파 테스트</span>
web/src\views\FormPage.tsx:138:          <h1 className="form__title">알파 테스터 신청</h1>
web/src\views\FormPage.tsx:139:          <p className="form__lead">
web/src\views\FormPage.tsx:146:        <label className="form__field">
web/src\views\FormPage.tsx:147:          <span className="form__label">성함</span>
web/src\views\FormPage.tsx:149:            className="form__input"
web/src\views\FormPage.tsx:158:        <label className="form__field">
web/src\views\FormPage.tsx:159:          <span className="form__label">전화번호 (쿠폰 받으실 번호)</span>
web/src\views\FormPage.tsx:161:            className="form__input"
web/src\views\FormPage.tsx:172:        <fieldset className="form__field">
web/src\views\FormPage.tsx:173:          <legend className="form__label">연기 경력</legend>
web/src\views\FormPage.tsx:174:          <div className="form__choices">
web/src\views\FormPage.tsx:179:                className={['form__chip', career === c && 'form__chip--on'].filter(Boolean).join(' ')}
web/src\views\FormPage.tsx:189:        <fieldset className="form__field">
web/src\views\FormPage.tsx:190:          <legend className="form__label">지금 연기 피드백은 주로 어디서 받나요?</legend>
web/src\views\FormPage.tsx:191:          <div className="form__choices">
web/src\views\FormPage.tsx:196:                className={['form__chip', feedbackSource === s && 'form__chip--on']
web/src\views\FormPage.tsx:208:        <fieldset className="form__field">
web/src\views\FormPage.tsx:209:          <legend className="form__label">연기에서 가장 고민인 부분 하나를 골라주세요</legend>
web/src\views\FormPage.tsx:210:          <div className="form__choices">
web/src\views\FormPage.tsx:215:                className={['form__chip', concern === c && 'form__chip--on'].filter(Boolean).join(' ')}
web/src\views\FormPage.tsx:225:        <fieldset className="form__field">
web/src\views\FormPage.tsx:226:          <legend className="form__label">
web/src\views\FormPage.tsx:229:          <div className="form__choices">
web/src\views\FormPage.tsx:232:              className={['form__chip', q1 === true && 'form__chip--on'].filter(Boolean).join(' ')}
web/src\views\FormPage.tsx:240:              className={['form__chip', q1 === false && 'form__chip--on'].filter(Boolean).join(' ')}
web/src\views\FormPage.tsx:249:        <fieldset className="form__field">
web/src\views\FormPage.tsx:250:          <legend className="form__label">어떤 경로로 오셨나요?</legend>
web/src\views\FormPage.tsx:251:          <div className="form__choices">
web/src\views\FormPage.tsx:256:                className={['form__chip', channel === c && 'form__chip--on'].filter(Boolean).join(' ')}
web/src\views\FormPage.tsx:266:        <label className="form__consent">
web/src\views\FormPage.tsx:281:          className="form__hp"
web/src\views\FormPage.tsx:290:          <p className="form__error" role="alert">
web/src\views\FormPage.tsx:295:        <button className="form__submit" type="submit" disabled={!ready || submitting}>
web/src\views\FormPage.tsx:298:      </form>
web/src\views\FormPage.css:4:.form {
web/src\views\FormPage.css:13:.form__topbar {
web/src\views\FormPage.css:19:.form__brand {
web/src\views\FormPage.css:28:.form__brand span {
web/src\views\FormPage.css:32:.form__badge {
web/src\views\FormPage.css:43:.form__card {
web/src\views\FormPage.css:54:.form__intro {
web/src\views\FormPage.css:60:.form__kicker {
web/src\views\FormPage.css:71:.form__title {
web/src\views\FormPage.css:80:.form__lead {
web/src\views\FormPage.css:87:.form__lead strong {
web/src\views\FormPage.css:92:.form__note {
web/src\views\FormPage.css:99:.form__field {
web/src\views\FormPage.css:108:.form__label {
web/src\views\FormPage.css:115:.form__input {
web/src\views\FormPage.css:130:.form__input::placeholder {
web/src\views\FormPage.css:134:.form__input:focus-visible {
web/src\views\FormPage.css:141:.form__choices {
web/src\views\FormPage.css:147:.form__chip {
web/src\views\FormPage.css:159:    transform var(--duration-fast) var(--ease-out),
web/src\views\FormPage.css:164:  .form__chip:hover {
web/src\views\FormPage.css:167:    transform: translateY(-1px);
web/src\views\FormPage.css:171:.form__chip:active {
web/src\views\FormPage.css:172:  transform: translateY(1px);
web/src\views\FormPage.css:175:.form__chip--on {
web/src\views\FormPage.css:183:  .form__chip--on:hover {
web/src\views\FormPage.css:190:.form__input--area {
web/src\views\FormPage.css:197:.form__field--reason {
web/src\views\FormPage.css:203:.form__sublabel {
web/src\views\FormPage.css:211:.form__input--reason {
web/src\views\FormPage.css:216:.form__consent {
web/src\views\FormPage.css:226:.form__consent input {
web/src\views\FormPage.css:235:.form__consent strong {
web/src\views\FormPage.css:240:.form__hp {
web/src\views\FormPage.css:248:.form__error {
web/src\views\FormPage.css:255:.form__submit {
web/src\views\FormPage.css:268:    transform var(--duration-fast) var(--ease-out),
web/src\views\FormPage.css:273:  .form__submit:hover:not(:disabled) {
web/src\views\FormPage.css:275:    transform: translateY(-1px);
web/src\views\FormPage.css:280:.form__submit:active:not(:disabled) {
web/src\views\FormPage.css:281:  transform: translateY(1px);
web/src\views\FormPage.css:284:.form__submit:disabled {
web/src\views\FormPage.css:291:.form__card--done {
web/src\views\FormPage.css:299:.form__done-mark {
web/src\views\FormPage.css:304:.form__home {
web/src\views\FormPage.css:317:  .form__home:hover {
web/src\views\ExcerPage.tsx:53:function formatPrice(won: number) {
web/src\views\ExcerPage.tsx:263:            <span className={isPriceActive ? 'is-active' : ''}>~ {formatPrice(priceMax)} / 시간</span>
web/src\views\ExcerPage.tsx:486:          <strong>{formatPrice(room.priceHour)}</strong>
web/src\views\SurveyPage.tsx:29:type RenderableItem = Exclude<SurveyItem, { kind: 'section' }>;
web/src\views\SurveyPage.tsx:31:  (it): it is RenderableItem => it.kind !== 'section'
web/src\views\SurveyPage.tsx:37:  if (item.kind === 'radio') return typeof v === 'string' && v.length > 0;
web/src\views\SurveyPage.tsx:38:  if (item.kind === 'checkbox') return Array.isArray(v) && v.length > 0;
web/src\views\SurveyPage.tsx:85:  if (item.kind === 'radio') {
web/src\views\SurveyPage.tsx:132:  if (item.kind === 'checkbox') {
web/src\views\SurveyPage.test.tsx:54:    if (firstItem.kind !== 'radio') {
web/src\views\SurveyPage.test.tsx:70:    if (secondItem.kind === 'section') return; // shape-dependent; sanity not required
web/src\views\SurveyPage.test.tsx:79:      if (item.kind === 'section' || item.kind === 'text') continue;
web/src\views\SurveyPage.test.tsx:89:      if (item.kind === 'radio') {
web/src\views\SurveyPage.test.tsx:98:    const contact = SURVEY_ITEMS.find((item) => item.kind === 'text' && item.id === 'contact');
web/src\views\SurveyPage.test.tsx:99:    if (!contact || contact.kind !== 'text') throw new Error('Missing contact survey item');
web/src\views\ExcerPage.css:154:  transform: translateY(-50%);
web/src\views\ExcerPage.css:400:  transform: translate(-50%, -50%);
web/src\views\ExcerPage.css:426:  transform: translateX(-50%);
web/src\views\ExcerPage.css:502:    transform 0.2s ease;
web/src\views\ExcerPage.css:507:  transform: translateY(-2px);
web/src\views\RootLandingPage.tsx:133:          <form className="root-landing__search" role="search">
web/src\views\RootLandingPage.tsx:136:          </form>
web/src\views\CommunityPage.tsx:20:  formatCommunityRelative,
web/src\views\CommunityPage.tsx:200:    <div className="community-form-page">
web/src\views\CommunityPage.tsx:201:      <div className="community-form-heading">
web/src\views\CommunityPage.tsx:207:      <div className="community-form-card">
web/src\views\CommunityPage.tsx:240:              <span>{formatCommunityRelative(comment.createdAt)}</span>
web/src\views\CommunityPage.tsx:273:      <div className="community-form-page">
web/src\views\CommunityPage.tsx:297:            <time>{formatCommunityRelative(post.createdAt)}</time>
web/src\views\CommunityPage.tsx:320:                <time>{formatCommunityRelative(comment.createdAt)}</time>
web/src\views\CommunityPage.tsx:454:          <time>{formatCommunityRelative(post.createdAt)}</time>
web/src\views\CommunityPage.tsx:480:    <form onSubmit={submit} className="community-search-form">
web/src\views\CommunityPage.tsx:489:    </form>
web/src\views\CommunityPage.tsx:527:    <form className="community-post-form" onSubmit={submit}>
web/src\views\CommunityPage.tsx:530:        <div className="community-post-form__boards">
web/src\views\CommunityPage.tsx:554:      <div className="community-post-form__actions">
web/src\views\CommunityPage.tsx:560:    </form>
web/src\views\CommunityPage.test.tsx:68:    fireEvent.submit(screen.getByPlaceholderText('제목·본문에서 검색').closest('form')!);
web/src\app\layout.tsx:21:          rel="stylesheet"
web/src\views\CommunityPage.css:79:  transition: transform 0.15s ease;
web/src\views\CommunityPage.css:83:  transform: rotate(-6deg);
web/src\views\CommunityPage.css:180:  text-transform: uppercase;
web/src\views\CommunityPage.css:441:  text-transform: uppercase;
web/src\views\CommunityPage.css:472:  transition: transform 0.15s ease;
web/src\views\CommunityPage.css:476:  transform: scale(1.05);
web/src\views\CommunityPage.css:488:.community-search-form {
web/src\views\CommunityPage.css:492:.community-search-form svg {
web/src\views\CommunityPage.css:499:  transform: translateY(-50%);
web/src\views\CommunityPage.css:503:.community-search-form input {
web/src\views\CommunityPage.css:515:.community-search-form input:focus {
web/src\views\CommunityPage.css:526:.community-form-page,
web/src\views\CommunityPage.css:533:.community-form-heading {
web/src\views\CommunityPage.css:540:.community-form-heading button {
web/src\views\CommunityPage.css:553:.community-form-heading button:hover {
web/src\views\CommunityPage.css:558:.community-form-heading svg {
web/src\views\CommunityPage.css:563:.community-form-heading h1 {
web/src\views\CommunityPage.css:569:.community-form-card {
web/src\views\CommunityPage.css:573:.community-post-form {
web/src\views\CommunityPage.css:578:.community-post-form label {
web/src\views\CommunityPage.css:585:  text-transform: uppercase;
web/src\views\CommunityPage.css:588:.community-post-form__boards {
web/src\views\CommunityPage.css:594:.community-post-form__boards button {
web/src\views\CommunityPage.css:605:.community-post-form__boards button.is-active {
web/src\views\CommunityPage.css:610:.community-post-form > input {
web/src\views\CommunityPage.css:622:.community-post-form > input:focus {
web/src\views\CommunityPage.css:626:.community-post-form textarea {
web/src\views\CommunityPage.css:637:.community-post-form > p {
web/src\views\CommunityPage.css:652:  text-transform: none !important;
web/src\views\CommunityPage.css:666:.community-post-form__actions {
web/src\views\CommunityPage.css:674:.community-post-form__actions a,
web/src\views\CommunityPage.css:675:.community-post-form__actions button {
web/src\views\CommunityPage.css:687:.community-post-form__actions a {
web/src\views\CommunityPage.css:691:.community-post-form__actions a:hover {
web/src\views\CommunityPage.css:695:.community-post-form__actions button {
web/src\views\RootLandingPage.css:104:  transform: translateY(-50%);
web/src\views\RootLandingPage.css:151:  transition: background 120ms ease, transform 120ms ease;
web/src\views\RootLandingPage.css:156:  transform: translateY(-1px);
web/src\views\RootLandingPage.css:200:  transition: transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 160ms ease;
web/src\views\RootLandingPage.css:204:  transform: translateY(-2px);
web/src\views\RootLandingPage.css:276:  transition: transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 120ms ease,
web/src\views\RootLandingPage.css:281:  transform: translateY(-2px);
web/src\views\RootLandingPage.css:364:  text-transform: uppercase;
web/src\views\RootLandingPage.css:567:  transition: transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 160ms ease;
web/src\views\RootLandingPage.css:571:  transform: translateY(-2px) scale(1.03);
web/src\views\CoachPage.tsx:18:  formatTime,
web/src\views\CoachPage.tsx:318:                      ? `녹화 중 ${formatTime(recordingSeconds)}`
web/src\views\CoachPage.tsx:373:                    {duration > 0 ? formatTime(duration) : '—'}
web/src\views\CoachPage.tsx:411:              영상 길이 {formatTime(duration)} · 전체에서 연기 구간을 자동으로 잡아 분석해요.
web/src\views\CoachPage.tsx:454:              href={sessionId ? `/form/review?s=${encodeURIComponent(sessionId)}` : '/form/review'}
web/src\views\PlayPage.tsx:180:        <section className="play__form">
web/src\views\PlayPage.tsx:199:          <div className="play__form-foot">
web/src\views\PlayPage.css:147:.play__form {
web/src\views\PlayPage.css:177:.play__form-foot {
web/src\views\PlayPage.css:267:  to { transform: rotate(360deg); }
web/src\views\QuizPage.css:48:  from { opacity: 0; transform: translateX(12px); }
web/src\views\QuizPage.css:49:  to   { opacity: 1; transform: translateX(0); }
web/src\server\email\emailTemplate.ts:46:          <p style="margin:0;font-size:12px;color:#999;letter-spacing:0.08em;text-transform:uppercase;">ACTI · 연기 스타일 MBTI</p>
web/src\views\QuickTestPage.tsx:17:import { formatTime, type CoachFeedback } from '../coach/evaluation';
web/src\views\QuickTestPage.tsx:383:                      ? `녹화 중 ${formatTime(recordingSeconds)}`
web/src\views\QuickTestPage.tsx:434:              영상 길이 {formatTime(duration)} · 전체에서 연기 구간을 자동으로 잡아 분석해요.
web/src\views\QuickTestPage.tsx:470:              href={sessionId ? `/form/review?s=${encodeURIComponent(sessionId)}` : '/form/review'}
web/src\views\LineshotPage.tsx:138:      const formData = new FormData();
web/src\views\LineshotPage.tsx:139:      formData.set('audio', blobRef.current, 'lineshot.webm');
web/src\views\LineshotPage.tsx:140:      formData.set('line', line.trim());
web/src\views\LineshotPage.tsx:141:      formData.set('level', String(levelRef.current));
web/src\views\LineshotPage.tsx:142:      const response = await fetch('/api/lineshot', { method: 'POST', body: formData });
web/src\views\LineshotPage.tsx:191:          <div className="lineshot__form">
web/src\server\lineshotScore.test.ts:28:// request.formData()의 반환값뿐이므로 그 메서드만 직접 주입한다.
web/src\server\lineshotScore.test.ts:33:  const formData = new FormData();
web/src\server\lineshotScore.test.ts:34:  if (parts.audio) formData.set('audio', parts.audio, 'lineshot.webm');
web/src\server\lineshotScore.test.ts:35:  if (parts.line != null) formData.set('line', parts.line);
web/src\server\lineshotScore.test.ts:36:  if (parts.level != null) formData.set('level', parts.level);
web/src\server\lineshotScore.test.ts:39:    headers: new Headers({ 'content-type': opts.contentType ?? 'multipart/form-data; boundary=test' }),
web/src\server\lineshotScore.test.ts:40:    formData: async () => formData,
web/src\app\api\send-result\route.ts:46:    const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;
web/src\app\api\send-result\route.ts:47:    if (sheetsUrl) {
web/src\app\api\send-result\route.ts:49:        await fetch(sheetsUrl, {
web/src\app\api\send-result\route.ts:54:      } catch (sheetErr) {
web/src\app\api\send-result\route.ts:55:        console.warn('Sheets log failed', sheetErr);
web/src\lib\surveySubmit.ts:15:const FORM_RESPONSE_URL =
web/src\lib\surveySubmit.ts:16:  'https://docs.google.com/forms/d/e/1FAIpQLSfjQ1QWaNJDs50Ljjoxtw9u6nE3lr2tttQjSDqQra3tFGFfFQ/formResponse';
web/src\lib\surveySubmit.ts:21:    if (item.kind === 'section') continue;
web/src\lib\surveySubmit.ts:26:    if (item.kind === 'radio') {
web/src\lib\surveySubmit.ts:30:    } else if (item.kind === 'checkbox') {
web/src\lib\surveySubmit.ts:55:  await fetch(FORM_RESPONSE_URL, {
web/src\lib\surveySubmit.ts:58:    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
web/src\server\formReview.ts:3:import { phoneSchema } from './formApply';
web/src\server\formReview.ts:4:import { sendToSheetsWebhook } from './sheetsWebhook';
web/src\server\formReview.ts:7: * formReview — 알파 테스트 사용 후 리뷰(acttub.com/form/review) 접수.
web/src\server\formReview.ts:18: * payload kind='tester-review'로 Apps Script가 리뷰 탭에 분기 적재한다(컬럼은 v2 스키마).
web/src\server\formReview.ts:19: * formApply와 같은 SHEETS_WEBHOOK_URL 재사용.
web/src\server\formReview.ts:53:  kind: 'tester-review';
web/src\server\formReview.ts:72:  webhookUrl?: string;
web/src\server\formReview.ts:97:  const webhookUrl = options.webhookUrl ?? process.env.SHEETS_WEBHOOK_URL;
web/src\server\formReview.ts:98:  if (!webhookUrl) {
web/src\server\formReview.ts:104:    kind: 'tester-review',
web/src\server\formReview.ts:122:    ok = await send(webhookUrl, payload);
web/src\server\formReview.test.ts:2:import { handleFormReview, type FormReviewPayload } from './formReview';
web/src\server\formReview.test.ts:8:  return { method: 'POST', url: '/api/form/review', body };
web/src\server\formReview.test.ts:25:  it('유효 입력을 webhook으로 보내고 200 ok 를 반환한다 (전화번호 숫자만 정규화, reuse는 Y/N)', async () => {
web/src\server\formReview.test.ts:31:      webhookUrl: 'https://example.test/hook',
web/src\server\formReview.test.ts:40:      kind: 'tester-review',
web/src\server\formReview.test.ts:63:      { webhookUrl: 'https://example.test/hook', send, now: () => FIXED },
web/src\server\formReview.test.ts:77:      webhookUrl: 'https://example.test/hook',
web/src\server\formReview.test.ts:90:      webhookUrl: 'https://example.test/hook',
web/src\server\formReview.test.ts:101:      webhookUrl: 'https://example.test/hook',
web/src\server\formReview.test.ts:111:      webhookUrl: 'https://example.test/hook',
web/src\server\formReview.test.ts:121:      webhookUrl: 'https://example.test/hook',
web/src\server\formReview.test.ts:131:      webhookUrl: 'https://example.test/hook',
web/src\server\formReview.test.ts:142:      webhookUrl: 'https://example.test/hook',
web/src\server\formReview.test.ts:151:  it('webhook URL 이 없으면 500 을 반환한다', async () => {
web/src\server\formReview.test.ts:152:    const result = await handleFormReview(input(validBody), { webhookUrl: '' });
web/src\server\formReview.test.ts:158:      webhookUrl: 'https://example.test/hook',
web/src\server\formReview.test.ts:166:      webhookUrl: 'https://example.test/hook',
web/src\server\formApply.ts:3:import { sendToSheetsWebhook } from './sheetsWebhook';
web/src\server\formApply.ts:6: * formApply — 알파 테스터 신청(acttub.com/form) 접수.
web/src\server\formApply.ts:9: * 7문항 + 개인정보 동의를 검증해 구글시트(Apps Script 웹앱 webhook)로 한 행
web/src\server\formApply.ts:10: * append 한다. webhook URL은 기존 환경변수 SHEETS_WEBHOOK_URL 재사용(send-result와
web/src\server\formApply.ts:11: * 공유). payload의 kind='tester-apply'로 Apps Script가 다른 탭에 분기 적재한다.
web/src\server\formApply.ts:32:  .transform((v) => v.replace(/\D/g, ''))
web/src\server\formApply.ts:50:  kind: 'tester-apply';
web/src\server\formApply.ts:63:  webhookUrl?: string;
web/src\server\formApply.ts:88:  const webhookUrl = options.webhookUrl ?? process.env.SHEETS_WEBHOOK_URL;
web/src\server\formApply.ts:89:  if (!webhookUrl) {
web/src\server\formApply.ts:95:    kind: 'tester-apply',
web/src\server\formApply.ts:110:    ok = await send(webhookUrl, payload);
web/src\server\testCoachAnalyze.ts:11:import { formatTime, type CoachFeedback } from '../coach/evaluation';
web/src\server\testCoachAnalyze.ts:209:      start: formatTime(input.startTime),
web/src\server\testCoachAnalyze.ts:210:      end: formatTime(input.endTime),
web/src\server\testCoachAnalyze.ts:567:    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
web/src\server\testCoachAnalyze.ts:571:    const formData = await request.formData();
web/src\server\testCoachAnalyze.ts:572:    const video = formData.get('video');
web/src\server\testCoachAnalyze.ts:582:    const fileName = textFromForm(formData.get('fileName')) || video.name || '연기 연습 영상';
web/src\server\testCoachAnalyze.ts:583:    const category = textFromForm(formData.get('category'));
web/src\server\testCoachAnalyze.ts:584:    const intent = textFromForm(formData.get('intent'));
web/src\server\testCoachAnalyze.ts:585:    const expectedLine = textFromForm(formData.get('expectedLine'));
web/src\server\testCoachAnalyze.ts:586:    const startTime = numberFromForm(formData.get('startTime'));
web/src\server\testCoachAnalyze.ts:587:    const endTime = numberFromForm(formData.get('endTime'));
web/src\server\playData.ts:18:  form: PlayForm;
web/src\server\playData.ts:29:    genre: '비극', era: '고전', country: '영국', form: '연극', tone: '비장', cast: '앙상블',
web/src\server\playData.ts:40:    genre: '비극', era: '고전', country: '영국', form: '연극', tone: '서정', cast: '앙상블',
web/src\server\playData.ts:51:    genre: '비극', era: '고전', country: '영국', form: '연극', tone: '비장', cast: '앙상블',
web/src\server\playData.ts:62:    genre: '비극', era: '고전', country: '영국', form: '연극', tone: '비장', cast: '앙상블',
web/src\server\playData.ts:73:    genre: '희극', era: '고전', country: '영국', form: '연극', tone: '유쾌', cast: '앙상블',
web/src\server\playData.ts:84:    genre: '비극', era: '고전', country: '그리스', form: '연극', tone: '비장', cast: '앙상블',
web/src\server\playData.ts:95:    genre: '드라마', era: '근대', country: '러시아', form: '연극', tone: '서정', cast: '앙상블',
web/src\server\playData.ts:106:    genre: '드라마', era: '근대', country: '노르웨이', form: '연극', tone: '비장', cast: '소규모',
web/src\server\playData.ts:117:    genre: '부조리극', era: '현대', country: '아일랜드', form: '연극', tone: '냉소', cast: '2인극',
web/src\server\playData.ts:128:    genre: '드라마', era: '현대', country: '미국', form: '연극', tone: '비장', cast: '소규모',
web/src\server\playData.ts:139:    genre: '드라마', era: '현대', country: '한국', form: '뮤지컬', tone: '따뜻함', cast: '앙상블',
web/src\server\playData.ts:150:    genre: '판타지', era: '현대', country: '미국', form: '뮤지컬', tone: '유쾌', cast: '앙상블',
web/src\server\playData.ts:161:    genre: '드라마', era: '근대', country: '프랑스', form: '뮤지컬', tone: '비장', cast: '앙상블',
web/src\server\playData.ts:172:    genre: '로맨스', era: '근대', country: '영국', form: '뮤지컬', tone: '서정', cast: '앙상블',
web/src\server\playData.ts:183:    genre: '풍자', era: '현대', country: '미국', form: '뮤지컬', tone: '냉소', cast: '앙상블',
web/src\server\playData.ts:194:    genre: '로맨스', era: '현대', country: '한국', form: '뮤지컬', tone: '유쾌', cast: '소규모',
web/src\server\playScore.ts:80:    { key: 'form', label: '형식', state: exactState(guess.form, answer.form), value: guess.form },
web/src\server\playGame.ts:30:  { key: 'form', label: '형식' },
web/src\server\lineshotScore.ts:102:    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
web/src\server\lineshotScore.ts:106:    const formData = await request.formData();
web/src\server\lineshotScore.ts:107:    const audio = formData.get('audio');
web/src\server\lineshotScore.ts:118:    const line = textFromForm(formData.get('line')).slice(0, 200);
web/src\server\lineshotScore.ts:124:    const rawLevel = formData.get('level');
web/src\server\sheetsWebhook.ts:2: * sheetsWebhook — 구글시트(Apps Script 웹앱) webhook 공용 전송기.
web/src\server\sheetsWebhook.ts:4: * /form(신청)·/form/review(리뷰)가 같은 SHEETS_WEBHOOK_URL 로 payload 를 보내고,
web/src\server\sheetsWebhook.ts:5: * Apps Script 가 payload.kind 로 탭을 분기해 append 한다.
web/src\app\api\form\route.ts:1:import { handleFormApply } from '@/server/formApply';
web/src\app\api\form\review\route.ts:1:import { handleFormReview } from '@/server/formReview';

 succeeded in 2086ms:
.\CLAUDE.md:102:This repository disables Vercel Git auto-deploy through `git.deploymentEnabled: false` in `web/vercel.json` and the legacy project-root `vercel.json` files.
.\CLAUDE.md:113:- `web/.vercel/`
.\acttub-landing\vercel.json:2:  "$schema": "https://openapi.vercel.sh/vercel.json",
.\acttub-landing\vercel.json:4:    "deploymentEnabled": false
.\coach\vercel.json:2:  "$schema": "https://openapi.vercel.sh/vercel.json",
.\coach\vercel.json:4:    "deploymentEnabled": false
.\arch\vercel.json:2:  "$schema": "https://openapi.vercel.sh/vercel.json",
.\arch\vercel.json:4:    "deploymentEnabled": false
.\comm\vercel.json:2:  "$schema": "https://openapi.vercel.sh/vercel.json",
.\comm\vercel.json:4:    "deploymentEnabled": false
.\ACTI\vercel.json:2:  "$schema": "https://openapi.vercel.sh/vercel.json",
.\ACTI\vercel.json:4:    "deploymentEnabled": false
.\excer\vercel.json:2:  "$schema": "https://openapi.vercel.sh/vercel.json",
.\excer\vercel.json:4:    "deploymentEnabled": false
.\web\vercel.json:2:  "$schema": "https://openapi.vercel.sh/vercel.json",
.\web\vercel.json:6:    "deploymentEnabled": false
.\ACTI\outputs\stage-3\test-report.md:136:1. **Vercel SPA rewrites** — `vercel.json` 또는 `_redirects` (모든 경로 → `index.html`)
.\ACTI\outputs\stage-3\build-config.md:10:| `app/vercel.json` | Vercel SPA rewrites + assets/og 캐시 헤더 |
.\ACTI\outputs\stage-3\build-config.md:17:## 2. Vercel rewrites (`vercel.json`)
.\ACTI\outputs\stage-3\build-config.md:133:- Vercel/Netlify SPA rewrites 미적용 → `vercel.json` / `_redirects` 배포 확인
.\arch\src\components\upload-form.tsx:5:import { upload } from "@vercel/blob/client";
.\web\src\views\QuickTestPage.tsx:4:import { upload as uploadBlob } from '@vercel/blob/client';
.\web\src\views\CoachPage.tsx:4:import { upload as uploadBlob } from '@vercel/blob/client';
.\web\src\views\ArchivePage.tsx:6:import { upload } from '@vercel/blob/client';
.\arch\README.md:98:npm i -g vercel
.\arch\README.md:99:vercel link
.\arch\README.md:100:vercel env pull .env.local
.\arch\README.md:101:vercel              # preview
.\arch\README.md:102:vercel --prod       # production
.\arch\next.config.ts:7:      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
.\arch\src\app\api\videos\[id]\route.ts:4:import { del } from "@vercel/blob";
.\web\src\server\testCoachAnalyze.ts:10:import { del } from '@vercel/blob';
.\web\src\server\testCoachAnalyze.ts:454:  if (!parsedUrl.hostname.endsWith('.vercel-storage.com')) {
.\arch\src\app\api\upload\route.ts:2:import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
.\web\src\server\storage.test.ts:33:      blobUrl: 'https://blob.vercel-storage.com/archive/test.mp4',
.\web\src\server\storage.test.ts:58:      blobUrl: 'https://blob.vercel-storage.com/archive/upload.mp4',
.\web\src\server\storage.test.ts:70:      blobUrl: 'https://blob.vercel-storage.com/archive/upload.mp4',
.\web\src\server\postgresStorage.test.ts:52:      blobUrl: 'https://blob.vercel-storage.com/archive/video.mp4',
.\web\src\server\coachSession.ts:2:import { copy, del } from '@vercel/blob';
.\web\src\server\coachSession.test.ts:37:      url: 'https://store.public.blob.vercel-storage.com/coach-sessions/abc.webm',
.\web\src\server\coachSession.test.ts:44:      baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
.\web\src\server\coachSession.test.ts:51:    expect(fromUrl).toBe('https://store.public.blob.vercel-storage.com/coach/123-scene.webm');
.\web\src\server\coachSession.test.ts:57:        blobUrl: 'https://store.public.blob.vercel-storage.com/coach-sessions/abc.webm',
.\web\src\server\coachSession.test.ts:79:      url: 'https://store.public.blob.vercel-storage.com/coach-sessions/orphan.webm',
.\web\src\server\coachSession.test.ts:88:        baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
.\web\src\server\coachSession.test.ts:93:      expect(deleteBlob).toHaveBeenCalledWith('https://store.public.blob.vercel-storage.com/coach-sessions/orphan.webm');
.\web\src\server\coachSession.test.ts:107:        baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
.\web\src\server\coachSecondAnalyze.ts:10:import { del } from '@vercel/blob';
.\web\src\server\coachSecondAnalyze.ts:480:  if (!parsedUrl.hostname.endsWith('.vercel-storage.com')) {
.\web\src\server\coachSecondAnalyze.test.ts:25:      videoUrl: 'https://blob.vercel-storage.com/coach/scene.webm',
.\web\src\server\coachSecondAnalyze.test.ts:46:      url: 'https://store.public.blob.vercel-storage.com/coach-sessions/kept.webm',
.\web\src\server\coachBlobCleanup.ts:1:import { del, list, type ListBlobResultBlob } from '@vercel/blob';
.\web\src\server\coachBlobCleanup.test.ts:7:    url: `https://blob.vercel-storage.com/${pathname}`,
.\web\src\server\coachBlobCleanup.test.ts:8:    downloadUrl: `https://blob.vercel-storage.com/${pathname}?download=1`,
.\web\src\server\coachAnalyze.ts:6:import { del } from '@vercel/blob';
.\web\src\server\coachAnalyze.ts:221:  if (!parsedUrl.hostname.endsWith('.vercel-storage.com')) {
.\web\src\server\coachAnalyze.test.ts:13:  url: 'https://store.public.blob.vercel-storage.com/coach-sessions/kept.webm',
.\web\src\server\coachAnalyze.test.ts:116:        videoUrl: 'https://blob.vercel-storage.com/coach/scene.webm',
.\web\src\server\coachAnalyze.test.ts:133:    expect(fetcher).toHaveBeenCalledWith(new URL('https://blob.vercel-storage.com/coach/scene.webm'));
.\web\src\server\coachAnalyze.test.ts:192:          videoUrl: 'https://blob.vercel-storage.com/coach/huge.webm',
.\web\src\server\blobUpload.ts:1:import type { GenerateClientTokenOptions } from '@vercel/blob/client';
.\excer\next.config.ts:7:      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
.\excer\CLAUDE.md:48:`.env.local.example` 참조. acttub 의 Vercel 프로젝트에서 `vercel env pull` 로 동기화 가능.
.\arch\scripts\verify-blob.mjs:1:import { put, del } from "@vercel/blob";
.\ACTI\README.md:45:`vercel.json` 동봉. GitHub 연동만 하면 됩니다.
.\ACTI\README.md:47:- Build Command: `pnpm build` (vercel.json 명시)
.\web\src\app\unifiedRoutes.test.ts:98:  'ACTI/vercel.json',
.\web\src\app\unifiedRoutes.test.ts:99:  'acttub-landing/vercel.json',
.\web\src\app\unifiedRoutes.test.ts:100:  'arch/vercel.json',
.\web\src\app\unifiedRoutes.test.ts:101:  'coach/vercel.json',
.\web\src\app\unifiedRoutes.test.ts:102:  'comm/vercel.json',
.\web\src\app\unifiedRoutes.test.ts:103:  'excer/vercel.json',
.\web\src\app\unifiedRoutes.test.ts:104:  'thea/vercel.json',
.\web\src\app\unifiedRoutes.test.ts:126:  return execFileSync('git', ['ls-files', '*package.json', '*vercel.json'], {
.\web\src\app\unifiedRoutes.test.ts:198:      'web/vercel.json',
.\web\src\app\unifiedRoutes.test.ts:203:        $schema: 'https://openapi.vercel.sh/vercel.json',
.\web\src\app\unifiedRoutes.test.ts:205:          deploymentEnabled: false,
.\web\src\app\unifiedRoutes.test.ts:331:    const vercel = readJson<{
.\web\src\app\unifiedRoutes.test.ts:338:    }>(path.join(root, 'vercel.json'));
.\web\src\app\unifiedRoutes.test.ts:340:    expect(vercel.framework).toBe('nextjs');
.\web\src\app\unifiedRoutes.test.ts:341:    expect(vercel.buildCommand).toBe('pnpm build');
.\web\src\app\unifiedRoutes.test.ts:342:    expect(vercel.outputDirectory).toBeUndefined();
.\web\src\app\unifiedRoutes.test.ts:343:    expect(vercel.rewrites).toBeUndefined();
.\web\src\app\unifiedRoutes.test.ts:344:    expect(vercel.routes).toBeUndefined();
.\web\src\app\unifiedRoutes.test.ts:345:    expect(vercel.crons).toContainEqual({
.\web\src\app\unifiedRoutes.test.ts:386:    expect(rootIgnore).toMatch(/(^|\n)\.vercel\/?(\n|$)/);
.\web\src\app\unifiedRoutes.test.ts:389:    expect(webIgnore).toMatch(/(^|\n)\.vercel\/?(\n|$)/);
.\excer\outputs\stage-2\design-handoff.md:53:| `@vercel/blob` | 사진 저장 |
.\excer\outputs\stage-2\design-handoff.md:74:    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
.\excer\outputs\stage-2\design-handoff.md:211:> `vercel env pull` 로 로컬 동기화. acttub 조직의 다른 앱과 Clerk 키는 공유, DB·Blob 은 excer 전용.
.\excer\outputs\stage-1\prd.md:232:| 설정 파일 | `vercel.ts` (`@vercel/config`) | 신규 표준 |
.\web\AGENTS.md:39:Do not commit `.env.local`, `.vercel/`, `node_modules/`, or `.next/`. Keep UI unchanged unless explicitly requested.
.\README.md:98:- `vercel.json` sets `git.deploymentEnabled` to `false` for `web` and the legacy project roots so Vercel Git auto-deploy does not create extra deployments.
.\README.md:113:corepack pnpm dlx vercel env pull .env.local
.\README.md:122:Do not commit `.env.local`, `.vercel/`, `.next/`, or `node_modules/`.
.\pnpm-lock.yaml:19:      '@vercel/blob':
.\pnpm-lock.yaml:1259:  '@vercel/blob@2.4.0':
.\pnpm-lock.yaml:1455:      '@vercel/postgres': '>=0.8.0'
.\pnpm-lock.yaml:1500:      '@vercel/postgres':
.\pnpm-lock.yaml:3255:  '@vercel/blob@2.4.0':
.\thea\vercel.json:2:  "$schema": "https://openapi.vercel.sh/vercel.json",
.\thea\vercel.json:4:    "deploymentEnabled": false
.\web\outputs\stage-3\test-report.md:136:1. **Vercel SPA rewrites** — `vercel.json` 또는 `_redirects` (모든 경로 → `index.html`)
.\web\outputs\stage-3\build-config.md:10:| `app/vercel.json` | Vercel SPA rewrites + assets/og 캐시 헤더 |
.\web\outputs\stage-3\build-config.md:17:## 2. Vercel rewrites (`vercel.json`)
.\web\outputs\stage-3\build-config.md:133:- Vercel/Netlify SPA rewrites 미적용 → `vercel.json` / `_redirects` 배포 확인
.\web\package.json:21:    "@vercel/blob": "^2.4.0",
.\web\src\app\api\archive\upload\route.ts:1:import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
.\web\src\app\api\coach\upload\route.ts:1:import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

codex
확인 결과 기존 Sheets webhook은 `/form`과 `/form/review`에서 이미 `kind`로 분기하고 있습니다. UTM/라우팅/배포 판단을 위해 해당 구현부만 더 읽겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'web\\src\\lib\\analytics.ts'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'web\\AGENTS.md'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'web\\src\\server\\formReview.ts'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'web\\src\\server\\formApply.ts'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg --files web/src/app | rg "(''^|/|'"\\\\)(waitlist|ig|form|coach|test)(/|\\\\|\\.)\"" in C:\soma\repos\acttub
 succeeded in 1055ms:
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

 succeeded in 1022ms:
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

 succeeded in 1074ms:
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

 succeeded in 1041ms:
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

 succeeded in 1183ms:
web/src/app\coach\page.tsx
web/src/app\test\page.tsx
web/src/app\form\review\page.tsx
web/src/app\form\page.tsx
web/src/app\api\test\analyze\route.ts
web/src/app\api\form\route.ts
web/src/app\api\form\review\route.ts
web/src/app\api\coach\upload\route.ts
web/src/app\api\coach\analyze\route.ts
web/src/app\api\coach\cleanup\route.ts

codex
`/waitlist`와 `/ig` 라우트는 현재 `web/src/app`에 없고, `/form` 계열만 있습니다. UTM 최소 수정의 테스트 영향 범위를 보려고 analytics 테스트를 확인합니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'web\\src\\lib\\analytics.test.ts'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'web\\src\\app\\api\\form\\route.ts'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'web\\src\\app\\form\\page.tsx'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'web\\src\\views\\FormPage.tsx'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'web\\src\\server\\sheetsWebhook.ts'" in C:\soma\repos\acttub
 succeeded in 797ms:
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

 succeeded in 805ms:
import { handleFormApply } from '@/server/formApply';
import { jsonRequestInput, jsonResponse } from '@/server/nextApi';

export async function POST(request: Request) {
  return jsonResponse(await handleFormApply(await jsonRequestInput(request)));
}

 succeeded in 817ms:
import FormPage from '../../views/FormPage';

export const metadata = {
  title: '?뚰뙆 ?뚯뒪???좎껌 쨌 acttub',
  description:
    '?곌린 ?곸긽 1媛쒕줈 AI ?곌린 ?쇰뱶諛깆쓣 ?뚯뒪?명빐蹂댁꽭?? ?ъ슜 ??由щ럭瑜??④린硫?而ㅽ뵾 湲고봽?곗퐯???쒕┰?덈떎.',
};

export default function Page() {
  return <FormPage />;
}

 succeeded in 832ms:
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

 succeeded in 862ms:
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

codex
정적 샘플 리포트는 `/coach` 제품면을 건드리지 않는다는 전제이므로, 실제 결과 카드가 공유 컴포넌트인지와 mock 데이터 주입 비용만 보겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'web\\src\\coach\\evaluation.ts'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$lines = Get-Content -LiteralPath '"'web\\src\\views\\QuickTestPage.tsx'; "'$lines[0..520]' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Content -LiteralPath 'web\\src\\views\\coachFeedbackCards.tsx'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command '$lines = Get-Content -LiteralPath '"'web\\src\\views\\CoachPage.tsx'; "'$lines[0..520]' in C:\soma\repos\acttub
 exited 124 in 15049ms:
 exited 124 in 15048ms:
 exited 124 in 15201ms:
 exited 124 in 15053ms:
2026-07-03T08:23:47.179087Z ERROR codex_core::tools::router: error=Exit code: 124
Wall time: 15.2 seconds
Output:
command timed out after 15201 milliseconds

2026-07-03T08:23:48.738234Z ERROR codex_core::tools::router: error=Exit code: 124
Wall time: 15.1 seconds
Output:
command timed out after 15053 milliseconds

2026-07-03T08:23:48.738309Z ERROR codex_core::tools::router: error=Exit code: 124
Wall time: 15 seconds
Output:
command timed out after 15048 milliseconds

2026-07-03T08:23:48.738337Z ERROR codex_core::tools::router: error=Exit code: 124
Wall time: 15 seconds
Output:
command timed out after 15049 milliseconds

codex
방금 큰 파일 병렬 읽기가 시간 초과됐습니다. 필요한 라인만 `rg`로 좁혀서 다시 보겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'rg -n "export type CoachFeedback|type CoachFeedback|export function|function .*Block|OverallBlock|StrengthBlock|FocusBlock|NextStepBlock|feedback|analysis" web/src/coach/evaluation.ts web/src/views/coachFeedbackCards.tsx web/src/views/CoachPage.tsx web/src/views/QuickTestPage.tsx -S' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "rg -n \"useState<.*feedback|setFeedback|result_shown|OverallBlock|StrengthBlock|FocusBlock|NextStepBlock|feedback\\?\\.\" web/src/views/CoachPage.tsx web/src/views/QuickTestPage.tsx -S" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command "Get-Item 'web\\src\\views\\coachFeedbackCards.tsx','web\\src\\coach\\evaluation.ts','web\\src\\views\\CoachPage.tsx','web\\src\\views\\QuickTestPage.tsx' | Select-Object FullName,Length" in C:\soma\repos\acttub
2026-07-03T08:24:50.004136Z ERROR codex_core::tools::router: error=Exit code: 124
Wall time: 10.3 seconds
Output:
command timed out after 10253 milliseconds

 exited 124 in 10253ms:
2026-07-03T08:24:50.009556Z ERROR codex_core::tools::router: error=Exit code: 124
Wall time: 10.2 seconds
Output:
command timed out after 10177 milliseconds

 exited 124 in 10177ms:
2026-07-03T08:24:50.541234Z ERROR codex_core::tools::router: error=Exit code: 124
Wall time: 10.2 seconds
Output:
command timed out after 10156 milliseconds

 exited 124 in 10156ms:
codex
파일 읽기 명령이 비정상적으로 지연되고 있어 프로세스 상태를 확인한 뒤 계속하겠습니다. 구현 변경은 없고, 판단에 필요한 최소 확인만 진행합니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -Command 'Get-Process | Where-Object { $_.ProcessName -match '"'rg|powershell|node' } | Select-Object ProcessName,Id,CPU,StartTime" in C:\soma\repos\acttub
 succeeded in 1482ms:

ProcessName    Id       CPU StartTime            
-----------    --       --- ---------            
node         2184     9.375 2026-07-02 오후 7:45:40
node         4328       5.5 2026-07-03 오후 4:36:21
node        11480   9.34375 2026-07-02 오후 7:45:40
node        13188   1.09375 2026-07-03 오후 4:36:20
node        13636   5.71875 2026-07-03 오후 4:36:21
node        16612 16.609375 2026-07-02 오후 7:45:39
node        18656    2.4375 2026-07-02 오후 7:45:49
node        19040  1.296875 2026-07-03 오후 5:22:21
node        19460 62.953125 2026-07-03 오후 4:42:26
node        19780  4.078125 2026-07-03 오후 5:22:18
node        20500    1.1875 2026-07-03 오후 5:22:21
node        21112  3.546875 2026-07-02 오후 7:45:49
node        21116   4.28125 2026-07-03 오후 5:22:18
node        22892   1.34375 2026-07-03 오후 4:36:27
node        23096     0.125 2026-07-03 오후 5:22:14
node        23572   1.53125 2026-07-03 오후 4:42:35
node        23784    1.6875 2026-07-03 오후 4:42:35
node        23972  0.140625 2026-07-03 오후 5:22:15
node        25164   1.59375 2026-07-03 오후 4:36:27
node        25308   7.59375 2026-07-03 오후 4:42:27
node        25796  0.359375 2026-07-03 오후 5:25:01
node        26172  0.296875 2026-07-03 오후 5:22:14
node        26448    7.3125 2026-07-03 오후 4:42:27
powershell   3336  2.703125 2026-07-03 오후 5:22:36
powershell   9972    0.9375 2026-07-03 오후 5:25:00
powershell  10996    5.9375 2026-07-02 오후 7:49:08
powershell  19864  18.28125 2026-07-02 오후 7:45:11



codex
이전 읽기 명령은 남은 PowerShell 세션 영향 가능성이 있습니다. 파일 전체가 아니라 앞부분/검색 결과만 긴 timeout으로 다시 읽어 판단하겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "Get-Content -LiteralPath 'web\\src\\views\\coachFeedbackCards.tsx' -TotalCount 240" in C:\soma\repos\acttub
 succeeded in 1299ms:
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

codex
카드 컴포넌트는 이미 `CoachFeedback` 하위 타입을 받아 렌더링하는 형태라 샘플 카드 자체는 재사용 가능합니다. 다만 랜딩 hero에 “실제 코치카드 1건”을 박으려면 라우트/뷰/CSS/테스트 추가는 피할 수 없습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "Get-Content -LiteralPath 'web\\src\\coach\\evaluation.ts' -TotalCount 260" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command '$lines = Get-Content -LiteralPath '"'web\\src\\views\\CoachPage.tsx'; "'$lines[30..90]; $lines[230..500]' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command '$lines = Get-Content -LiteralPath '"'web\\src\\views\\QuickTestPage.tsx'; "'$lines[20..80]; $lines[450..520]' in C:\soma\repos\acttub
 succeeded in 1794ms:

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

 succeeded in 1370ms:

// 鍮좊Ⅸ ?뚯뒪?????蹂맞룹쓽?꾨? 以鍮꾪븷 ?꾩슂 ?놁씠, ?뺥빐吏??????留덈뵒瑜??곌린?섎㈃ 諛붾줈 遺꾩꽍?쒕떎.
// 遺꾩꽍 ?붿쭊? /coach 硫붿씤怨??숈씪(?꾨옒 ANALYZE_URL = v2). ???룹쓽?꾨쭔 ?쒖뒪?쒖씠 誘몃━ 諛뺤븘 ?몄텧?쒕떎.
// ?????留덈뵒 泥댄뿕?대씪 ?곹븳??吏㏐쾶 ??v2???곸긽??Gemini 6~7?뙿룻븿????꾩븘??300s??湲??곸긽? 鍮꾩슜쨌?ㅽ뙣 ?꾪뿕.
const MAX_DURATION_SECONDS = 120;

// ?뺥빐吏????+ ?곹솴???쒖뒪?쒖씠 ?쒖떆. ?곹솴쨌??щ뒗 遺꾩꽍 ?꾨＼?꾪듃濡??④퍡 蹂대궡怨?intent ?꾨뱶???⑹묠),
// ??щ뒗 expectedLine?쇰줈??蹂대궡 "?뺥빐吏???щ? ?ㅼ젣濡??덈뒗吏" 寃뚯씠?몄뿉 ?대떎.
const SAMPLE_LINES: { line: string; situation: string }[] = [
  {
    line: '???ъ떎???덊븳??怨꾩냽 ?섍퀬 ?띠뿀??留먯씠 ?덉뿀??',
    situation: '?ㅻ옯?숈븞 留덉쓬???댁븘??怨좊갚?? ?곕쭣 癒밴퀬 ?곷? ?욎뿉??泥섏쓬 爰쇰궡???쒓컙.',
  },
  {
    line: '愿쒖갖?? ???뺣쭚 愿쒖갖?쇰땲源? 洹몃윴 ?쒖젙 ?섏? 留?',
    situation: '?띿? 臾대꼫議뚯?留? 嫄깆젙?섎뒗 ?곷? ?욎뿉???꾨Т?뉗? ?딆? 泥??덉떖?쒗궎?ㅻ뒗 ?쒓컙.',
  },
  {
    line: '???댁젣??留먰빐? ?닿? ?쇰쭏??湲곕떎?몃뒗吏 ?뚭린????',
    situation: '?ㅻ옒 湲곕떎由??앹뿉 ?섑????곷??먭쾶, ?쒖슫?④낵 諛섍?????ㅼ꽎???곕쑉由щ뒗 ?쒓컙.',
  },
];

// 鍮좊Ⅸ ?뚯뒪?몃뒗 ??以???ъ씠誘濡?遺꾨쪟瑜?臾살? ?딄퀬 '???濡?怨좎젙?쒕떎(ACTING_CATEGORIES 以??섎굹).
const CATEGORY = '???;

// /test ?꾩슜 遺꾩꽍 ?뚯씠?꾨씪??testcoach) ??/coach? 遺꾨━??蹂듭궗???낅┰ ?붿쭊.
// ???룹긽??二쇱엯, ????????먯젙 ??/test 怨좎쑀 ?숈옉??/coach ?곹뼢 ?놁씠 ?ｊ린 ?꾪븿.
const ANALYZE_URL = '/api/test/analyze';

function fieldHintClass() {
  return 'text-xs font-medium text-muted';
}

export default function QuickTestPage() {
  const [mode, setMode] = useState<InputMode>('record');
  const [lineIndex, setLineIndex] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState('');
  // ??????⑥? ?ㅽ뙣媛 ?꾨땲???ъ슂泥??덈궡 ??鍮④컙 error? 遺꾨━??以묐┰ ??
  const [notice, setNotice] = useState('');
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

  const current = SAMPLE_LINES[lineIndex];

  const selectedVideoLabel = videoFile
    ? `${videoFile.name} 쨌 ${(videoFile.size / 1024 / 1024).toFixed(1)}MB`
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

      <aside className="flex flex-col gap-5">
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
            ??щ? ?곌린???곸긽???щ━怨?遺꾩꽍?섎㈃, ?섎맂 ?쒓컙 ?섎굹? ?대쾲?????섎굹 怨좎튌 ?? 洹몃━怨??ㅼ쓬 ??嫄몄쓬??移대뱶濡??쒖떆?⑸땲??
          </section>
        )}
      </aside>
    </div>
  );
}

 succeeded in 1816ms:
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

codex
배포 경로는 `vercel.json`뿐 아니라 GitHub Actions가 실제 제약입니다. main push 생산 배포와 PR preview 여부를 워크플로우에서 확인하겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command 'rg -n "vercel|production|preview|main|pull_request|push|deploy|VERCEL|prebuilt" .github scripts web/package.json package.json -S' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command 'rg --files .github scripts | rg "(yml|yaml|mjs|json)$"' in C:\soma\repos\acttub
 succeeded in 492ms:
package.json:19:    "db:push": "corepack pnpm --dir web db:push",
package.json:23:    "verify:preview": "corepack pnpm verify && PROD_VERIFY_PORT=4010 corepack pnpm verify:prod-runtime",
package.json:24:    "pr:preview": "node scripts/create-preview-pr.mjs"
web/package.json:12:    "db:push": "drizzle-kit push",
web/package.json:21:    "@vercel/blob": "^2.4.0",
scripts\create-preview-pr.mjs:5:const bodyFile = 'docs/nextjs-preview-pr-body.md';
scripts\create-preview-pr.mjs:6:const browserUrl = 'https://github.com/acttub/acttub/compare/main...experiment/nextjs-preview?quick_pull=1';
scripts\create-preview-pr.mjs:11:  'main',
scripts\create-preview-pr.mjs:13:  'experiment/nextjs-preview',
scripts\smoke-routes.mjs:96:    if (!ok) failures.push(`${label} ${path} returned ${response.status}`);
scripts\smoke-routes.mjs:98:      failures.push(`${label} ${path} did not include expected content: ${expectedContent}`);
scripts\smoke-routes.mjs:101:      failures.push(`${label} ${path} included forbidden content: ${leakedContent}`);
scripts\smoke-routes.mjs:104:      failures.push(`${label} ${path} did not return application/json content-type`);
scripts\smoke-routes.mjs:107:      failures.push(`${label} ${path} did not return valid JSON`);
scripts\smoke-routes.mjs:112:    failures.push(`${label} ${path} failed: ${message}`);
.github\workflows\verify.yml:1:name: verify and deploy
.github\workflows\verify.yml:4:  pull_request:
.github\workflows\verify.yml:5:  push:
.github\workflows\verify.yml:7:      - main
.github\workflows\verify.yml:34:  deploy-preview:
.github\workflows\verify.yml:35:    name: deploy preview
.github\workflows\verify.yml:37:    if: github.event_name == 'pull_request'
.github\workflows\verify.yml:40:    environment: preview
.github\workflows\verify.yml:42:      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
.github\workflows\verify.yml:43:      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
.github\workflows\verify.yml:60:      - name: Pull Vercel preview environment
.github\workflows\verify.yml:61:        run: corepack pnpm dlx vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
.github\workflows\verify.yml:63:      - name: Build Vercel preview output
.github\workflows\verify.yml:64:        run: corepack pnpm dlx vercel build --token=${{ secrets.VERCEL_TOKEN }}
.github\workflows\verify.yml:66:      - name: Deploy Vercel preview
.github\workflows\verify.yml:67:        run: corepack pnpm dlx vercel deploy --prebuilt --archive=tgz --token=${{ secrets.VERCEL_TOKEN }}
.github\workflows\verify.yml:69:  deploy-production:
.github\workflows\verify.yml:70:    name: deploy production
.github\workflows\verify.yml:72:    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
.github\workflows\verify.yml:75:    environment: production
.github\workflows\verify.yml:77:      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
.github\workflows\verify.yml:78:      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
.github\workflows\verify.yml:95:      - name: Pull Vercel production environment
.github\workflows\verify.yml:96:        run: corepack pnpm dlx vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
.github\workflows\verify.yml:98:      - name: Build Vercel production output
.github\workflows\verify.yml:99:        run: corepack pnpm dlx vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
.github\workflows\verify.yml:101:      - name: Deploy Vercel production
.github\workflows\verify.yml:102:        run: corepack pnpm dlx vercel deploy --prebuilt --prod --archive=tgz --token=${{ secrets.VERCEL_TOKEN }}

2026-07-03T08:25:27.442716Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:

 exited 1 in 649ms:
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "Get-Content -LiteralPath 'web\\vercel.json'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "Get-Content -LiteralPath 'package.json'" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "Get-Content -LiteralPath 'web\\package.json'" in C:\soma\repos\acttub
 succeeded in 484ms:
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "git": {
    "deploymentEnabled": false
  },
  "crons": [
    {
      "path": "/api/coach/cleanup",
      "schedule": "0 3 * * *"
    }
  ]
}

 succeeded in 494ms:
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

 succeeded in 437ms:
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

codex
워크플로우상 PR preview도 존재하지만 production은 main push만입니다. 빠른 카피 반복이 “운영 반영” 기준이면 코드 merge 없이는 불가능에 가깝습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "Get-Content -LiteralPath '.github\\workflows\\verify.yml'" in C:\soma\repos\acttub
 succeeded in 345ms:
name: verify and deploy

on:
  pull_request:
  push:
    branches:
      - main

concurrency:
  group: verify-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    name: verify
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Enable Corepack
        run: corepack enable

      - name: Verify
        run: corepack pnpm verify

  deploy-preview:
    name: deploy preview
    needs: verify
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    environment: preview
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Enable Corepack
        run: corepack enable

      - name: Install dependencies
        run: corepack pnpm install --frozen-lockfile

      - name: Pull Vercel preview environment
        run: corepack pnpm dlx vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Vercel preview output
        run: corepack pnpm dlx vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Vercel preview
        run: corepack pnpm dlx vercel deploy --prebuilt --archive=tgz --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    name: deploy production
    needs: verify
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    environment: production
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Enable Corepack
        run: corepack enable

      - name: Install dependencies
        run: corepack pnpm install --frozen-lockfile

      - name: Pull Vercel production environment
        run: corepack pnpm dlx vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Vercel production output
        run: corepack pnpm dlx vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Vercel production
        run: corepack pnpm dlx vercel deploy --prebuilt --prod --archive=tgz --token=${{ secrets.VERCEL_TOKEN }}

codex
IG 인앱웹뷰 검증은 코드로 대체할 수 없는 게이트입니다. `/coach`가 실제 `getUserMedia`, `MediaRecorder`, `video/*` file input, Vercel Blob upload를 쓰는지 확인해 절차를 구체화하겠습니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "rg -n \"getUserMedia|MediaRecorder|accept=\\\"video/\\*\\\"|uploadBlob|handleUploadUrl|FormData|fetch\\(analyzeUrl|startRecording|setSelectedVideo|onVideoMetadata|analyzeVideo\" web/src/views/CoachPage.tsx -S" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "rg -n \"getUserMedia|MediaRecorder|accept=\\\"video/\\*\\\"|uploadBlob|handleUploadUrl|FormData|fetch\\(ANALYZE_URL|startRecording|setSelectedVideo|onVideoMetadata|analyzeVideo\" web/src/views/QuickTestPage.tsx -S" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command 'rg -n "trackPageView|initAnalytics|usePathname|useSearchParams|pathname|searchParams" web/src -S' in C:\soma\repos\acttub
2026-07-03T08:25:42.963868Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:
rg: regex parse error:
    (?:getUserMedia|MediaRecorder|accept=\)
    ^
error: unclosed group

 exited 1 in 491ms:
rg: regex parse error:
    (?:getUserMedia|MediaRecorder|accept=\)
    ^
error: unclosed group

2026-07-03T08:25:42.982232Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:
rg: regex parse error:
    (?:getUserMedia|MediaRecorder|accept=\)
    ^
error: unclosed group

 exited 1 in 502ms:
rg: regex parse error:
    (?:getUserMedia|MediaRecorder|accept=\)
    ^
error: unclosed group

 succeeded in 599ms:
web/src\views\ArchivePage.tsx:43:  searchParams?: Record<string, string | string[] | undefined>;
web/src\views\ArchivePage.tsx:46:export default function ArchivePage({ view = 'home', videoId, searchParams = {} }: ArchivePageProps) {
web/src\views\ArchivePage.tsx:48:  if (view === 'search') content = <ArchiveSearch searchParams={searchParams} />;
web/src\views\ArchivePage.tsx:135:function ArchiveSearch({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
web/src\views\ArchivePage.tsx:136:  const query = firstValue(searchParams.q)?.trim() || null;
web/src\views\ArchivePage.tsx:137:  const tag = firstValue(searchParams.tag)?.trim() || null;
web/src\views\ArchivePage.tsx:320:          blobPathname: blob?.pathname,
web/src\views\CommunityPage.tsx:45:  searchParams?: SearchParamsLike;
web/src\views\CommunityPage.tsx:48:export default function CommunityPage({ view = 'home', postId, searchParams = {} }: CommunityPageProps) {
web/src\views\CommunityPage.tsx:50:  if (view === 'search') content = <CommunitySearch searchParams={searchParams} />;
web/src\views\CommunityPage.tsx:51:  else if (view === 'new') content = <CommunityNew searchParams={searchParams} />;
web/src\views\CommunityPage.tsx:52:  else if (view === 'me') content = <CommunityMe searchParams={searchParams} />;
web/src\views\CommunityPage.tsx:54:  else content = <CommunityHome searchParams={searchParams} />;
web/src\views\CommunityPage.tsx:104:function CommunityHome({ searchParams }: { searchParams: SearchParamsLike }) {
web/src\views\CommunityPage.tsx:105:  const params = parseCommunityParams(searchParams);
web/src\views\CommunityPage.tsx:166:function CommunitySearch({ searchParams }: { searchParams: SearchParamsLike }) {
web/src\views\CommunityPage.tsx:167:  const query = (firstValue(searchParams.q) ?? '').trim();
web/src\views\CommunityPage.tsx:195:function CommunityNew({ searchParams }: { searchParams: SearchParamsLike }) {
web/src\views\CommunityPage.tsx:197:  const board = firstValue(searchParams.board) ?? 'free';
web/src\views\CommunityPage.tsx:214:function CommunityMe({ searchParams }: { searchParams: SearchParamsLike }) {
web/src\views\CommunityPage.tsx:215:  const tab = firstValue(searchParams.tab) ?? 'posts';
web/src\lib\analytics.ts:42:export function initAnalytics(): void {
web/src\lib\analytics.ts:69:  if (!window.gtag) initAnalytics();
web/src\lib\analytics.ts:74: * 입력 path를 안전한 pathname으로 정규화.
web/src\lib\analytics.ts:85:    return url.pathname;
web/src\lib\analytics.ts:92: * 클라이언트 페이지뷰 추적. `path`는 `/`로 시작하는 pathname을 기대하지만,
web/src\lib\analytics.ts:95:export function trackPageView(path: string): void {
web/src\lib\analytics.test.ts:27:    const { initAnalytics, trackPageView } = await loadAnalytics();
web/src\lib\analytics.test.ts:29:    initAnalytics();
web/src\lib\analytics.test.ts:30:    trackPageView('/ACTI/quiz');
web/src\lib\analytics.test.ts:38:    const { initAnalytics } = await loadAnalytics();
web/src\lib\analytics.test.ts:40:    initAnalytics();
web/src\lib\analytics.test.ts:41:    initAnalytics();
web/src\lib\analytics.test.ts:50:    const { initAnalytics } = await loadAnalytics();
web/src\lib\analytics.test.ts:52:    initAnalytics();
web/src\lib\analytics.test.ts:60:    const { initAnalytics, trackPageView } = await loadAnalytics();
web/src\lib\analytics.test.ts:62:    initAnalytics();
web/src\lib\analytics.test.ts:63:    trackPageView('/ACTI/result/MINB');
web/src\lib\analytics.test.ts:77:    const { initAnalytics, trackPageView } = await loadAnalytics();
web/src\lib\analytics.test.ts:79:    initAnalytics();
web/src\lib\analytics.test.ts:80:    trackPageView('/ACTI/result/MINB?email=user@example.com#private');
web/src\lib\analytics.test.ts:94:    const { initAnalytics, trackResultAction } = await loadAnalytics();
web/src\lib\analytics.test.ts:96:    initAnalytics();
web/src\lib\analytics.test.ts:110:  it('lazy-initializes when trackPageView is called before initAnalytics', async () => {
web/src\lib\analytics.test.ts:112:    const { trackPageView } = await loadAnalytics();
web/src\lib\analytics.test.ts:114:    trackPageView('/ACTI/quiz');
web/src\lib\analytics.test.ts:126:    const { initAnalytics, trackCoachStep } = await loadAnalytics();
web/src\lib\analytics.test.ts:128:    initAnalytics();
web/src\lib\analytics.test.ts:141:    const { initAnalytics, trackCoachStep } = await loadAnalytics();
web/src\lib\analytics.test.ts:143:    initAnalytics();
web/src\lib\analytics.test.ts:161:  it('lazy-initializes when trackResultAction is called before initAnalytics', async () => {
web/src\lib\analytics.test.ts:177:    const { initAnalytics, trackPageView } = await loadAnalytics();
web/src\lib\analytics.test.ts:179:    initAnalytics();
web/src\lib\analytics.test.ts:180:    trackPageView('ACTI/quiz');
web/src\lib\analytics.test.ts:194:    const { initAnalytics, trackPageView } = await loadAnalytics();
web/src\lib\analytics.test.ts:196:    initAnalytics();
web/src\lib\analytics.test.ts:197:    trackPageView('//evil.com/leak');
web/src\lib\analytics.test.ts:205:    const { initAnalytics, trackPageView } = await loadAnalytics();
web/src\lib\analytics.test.ts:207:    initAnalytics();
web/src\lib\analytics.test.ts:208:    trackPageView('http://evil.com/leak');
web/src\lib\analytics.test.ts:209:    trackPageView('https://evil.com/leak');
web/src\lib\analytics.test.ts:217:    const { initAnalytics, trackPageView } = await loadAnalytics();
web/src\lib\analytics.test.ts:219:    initAnalytics();
web/src\lib\analytics.test.ts:220:    trackPageView('/ACTI/quiz');
web/src\lib\analytics.test.ts:221:    trackPageView('/ACTI/quiz');
web/src\lib\analytics.test.ts:222:    trackPageView('/ACTI/result/MINB');
web/src\lib\analytics.test.ts:223:    trackPageView('/ACTI/result/MINB');
web/src\views\ExcerPage.tsx:4:import { usePathname, useRouter } from 'next/navigation';
web/src\views\ExcerPage.tsx:50:  searchParams?: Record<string, string | string[] | undefined>;
web/src\views\ExcerPage.tsx:66:export default function ExcerPage({ searchParams = {} }: ExcerPageProps) {
web/src\views\ExcerPage.tsx:67:  const pathname = usePathname() ?? '/excer';
web/src\views\ExcerPage.tsx:73:    () => parseExcerSearchParams(searchParams),
web/src\views\ExcerPage.tsx:74:    [searchParams],
web/src\views\ExcerPage.tsx:84:    router.replace(query ? `${pathname}?${query}` : pathname);
web/src\views\ExcerPage.test.tsx:12:  usePathname: () => '/excer',
web/src\excer\excerFilters.ts:92:  const searchParams = new URLSearchParams();
web/src\excer\excerFilters.ts:95:    searchParams.set(key, String(value));
web/src\excer\excerFilters.ts:97:  return searchParams.toString();
web/src\views\SurveyPage.test.tsx:19:  usePathname: () => '/ACTI/survey',
web/src\views\SurveyPage.test.tsx:20:  useSearchParams: () => new URLSearchParams(),
web/src\app\Providers.tsx:4:import { usePathname } from 'next/navigation';
web/src\app\Providers.tsx:5:import { initAnalytics, trackPageView } from '../lib/analytics';
web/src\app\Providers.tsx:8:  const pathname = usePathname();
web/src\app\Providers.tsx:11:    initAnalytics();
web/src\app\Providers.tsx:15:    if (pathname) trackPageView(pathname);
web/src\app\Providers.tsx:16:  }, [pathname]);
web/src\server\schema.ts:62:  blobPathname: text('blob_pathname'),
web/src\server\schema.ts:89:  blobPathname: text('blob_pathname'),
web/src\server\playGame.ts:100:    const requested = url.searchParams.get('date') ?? undefined;
web/src\app\community\write\page.tsx:4:  searchParams?: Promise<Record<string, string | string[] | undefined>>;
web/src\app\community\write\page.tsx:12:export default async function Page({ searchParams }: PageProps) {
web/src\app\community\write\page.tsx:13:  return <CommunityPage view="new" searchParams={(await searchParams) ?? {}} />;
web/src\app\excer\rooms\[slug]\page.tsx:8:  searchParams?: Promise<Record<string, string | string[] | undefined>>;
web/src\app\excer\rooms\[slug]\page.tsx:37:export default async function Page({ params, searchParams }: PageProps) {
web/src\app\excer\rooms\[slug]\page.tsx:45:  return <ExcerPage searchParams={(await searchParams) ?? {}} />;
web/src\server\coachSession.test.ts:38:      pathname: 'coach-sessions/abc.webm',
web/src\server\coachSession.test.ts:80:      pathname: 'coach-sessions/orphan.webm',
web/src\app\excer\page.tsx:4:  searchParams?: Promise<Record<string, string | string[] | undefined>>;
web/src\app\excer\page.tsx:12:export default async function Page({ searchParams }: PageProps) {
web/src\app\excer\page.tsx:13:  return <ExcerPage searchParams={(await searchParams) ?? {}} />;
web/src\server\coachAnalyze.test.ts:14:  pathname: 'coach-sessions/kept.webm',
web/src\server\coachSecondAnalyze.test.ts:47:      pathname: 'coach-sessions/kept.webm',
web/src\app\community\search\page.tsx:4:  searchParams?: Promise<Record<string, string | string[] | undefined>>;
web/src\app\community\search\page.tsx:12:export default async function Page({ searchParams }: PageProps) {
web/src\app\community\search\page.tsx:13:  return <CommunityPage view="search" searchParams={(await searchParams) ?? {}} />;
web/src\server\blobUpload.ts:16:  pathname: string,
web/src\server\blobUpload.ts:32:    tokenPayload: JSON.stringify({ pathname }),
web/src\server\blobUpload.ts:36:export async function createCoachUploadTokenOptions(pathname: string) {
web/src\server\blobUpload.ts:40:    tokenPayload: JSON.stringify({ pathname }),
web/src\server\coachBlobCleanup.ts:57:      deletedPathnames.push(...expired.map((blob) => blob.pathname));
web/src\server\blobUpload.test.ts:13:    expect(options.tokenPayload).toBe(JSON.stringify({ pathname: 'archive/sample.mp4' }));
web/src\server\coachBlobCleanup.test.ts:5:function blob(pathname: string, uploadedAt: Date) {
web/src\server\coachBlobCleanup.test.ts:7:    url: `https://blob.vercel-storage.com/${pathname}`,
web/src\server\coachBlobCleanup.test.ts:8:    downloadUrl: `https://blob.vercel-storage.com/${pathname}?download=1`,
web/src\server\coachBlobCleanup.test.ts:9:    pathname,
web/src\server\coachBlobCleanup.test.ts:12:    etag: pathname,
web/src\server\apiCore.ts:88:    const id = url.searchParams.get('id');
web/src\server\apiCore.ts:95:      q: url.searchParams.get('q'),
web/src\server\apiCore.ts:96:      board: url.searchParams.get('board'),
web/src\server\apiCore.ts:97:      sort: url.searchParams.get('sort'),
web/src\server\apiCore.ts:119:    const postId = url.searchParams.get('postId');
web/src\server\apiCore.ts:149:    const id = url.searchParams.get('id');
web/src\server\apiCore.ts:155:      query: url.searchParams.get('q'),
web/src\server\apiCore.ts:156:      tag: url.searchParams.get('tag'),
web/src\server\apiCore.ts:157:      includePrivate: url.searchParams.get('includePrivate') === '1',
web/src\server\coachSession.ts:66:      retainedPathname = copied.pathname;
web/src\app\community\page.tsx:4:  searchParams?: Promise<Record<string, string | string[] | undefined>>;
web/src\app\community\page.tsx:12:export default async function Page({ searchParams }: PageProps) {
web/src\app\community\page.tsx:13:  return <CommunityPage searchParams={(await searchParams) ?? {}} />;
web/src\app\archive\search\page.tsx:4:  searchParams?: Promise<Record<string, string | string[] | undefined>>;
web/src\app\archive\search\page.tsx:12:export default async function Page({ searchParams }: PageProps) {
web/src\app\archive\search\page.tsx:13:  return <ArchivePage view="search" searchParams={(await searchParams) ?? {}} />;
web/src\app\community\new\page.tsx:4:  searchParams?: Promise<Record<string, string | string[] | undefined>>;
web/src\app\community\new\page.tsx:12:export default async function Page({ searchParams }: PageProps) {
web/src\app\community\new\page.tsx:13:  return <CommunityPage view="new" searchParams={(await searchParams) ?? {}} />;
web/src\app\community\me\page.tsx:4:  searchParams?: Promise<Record<string, string | string[] | undefined>>;
web/src\app\community\me\page.tsx:12:export default async function Page({ searchParams }: PageProps) {
web/src\app\community\me\page.tsx:13:  return <CommunityPage view="me" searchParams={(await searchParams) ?? {}} />;

codex
analytics Provider가 `usePathname()`만 넘기는 것도 확인됐습니다. 즉 UTM 손실은 `normalizePath` 이전에 이미 발생합니다.
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "rg -n \"getUserMedia|MediaRecorder|uploadBlob|handleUploadUrl|fetch\\(analyzeUrl|startRecording|setSelectedVideo|onVideoMetadata|analyzeVideo\" web/src/views/CoachPage.tsx -S" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "rg -n \"type=\\\"file\\\"|accept=\\\"video/\\*\\\"|playsInline|controls\" web/src/views/CoachPage.tsx -S" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "Get-Content -LiteralPath 'web\\src\\app\\Providers.tsx'" in C:\soma\repos\acttub
 succeeded in 436ms:
4:import { upload as uploadBlob } from '@vercel/blob/client';
63:  const recorderRef = useRef<MediaRecorder | null>(null);
95:  function setSelectedVideo(file: File) {
112:  function onVideoMetadata() {
125:  async function startRecording() {
131:      if (!navigator.mediaDevices?.getUserMedia) {
136:      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
137:      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
140:      const recorder = new MediaRecorder(stream, { mimeType });
156:        setSelectedVideo(file);
192:  async function analyzeVideo() {
208:      const blob = await uploadBlob(`coach/${Date.now()}-${videoFile.name}`, videoFile, {
210:        handleUploadUrl: '/api/coach/upload',
216:      const response = await fetch(analyzeUrl, {
307:                    if (file) setSelectedVideo(file);
327:                    onClick={startRecording}
399:                onLoadedMetadata={onVideoMetadata}
436:            onClick={analyzeVideo}

2026-07-03T08:25:50.440292Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.4 seconds
Output:
rg: regex parse error:
    (?:type=\)
    ^
error: unclosed group

 exited 1 in 436ms:
rg: regex parse error:
    (?:type=\)
    ^
error: unclosed group

 succeeded in 470ms:
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

exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "rg -n -F 'type=\"file\"' web/src/views/CoachPage.tsx" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "rg -n -F 'accept=\"video/*\"' web/src/views/CoachPage.tsx" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "rg -n -F 'playsInline' web/src/views/CoachPage.tsx" in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command "rg -n -F 'controls' web/src/views/CoachPage.tsx" in C:\soma\repos\acttub
2026-07-03T08:25:58.993307Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:

 exited 1 in 504ms:
2026-07-03T08:25:59.014801Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.5 seconds
Output:

 exited 1 in 503ms:
 succeeded in 506ms:
398:                playsInline

 succeeded in 527ms:
397:                controls

exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command '$lines = Get-Content -LiteralPath '"'web\\src\\views\\CoachPage.tsx'; "'$lines[90..225]' in C:\soma\repos\acttub
exec
"C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -Command '$lines = Get-Content -LiteralPath '"'web\\src\\views\\CoachPage.tsx'; "'$lines[295..312]' in C:\soma\repos\acttub
 succeeded in 395ms:

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

 succeeded in 371ms:
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

codex
확정: R1 방향은 코드 관점에서 타당. 단, “dev 0시간”과 “운영 카피 빠른 반복”은 그대로는 불가.

1. 착수 전 게이트: `GO with gates`
- IG 인앱웹뷰 검증은 critical. `/coach`가 `getUserMedia`, `MediaRecorder`, `video/*` file input, Vercel Blob upload를 직접 쓰므로 iOS/Android Instagram 인앱에서 실기기 확인 후 시작.
- UTM 최소 수정은 `normalizePath`를 건드리지 말고 `page_location`만 현재 URL 기반으로 보강하는 쪽이 저위험. 단 raw full URL은 PII 위험이 있어 `utm_*` allowlist가 맞음. 현재 Provider는 `usePathname()`만 넘겨 UTM이 이미 소실됨.
- waitlist는 `/api/form` 유지 + `kind` union 추가 + `/form?kind=ig-waitlist` 또는 `/ig` hidden kind 전달이면 최소. 새 API 0 가능. 별도 짧은 waitlist 폼을 만들면 현재 `/api/form` 필수 7문항 스키마와 안 맞아 범위 증가.

2. 정적 샘플 리포트 프리뷰: `dev 0시간과 양립 불가`
- Coach 제품면은 안 건드리고 기존 `coachFeedbackCards` 재사용 가능.
- 그래도 `/ig` route, landing view/CSS, static `CoachFeedback` fixture, CTA, smoke/test는 net-new.
- “0시간”은 샘플 프리뷰를 빼거나 외부 이미지/캡처를 수동으로 쓰는 경우에만 성립.

3. prebuilt 배포와 빠른 반복: `운영 기준 불가`
- PR preview는 가능하지만 production은 `main` push + Actions `vercel deploy --prebuilt --prod`만 가능.
- Vercel Git auto deploy도 `deploymentEnabled:false`.
- 대안: 첫 배포에 `?v=a|b|c` 같은 사전 정의 카피/CTA variant를 심고 Instagram 링크만 바꾸기. 완전 자유 카피 반복은 CMS/Edge Config/외부 link-in-bio 같은 운영 도구가 필요하고, 이는 새 의존성이다.

잔여 위험:
- critical: IG 인앱에서 카메라 권한/녹화/파일 업로드가 막히면 랜딩 전환 자체가 무력화.
- major: raw full URL GA 전송 시 개인정보 query 유출 가능, 샘플 프리뷰를 “dev 0”으로 잡으면 일정 왜곡.
- minor: Sheets Apps Script가 새 `kind`를 실제로 분기 저장하는지 별도 확인 필요.

검증: 코드 조회로 확인. 코드 변경 없음, 테스트 실행 없음.
tokens used
139,161

```

## Concise summary

Provider completed successfully. Review the raw output for details.

## Action items

- Review the response and extract decisions you want to apply.
- Capture follow-up implementation tasks if needed.
