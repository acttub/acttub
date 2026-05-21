# Survey Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a required `/survey` page between quiz completion and result viewing.

**Architecture:** Store the computed result code with the existing `setMyTypeCode()` flow, navigate to `/survey`, collect required single-choice survey answers locally, then navigate to `/result/:code`. Survey question copy is isolated in `src/content/survey.ts` for later replacement.

**Tech Stack:** React, TypeScript, React Router, Vitest, Testing Library, Vite.

---

## File Structure

- Create `app/src/content/survey.ts`: Defines the placeholder survey question data and exported types.
- Create `app/src/pages/SurveyPage.tsx`: Renders the survey gate, validates completion, and navigates to the stored result.
- Create `app/src/pages/SurveyPage.css`: Styles the new page using existing design tokens and button/card patterns.
- Create `app/src/content/survey.test.ts`: Verifies survey content invariants.
- Create `app/src/pages/SurveyPage.test.tsx`: Verifies route guard and required-answer behavior.
- Modify `app/src/pages/QuizPage.tsx`: Change final navigation from `/result/:code` to `/survey`.
- Modify `app/src/App.tsx`: Add the `/survey` route.

### Task 1: Survey Content Module

**Files:**
- Create: `app/src/content/survey.ts`
- Test: `app/src/content/survey.test.ts`

- [ ] **Step 1: Write the failing content invariant test**

```ts
import { SURVEY_QUESTIONS } from './survey';

describe('content.survey invariants', () => {
  it('defines required single-choice questions with usable options', () => {
    expect(SURVEY_QUESTIONS.length).toBeGreaterThan(0);

    for (const question of SURVEY_QUESTIONS) {
      expect(question.id.trim()).toHaveLength(question.id.length);
      expect(question.label.trim().length).toBeGreaterThan(0);
      expect(question.required).toBe(true);
      expect(question.options.length).toBeGreaterThanOrEqual(2);

      const optionValues = new Set(question.options.map((option) => option.value));
      expect(optionValues.size).toBe(question.options.length);

      for (const option of question.options) {
        expect(option.value.trim().length).toBeGreaterThan(0);
        expect(option.label.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/content/survey.test.ts`

Expected: FAIL because `src/content/survey.ts` does not exist.

- [ ] **Step 3: Add the survey content module**

```ts
export type SurveyOption = {
  value: string;
  label: string;
};

export type SurveyQuestion = {
  id: string;
  label: string;
  required: true;
  options: SurveyOption[];
};

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'actor-status',
    label: '본인을 가장 잘 설명하는 항목은?',
    required: true,
    options: [
      { value: 'active-actor', label: '현역 배우 (최근 6개월 내 오디션·촬영·공연 1회 이상)' },
      { value: 'learning-acting', label: '연기 학습 중 (학원·워크숍·스터디)' },
      { value: 'resting', label: '휴식 혹은 비활동' },
      { value: 'not-actor', label: '배우가 아님' },
    ],
  },
  {
    id: 'acting-duration',
    label: '연기 활동 기간',
    required: true,
    options: [
      { value: 'under-1-year', label: '1년 미만' },
      { value: '1-to-3-years', label: '1-3년' },
      { value: '3-to-7-years', label: '3-7년' },
      { value: 'over-7-years', label: '7년 이상' },
    ],
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/content/survey.test.ts`

Expected: PASS.

### Task 2: Survey Page Behavior

**Files:**
- Create: `app/src/pages/SurveyPage.tsx`
- Create: `app/src/pages/SurveyPage.test.tsx`
- Modify: `app/src/App.tsx`

- [ ] **Step 1: Write the failing page tests**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SurveyPage from './SurveyPage';
import { SURVEY_QUESTIONS } from '../content/survey';
import { setMyTypeCode } from '../lib/storage';

