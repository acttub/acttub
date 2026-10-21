import { describe, it, expect, vi } from 'vitest';
import { handleSceneScore } from './sceneScore';
import type { SceneResult } from './scenePrompt';

const sample: SceneResult = {
  title: '받아치기 고수',
  score: 86,
  oneLiner: '합이 좋네요.',
  axes: {
    voice: { score: 84, comment: '' },
    emotion: { score: 89, comment: '' },
    delivery: { score: 82, comment: '' },
    reaction: { score: 88, comment: '' },
  },
  strength: '듣고 삼킨 호흡',
  tip: '더 낮게',
  bestMoment: '입 밖에 내니까 다르네',
  funFallback: false,
};

const okScore = async () => sample;

function audioBlob(bytes = 1024, type = 'audio/webm') {
  return new Blob([new Uint8Array(bytes)], { type });
}

// lineshotScore.test와 동일 이유: multipart 직렬화는 Node/undici 버전 의존이라 formData()만 주입한다.
function request(
  parts: { audio?: Blob; sceneId?: string; level?: string },
  opts: { method?: string; contentType?: string } = {},
): Request {
  const formData = new FormData();
  if (parts.audio) formData.set('audio', parts.audio, 'scene.webm');
  if (parts.sceneId != null) formData.set('sceneId', parts.sceneId);
  if (parts.level != null) formData.set('level', parts.level);
  return {
    method: opts.method ?? 'POST',
    headers: new Headers({ 'content-type': opts.contentType ?? 'multipart/form-data; boundary=test' }),
    formData: async () => formData,
  } as unknown as Request;
}

describe('handleSceneScore', () => {
  it('POST가 아니면 405', async () => {
    const res = await handleSceneScore(request({}, { method: 'GET' }), { apiKey: 'k', score: okScore });
    expect(res.status).toBe(405);
  });

  it('API 키가 없으면 500', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const res = await handleSceneScore(request({ audio: audioBlob(), sceneId: 'breakup' }), { score: okScore });
    expect(res.status).toBe(500);
    vi.unstubAllEnvs();
  });

  it('multipart 본문이 아니면 400', async () => {
    const res = await handleSceneScore(request({}, { contentType: 'application/json' }), {
      apiKey: 'k',
      score: okScore,
    });
    expect(res.status).toBe(400);
  });

  it('알 수 없는 장면이면 400', async () => {
    const res = await handleSceneScore(request({ audio: audioBlob(), sceneId: 'nope' }), {
      apiKey: 'k',
      score: okScore,
    });
    expect(res.status).toBe(400);
  });

  it('녹음 파일이 없으면 400', async () => {
    const res = await handleSceneScore(request({ sceneId: 'breakup' }), { apiKey: 'k', score: okScore });
    expect(res.status).toBe(400);
  });

  it('정상 입력은 200과 합 카드를 돌려준다', async () => {
    const res = await handleSceneScore(request({ audio: audioBlob(), sceneId: 'breakup' }), {
      apiKey: 'k',
      score: okScore,
    });
    expect(res.status).toBe(200);
    expect((res.body as { result: SceneResult }).result.title).toBe('받아치기 고수');
  });

  it('무음(level 임계 이하)이면 Gemini를 부르지 않고 위트 폴백을 돌려준다', async () => {
    const spy = vi.fn(okScore);
    const res = await handleSceneScore(request({ audio: audioBlob(), sceneId: 'breakup', level: '0.005' }), {
      apiKey: 'k',
      score: spy,
    });
    expect(res.status).toBe(200);
    expect(spy).not.toHaveBeenCalled();
    expect((res.body as { result: SceneResult }).result.funFallback).toBe(true);
  });
});
