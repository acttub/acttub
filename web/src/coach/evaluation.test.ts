import { describe, expect, it } from 'vitest';
import { buildSynthesisPrompt, parseGeminiFeedback } from './evaluation';

describe('buildSynthesisPrompt', () => {
  const prompt = buildSynthesisPrompt({
    category: '독백',
    intent: '떨리는 호흡으로 불안을 표현',
    signals: '[{"persona":"emotion","signals":"[]"}]',
  });

  it('passes category, intent and the persona signals through', () => {
    expect(prompt).toContain('독백');
    expect(prompt).toContain('떨리는 호흡으로 불안을 표현');
    expect(prompt).toContain('persona');
  });

  it('enforces the observed→read→seen→tip moment flow', () => {
    expect(prompt).toContain('observed(관찰된 사실)→read(의도 읽기)→seen(보는 입장의 인상)→tip(실행 가능한 처방)');
  });

  it('caps length and requires at least half aligned moments', () => {
    expect(prompt).toContain('moment는 3~4개만');
    expect(prompt).toContain('절반은 aligned=true');
    expect(prompt).toContain('수긍할 내용이 절반을 넘어야');
  });

  it('prioritises intent vs impression gaps', () => {
    expect(prompt).toContain('의도 ≠ 인상');
  });

  it('keeps the metric labels and the moments JSON contract', () => {
    expect(prompt).toContain('"감정 전달"');
    expect(prompt).toContain('"대사 전달"');
    expect(prompt).toContain('"신체 표현"');
    expect(prompt).toContain('"의도 부합"');
    expect(prompt).toContain('evaluationMetrics');
    expect(prompt).toContain('"moments"');
    expect(prompt).toContain('"aligned"');
  });
});

describe('parseGeminiFeedback', () => {
  it('parses a well-formed synthesized response into the moment schema', () => {
    const raw = JSON.stringify({
      summary: '요약',
      evaluationMetrics: [
        { label: '감정 전달', score: 80, note: '0:10 한숨에서 불안이 보임' },
        { label: '대사 전달', score: 70, note: '0:40 말끝이 흐려짐' },
        { label: '신체 표현', score: 60, note: '상반신 고정' },
        { label: '의도 부합', score: 75, note: '의도 대체로 구현' },
      ],
      moments: [
        { timecode: '0:10', observed: '한숨', read: '불안 의도', seen: '잘 보임', tip: '유지', aligned: true },
        { timecode: '0:40', observed: '말끝 흐림', read: '절제 의도', seen: '안 들림', tip: '끝음절 받치기', aligned: false },
      ],
    });

    const parsed = parseGeminiFeedback(raw);
    expect(parsed.summary).toBe('요약');
    expect(parsed.evaluationMetrics).toHaveLength(4);
    expect(parsed.evaluationMetrics[0]).toMatchObject({ label: '감정 전달', score: 80 });
    expect(parsed.moments).toHaveLength(2);
    expect(parsed.moments[0]).toMatchObject({ timecode: '0:10', aligned: true, tip: '유지' });
    expect(parsed.moments[1].aligned).toBe(false);
  });

  it('drops empty moment cards but keeps valid ones', () => {
    const raw = JSON.stringify({
      summary: '요약',
      moments: [
        { timecode: '0:05', observed: '', read: '', seen: '', tip: '', aligned: false },
        { timecode: '0:08', observed: '시선 처리', read: '', seen: '', tip: '', aligned: true },
      ],
    });

    const parsed = parseGeminiFeedback(raw);
    expect(parsed.moments).toHaveLength(1);
    expect(parsed.moments[0].timecode).toBe('0:08');
  });

  it('falls back to a structured placeholder on malformed JSON', () => {
    const parsed = parseGeminiFeedback('not json at all');
    expect(parsed.evaluationMetrics).toHaveLength(4);
    expect(parsed.moments).toHaveLength(1);
    expect(parsed.summary).toContain('구조화하지 못했습니다');
  });
});
