import { describe, expect, it } from 'vitest';
import { buildEvaluationPrompt, parseGeminiFeedback } from './evaluation';

describe('buildEvaluationPrompt', () => {
  const prompt = buildEvaluationPrompt({
    fileName: '연습.mp4',
    category: '독백',
    intent: '떨리는 호흡으로 불안을 표현',
    startTime: 5,
    endTime: 65,
  });

  it('analysis inputs and formatted time range', () => {
    expect(prompt).toContain('연습.mp4');
    expect(prompt).toContain('독백');
    expect(prompt).toContain('떨리는 호흡으로 불안을 표현');
    expect(prompt).toContain('0:05 ~ 1:05');
  });

  it('enforces evidence-with-timecode rule', () => {
    expect(prompt).toContain('타임코드');
    expect(prompt).toContain('지점 없는 총평은 금지');
  });

  it('respects actor intent and subtext over imposed bigger emotion', () => {
    expect(prompt).toContain('서브텍스트를 먼저 존중');
    expect(prompt).toContain('의도적으로 선택한 톤');
  });

  it('requires cause + actionable prescription, not symptom only', () => {
    expect(prompt).toContain('증상이 아니라 원인과 처방');
  });

  it('limits prescriptions to what the camera frame can show', () => {
    expect(prompt).toContain('촬영 조건에서 실제로 보이거나 들릴 수 있는 것만');
  });

  it('requires strengths stated as a concrete skill', () => {
    expect(prompt).toContain("'무엇을' 잘했는지 기술 단위");
  });

  it('keeps the JSON output contract stable', () => {
    expect(prompt).toContain('"감정 전달"');
    expect(prompt).toContain('"대사 전달"');
    expect(prompt).toContain('"신체 표현"');
    expect(prompt).toContain('"의도 부합"');
    expect(prompt).toContain('evaluationMetrics');
    expect(prompt).toContain('weaknesses');
    expect(prompt).toContain('alignedMoments');
    expect(prompt).toContain('practiceRecommendations');
  });

  it('documents the score rubric', () => {
    expect(prompt).toContain('score 채점 기준');
    expect(prompt).toContain('85~100');
  });
});

describe('parseGeminiFeedback', () => {
  it('parses a well-formed response unchanged by the prompt redesign', () => {
    const raw = JSON.stringify({
      summary: '요약',
      evaluationMetrics: [
        { label: '감정 전달', score: 80, note: '0:10 한숨에서 불안이 보임' },
        { label: '대사 전달', score: 70, note: '0:40 말끝이 흐려짐' },
        { label: '신체 표현', score: 60, note: '상반신 고정' },
        { label: '의도 부합', score: 75, note: '의도 대체로 구현' },
      ],
      weaknesses: ['약점1'],
      alignedMoments: ['강점1'],
      practiceRecommendations: ['연습1'],
    });

    const parsed = parseGeminiFeedback(raw);
    expect(parsed.evaluationMetrics).toHaveLength(4);
    expect(parsed.evaluationMetrics[0]).toMatchObject({ label: '감정 전달', score: 80 });
    expect(parsed.summary).toBe('요약');
  });
});
