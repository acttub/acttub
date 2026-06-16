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

function audioFile(bytes = 1024, type = 'audio/webm') {
  return new File([new Uint8Array(bytes)], 'lineshot.webm', { type });
}

function multipartRequest(parts: { audio?: File; line?: string }) {
  const formData = new FormData();
  if (parts.audio) formData.set('audio', parts.audio);
  if (parts.line != null) formData.set('line', parts.line);
  return new Request('http://localhost/api/lineshot', { method: 'POST', body: formData });
}

describe('handleLineshotScore', () => {
  it('POST가 아니면 405', async () => {
    const res = await handleLineshotScore(new Request('http://localhost/api/lineshot'), {
      apiKey: 'k',
      score: okScore,
    });
    expect(res.status).toBe(405);
  });

  it('API 키가 없으면 500', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const res = await handleLineshotScore(multipartRequest({ audio: audioFile() }), { score: okScore });
    expect(res.status).toBe(500);
    vi.unstubAllEnvs();
  });

  it('multipart 본문이 아니면 400', async () => {
    const req = new Request('http://localhost/api/lineshot', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    });
    const res = await handleLineshotScore(req, { apiKey: 'k', score: okScore });
    expect(res.status).toBe(400);
  });

  it('녹음 파일이 없으면 400', async () => {
    const res = await handleLineshotScore(multipartRequest({ line: '왜 이제 왔어' }), {
      apiKey: 'k',
      score: okScore,
    });
    expect(res.status).toBe(400);
  });

  it('정상 입력은 200과 결과 카드를 돌려준다', async () => {
    const res = await handleLineshotScore(multipartRequest({ audio: audioFile(), line: '왜 이제 왔어' }), {
      apiKey: 'k',
      score: okScore,
    });
    expect(res.status).toBe(200);
    expect((res.body as { result: Lineshot }).result.title).toBe('발음 장인');
  });
});
