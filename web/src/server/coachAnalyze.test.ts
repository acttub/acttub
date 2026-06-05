// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { handleCoachAnalyze } from './coachAnalyze';

function videoFormData(overrides: Partial<Record<string, string | Blob>> = {}) {
  const data = new FormData();
  data.set('video', new File(['video-bytes'], 'scene.webm', { type: 'video/webm' }));
  data.set('fileName', '햄릿 독백');
  data.set('category', '독백');
  data.set('intent', '겉으로는 침착하지만 속으로는 무너지는 인물');
  data.set('startTime', '0');
  data.set('endTime', '12');

  Object.entries(overrides).forEach(([key, value]) => {
    if (value !== undefined) data.set(key, value);
  });
  return data;
}

describe('coach analysis API', () => {
  it('returns JSON when the request is missing the AI analysis API key', async () => {
    const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
      method: 'POST',
      body: videoFormData(),
    }));

    expect(result.status).toBe(500);
    expect(result.body).toEqual({
      error: 'AI 분석 환경변수가 설정되어 있지 않습니다. Vercel 또는 로컬 환경변수를 확인해 주세요.',
    });
  });

  it('returns JSON validation errors for invalid form data', async () => {
    const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
      method: 'POST',
      body: videoFormData({ intent: '' }),
    }), {
      apiKey: 'test-key',
    });

    expect(result).toEqual({
      status: 400,
      body: { error: '이번 연습의 의도나 목표를 입력해 주세요.' },
    });
  });

  it('returns a JSON 400 for non-form requests', async () => {
    const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
      method: 'POST',
      body: '',
    }), {
      apiKey: 'test-key',
    });

    expect(result).toEqual({
      status: 400,
      body: { error: '분석할 영상 파일이 필요합니다.' },
    });
  });

  it('does not reject large uploads before the analyzer receives them', async () => {
    const analyze = vi.fn().mockResolvedValue({
      summary: '요약',
      evaluationMetrics: [],
      moments: [
        { timecode: '0:05', observed: '시선 처리', read: '집중 의도', seen: '잘 보임', tip: '유지', aligned: true },
      ],
    });
    const largeVideo = new Blob([new Uint8Array(81 * 1024 * 1024)], { type: 'video/webm' });

    const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
      method: 'POST',
      body: videoFormData({ video: largeVideo }),
    }), {
      apiKey: 'test-key',
      analyze,
    });

    expect(result.status).toBe(200);
    expect(analyze).toHaveBeenCalledOnce();
  });

  it('accepts a Blob URL payload so Vercel route requests stay small', async () => {
    const analyze = vi.fn().mockResolvedValue({
      summary: '요약',
      evaluationMetrics: [],
      moments: [
        { timecode: '0:05', observed: '시선 처리', read: '집중 의도', seen: '잘 보임', tip: '유지', aligned: true },
      ],
    });
    const fetcher = vi.fn().mockResolvedValue(
      new Response(new Blob(['video-bytes'], { type: 'video/webm' }), {
        headers: { 'content-type': 'video/webm' },
      }),
    );

    const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        videoUrl: 'https://blob.vercel-storage.com/coach/scene.webm',
        fileName: '햄릿 독백',
        mimeType: 'video/webm',
        category: '독백',
        intent: '겉으로는 침착하지만 속으로는 무너지는 인물',
        startTime: 0,
        endTime: 12,
      }),
    }), {
      apiKey: 'test-key',
      analyze,
      fetch: fetcher,
    });

    expect(result.status).toBe(200);
    expect(fetcher).toHaveBeenCalledWith(new URL('https://blob.vercel-storage.com/coach/scene.webm'));
    expect(analyze).toHaveBeenCalledWith(expect.objectContaining({
      fileName: '햄릿 독백',
      category: '독백',
      intent: '겉으로는 침착하지만 속으로는 무너지는 인물',
      startTime: 0,
      endTime: 12,
    }));
  });

  it('does not expose provider or model details from analyzer failures', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const analyze = vi.fn().mockRejectedValue(new Error('Gemini model gemini-3.5-flash failed: Request Entity Too Large'));

    try {
      const result = await handleCoachAnalyze(new Request('http://localhost/api/coach/analyze', {
        method: 'POST',
        body: videoFormData(),
      }), {
        apiKey: 'test-key',
        analyze,
      });

      expect(result.status).toBe(500);
      expect(result.body).toEqual({
        error: '분석 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      });
      expect(JSON.stringify(result.body)).not.toMatch(/Gemini|gemini|model|Request Entity Too Large/i);
    } finally {
      errorSpy.mockRestore();
    }
  });
});
