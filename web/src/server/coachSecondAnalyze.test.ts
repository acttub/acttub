// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { handleCoachSecondAnalyze } from './coachSecondAnalyze';
import type { ActtubStorage, CoachSession } from './storage';
import type { CoachFeedback } from '../coach/evaluation';

const feedback: CoachFeedback = {
  sceneIntent: { text: '집중을 보여주고 싶었어요', source: 'actor_input' },
  strength: { timecode: '0:05', axis: 'face', signal: '시선 처리', why: '집중이 보였어요', tier: 'execution' },
  focus: { timecode: '0:10', axes: ['speech'], observedSignal: '말끝 흐림', rootCause: '호흡', intentGap: '', prescription: '끝음절 받치기' },
  nextStep: { text: '도입부만 다시', action: 'retake_selected_range' },
};

function stubStorage(id: string) {
  return {
    createCoachSession: vi.fn(async (input) => ({ id, ...input } as unknown as CoachSession)),
  } as unknown as ActtubStorage;
}

function blobRequest() {
  return new Request('http://localhost/api/coach-second/analyze', {
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
  });
}

describe('coach-second analysis API', () => {
  it('피드백·trace 와 함께 세션을 보관하고 sessionId 를 돌려준다', async () => {
    const analyze = vi.fn().mockResolvedValue({ feedback, trace: { promptVersion: 'v2', failures: [] } });
    const fetcher = vi.fn().mockResolvedValue(
      new Response(new Blob(['video-bytes'], { type: 'video/webm' }), {
        headers: { 'content-type': 'video/webm' },
      }),
    );
    const createCoachSession = vi.fn(async (input) => ({ id: 'coach-session-v2', ...input } as unknown as CoachSession));
    const copyBlob = vi.fn().mockResolvedValue({
      url: 'https://store.public.blob.vercel-storage.com/coach-sessions/kept.webm',
      pathname: 'coach-sessions/kept.webm',
      contentType: 'video/webm',
      contentDisposition: '',
    });

    const result = await handleCoachSecondAnalyze(blobRequest(), {
      apiKey: 'test-key',
      analyze,
      fetch: fetcher,
      storage: { createCoachSession } as unknown as ActtubStorage,
      copyBlob,
    });

    expect(result.status).toBe(200);
    const body = result.body as { feedback?: CoachFeedback; trace?: unknown; sessionId?: string };
    expect(body.feedback).toEqual(feedback);
    expect(body.trace).toEqual({ promptVersion: 'v2', failures: [] });
    expect(body.sessionId).toBe('coach-session-v2');
    expect(copyBlob).toHaveBeenCalled();
    expect(createCoachSession).toHaveBeenCalledWith(
      expect.objectContaining({ pipeline: 'coach-second', trace: { promptVersion: 'v2', failures: [] } }),
    );
  });

  it('세션 저장이 실패해도 분석 결과(피드백)는 그대로 200 으로 반환한다', async () => {
    const analyze = vi.fn().mockResolvedValue({ feedback, trace: {} });
    const fetcher = vi.fn().mockResolvedValue(
      new Response(new Blob(['video-bytes'], { type: 'video/webm' }), {
        headers: { 'content-type': 'video/webm' },
      }),
    );
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    try {
      const result = await handleCoachSecondAnalyze(blobRequest(), {
        apiKey: 'test-key',
        analyze,
        fetch: fetcher,
        storage: stubStorage('unused'),
        copyBlob: vi.fn().mockRejectedValue(new Error('copy down')),
        deleteBlob: vi.fn(),
      });

      expect(result.status).toBe(200);
      const body = result.body as { feedback?: CoachFeedback; sessionId?: string };
      expect(body.feedback).toEqual(feedback);
      expect(body.sessionId).toBeUndefined();
    } finally {
      warn.mockRestore();
    }
  });
});
