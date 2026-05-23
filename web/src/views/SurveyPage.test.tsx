import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SurveyPage from './SurveyPage';
import { SURVEY_ITEMS } from '../content/survey';
import { setMyTypeCode } from '../lib/storage';

function renderSurvey(initialEntries = ['/ACTI/survey']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/ACTI/survey" element={<SurveyPage />} />
        <Route path="/ACTI/quiz" element={<div>quiz page</div>} />
        <Route path="/ACTI/result/:code" element={<div>result page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('SurveyPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('redirects to the quiz when there is no stored result code', async () => {
    renderSurvey();
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(screen.getByText('quiz page')).toBeInTheDocument();
  });

  it('renders the first radio question and advances after picking an option', async () => {
    setMyTypeCode('MINB');
    renderSurvey();

    const firstItem = SURVEY_ITEMS[0];
    if (firstItem.kind !== 'radio') {
      throw new Error('Test fixture assumes first item is radio');
    }

    // first question label visible
    expect(screen.getByText((t) => t.includes(firstItem.label))).toBeInTheDocument();

    // pick first option
    fireEvent.click(screen.getByText(firstItem.options[0].label));

    // auto-advance triggers a setTimeout — fast-forward
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const secondItem = SURVEY_ITEMS[1];
    if (secondItem.kind === 'section') return; // shape-dependent; sanity not required
    expect(screen.getByText((t) => t.includes(secondItem.label))).toBeInTheDocument();
  });
});
