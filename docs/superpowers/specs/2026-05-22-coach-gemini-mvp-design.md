# Coach Gemini MVP Design

## Objective

Create `coach`, a new independent Acttub app for an MVP acting-practice feedback experience. Users can upload an existing rehearsal video or record one in the browser, choose the segment to analyze, describe the acting intent, and receive Gemini-powered feedback. The MVP intentionally excludes login, persistence, and history.

## Scope

The app supports:

- Video file upload and browser recording.
- Video preview with start and end time controls for the analysis segment.
- File name, acting category, and intent/goal inputs.
- Gemini video analysis through a server API route.
- Feedback sections for weak points, intent-aligned points, and practice recommendations.
- A local memo field shown after feedback.

The app does not support saving videos, saving feedback, user accounts, or server-side clip re-encoding.

## Architecture

`coach/` will be a Next.js app in the existing pnpm workspace. The client handles video capture, preview, segment selection, form state, loading state, and result rendering. The server route `coach/src/app/api/analyze/route.ts` receives multipart form data, uploads the video to Gemini Files API using `GEMINI_API_KEY`, waits until the file is active, requests structured feedback, and returns normalized JSON.

The API key stays server-side only. Vercel deployment requires a new project with root directory `coach` and the `GEMINI_API_KEY` environment variable.

## User Flow

1. Choose a video file or record directly from camera/microphone.
2. Preview the video and set the start/end times for analysis.
3. Enter file name, category, and acting intent.
4. Submit for analysis.
5. Review Gemini feedback in three sections.
6. Add a memo locally if desired.

## Evaluation Model

The prompt asks Gemini to evaluate the selected segment against fixed criteria:

- Emotional clarity.
- Line delivery and audibility.
- Eye focus and breathing.
- Physical use and posture.
- Rhythm, pacing, and pause control.
- Fit with the user's stated intent.

The response must be JSON with:

- `weaknesses`: concrete issues to improve.
- `alignedMoments`: choices that matched the intent.
- `practiceRecommendations`: next rehearsal drills.
- `summary`: concise overall read.

## Error Handling

The UI shows clear errors for missing video, invalid time ranges, missing intent, unavailable recorder permissions, missing `GEMINI_API_KEY`, Gemini upload failures, and malformed model responses. Failed analysis does not clear the user's current video or form inputs.

## Verification

Implementation is complete when:

- `coach` is included in `pnpm-workspace.yaml`.
- Root scripts include `local:coach` and `prod:coach`.
- `corepack pnpm --dir coach lint` passes.
- `corepack pnpm --dir coach build` passes without requiring `GEMINI_API_KEY`.
- The app can run locally and show upload, record, trim, analysis, feedback, and memo states.
