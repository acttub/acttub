import { describe, it, expect } from 'vitest';
import { buildLineshotPrompt, parseLineshot } from './lineshotPrompt';

describe('buildLineshotPrompt', () => {
  it('제시 대사를 프롬프트에 넣는다', () => {
    const prompt = buildLineshotPrompt('왜 이제 왔어');
    expect(prompt).toContain('"왜 이제 왔어"');
    expect(prompt).toContain('voice(발성)');
    expect(prompt).toContain('fun_fallback');
  });

  it('대사가 비면 지정 없음으로 처리한다', () => {
    const prompt = buildLineshotPrompt('   ');
    expect(prompt).toContain('지정 없음');
  });
});

const validJson = JSON.stringify({
  title: '발음 장인',
  score: 84,
  one_liner: '또박또박함이 무기예요.',
  axes: {
    voice: { score: 88, comment: '깔끔' },
    emotion: { score: 79, comment: '담백' },
    delivery: { score: 85, comment: '안정적' },
  },
  strength: 'ㅆ 받침을 끝까지 살림',
  tip: '마지막 음을 0.5초 더 끌기',
  actor_vibe: '차분한 라디오 DJ 톤',
  fun_fallback: false,
});

describe('parseLineshot', () => {
  it('정상 JSON을 파싱하고 snake_case를 camelCase로 옮긴다', () => {
    const result = parseLineshot(validJson);
    expect(result.title).toBe('발음 장인');
    expect(result.oneLiner).toBe('또박또박함이 무기예요.');
    expect(result.actorVibe).toBe('차분한 라디오 DJ 톤');
    expect(result.funFallback).toBe(false);
    expect(result.axes.voice.score).toBe(88);
    expect(result.axes.delivery.comment).toBe('안정적');
  });

  it('코드펜스로 감싼 응답도 파싱한다', () => {
    const result = parseLineshot('```json\n' + validJson + '\n```');
    expect(result.title).toBe('발음 장인');
  });

  it('점수를 60~99로 clamp한다 (절대 기죽이지 않는다)', () => {
    const parsed = parseLineshot(
      JSON.stringify({
        ...JSON.parse(validJson),
        score: 12,
        axes: {
          voice: { score: 5, comment: '' },
          emotion: { score: 150, comment: '' },
          delivery: { score: 80, comment: '' },
        },
      }),
    );
    expect(parsed.score).toBe(60);
    expect(parsed.axes.voice.score).toBe(60);
    expect(parsed.axes.emotion.score).toBe(99);
    expect(parsed.axes.delivery.score).toBe(80);
  });

  it('칭호나 총평이 비면 throw 한다', () => {
    expect(() => parseLineshot(JSON.stringify({ ...JSON.parse(validJson), title: '' }))).toThrow();
    expect(() => parseLineshot(JSON.stringify({ ...JSON.parse(validJson), one_liner: '' }))).toThrow();
  });

  it('해석 불가능한 텍스트는 throw 한다', () => {
    expect(() => parseLineshot('음성을 못 들었어요')).toThrow();
  });
});
