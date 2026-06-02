import { beforeEach, describe, expect, it, vi } from 'vitest';
import { submitSurveyResponse } from './surveySubmit';

describe('submitSurveyResponse', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
  });

  it('stores the ACTI survey response before forwarding it to Google Forms', async () => {
    const answers = {
      'actor-status': 'active-actor',
      'feedback-source': ['teacher-coach', 'director'],
    };

    await submitSurveyResponse(answers, 'MINB', 'acti-user-test');

    const fetchMock = vi.mocked(fetch);
    expect(fetchMock).toHaveBeenCalledWith('/api/acti/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'acti-user-test', resultCode: 'MINB', answers }),
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
