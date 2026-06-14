// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { persistCoachSession } from './coachSession';
import type { ActtubStorage, CoachSession } from './storage';
import type { CoachFeedback } from '../coach/evaluation';

const feedback: CoachFeedback = {
  sceneIntent: { text: '집중을 보여주고 싶었어요', source: 'actor_input' },
  strength: { timecode: '0:05', axis: 'face', signal: '시선 처리', why: '집중이 보였어요', tier: 'execution' },
  focus: { timecode: '0:10', axes: ['speech'], observedSignal: '말끝 흐림', rootCause: '호흡', intentGap: '', prescription: '끝음절 받치기' },
  nextStep: { text: '도입부만 다시', action: 'retake_selected_range' },
};

function baseInput(overrides: Record<string, unknown> = {}) {
  return {
    pipeline: 'coach-second' as const,
    feedback,
    category: '독백',
    intent: '겉으로는 침착하지만 속으로는 무너지는 인물',
    startTime: 0,
    endTime: 12,
    fileName: '햄릿 독백',
    mimeType: 'video/webm',
    sizeBytes: 1234,
    ...overrides,
  };
}

function fakeStorage(createCoachSession: ActtubStorage['createCoachSession']) {
  return { createCoachSession } as unknown as ActtubStorage;
}

describe('persistCoachSession', () => {
  it('영상 URL 이 있으면 보관 prefix 로 복사하고 보관본 URL 로 세션을 저장한 뒤 id 를 돌려준다', async () => {
    const createCoachSession = vi.fn(async (input) => ({ id: 'coach-session-1', ...input } as unknown as CoachSession));
    const copyBlob = vi.fn().mockResolvedValue({
      url: 'https://store.public.blob.vercel-storage.com/coach-sessions/abc.webm',
      pathname: 'coach-sessions/abc.webm',
      contentType: 'video/webm',
      contentDisposition: '',
    });

    const id = await persistCoachSession(
      baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
      { storage: fakeStorage(createCoachSession), copyBlob },
    );

    expect(id).toBe('coach-session-1');
    expect(copyBlob).toHaveBeenCalledTimes(1);
    const [fromUrl, toPathname, opts] = copyBlob.mock.calls[0];
    expect(fromUrl).toBe('https://store.public.blob.vercel-storage.com/coach/123-scene.webm');
    expect(toPathname).toMatch(/^coach-sessions\/.+\.webm$/);
    expect(opts).toEqual({ access: 'public' });
    expect(createCoachSession).toHaveBeenCalledWith(
      expect.objectContaining({
        pipeline: 'coach-second',
        blobUrl: 'https://store.public.blob.vercel-storage.com/coach-sessions/abc.webm',
        blobPathname: 'coach-sessions/abc.webm',
        feedback,
      }),
    );
  });

  it('영상 URL 이 없으면 복사 없이 영상 없는 세션을 저장한다', async () => {
    const createCoachSession = vi.fn(async (input) => ({ id: 'coach-session-2', ...input } as unknown as CoachSession));
    const copyBlob = vi.fn();

    const id = await persistCoachSession(baseInput(), { storage: fakeStorage(createCoachSession), copyBlob });

    expect(id).toBe('coach-session-2');
    expect(copyBlob).not.toHaveBeenCalled();
    expect(createCoachSession).toHaveBeenCalledWith(expect.objectContaining({ blobUrl: null, blobPathname: null }));
  });

  it('복사 후 DB 저장이 실패하면 null 을 돌려주고 보관본을 회수한다', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const createCoachSession = vi.fn().mockRejectedValue(new Error('db down'));
    const copyBlob = vi.fn().mockResolvedValue({
      url: 'https://store.public.blob.vercel-storage.com/coach-sessions/orphan.webm',
      pathname: 'coach-sessions/orphan.webm',
      contentType: 'video/webm',
      contentDisposition: '',
    });
    const deleteBlob = vi.fn().mockResolvedValue(undefined);

    try {
      const id = await persistCoachSession(
        baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
        { storage: fakeStorage(createCoachSession), copyBlob, deleteBlob },
      );

      expect(id).toBeNull();
      expect(deleteBlob).toHaveBeenCalledWith('https://store.public.blob.vercel-storage.com/coach-sessions/orphan.webm');
    } finally {
      warn.mockRestore();
    }
  });

  it('복사가 실패하면 null 을 돌려주고 저장을 시도하지 않는다', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const createCoachSession = vi.fn();
    const copyBlob = vi.fn().mockRejectedValue(new Error('copy failed'));
    const deleteBlob = vi.fn();

    try {
      const id = await persistCoachSession(
        baseInput({ videoUrl: 'https://store.public.blob.vercel-storage.com/coach/123-scene.webm' }),
        { storage: fakeStorage(createCoachSession), copyBlob, deleteBlob },
      );

      expect(id).toBeNull();
      expect(createCoachSession).not.toHaveBeenCalled();
      expect(deleteBlob).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });
});