function renderSurvey(initialEntries = ['/survey']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/quiz" element={<div>quiz page</div>} />
        <Route path="/result/:code" element={<div>result page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('SurveyPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('redirects to the quiz when there is no stored result code', async () => {
    renderSurvey();

    expect(await screen.findByText('quiz page')).toBeInTheDocument();
  });

  it('requires every survey question before showing the result', async () => {
    setMyTypeCode('MINB');
    renderSurvey();

    const submit = screen.getByRole('button', { name: '결과 보기' });
    expect(submit).toBeDisabled();

    for (const question of SURVEY_QUESTIONS) {
      fireEvent.click(screen.getByLabelText(question.options[0].label));
    }

    expect(submit).toBeEnabled();
    fireEvent.click(submit);
    expect(await screen.findByText('result page')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/pages/SurveyPage.test.tsx`

Expected: FAIL because `SurveyPage.tsx` does not exist.

- [ ] **Step 3: Implement the page and route**

Add `/survey` to `App.tsx`:

```tsx
import SurveyPage from './pages/SurveyPage';

<Route path="/survey" element={<SurveyPage />} />
```

Create `SurveyPage.tsx`:

```tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';
import { SURVEY_QUESTIONS } from '../content/survey';
import { getMyTypeCode } from '../lib/storage';
import './SurveyPage.css';

export default function SurveyPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const resultCode = useMemo(() => getMyTypeCode(), []);

  useEffect(() => {
    if (!resultCode) {
      navigate('/quiz', { replace: true });
    }
  }, [navigate, resultCode]);

  const isComplete = SURVEY_QUESTIONS.every((question) => answers[question.id]);

  const handleShowResult = () => {
    if (!resultCode || !isComplete) return;
    navigate(`/result/${resultCode}`, { replace: true });
  };

  if (!resultCode) return null;

  return (
    <main className="page page-enter page-survey">
      <div className="page-survey__container">
        <header className="page-survey__header">
          <p className="page-survey__eyebrow">결과 보기 전 마지막 단계</p>
          <h1 className="page-survey__title">짧은 설문에 답해 주세요</h1>
          <p className="page-survey__description">
            답변을 마치면 바로 ACTI 결과를 볼 수 있어요.
          </p>
        </header>

        <div className="page-survey__questions">
          {SURVEY_QUESTIONS.map((question) => (
            <fieldset className="page-survey__question" key={question.id}>
              <legend className="page-survey__legend">
                {question.label}
                {question.required && <span aria-label="필수">*</span>}
              </legend>
              <div className="page-survey__options">
                {question.options.map((option) => (
                  <label className="page-survey__option" key={option.value}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: option.value,
                        }))
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <PrimaryButton size="xl" fullWidth disabled={!isComplete} onClick={handleShowResult}>
          결과 보기
          <ArrowRight size={20} aria-hidden="true" />
        </PrimaryButton>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/pages/SurveyPage.test.tsx`

Expected: PASS.

### Task 3: Quiz Completion Navigation

**Files:**
- Modify: `app/src/pages/QuizPage.tsx`
- Test: existing app tests plus manual browser check

- [ ] **Step 1: Change final quiz navigation**

Replace:

```ts
navigate(`/result/${code}`, { replace: true });
```

With:

```ts
navigate('/survey', { replace: true });
```

- [ ] **Step 2: Run targeted tests**

Run: `pnpm test src/pages/SurveyPage.test.tsx src/content/survey.test.ts`

Expected: PASS.

### Task 4: Styling and Full Verification

**Files:**
- Create: `app/src/pages/SurveyPage.css`
- Verify: browser at `http://localhost:5173/survey`

- [ ] **Step 1: Add responsive survey styles**

Create CSS using the existing page background, container max width, white surfaces, radio option cards, and sticky-safe bottom spacing.

- [ ] **Step 2: Run full checks**

Run:

```bash
pnpm test
pnpm lint
pnpm build
```

Expected: all commands pass.

- [ ] **Step 3: Browser check**

Run `pnpm dev`, open the app, complete the quiz, confirm `/survey` appears, answer every survey question, and confirm the app navigates to `/result/:code`.
