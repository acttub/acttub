// coach-second(v2) 결정적 코드 단계 — 병합·다수결·집계·카드 조립.
// 이 파일에는 LLM 호출이 없다. 같은 입력 → 같은 출력(산수·정렬·템플릿)이 자명한 영역.
import type { CoachFeedback, FeedbackAxis, FeedbackAxisBand, OverallBand } from '../coach/evaluation';
import { AXIS_BAND_PHRASES, findPrescription, findRoot, MISREAD_BRIDGE, PROGRESSION_LIBRARY, translateEvidenceRef } from './dictionaries';
import type {
  Aggregation,
  AggregateRow,
  AllVerdicts,
  Anchor,
  AudienceVerdict,
  BodyEvent,
  CoachPersonaKey,
  CoachVerdict,
  Diagnosis,
  FaceEvent,
  IntentInfo,
  TranscriptResult,
  VoiceEvent,
} from './types';

export function timecodeToSeconds(timecode: string): number {
  // 모델이 "00:44 - 00:47" 같은 범위를 내도 시작 시점으로 정규화 — NaN이 정렬에 섞이지 않게.
  const head = String(timecode).split('-')[0].trim();
  const parts = head.split(':').map(Number);
  if (parts.length === 0 || parts.some((part) => !Number.isFinite(part))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

// E4 다수결 k=3 — 같은 출력(직렬화 동일)이 가장 많은 후보를 채택. 동률이면 먼저 나온 후보.
// 시각 분류 경계(팔짓↔손짓)의 잔여 분산을 흡수한다(설계 §5.6 실측 2).
export function pickMajority<T>(candidates: T[]): { picked: T; pickedIndex: number } {
  const counts = new Map<string, { count: number; firstIndex: number }>();
  candidates.forEach((candidate, index) => {
    const key = JSON.stringify(candidate);
    const entry = counts.get(key);
    if (entry) entry.count += 1;
    else counts.set(key, { count: 1, firstIndex: index });
  });

  let best: { count: number; firstIndex: number } | null = null;
  for (const entry of counts.values()) {
    if (!best || entry.count > best.count || (entry.count === best.count && entry.firstIndex < best.firstIndex)) {
      best = entry;
    }
  }

  const pickedIndex = best ? best.firstIndex : 0;
  return { picked: candidates[pickedIndex], pickedIndex };
}

// 병합 — E1 발화를 anchor로, E2~E4 이벤트를 가장 가까운 anchor(±2초)에 귀속.
// 어디에도 못 붙는 이벤트는 무발화 시간 블록 anchor로 만든다. anchorId는 시간순 재부여.
const ATTACH_WINDOW_SECONDS = 2;

type UnanchoredEvent = { timecode: string };

function attachEvents<E extends UnanchoredEvent>(
  anchorSeconds: number[],
  events: E[],
): { attached: Map<number, E[]>; orphans: E[] } {
  const attached = new Map<number, E[]>();
  const orphans: E[] = [];

  for (const event of events) {
    const seconds = timecodeToSeconds(event.timecode);
    let bestIndex = -1;
    let bestDistance = ATTACH_WINDOW_SECONDS + 0.001;

    anchorSeconds.forEach((anchorSecond, index) => {
      const distance = Math.abs(seconds - anchorSecond);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    if (bestIndex >= 0) {
      const list = attached.get(bestIndex) ?? [];
      list.push(event);
      attached.set(bestIndex, list);
    } else {
      orphans.push(event);
    }
  }

  return { attached, orphans };
}

export function mergeToAnchors(input: {
  transcript: TranscriptResult;
  voice: VoiceEvent[];
  face: FaceEvent[];
  body: BodyEvent[];
}): Anchor[] {
  const utterances = [...input.transcript.events]
    .sort((a, b) => timecodeToSeconds(a.timecode) - timecodeToSeconds(b.timecode));
  const anchorSeconds = utterances.map((event) => timecodeToSeconds(event.timecode));

  const voice = attachEvents(anchorSeconds, input.voice);
  const face = attachEvents(anchorSeconds, input.face);
  const body = attachEvents(anchorSeconds, input.body);

  type Draft = Omit<Anchor, 'anchorId'> & { seconds: number };

  const drafts: Draft[] = utterances.map((utterance, index) => ({
    seconds: anchorSeconds[index],
    timecode: utterance.timecode,
    line: utterance.line,
    confidence: utterance.confidence,
    voice: voice.attached.get(index) ?? [],
    face: face.attached.get(index) ?? [],
    body: body.attached.get(index) ?? [],
  }));

  // 고아 이벤트는 무발화 시간 블록 — 같은 timecode끼리 묶는다.
  const orphanBlocks = new Map<string, Draft>();
  const pushOrphan = (timecode: string, apply: (draft: Draft) => void) => {
    const existing = orphanBlocks.get(timecode);
    if (existing) {
      apply(existing);
      return;
    }
    const draft: Draft = {
      seconds: timecodeToSeconds(timecode),
      timecode,
      line: '',
      confidence: '높음',
      voice: [],
      face: [],
      body: [],
    };
    apply(draft);
    orphanBlocks.set(timecode, draft);
  };

  voice.orphans.forEach((event) => pushOrphan(event.timecode, (draft) => draft.voice.push(event)));
  face.orphans.forEach((event) => pushOrphan(event.timecode, (draft) => draft.face.push(event)));
  body.orphans.forEach((event) => pushOrphan(event.timecode, (draft) => draft.body.push(event)));

  const ordered = [...drafts, ...orphanBlocks.values()]
    .sort((a, b) => a.seconds - b.seconds || a.timecode.localeCompare(b.timecode));

  return ordered.map((draft, index) => ({
    anchorId: `a${String(index + 1).padStart(2, '0')}`,
    timecode: draft.timecode,
    line: draft.line,
    confidence: draft.confidence,
    voice: draft.voice,
    face: draft.face,
    body: draft.body,
  }));
}

// 집계 — 프롬프트 명세 §4 의사코드 그대로. 산수와 정렬뿐이라 완전 결정적.
const GAP_VALUE: Record<CoachVerdict['gap_bucket'], number> = { 0: 0, 0.5: 0.5, 1: 1 };
const COACH_KEYS: CoachPersonaKey[] = ['emotion', 'speech', 'body'];

function audienceGapOf(verdict: AudienceVerdict | undefined, expectedImpressions: string[]): 0 | 1 {
  if (!verdict || !verdict.relevant) return 0;
  if (verdict.impression === '안 잡힘') return 1;
  if (expectedImpressions.length > 0 && !expectedImpressions.includes(verdict.impression)) return 1;
  return 0;
}

export function aggregate(anchors: Anchor[], verdicts: AllVerdicts, expectedImpressions: string[]): Aggregation {
  const audienceByAnchor = new Map(verdicts.audience.map((verdict) => [verdict.anchorId, verdict]));
  const coachByAnchor = new Map<string, CoachVerdict[]>();
  for (const key of COACH_KEYS) {
    for (const verdict of verdicts[key]) {
      const list = coachByAnchor.get(verdict.anchorId) ?? [];
      list.push(verdict);
      coachByAnchor.set(verdict.anchorId, list);
    }
  }

  const rows: AggregateRow[] = anchors.map((anchor) => {
    const coachVerdicts = (coachByAnchor.get(anchor.anchorId) ?? []).filter((verdict) => verdict.relevant);
    const gaps = coachVerdicts.map((verdict) => GAP_VALUE[verdict.gap_bucket]);
    const coachGap = gaps.length > 0 ? Math.max(...gaps) : 0;
    const agreeCount = gaps.filter((gap) => gap > 0).length;
    const audienceGap = audienceGapOf(audienceByAnchor.get(anchor.anchorId), expectedImpressions);
    const alignedCount = coachVerdicts.filter((verdict) => verdict.aligned).length;

    return {
      anchorId: anchor.anchorId,
      coachGap,
      agreeCount,
      audienceGap,
      priority: coachGap * 2 + agreeCount + audienceGap,
      alignedCount,
    };
  });

  const secondsOf = (anchorId: string) =>
    timecodeToSeconds(anchors.find((anchor) => anchor.anchorId === anchorId)?.timecode ?? '0:00');

  // focus = priority 최대 → 동률: audienceGap 큰 것 → timecode 빠른 것. 갭이 전혀 없으면 null.
  const focusCandidates = rows.filter((row) => row.priority > 0);
  const focusRow = focusCandidates.length > 0
    ? [...focusCandidates].sort((a, b) =>
      b.priority - a.priority
      || b.audienceGap - a.audienceGap
      || secondsOf(a.anchorId) - secondsOf(b.anchorId))[0]
    : null;

  // strength = aligned 코치 수 최대 → timecode 빠른 것. 0이면 null(tier 폴백).
  const strengthCandidates = rows.filter((row) => row.alignedCount > 0);
  const strengthRow = strengthCandidates.length > 0
    ? [...strengthCandidates].sort((a, b) =>
      b.alignedCount - a.alignedCount
      || secondsOf(a.anchorId) - secondsOf(b.anchorId))[0]
    : null;

  const axisMean = (key: CoachPersonaKey): number | null => {
    const relevant = verdicts[key].filter((verdict) => verdict.relevant);
    if (relevant.length === 0) return null;
    const total = relevant.reduce((sum, verdict) => sum + GAP_VALUE[verdict.gap_bucket], 0);
    return Math.round((total / relevant.length) * 100) / 100;
  };

  const relevantAudience = verdicts.audience.filter((verdict) => verdict.relevant);
  const audienceMismatchRate = relevantAudience.length > 0
    ? Math.round((relevantAudience.filter((verdict) => audienceGapOf(verdict, expectedImpressions) === 1).length / relevantAudience.length) * 100) / 100
    : null;

  return {
    rows,
    focusAnchorId: focusRow?.anchorId ?? null,
    strengthAnchorId: strengthRow?.anchorId ?? null,
    axisProfile: {
      emotion: axisMean('emotion'),
      speech: axisMean('speech'),
      movement: axisMean('body'),
      audienceMismatchRate,
    },
  };
}

// 카드 조립 — 모든 문장은 사전·템플릿에서. SOMA-62 스키마 불변(기존 UI가 그대로 렌더).
const PERSONA_AXIS: Record<CoachPersonaKey, FeedbackAxis> = {
  emotion: 'emotion',
  speech: 'speech',
  body: 'movement',
};

// 신호가 아닌 중립값은 카드 근거로 인용하지 않는다 — "음량이 보통이 보였어요" 같은 빈 문장 방지.
const NEUTRAL_PHRASES = new Set(['음량이 보통', '속도가 보통', '짧은 멈춤']);

// 같은 신호의 변주("일부 발음이 뭉개짐"·"'거잖아요' 발음이 뭉개짐")는 한 번만 말한다 —
// 검출기 출력을 그대로 이어붙인 듯한 이음새 방지. 인용('…')이 있는 구체적인 쪽을 남긴다.
export function dedupeSameSignal(phrases: string[]): string[] {
  const core = (phrase: string) => phrase.replace(/'[^']*'/g, '').replace(/\s+/g, ' ').trim();
  const score = (phrase: string) => (phrase.includes("'") ? 1000 : 0) + phrase.length;
  return phrases.filter((phrase, index) => !phrases.some((other, otherIndex) => {
    if (otherIndex === index) return false;
    const mine = core(phrase);
    const theirs = core(other);
    if (!mine || !theirs) return false;
    if (!mine.endsWith(theirs) && !theirs.endsWith(mine)) return false;
    const diff = score(other) - score(phrase);
    return diff > 0 || (diff === 0 && otherIndex < index);
  }));
}

function evidencePhrases(anchor: Anchor, refs: string[]): string {
  const phrases = refs
    .map((ref) => translateEvidenceRef(anchor as unknown as Record<string, unknown>, ref))
    .filter((phrase) => phrase && !NEUTRAL_PHRASES.has(phrase));
  return dedupeSameSignal(Array.from(new Set(phrases))).slice(0, 2).join(' · ');
}

function whereText(anchor: Anchor): string {
  // confidence 인용 게이트 — 또렷이 들린 대사만 인용, 아니면 타임코드로만 가리킨다.
  if (anchor.line && anchor.confidence === '높음') return `${anchor.timecode} "${anchor.line}"에서`;
  return `${anchor.timecode} 부근에서`;
}

function findAnchor(anchors: Anchor[], anchorId: string | null): Anchor | null {
  if (!anchorId) return null;
  return anchors.find((anchor) => anchor.anchorId === anchorId) ?? null;
}

function focusVerdicts(verdicts: AllVerdicts, anchorId: string): { persona: CoachPersonaKey; verdict: CoachVerdict }[] {
  return COACH_KEYS
    .map((key) => ({ persona: key, verdict: verdicts[key].find((verdict) => verdict.anchorId === anchorId && verdict.relevant) }))
    .filter((entry): entry is { persona: CoachPersonaKey; verdict: CoachVerdict } => Boolean(entry.verdict));
}

// 한글 받침 유무로 목적격 조사(을/를)를 붙인다. 받침 있으면 '을', 없으면 '를'.
// 끝 글자가 한글 음절이 아니면(영문·숫자·기호) '을'로 폴백한다.
function withObjectParticle(word: string): string {
  const trimmed = word.trim();
  if (!trimmed) return trimmed;
  const last = trimmed.charCodeAt(trimmed.length - 1);
  if (last >= 0xAC00 && last <= 0xD7A3) {
    return `${trimmed}${(last - 0xAC00) % 28 !== 0 ? '을' : '를'}`;
  }
  return `${trimmed}을`;
}

// 배우 입력 키워드를 칭찬 문장에 그대로 박지 않는다 — "이 선택이 test를 그대로 전했어요" 사고 방지.
// 해석(기대 인상)은 보강 confidence 높음일 때만 쓰고, 아니면 echo 없는 중립 문구.
function trustedImpression(intent: IntentInfo) {
  return intent.confidence === '높음' ? intent.expectedImpressions[0] ?? null : null;
}

const STRENGTH_WHY: Record<Diagnosis['strength_tier'], (intent: IntentInfo) => string> = {
  execution: (intent) => {
    const impression = trustedImpression(intent);
    return impression
      ? `이 선택이 노린 ${impression} 인상을 그대로 전했어요.`
      : '이 선택이 의도한 인상을 그대로 전했어요.';
  },
  attempt: (intent) => {
    const impression = trustedImpression(intent);
    return impression
      ? `${impression} 인상을 향한 시도가 분명히 보여요.`
      : '의도한 방향을 향한 시도가 분명히 보여요.';
  },
  encouragement: () => '이 장면을 끝까지 해본 것이 다음 분석의 출발점이에요.',
};

// 의도 원문이 이 길이를 넘으면 카드에서 보강 요약으로 압축한다(두 줄 안팎 기준).
const INTENT_ECHO_MAX = 60;

const AXIS_SUMMARY_LABEL: Record<'emotion' | 'speech' | 'movement', string> = {
  emotion: '감정',
  speech: '대사 전달',
  movement: '몸의 움직임',
};

// 다축 전경(rev.7) — 축별 평균 갭을 밴드로 양자화하고 「축×밴드 문구」 사전에서 문장을 꺼낸다.
// 단일 초점 위에 얹는 "코치 머릿속 전체 스캔"(Confluence 18153475 §3-1). 같은 밴드 → 같은 문구(멱등).
function gapBand(gap: number): OverallBand {
  if (gap <= 0.25) return 'good';
  if (gap <= 0.5) return 'mid';
  return 'weak';
}

// 축의 최빈 misread 인상 — "의도 대신 무엇으로 보였나". relevant·갭>0·해당없음 제외.
// 동률이면 먼저 나온 인상(verdict 순서 고정 → 결정적).
function topMisread(verdicts: AllVerdicts, key: CoachPersonaKey): string | null {
  const counts = new Map<string, number>();
  for (const verdict of verdicts[key]) {
    if (verdict.relevant && GAP_VALUE[verdict.gap_bucket] > 0 && verdict.misread_as !== '해당없음') {
      counts.set(verdict.misread_as, (counts.get(verdict.misread_as) ?? 0) + 1);
    }
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [impression, count] of counts) {
    if (count > bestCount) {
      best = impression;
      bestCount = count;
    }
  }
  return best;
}

const AXIS_TO_PERSONA: Record<'emotion' | 'speech' | 'movement', CoachPersonaKey> = {
  emotion: 'emotion',
  speech: 'speech',
  movement: 'body',
};

export function buildAxisBands(aggregation: Aggregation, verdicts: AllVerdicts): FeedbackAxisBand[] {
  const bands: FeedbackAxisBand[] = [];

  (['emotion', 'speech', 'movement'] as const).forEach((axis) => {
    const gap = aggregation.axisProfile[axis];
    if (gap === null) return;
    const band = gapBand(gap);
    const entry = AXIS_BAND_PHRASES[axis];
    let text = entry.bands[band];
    // mid·weak에 misread 템플릿이 있고 최빈 인상이 잡히면 "의도 대신 무엇으로 보였나"로 구체화.
    const template = band === 'mid' || band === 'weak' ? entry.misread?.[band] : undefined;
    if (template) {
      const misread = topMisread(verdicts, AXIS_TO_PERSONA[axis]);
      if (misread) text = template.replace('{x}', misread);
    }
    bands.push({ axis, label: entry.label, band, text });
  });

  // 관객 인상 불일치율 — 의도 대비 "처음 보는 사람" 눈에 어떻게 닿았나(가장 모르는 정보).
  const rate = aggregation.axisProfile.audienceMismatchRate;
  if (rate !== null) {
    const band: OverallBand = rate === 0 ? 'good' : rate < 0.5 ? 'mid' : 'weak';
    const entry = AXIS_BAND_PHRASES.audience;
    bands.push({ axis: 'audience', label: entry.label, band, text: entry.bands[band] });
  }

  return bands;
}

// 전체 흐름 요약 — 축별 평균 갭을 밴드 문구로 번역(시드 유저 r3: "특정 부분만이 아니라 전체가 어땠는지").
// 수치는 표면에 노출하지 않는다 — 어휘 사전 원칙 그대로. ⚠️ 문구 초안 — 코치 검수 전.
// rev.7: 구조화 전경은 buildAxisBands가 담당, 이 한 문단 요약은 하위호환 fallback으로만 유지.
export function overallSummary(aggregation: Aggregation, anchorCount: number): string {
  const parts: string[] = [];
  (['emotion', 'speech', 'movement'] as const).forEach((axis) => {
    const gap = aggregation.axisProfile[axis];
    if (gap === null) return;
    const label = AXIS_SUMMARY_LABEL[axis];
    if (gap <= 0.25) parts.push(`${label}은 의도대로 안정적으로 흘러갔어요`);
    else if (gap <= 0.5) parts.push(`${label}은 대체로 전달됐지만 흔들리는 순간이 있었어요`);
    else parts.push(`${label}은 의도와 어긋나는 순간이 잦았어요`);
  });

  const rate = aggregation.axisProfile.audienceMismatchRate;
  let audience = '';
  if (rate !== null) {
    if (rate === 0) audience = '관객 눈에는 노린 인상이 그대로 잡혔어요.';
    else if (rate < 0.5) audience = '관객 눈에는 한두 군데서 다른 인상으로 잡혔어요.';
    else audience = '관객 눈에는 노린 인상이 절반 넘게 다르게 잡혔어요.';
  }

  if (parts.length === 0 && !audience) return '';
  const body = parts.length > 0 ? `${parts.join('. ')}. ` : '';
  return `구간 전체(포착된 순간 ${anchorCount}곳 기준)로 보면 — ${body}${audience}`.trim();
}

export function assembleCard(input: {
  anchors: Anchor[];
  verdicts: AllVerdicts;
  aggregation: Aggregation;
  diagnosis: Diagnosis | null;
  intent: IntentInfo;
}): CoachFeedback {
  const { anchors, verdicts, aggregation, diagnosis, intent } = input;
  const focusAnchor = findAnchor(anchors, aggregation.focusAnchorId);
  const strengthAnchor = findAnchor(anchors, aggregation.strengthAnchorId);

  // focus 갭 판정을 sceneIntent보다 먼저 계산한다 — misread로 판정된 인상이 의도 요약에 남으면
  // "위에서는 슬픔이 의도, 아래에서는 슬픔이 이탈"이라는 카드 내 모순이 생긴다.
  const entries = focusAnchor
    ? focusVerdicts(verdicts, focusAnchor.anchorId)
      .filter((entry) => GAP_VALUE[entry.verdict.gap_bucket] > 0)
      .sort((a, b) => GAP_VALUE[b.verdict.gap_bucket] - GAP_VALUE[a.verdict.gap_bucket])
    : [];
  const primary = entries[0] ?? null;
  const audienceVerdict = focusAnchor
    ? verdicts.audience.find((verdict) => verdict.anchorId === focusAnchor.anchorId)
    : undefined;
  const misread = primary && primary.verdict.misread_as !== '해당없음'
    ? primary.verdict.misread_as
    : audienceVerdict && audienceVerdict.relevant && audienceVerdict.impression !== '안 잡힘'
      ? audienceVerdict.impression
      : null;

  // 원문 echo만 하지 않는다 — 보강에서 해석한 기대 인상을 함께 보여 "이해했음"을 드러낸다.
  // 보강 실패·confidence 낮음이면 틀린 해석을 보여주는 대신 원문 확인 문구로 폴백.
  const expectedLabel = intent.confidence === '높음'
    ? intent.expectedImpressions.filter((impression) => impression !== misread).join('·')
    : '';
  // 짧은 원문은 그대로 되읽는다 — "내 말을 그대로 받아줬다"가 신뢰 포인트(r2·r3).
  // 길 때만 보강 요약(원문 단어 발췌·재배열)으로 압축하고, 요약을 못 믿으면(낮음) 원문 유지.
  const intentEcho = intent.raw.length > INTENT_ECHO_MAX && intent.summary && intent.confidence === '높음'
    ? intent.summary
    : intent.raw;
  const sceneIntent = {
    text: intentEcho
      ? expectedLabel
        ? `${intentEcho} — 관객에게 ${expectedLabel} 인상으로 닿는 걸 노리신 거죠.`
        : `${intentEcho} — 이렇게 가려 하셨죠.`
      : '이 장면의 의도를 알려주시면 다음 분석이 더 정확해져요.',
    source: intent.raw ? ('actor_input' as const) : ('ai_inferred' as const),
  };

  const axisBands = buildAxisBands(aggregation, verdicts);
  const overallText = overallSummary(aggregation, anchors.length);
  const overall = axisBands.length > 0 || overallText
    ? {
      ...(axisBands.length > 0 ? { axisBands } : {}),
      ...(overallText ? { text: overallText } : {}),
    }
    : undefined;

  // 강점 블록 — aligned 판정을 낸 첫 코치(고정 순서)의 evidence를 어휘 사전으로 번역.
  const tier = diagnosis?.strength_tier ?? (strengthAnchor ? 'execution' : 'encouragement');
  let strength: CoachFeedback['strength'];
  if (strengthAnchor) {
    const alignedEntry = focusVerdicts(verdicts, strengthAnchor.anchorId)
      .find((entry) => entry.verdict.aligned);
    const phrases = alignedEntry ? evidencePhrases(strengthAnchor, alignedEntry.verdict.evidence_refs) : '';
    strength = {
      timecode: strengthAnchor.timecode,
      axis: alignedEntry ? PERSONA_AXIS[alignedEntry.persona] : 'emotion',
      // 신호 나열은 관찰로만 — "의도대로"라는 귀속은 confidence 게이트를 통과한 why 줄에만.
      // 의도문에 없는 신호(시선 등)를 "당신 의도였다"고 단언하면 칭찬 카드 전체가 무너진다(r3).
      signal: phrases
        ? `${whereText(strengthAnchor)} ${phrases}이 또렷하게 잡혔어요.`
        : `${whereText(strengthAnchor)} 흐름이 가장 안정적으로 잡혔어요.`,
      why: STRENGTH_WHY[tier](intent),
      tier,
    };
  } else {
    strength = {
      timecode: anchors[0]?.timecode ?? '0:00',
      axis: 'emotion',
      signal: '이번 구간에서 의도대로 또렷이 작동한 순간은 분리하지 못했어요.',
      why: STRENGTH_WHY.encouragement(intent),
      tier: 'encouragement',
    };
  }

  // focus 블록 — 갭이 전혀 없으면 덕담 대신 "다음 레벨 과제"(잘된 축을 한 단계 밀어붙이는 행동 1개).
  if (!focusAnchor) {
    const progression = PROGRESSION_LIBRARY[strength.axis];
    return {
      sceneIntent,
      overall,
      strength,
      focus: {
        // 어긋난 지점이 없는데 타임코드가 찍히면 자기모순 — 빈 값이면 UI가 칩을 숨긴다.
        timecode: '',
        axes: [strength.axis],
        observedSignal: '이번 구간은 의도와 인상이 어긋난 지점을 찾지 못했어요. 그래서 잘된 축을 한 단계 밀어붙이는 과제를 드려요.',
        rootCause: '',
        intentGap: '',
        prescription: progression.task,
      },
      nextStep: { text: progression.nextStep, action: 'retake_selected_range' },
    };
  }

  const axes = entries.length > 0
    ? Array.from(new Set(entries.map((entry) => PERSONA_AXIS[entry.persona])))
    : (['emotion'] as FeedbackAxis[]);

  const phrases = primary ? evidencePhrases(focusAnchor, primary.verdict.evidence_refs) : '';
  const observedSignal = phrases
    ? `${whereText(focusAnchor)} ${phrases}이 보였어요.`
    : `${whereText(focusAnchor)} 의도와 다른 신호가 보였어요.`;

  // 갭은 기대 인상 대비로 말한다 — 키워드 echo가 아니라 "노린 인상 vs 보인 인상" 비교.
  // misread와 같은 기대 인상은 제외(같은 단어 대 같은 단어 비교 방지), 없으면 키워드만.
  const intentLabel = intent.keywords[0] ?? '의도하신 것';
  const expectedImpression = intent.confidence === '높음'
    ? intent.expectedImpressions.find((impression) => impression !== misread) ?? null
    : null;
  const intended = expectedImpression
    ? `${intentLabel}(${expectedImpression} 인상)을 의도하셨지만`
    : `${withObjectParticle(intentLabel)} 의도하셨지만`;
  const intentGap = misread
    ? `${intended} ${misread}에 가깝게 보였어요.`
    : `${intended} 인상이 또렷이 잡히지 않았어요.`;

  const root = diagnosis ? findRoot(diagnosis.root_cause_id) : null;
  const prescription = diagnosis ? findPrescription(diagnosis.prescription_id) : null;
  const rootMatched = Boolean(root && prescription && prescription.rootId === root.id);

  // 증상→보인 인상 다리 — "왜 하필 그 인상으로 읽혔나" 한 문장. 사전에 있는 조합만, 없으면 침묵.
  const bridge = rootMatched && root && misread ? MISREAD_BRIDGE[root.id]?.[misread] ?? '' : '';

  return {
    sceneIntent,
    overall,
    strength,
    focus: {
      timecode: focusAnchor.timecode,
      axes,
      observedSignal,
      // unlisted — 생성 폴백 없음. 배우 언어로만 말한다(시스템 내부 사정 노출 금지, r3).
      rootCause: rootMatched && root
        ? root.hypothesisText
        : '흔한 패턴으로 딱 떨어지지 않는 신호예요. 원인을 하나로 단정하긴 어려우니, 아래 방법으로 직접 견줘보면서 찾아보세요.',
      intentGap: bridge ? `${intentGap} ${bridge}` : intentGap,
      // unlisted여도 검출 신호를 변인으로 돌려준다 — 비교 테이크에 변인이 있어야 배우가 차이를 발견한다(r3).
      prescription: rootMatched && prescription
        ? prescription.text
        : phrases
          ? `같은 구간을 두 번 찍어 비교해 보세요 — 한 번은 지금처럼(${phrases}), 한 번은 그 부분만 반대로 바꿔서. 나란히 보면 차이가 본인 눈에 먼저 보여요.`
          : '같은 구간을 한 번 더 찍어 둘을 나란히 보며, 어디가 다르게 보이는지 본인 눈으로 확인해 보세요.',
    },
    nextStep: {
      text: `${focusAnchor.timecode} 구간만 다시 찍어보기`,
      action: 'retake_selected_range',
    },
  };
}
