# Coach Gemini MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `coach`, an independent Next.js MVP app that records or uploads acting rehearsal video and returns Gemini-powered practice feedback without persistence.

**Architecture:** `coach` is a new pnpm workspace app. The browser owns capture, preview, segment controls, form state, and result rendering. A Next API route uploads the video to Gemini Files API, waits for processing, requests structured JSON feedback, and returns normalized data.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, `@google/genai`, pnpm workspace.

---

## File Structure

- Create `coach/package.json`: app scripts and dependencies.
- Create `coach/next.config.ts`: Next config for standalone deployment.
- Create `coach/eslint.config.mjs`, `coach/tsconfig.json`, `coach/postcss.config.mjs`, `coach/next-env.d.ts`: standard Next tooling.
- Create `coach/src/app/layout.tsx`, `coach/src/app/page.tsx`, `coach/src/app/globals.css`: app shell and UI.
- Create `coach/src/app/api/analyze/route.ts`: Gemini upload and analysis endpoint.
- Create `coach/src/lib/evaluation.ts`: categories, prompt builder, response normalization.
- Modify `pnpm-workspace.yaml`: include `coach`.
- Modify root `package.json`: add `local:coach`, `prod:coach`, and include `prod:coach` in `verify`.

## Tasks

### Task 1: Workspace Scaffold

- [ ] Create `coach` as a Next.js workspace package with scripts for `dev`, `build`, `start`, and `lint`.
- [ ] Add `coach` to `pnpm-workspace.yaml`.
- [ ] Add root scripts:
  - `local:coach`: `corepack pnpm --dir coach dev --port 3004`
  - `prod:coach`: `corepack pnpm --dir coach build`
- [ ] Install and lock dependencies with pnpm.
- [ ] Commit scaffold.

### Task 2: Evaluation Library

- [ ] Add category constants and result types in `coach/src/lib/evaluation.ts`.
- [ ] Add `buildEvaluationPrompt(input)` that includes category, intent, file name, and selected time range.
- [ ] Add `parseGeminiFeedback(text)` that extracts JSON from raw Gemini output and validates required arrays.
- [ ] Add focused tests if a local test runner is added; otherwise verify through TypeScript build.
- [ ] Commit evaluation helpers.

### Task 3: Gemini Analyze API

- [ ] Implement `POST /api/analyze` multipart handling for `video`, `fileName`, `category`, `intent`, `startTime`, and `endTime`.
- [ ] Return `500` with a clear error when `GEMINI_API_KEY` is missing at request time.
- [ ] Write the uploaded video to a temporary file because Gemini Files API expects a path in Node.js.
- [ ] Upload with `@google/genai`, poll until file state is `ACTIVE`, call `generateContent`, normalize JSON, and delete the temporary file.
- [ ] Ensure build succeeds without `GEMINI_API_KEY`.
- [ ] Commit API route.

### Task 4: Coach UI

- [ ] Build the main page with upload and record modes.
- [ ] Use `MediaRecorder` for direct camera/microphone recording.
- [ ] Show video preview and start/end controls.
- [ ] Validate missing video, invalid segment, missing intent, and recording permission errors.
- [ ] Submit `FormData` to `/api/analyze`.
- [ ] Render summary, weak points, aligned moments, practice recommendations, and memo field.
- [ ] Commit UI.

### Task 5: Verification

- [ ] Run `corepack pnpm --dir coach lint`.
- [ ] Run `corepack pnpm --dir coach build`.
- [ ] Run root `corepack pnpm verify`.
- [ ] Start `corepack pnpm local:coach` and confirm the page loads at `http://localhost:3004`.
- [ ] Commit any final fixes.
