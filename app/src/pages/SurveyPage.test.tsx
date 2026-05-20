import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
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
