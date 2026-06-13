import { describe, expect, it } from 'vitest';
import { AXIS_BAND_PHRASES, PROGRESSION_LIBRARY, translateEvidenceRef } from './dictionaries';
import { aggregate, assembleCard, buildAxisBands, dedupeSameSignal, mergeToAnchors, pickMajority, timecodeToSeconds } from './pipeline';
import type { AllVerdicts, Anchor, BodyEvent, FaceEvent, IntentInfo, TranscriptResult, VoiceEvent } from './types';

function voiceEvent(timecode: string, overrides: Partial<VoiceEvent> = {}): VoiceEvent {
  return {
    timecode,
    volume: 3,
    speed: 3,
    articulation: '또렷함',
    mumbledWords: [],
    ending: '유지',
    tremor: false,
    audibleBreath: false,
    silenceAfterSec: 0,
    ...overrides,
  };
}

function faceEvent(timecode: string, overrides: Partial<FaceEvent> = {}): FaceEvent {
  return { timecode, faceChanges: [], gazeDirection: '카메라', blink: '보통', ...overrides };
}

function bodyEvent(timecode: string, overrides: Partial<BodyEvent> = {}): BodyEvent {
  return { timecode, postureChanges: [], gesture: '손짓', gestureRepeat: 1, movement: '제자리', ...overrides };
}

const TRANSCRIPT: TranscriptResult = {
  events: [
    { timecode: '0:05', line: '됐어, 그냥 가', confidence: '높음' },
    { timecode: '0:20', line: '왜 그랬어', confidence: '낮음' },
  ],
  silentRanges: [],
};

describe('timecodeToSeconds', () => {
  it('m:ss와 h:mm:ss를 초로 바꾼다', () => {
    expect(timecodeToSeconds('0:05')).toBe(5);
    expect(timecodeToSeconds('1:10')).toBe(70);
    expect(timecodeToSeconds('1:00:01')).toBe(3601);
  });

  it('범위 표기("00:44 - 00:47")는 시작 시점으로 정규화한다', () => {
    expect(timecodeToSeconds('00:44 - 00:47')).toBe(44);
    expect(timecodeToSeconds('이상한값')).toBe(0);
  });
});

describe('pickMajority', () => {
  it('가장 많이 나온 출력을 고른다', () => {
    const { picked, pickedIndex } = pickMajority([{ a: 1 }, { a: 2 }, { a: 2 }]);
    expect(picked).toEqual({ a: 2 });
    expect(pickedIndex).toBe(1);
  });

  it('동률이면 먼저 나온 후보를 고른다 — 결정적 tie-break', () => {
    const { pickedIndex } = pickMajority([{ a: 1 }, { a: 2 }, { a: 3 }]);
    expect(pickedIndex).toBe(0);
  });
});

describe('mergeToAnchors', () => {
  it('±2초 안의 요소 이벤트를 발화 anchor에 귀속한다', () => {
    const anchors = mergeToAnchors({
      transcript: TRANSCRIPT,
      voice: [voiceEvent('0:06', { ending: '흐려짐' })],
      face: [faceEvent('0:21', { gazeDirection: '아래' })],
      body: [],
    });

    expect(anchors).toHaveLength(2);
    expect(anchors[0].anchorId).toBe('a01');
    expect(anchors[0].voice[0].ending).toBe('흐려짐');
    expect(anchors[1].face[0].gazeDirection).toBe('아래');
  });

  it('어디에도 못 붙는 이벤트는 무발화 시간 블록 anchor가 되고, 전체가 시간순으로 재번호된다', () => {
    const anchors = mergeToAnchors({
      transcript: TRANSCRIPT,
      voice: [],
      face: [],
      body: [bodyEvent('0:12', { gesture: '만지작거림' })],
    });

    expect(anchors.map((anchor) => anchor.timecode)).toEqual(['0:05', '0:12', '0:20']);
    expect(anchors[1].line).toBe('');
    expect(anchors[1].body[0].gesture).toBe('만지작거림');
    expect(anchors.map((anchor) => anchor.anchorId)).toEqual(['a01', 'a02', 'a03']);
  });
});

