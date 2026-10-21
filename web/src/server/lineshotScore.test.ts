import { describe, it, expect, vi } from 'vitest';
import { handleLineshotScore } from './lineshotScore';
import type { Lineshot } from './lineshotPrompt';

const sample: Lineshot = {
  title: '발음 장인',
  score: 84,
  oneLiner: '또박또박함이 무기예요.',
  axes: {
    voice: { score: 88, comment: '' },
    emotion: { score: 79, comment: '' },
    delivery: { score: 85, comment: '' },
  },
  strength: 'ㅆ 받침을 살림',
  tip: '0.5초 더 끌기',
  actorVibe: '라디오 DJ 톤',
  funFallback: false,
};

const okScore = async () => sample;

function audioBlob(bytes = 1024, type = 'audio/webm') {
  return new Blob([new Uint8Array(bytes)], { type });
}

// 실제 multipart 본문을 직렬화해 Request로 보내면 File 합성 결과가 Node/undici 버전마다 달라
// (CI에서 multipartFormDataParser가 거부) 테스트가 환경 의존적이 된다. 핸들러가 의존하는 건
// request.formData()의 반환값뿐이므로 그 메서드만 직접 주입한다.
function request(
  parts: { audio?: Blob; line?: string; level?: string },
  opts: { method?: string; contentType?: string } = {},
): Request {
  const formData = new FormData();
  if (parts.audio) formData.set('audio', parts.audio, 'lineshot.webm');
  if (parts.line != null) formData.set('line', parts.line);
  if (parts.level != null) formData.set('level', parts.level);
  return {
    method: opts.method ?? 'POST',
    headers: new Headers({ 'content-type': opts.contentType ?? 'multipart/form-data; boundary=test' }),
    formData: async () => formData,
  } as unknown as Request;
}

describe('handleLineshotScore', () => {
  it('POST가 아니면 405', async () => {
    const res = await handleLineshotScore(request({}, { method: 'GET' }), { apiKey: 'k', score: okScore });
    expect(res.status).toBe(405);
  });

  it('API 키가 없으면 500', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const res = await handleLineshotScore(request({ audio: audioBlob() }), { score: okScore });
    expect(res.status).toBe(500);
    vi.unstubAllEnvs();
  });

  it('multipart 본문이 아니면 400', async () => {
    const res = await handleLineshotScore(request({}, { contentType: 'application/json' }), {
      apiKey: 'k',
      score: okScore,
    });
    expect(res.status).toBe(400);
  });

  it('녹음 파일이 없으면 400', async () => {
    const res = await handleLineshotScore(request({ line: '왜 이제 왔어' }), { apiKey: 'k', score: okScore });
    expect(res.status).toBe(400);
  });

  it('정상 입력은 200과 결과 카드를 돌려준다', async () => {
    const res = await handleLineshotScore(request({ audio: audioBlob(), line: '왜 이제 왔어' }), {
      apiKey: 'k',
      score: okScore,
    });
    expect(res.status).toBe(200);
    expect((res.body as { result: Lineshot }).result.title).toBe('발음 장인');
  });

  it('level이 임계 이하(무음)면 Gemini를 부르지 않고 fun_fallback 카드를 돌려준다', async () => {
    const score = vi.fn(okScore);
    const res = await handleLineshotScore(request({ audio: audioBlob(), line: '왜 이제 왔어', level: '0' }), {
      apiKey: 'k',
      score,
    });
    expect(res.status).toBe(200);
    const result = (res.body as { result: Lineshot }).result;
    expect(result.funFallback).toBe(true);
    expect(result.title).toBe('미스터리 보이스');
    expect(result.score).toBeGreaterThanOrEqual(60); // 무음에도 기죽이지 않는다
    expect(score).not.toHaveBeenCalled(); // 채점 호출 자체를 막는다
  });

  it('level이 충분하면(발화 있음) 정상 채점 경로로 간다', async () => {
    const score = vi.fn(okScore);
    const res = await handleLineshotScore(request({ audio: audioBlob(), line: '왜 이제 왔어', level: '0.4' }), {
      apiKey: 'k',
      score,
    });
    expect(res.status).toBe(200);
    expect((res.body as { result: Lineshot }).result.title).toBe('발음 장인');
    expect(score).toHaveBeenCalledOnce();
  });

  it('level이 없으면(구버전/직접 호출) 가드를 건너뛰고 정상 채점한다', async () => {
    const score = vi.fn(okScore);
    const res = await handleLineshotScore(request({ audio: audioBlob(), line: '왜 이제 왔어' }), {
      apiKey: 'k',
      score,
    });
    expect(res.status).toBe(200);
    expect(score).toHaveBeenCalledOnce();
  });
});
