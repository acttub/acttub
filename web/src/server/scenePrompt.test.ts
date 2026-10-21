import { describe, it, expect } from 'vitest';
import { buildScenePrompt, buildSilentFallback, parseScene } from './scenePrompt';

describe('buildScenePrompt', () => {
  it('상황·대본·큐·사용자 대사를 프롬프트에 넣는다', () => {
    const prompt = buildScenePrompt({
      situation: '오랜 연인과의 이별',
      scriptText: 'A: 우리 그만하자.\nU: 진심이야?',
      userLine: '진심이야?',
      cueLine: '우리 그만하자.',
    });
    expect(prompt).toContain('오랜 연인과의 이별');
    expect(prompt).toContain('"진심이야?"');
    expect(prompt).toContain('"우리 그만하자."');
    expect(prompt).toContain('reaction(합/케미)');
    expect(prompt).toContain('fun_fallback');
  });

  it('큐가 없으면 첫 대사 기준으로 안내한다', () => {
    const prompt = buildScenePrompt({ situation: 's', scriptText: 'U: 시작', userLine: '시작', cueLine: '   ' });
    expect(prompt).toContain('큐 없음');
  });
});

const validJson = JSON.stringify({
  title: '받아치기 고수',
  score: 86,
  one_liner: '상대 큐를 흘리지 않고 받아쳐요.',
  axes: {
    voice: { score: 84, comment: '안 무너짐' },
    emotion: { score: 89, comment: '체념이 진짜 같음' },
    delivery: { score: 82, comment: '사이를 쓸 줄 안다' },
    reaction: { score: 88, comment: '타이밍이 절묘' },
  },
  strength: '듣고 삼킨 뒤 뱉는 호흡',
  tip: '상대 눈 보듯 더 낮게',
  best_moment: '입 밖에 내니까 다르네',
  fun_fallback: false,
});

describe('parseScene', () => {
  it('정상 JSON을 파싱하고 snake_case를 camelCase로 옮긴다', () => {
    const result = parseScene(validJson);
    expect(result.title).toBe('받아치기 고수');
    expect(result.oneLiner).toBe('상대 큐를 흘리지 않고 받아쳐요.');
    expect(result.bestMoment).toBe('입 밖에 내니까 다르네');
    expect(result.funFallback).toBe(false);
    expect(result.axes.reaction.score).toBe(88);
    expect(result.axes.emotion.comment).toBe('체념이 진짜 같음');
  });

  it('코드펜스로 감싼 응답도 파싱한다', () => {
    const result = parseScene('```json\n' + validJson + '\n```');
    expect(result.title).toBe('받아치기 고수');
  });

  it('점수를 60~99로 clamp한다 (절대 기죽이지 않는다)', () => {
    const parsed = parseScene(
      JSON.stringify({
        ...JSON.parse(validJson),
        score: 12,
        axes: {
          voice: { score: 5, comment: '' },
          emotion: { score: 150, comment: '' },
          delivery: { score: 80, comment: '' },
          reaction: { score: 0, comment: '' },
        },
      }),
    );
    expect(parsed.score).toBe(60);
    expect(parsed.axes.voice.score).toBe(60);
    expect(parsed.axes.emotion.score).toBe(99);
    expect(parsed.axes.delivery.score).toBe(80);
    expect(parsed.axes.reaction.score).toBe(60);
  });

  it('칭호나 총평이 비면 throw 한다', () => {
    expect(() => parseScene(JSON.stringify({ ...JSON.parse(validJson), title: '' }))).toThrow();
    expect(() => parseScene(JSON.stringify({ ...JSON.parse(validJson), one_liner: '' }))).toThrow();
  });

  it('해석 불가능한 텍스트는 throw 한다', () => {
    expect(() => parseScene('음성을 못 들었어요')).toThrow();
  });
});

describe('buildSilentFallback', () => {
  it('무음 폴백은 funFallback이고 점수는 60 이상이다', () => {
    const fb = buildSilentFallback();
    expect(fb.funFallback).toBe(true);
    expect(fb.score).toBeGreaterThanOrEqual(60);
    expect(fb.axes.reaction.score).toBeGreaterThanOrEqual(60);
    expect(fb.title).not.toBe('');
  });
});