function makeAnchors(): Anchor[] {
  return mergeToAnchors({
    transcript: TRANSCRIPT,
    voice: [voiceEvent('0:05', { ending: '흐려짐', volume: 2 })],
    face: [],
    body: [],
  });
}

function makeVerdicts(): AllVerdicts {
  return {
    emotion: [
      { anchorId: 'a01', relevant: true, aligned: false, gap_bucket: '1', misread_as: '평정', evidence_refs: ['voice[0].ending'] },
      { anchorId: 'a02', relevant: true, aligned: true, gap_bucket: '0', misread_as: '해당없음', evidence_refs: ['line'] },
    ],
    speech: [
      { anchorId: 'a01', relevant: true, aligned: false, gap_bucket: '1', misread_as: '해당없음', evidence_refs: ['voice[0].volume'] },
      { anchorId: 'a02', relevant: false, aligned: false, gap_bucket: '0', misread_as: '해당없음', evidence_refs: [] },
    ],
    body: [
      { anchorId: 'a01', relevant: false, aligned: false, gap_bucket: '0', misread_as: '해당없음', evidence_refs: [] },
      { anchorId: 'a02', relevant: false, aligned: false, gap_bucket: '0', misread_as: '해당없음', evidence_refs: [] },
    ],
    audience: [
      { anchorId: 'a01', relevant: true, impression: '안 잡힘' },
      { anchorId: 'a02', relevant: true, impression: '슬픔' },
    ],
  };
}

const INTENT: IntentInfo = {
  raw: '이별을 담담하게 받아들이는 절제된 슬픔',
  keywords: ['담담하게', '절제된 슬픔'],
  expectedImpressions: ['슬픔'],
  confidence: '높음',
};

describe('aggregate', () => {
  it('priority = coachGap×2 + 동의 코치 수 + audienceGap, focus·strength를 결정적으로 고른다', () => {
    const anchors = makeAnchors();
    const aggregation = aggregate(anchors, makeVerdicts(), INTENT.expectedImpressions);

    const a01 = aggregation.rows.find((row) => row.anchorId === 'a01');
    // coachGap 1 ×2 + 동의 2 + 관객 안 잡힘 1 = 5
    expect(a01?.priority).toBe(5);
    expect(aggregation.focusAnchorId).toBe('a01');
    expect(aggregation.strengthAnchorId).toBe('a02');
  });

  it('기대 인상과 일치하는 관객 인상은 audienceGap 0', () => {
    const aggregation = aggregate(makeAnchors(), makeVerdicts(), ['슬픔']);
    const a02 = aggregation.rows.find((row) => row.anchorId === 'a02');
    expect(a02?.audienceGap).toBe(0);
  });

  it('축 프로필은 relevant 판정의 평균 gap', () => {
    const aggregation = aggregate(makeAnchors(), makeVerdicts(), INTENT.expectedImpressions);
    expect(aggregation.axisProfile.emotion).toBe(0.5); // (1 + 0) / 2
    expect(aggregation.axisProfile.speech).toBe(1); // relevant 1건, gap 1
    expect(aggregation.axisProfile.movement).toBeNull(); // relevant 없음
  });
});

describe('translateEvidenceRef', () => {
  it('필드 경로를 anchor 값으로 해석해 어휘 사전 문구로 바꾼다', () => {
    const anchor = makeAnchors()[0] as unknown as Record<string, unknown>;
    expect(translateEvidenceRef(anchor, 'voice[0].ending')).toBe('말끝이 흐려짐');
    expect(translateEvidenceRef(anchor, 'voice[0].volume')).toBe('음량이 작음');
  });

  it('없는 경로는 빈 문자열 — 근거를 지어내지 않는다', () => {
    const anchor = makeAnchors()[0] as unknown as Record<string, unknown>;
    expect(translateEvidenceRef(anchor, 'voice[9].ending')).toBe('');
  });
});

