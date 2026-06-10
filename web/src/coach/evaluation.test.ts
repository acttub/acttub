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

  it('enforces the single-focus card contract keys', () => {
    expect(prompt).toContain('"scene_intent"');
    expect(prompt).toContain('"strength"');
    expect(prompt).toContain('"focus"');
    expect(prompt).toContain('"next_step"');
  });

  it('selects the focus by intent gap, not absolute weakness', () => {
    expect(prompt).toContain('의도 격차 최대');
    expect(prompt).toContain('제일 못한 것');
  });

  it('requires a strength with a fallback tier and forbids fake praise', () => {
    expect(prompt).toContain('execution');
    expect(prompt).toContain('attempt');
    expect(prompt).toContain('encouragement');
    expect(prompt).toContain('거짓·추상 칭찬');
  });

  it('tolerates missing persona signals without fabricating', () => {
    expect(prompt).toContain('지어내지 말고');
  });

  it('enforces actor language and timecode grounding', () => {
    expect(prompt).toContain('2인칭 존댓말');
    expect(prompt).toContain('timecode');
  });
});

describe('parseGeminiFeedback', () => {
  it('parses a well-formed single-focus card', () => {
    const raw = JSON.stringify({
      scene_intent: { text: '꾹 참다 무너지는 걸 보여주고 싶었어요', source: 'actor_input' },
      strength: {
        timecode: '0:48',
        axis: 'emotion',
        signal: '"괜찮아"에서 목소리가 떨렸어요',
        why: '참으려는 마음과 무너짐이 동시에 읽혔어요',
        tier: 'execution',
      },
      focus: {
        timecode: '0:00-0:15',
        axes: ['emotion', 'speech'],
        observed_signal: '도입부 첫 세 대사가 굳어 있었어요',
        root_cause: '도입부 긴장 — 무너질 높이가 안 생겼어요',
        intent_gap: '꾹 참다 무너지려 했는데 이미 굳어 보였어요',
        prescription: '슬레이트 직전 3초 숨 내쉬며 어깨 툭',
      },
      next_step: { text: '도입부만 다시', action: 'retake_selected_range' },
    });

    const parsed = parseGeminiFeedback(raw);
    expect(parsed.sceneIntent).toMatchObject({ source: 'actor_input' });
    expect(parsed.strength).toMatchObject({ timecode: '0:48', axis: 'emotion', tier: 'execution' });
    expect(parsed.focus.axes).toEqual(['emotion', 'speech']);
    expect(parsed.focus.prescription).toContain('어깨 툭');
    expect(parsed.nextStep).toMatchObject({ text: '도입부만 다시', action: 'retake_selected_range' });
  });

  it('falls back unknown enum values to safe defaults', () => {
    const raw = JSON.stringify({
      scene_intent: { text: '의도', source: 'made_up' },
      strength: { timecode: '0:10', axis: 'nonsense', signal: '시선 처리', why: '집중이 보임', tier: 'weird' },
      focus: {
        timecode: '0:20',
        axes: ['emotion', 'bogus'],
        observed_signal: '말끝 흐림',
        root_cause: '호흡',
        intent_gap: '',
        prescription: '끝음절 받치기',
      },
      next_step: { text: '끝부분만 다시', action: 'unknown' },
    });

    const parsed = parseGeminiFeedback(raw);
    expect(parsed.sceneIntent.source).toBe('actor_input');
    expect(parsed.strength.axis).toBe('emotion');
    expect(parsed.strength.tier).toBe('attempt');
    expect(parsed.focus.axes).toEqual(['emotion']); // bogus dropped
    expect(parsed.nextStep.action).toBe('retake_selected_range');
  });

  it('does not duplicate the sentence when only one of signal/why arrives', () => {
    const base = {
      scene_intent: { text: '의도', source: 'actor_input' },
      focus: {
        timecode: '0:20',
        axes: ['speech'],
        observed_signal: '말끝 흐림',
        root_cause: '호흡',
        intent_gap: '',
        prescription: '끝음절 받치기',
      },
      next_step: { text: '다시', action: 'retake_selected_range' },
    };

    const onlySignal = parseGeminiFeedback(JSON.stringify({
      ...base,
      strength: { timecode: '0:10', axis: 'emotion', signal: '떨림이 보였어요', why: '', tier: 'execution' },
    }));
    expect(onlySignal.strength.signal).toBe('떨림이 보였어요');
    expect(onlySignal.strength.why).toBe('');

    const onlyWhy = parseGeminiFeedback(JSON.stringify({
      ...base,
      strength: { timecode: '0:10', axis: 'emotion', signal: '', why: '의도대로 무너짐이 읽혔어요', tier: 'execution' },
    }));
    expect(onlyWhy.strength.signal).toBe('의도대로 무너짐이 읽혔어요');
    expect(onlyWhy.strength.why).toBe('');
  });

  it('rejects a focus without a prescription (SOMA-60 hard floor)', () => {
    const raw = JSON.stringify({
      scene_intent: { text: '의도', source: 'actor_input' },
      strength: { timecode: '0:10', axis: 'emotion', signal: '시선 처리', why: '집중이 보임', tier: 'execution' },
      focus: {
        timecode: '0:20',
        axes: ['speech'],
        observed_signal: '말끝 흐림',
        root_cause: '호흡',
        intent_gap: '안 들렸어요',
        prescription: '',
      },
      next_step: { text: '다시', action: 'retake_selected_range' },
    });

    const parsed = parseGeminiFeedback(raw);
    expect(parsed.focus.prescription).toContain('다시 분석');
  });

  it('fills a fallback strength when signal and why are both empty', () => {
    const raw = JSON.stringify({
      scene_intent: { text: '의도', source: 'actor_input' },
      strength: { timecode: '0:10', axis: 'emotion', signal: '', why: '', tier: 'execution' },
      focus: {
        timecode: '0:20',
        axes: ['speech'],
        observed_signal: '말끝 흐림',
        root_cause: '호흡',
        intent_gap: '',
        prescription: '끝음절 받치기',
      },
      next_step: { text: '다시', action: 'retake_selected_range' },
    });

    const parsed = parseGeminiFeedback(raw);
    expect(parsed.strength.tier).toBe('encouragement'); // fallback strength
    expect(parsed.strength.signal.length).toBeGreaterThan(0);
  });

  it('falls back to a structured placeholder on malformed JSON', () => {
    const parsed = parseGeminiFeedback('not json at all');
    expect(parsed.sceneIntent.text).toContain('의도를 다시 읽지 못했');
    expect(parsed.strength.tier).toBe('encouragement');
    expect(parsed.focus.prescription).toContain('다시 분석');
    expect(parsed.nextStep.action).toBe('retake_selected_range');
  });
});
