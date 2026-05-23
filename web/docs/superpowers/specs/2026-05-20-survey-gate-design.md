# Survey Gate Design

## Goal

Insert a required `/survey` page between the 14-question quiz and the result page. The survey URL must not expose or require the result code.

## User Flow

1. The user completes all 14 quiz questions.
2. The app computes the ACTI type code and stores it with the existing localStorage helper.
3. The app navigates to `/survey`.
4. The user answers the required survey questions.
5. The app reads the stored type code and navigates to `/result/:code`.
6. If `/survey` is opened without a stored type code, the user is sent back to `/quiz`.

## Architecture

The route is implemented as a normal React page in `app/src/pages/SurveyPage.tsx`. Survey content lives in `app/src/content/survey.ts` so another worker can replace the placeholder questions without editing page logic.

The first version does not submit answers to a backend. It only gates access to the current user's result. This keeps the change small and avoids inventing a storage contract before the final survey questions are known.

## Form Behavior

Survey questions are single-choice and required. The submit button is disabled until every required question has an answer. Submitting with all required answers navigates to the stored result.

Example placeholder questions:

- 본인을 가장 잘 설명하는 항목은?
- 연기 활동 기간

## Error Handling

If localStorage is unavailable or no type code is found, `/survey` redirects to `/quiz`. Invalid result codes are already handled by the existing result page.

## Testing

Add focused tests for survey content invariants and the survey page gate behavior:

- Required survey questions have IDs, labels, and at least two options.
- The submit button is initially disabled.
- Selecting all required answers enables the submit button.
- A user without a stored result is redirected back to `/quiz`.