describe('assembleCard', () => {
  it('진단 id가 사전과 맞으면 표준 가설·처방 문구를 그대로 쓴다', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);

    const card = assembleCard({
      anchors,
      verdicts,
      aggregation,
      diagnosis: { root_cause_id: 'speech.ending_drop', prescription_id: 'p.ending-hold', strength_tier: 'execution' },
      intent: INTENT,
    });

    expect(card.focus.timecode).toBe('0:05');
    expect(card.focus.rootCause).toContain('말끝을 누르려다');
    expect(card.focus.prescription).toContain('끝음절을 한 박자');
    expect(card.focus.observedSignal).toContain('"됐어, 그냥 가"');
    expect(card.focus.intentGap).toContain('평정');
    // 기대 인상이 있으면 echo가 아니라 해석을 함께 보여준다
    expect(card.sceneIntent.text).toContain('슬픔 인상');
    expect(card.focus.intentGap).toContain('(슬픔 인상)');
    expect(card.nextStep.text).toContain('0:05');
    expect(card.sceneIntent.source).toBe('actor_input');
  });

  it('의도 보강 실패(기대 인상 없음) 시 sceneIntent·intentGap은 원문 기반 문구로 폴백한다', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    const bareIntent: IntentInfo = { ...INTENT, keywords: [], expectedImpressions: [] };
    const aggregation = aggregate(anchors, verdicts, bareIntent.expectedImpressions);

    const card = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: bareIntent });
    expect(card.sceneIntent.text).toBe(`${bareIntent.raw} — 이렇게 가려 하셨죠.`);
    expect(card.focus.intentGap).toContain('의도하신 것을 의도하셨지만');
    expect(card.focus.intentGap).not.toContain('인상)');
  });

  it('의도 원문이 길면 보강 요약으로 압축하고, 짧거나 confidence 낮음이면 원문 그대로 되읽는다', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);
    const longRaw = '오랜만에 만난 옛 연인에게 이별의 책임을 따지러 간 게 아니라 서로의 마음이 정말 끝났는지 확인하러 간 사람의 절제된 슬픔과 담담함을 보여주고 싶었어요';
    const longIntent: IntentInfo = { ...INTENT, raw: longRaw, summary: '따지러 간 게 아니라 확인하러 간 사람의 절제된 슬픔과 담담함' };

    const summarized = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: longIntent });
    expect(summarized.sceneIntent.text).toContain('확인하러 간 사람의 절제된 슬픔과 담담함');
    expect(summarized.sceneIntent.text).not.toContain('보여주고 싶었어요');

    // confidence 낮음 — 요약을 믿지 않고 원문 유지
    const lowIntent: IntentInfo = { ...longIntent, confidence: '낮음' };
    const verbatim = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: lowIntent });
    expect(verbatim.sceneIntent.text).toContain(longRaw);

    // 짧은 원문 — 요약이 있어도 그대로 되읽기
    const shortIntent: IntentInfo = { ...INTENT, summary: '다른 요약' };
    const short = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: shortIntent });
    expect(short.sceneIntent.text).toContain(INTENT.raw);
    expect(short.sceneIntent.text).not.toContain('다른 요약');
  });

  it('misread로 판정된 인상은 sceneIntent 의도 요약에서도 빠진다 — 카드 내 모순 차단', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    // misread=슬픔인데 기대 인상에도 슬픔이 있는 상황 — "위에선 의도, 아래에선 이탈" 모순 시나리오
    verdicts.emotion[0] = { ...verdicts.emotion[0], misread_as: '슬픔' };
    const contradictoryIntent: IntentInfo = { ...INTENT, expectedImpressions: ['슬픔', '두려움'] };
    const aggregation = aggregate(anchors, verdicts, contradictoryIntent.expectedImpressions);

    const card = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: contradictoryIntent });
    expect(card.sceneIntent.text).toContain('두려움 인상');
    expect(card.sceneIntent.text).not.toContain('슬픔 인상');
    expect(card.sceneIntent.text).not.toContain('슬픔·');
    expect(card.focus.intentGap).toContain('슬픔에 가깝게 보였어요');
  });

  it('진단 root와 misread 조합이 다리 사전에 있으면 intentGap 뒤에 "왜 그 인상으로 읽혔나"를 잇는다', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    verdicts.emotion[0] = { ...verdicts.emotion[0], misread_as: '체념' };
    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);

    const card = assembleCard({
      anchors,
      verdicts,
      aggregation,
      diagnosis: { root_cause_id: 'speech.ending_drop', prescription_id: 'p.ending-hold', strength_tier: 'execution' },
      intent: INTENT,
    });
    expect(card.focus.intentGap).toContain('체념에 가깝게 보였어요.');
    expect(card.focus.intentGap).toContain('말끝이 흐려지면');

    // 사전에 없는 조합(평정)은 침묵 — 다리를 지어내지 않는다
    verdicts.emotion[0] = { ...verdicts.emotion[0], misread_as: '평정' };
    const silent = assembleCard({
      anchors,
      verdicts,
      aggregation: aggregate(anchors, verdicts, INTENT.expectedImpressions),
      diagnosis: { root_cause_id: 'speech.ending_drop', prescription_id: 'p.ending-hold', strength_tier: 'execution' },
      intent: INTENT,
    });
    expect(silent.focus.intentGap).toMatch(/평정에 가깝게 보였어요\.$/);
  });

  it('기대 인상이 misread와 같으면 갭 문구에서 기대 인상을 빼고 키워드만 쓴다', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    // a01 primary misread를 기대 인상과 동일하게 — "슬픔을 노렸지만 슬픔으로 보였다" 방지 확인
    verdicts.emotion[0] = { ...verdicts.emotion[0], misread_as: '슬픔' };
    verdicts.speech[0] = { ...verdicts.speech[0], gap_bucket: '0.5' };
    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);

    const card = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: INTENT });
    expect(card.focus.intentGap).toContain('담담하게를 의도하셨지만 슬픔에 가깝게 보였어요');
    expect(card.focus.intentGap).not.toContain('(슬픔 인상)');
  });

  it('의도 키워드의 받침에 따라 목적격 조사(을/를)를 맞춘다 — "맹인연기을" 같은 어색함 방지', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    const aggregation = aggregate(anchors, verdicts, []);

    // 받침 없음: '맹인연기' → '를'
    const noFinal = assembleCard({
      anchors, verdicts, aggregation, diagnosis: null,
      intent: { ...INTENT, keywords: ['맹인연기'], expectedImpressions: [] },
    });
    expect(noFinal.focus.intentGap).toContain('맹인연기를 의도하셨지만');

    // 받침 있음: '슬픔' → '을'
    const withFinal = assembleCard({
      anchors, verdicts, aggregation, diagnosis: null,
      intent: { ...INTENT, keywords: ['슬픔'], expectedImpressions: [] },
    });
    expect(withFinal.focus.intentGap).toContain('슬픔을 의도하셨지만');
  });

  it('confidence 낮은 대사는 인용하지 않고 타임코드로만 가리킨다', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    // focus를 a02(낮음 confidence)로 강제 — a01 판정을 모두 무관 처리
    verdicts.emotion[0] = { ...verdicts.emotion[0], relevant: false, gap_bucket: '0' };
    verdicts.speech[0] = { ...verdicts.speech[0], relevant: false, gap_bucket: '0' };
    verdicts.emotion[1] = { anchorId: 'a02', relevant: true, aligned: false, gap_bucket: '1', misread_as: '분노', evidence_refs: ['line'] };
    verdicts.audience[0] = { anchorId: 'a01', relevant: false, impression: '안 잡힘' };

    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);
    expect(aggregation.focusAnchorId).toBe('a02');

    const card = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: INTENT });
    expect(card.focus.observedSignal).toContain('0:20 부근에서');
    expect(card.focus.observedSignal).not.toContain('왜 그랬어');
  });

  it('진단이 unlisted거나 없으면 생성 폴백 없이 표준 안내 카드를 쓴다', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);

    const card = assembleCard({
      anchors,
      verdicts,
      aggregation,
      diagnosis: { root_cause_id: 'unlisted', prescription_id: 'none', strength_tier: 'attempt' },
      intent: INTENT,
    });

    // 내부 사정("처방 사전") 노출 금지 — 배우 언어로만 (r3)
    expect(card.focus.rootCause).toContain('딱 떨어지지 않');
    expect(card.focus.rootCause).not.toContain('사전');
    // 우리 서비스엔 사람 코치가 직접 보지 않는다 — "코치 선생님이 본다"는 거짓 약속 금지
    expect(card.focus.rootCause).not.toContain('코치');
    expect(card.focus.rootCause).not.toContain('선생님');
    // unlisted여도 검출 신호를 변인으로 돌려준다 — "한 번은 지금처럼, 한 번은 반대로"
    expect(card.focus.prescription).toContain('반대로');
    expect(card.strength.tier).toBe('attempt');
  });

  it('전체 흐름 요약 — 축별 평균 갭을 밴드 문구로 번역해 카드에 싣는다', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);

    const card = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: INTENT });
    // emotion 평균 갭 0.5 → "대체로 전달", speech 갭 1 → "어긋나는 순간이 잦았어요"
    expect(card.overall?.text).toContain('구간 전체');
    expect(card.overall?.text).toContain('감정은 대체로 전달됐지만');
    expect(card.overall?.text).toContain('대사 전달은 의도와 어긋나는 순간이 잦았어요');
    expect(card.overall?.text).not.toMatch(/[0-9]+(\.[0-9]+)?점|0\.5|평균/); // 수치 비노출
  });

  it('강점 signal은 검출 신호를 의도에 귀속하지 않는다 — "의도대로"는 why 줄에만', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);

    const card = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: INTENT });
    expect(card.strength.signal).not.toContain('의도대로');

    // 어휘 번역되는 evidence가 있으면 관찰 문구로 나열한다 — 강점 anchor(0:20)에 voice 이벤트 부여
    const richAnchors = mergeToAnchors({
      transcript: TRANSCRIPT,
      voice: [voiceEvent('0:05', { ending: '흐려짐', volume: 2 }), voiceEvent('0:20', { ending: '유지' })],
      face: [],
      body: [],
    });
    verdicts.emotion[1] = { ...verdicts.emotion[1], evidence_refs: ['voice[0].ending'] };
    const withPhrase = assembleCard({
      anchors: richAnchors,
      verdicts,
      aggregation: aggregate(richAnchors, verdicts, INTENT.expectedImpressions),
      diagnosis: null,
      intent: INTENT,
    });
    expect(withPhrase.strength.signal).toContain('말끝이 끝까지 유지됨이 또렷하게 잡혔어요');
    expect(withPhrase.strength.signal).not.toContain('의도대로');
  });

  it('갭이 전혀 없으면 덕담 대신 잘된 축의 "다음 레벨 과제"를 처방한다', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    verdicts.emotion[0] = { ...verdicts.emotion[0], aligned: true, gap_bucket: '0', misread_as: '해당없음' };
    verdicts.speech[0] = { ...verdicts.speech[0], aligned: true, gap_bucket: '0', misread_as: '해당없음' };
    verdicts.audience[0] = { anchorId: 'a01', relevant: true, impression: '슬픔' };

    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);
    expect(aggregation.focusAnchorId).toBeNull();

    const card = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: INTENT });
    // 어긋난 지점이 없는데 타임코드가 찍히면 자기모순 — 빈 값으로 칩을 숨긴다
    expect(card.focus.timecode).toBe('');
    expect(card.focus.observedSignal).toContain('어긋난 지점을 찾지 못했');
    expect(card.focus.prescription).toBe(PROGRESSION_LIBRARY[card.strength.axis].task);
    expect(card.nextStep.text).toBe(PROGRESSION_LIBRARY[card.strength.axis].nextStep);
  });

  it('강점 why는 키워드 원문을 echo하지 않고 기대 인상 해석을 쓴다', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);

    const card = assembleCard({
      anchors,
      verdicts,
      aggregation,
      diagnosis: { root_cause_id: 'speech.ending_drop', prescription_id: 'p.ending-hold', strength_tier: 'execution' },
      intent: INTENT,
    });
    expect(card.strength.why).toContain('슬픔 인상');
    expect(card.strength.why).not.toContain('담담하게');
  });

  it('confidence 낮음이면 해석(기대 인상)을 카드 어디에도 쓰지 않는다', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    const lowIntent: IntentInfo = { ...INTENT, confidence: '낮음' };
    const aggregation = aggregate(anchors, verdicts, lowIntent.expectedImpressions);

    const card = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: lowIntent });
    expect(card.sceneIntent.text).toBe(`${lowIntent.raw} — 이렇게 가려 하셨죠.`);
    expect(card.focus.intentGap).not.toContain('인상)');
    expect(card.strength.why).toBe('이 선택이 의도한 인상을 그대로 전했어요.');
  });

  it('aligned 판정이 하나도 없으면 강점은 정직한 격려(tier 폴백)', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    verdicts.emotion[1] = { ...verdicts.emotion[1], aligned: false, gap_bucket: '0.5', misread_as: '평정' };

    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);
    expect(aggregation.strengthAnchorId).toBeNull();

    const card = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: INTENT });
    expect(card.strength.tier).toBe('encouragement');
    expect(card.strength.why).toContain('출발점');
  });

  it('같은 입력이면 카드가 바이트 단위로 같다 — 조립 단계의 멱등성', () => {
    const build = () => assembleCard({
      anchors: makeAnchors(),
      verdicts: makeVerdicts(),
      aggregation: aggregate(makeAnchors(), makeVerdicts(), INTENT.expectedImpressions),
      diagnosis: { root_cause_id: 'speech.ending_drop', prescription_id: 'p.ending-hold', strength_tier: 'execution' },
      intent: INTENT,
    });

    expect(JSON.stringify(build())).toBe(JSON.stringify(build()));
  });
});

describe('buildAxisBands', () => {
  it('축별 평균 갭을 밴드로 양자화하고, mid·weak엔 의도 대신 보인 인상(misread)을 넣어 구체화한다 — relevant 없는 축은 생략', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);
    const bands = buildAxisBands(aggregation, verdicts);

    const byAxis = Object.fromEntries(bands.map((band) => [band.axis, band]));
    expect(byAxis.emotion.band).toBe('mid'); // (1 + 0) / 2 = 0.5 → mid
    expect(byAxis.emotion.label).toBe('감정');
    // 최빈 misread(평정)가 문구에 박힌다 — "어떤 감정으로 보였나"
    expect(byAxis.emotion.text).toContain('평정');
    expect(byAxis.speech.band).toBe('weak'); // relevant 1건, gap 1
    // speech는 misread 템플릿이 없어 일반 문구 그대로
    expect(byAxis.speech.text).toBe(AXIS_BAND_PHRASES.speech.bands.weak);
    expect(byAxis.audience.band).toBe('weak'); // 관객 불일치율 0.5
    expect(byAxis.movement).toBeUndefined(); // relevant 판정 없음 → 칸 생략

    // 수치는 표면에 노출하지 않는다
    expect(bands.every((band) => !/[0-9]/.test(band.text))).toBe(true);
  });

  it('assembleCard가 다축 전경을 overall.axisBands에 싣는다 — 단일 초점(focus)은 그대로 1개', () => {
    const anchors = makeAnchors();
    const verdicts = makeVerdicts();
    const aggregation = aggregate(anchors, verdicts, INTENT.expectedImpressions);
    const card = assembleCard({ anchors, verdicts, aggregation, diagnosis: null, intent: INTENT });

    expect(card.overall?.axisBands?.map((band) => band.axis)).toEqual(['emotion', 'speech', 'audience']);
    expect(card.focus).toBeDefined(); // 전경을 얹어도 처방은 여전히 단일 초점 1개
  });
});

describe('dedupeSameSignal', () => {
  it('같은 신호의 변주는 인용이 있는 구체적인 쪽만 남긴다', () => {
    expect(dedupeSameSignal(['일부 발음이 뭉개짐', "'거잖아요' 발음이 뭉개짐"]))
      .toEqual(["'거잖아요' 발음이 뭉개짐"]);
  });

  it('다른 신호는 둘 다 남긴다', () => {
    expect(dedupeSameSignal(['말끝이 흐려짐', '음량이 작음'])).toEqual(['말끝이 흐려짐', '음량이 작음']);
  });
});
