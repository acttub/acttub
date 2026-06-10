export const ACTING_CATEGORIES = [
  '독백',
  '대사',
  '오디션',
  '감정연기',
  '발성/발음',
  '즉흥',
] as const;

export type ActingCategory = (typeof ACTING_CATEGORIES)[number];

export type EvaluationInput = {
  fileName: string;
  category: string;
  intent: string;
  startTime: number;
  endTime: number;
};

// SOMA-60/62 단일 초점 카드. 배우가 보는 표면은 한 번에 하나(딱 하나)만 짚는다.
// 내부 라벨(axis/tier/root)은 데이터엔 있되 화면엔 배우 언어로만 노출한다.

// SOMA-59 4축 → 코드값 (SOMA-62 §3)
export type FeedbackAxis = 'emotion' | 'speech' | 'face' | 'movement';

// 의도 출처 — 배우 입력 / AI 추정 / 배우 확인 (SOMA-60 블록0)
export type IntentSource = 'actor_input' | 'ai_inferred' | 'actor_confirmed';

// 강점 계단식 폴백 — 실행 강점 → 시도·선택 → 정직한 격려 (SOMA-60)
export type StrengthTier = 'execution' | 'attempt' | 'encouragement';

// 다음 한 걸음 행동 종류 (SOMA-62)
export type NextAction = 'retake_selected_range';

const FEEDBACK_AXES: readonly FeedbackAxis[] = ['emotion', 'speech', 'face', 'movement'];
const INTENT_SOURCES: readonly IntentSource[] = ['actor_input', 'ai_inferred', 'actor_confirmed'];
const STRENGTH_TIERS: readonly StrengthTier[] = ['execution', 'attempt', 'encouragement'];

// 블록0 — 의도 되짚기
export type SceneIntent = {
  text: string;
  source: IntentSource;
};

// 블록1 — 잘된 순간 (필수 1개, 폴백 tier라도 채움)
export type FeedbackStrength = {
  timecode: string;
  axis: FeedbackAxis;
  signal: string; // 무엇이 보였나 (관찰)
  why: string; // 왜 좋았나 (의도대로 작동한 지점)
  tier: StrengthTier;
};

// 블록2 — 이번에 딱 하나 (정확히 1개, 의도 격차로 선정)
export type FeedbackFocus = {
  timecode: string;
  axes: FeedbackAxis[];
  observedSignal: string; // 어디서·무엇이
  rootCause: string; // 왜 (root, 의도 격차로)
  intentGap: string; // 하려던 것 대비 이렇게 보였다
  prescription: string; // 무엇을·어떻게 고치나 (당장 1줄)
};

// 블록3 — 다음 한 걸음 (행동·범위만, 처방 반복 금지)
export type FeedbackNextStep = {
  text: string;
  action: NextAction;
};

export type CoachFeedback = {
  sceneIntent: SceneIntent;
  strength: FeedbackStrength;
  focus: FeedbackFocus;
  nextStep: FeedbackNextStep;
};

const FALLBACK_FEEDBACK: CoachFeedback = {
  sceneIntent: {
    text: '의도를 다시 읽지 못했어요. 의도 설명을 더 구체적으로 입력하고 다시 분석해 주세요.',
    source: 'ai_inferred',
  },
  strength: {
    timecode: '0:00',
    axis: 'emotion',
    signal: '응답 형식이 깨져 잘된 순간을 분리하지 못했어요.',
    why: '이 장면을 끝까지 해본 시도 자체는 다음 분석의 출발점이 돼요.',
    tier: 'encouragement',
  },
  focus: {
    timecode: '0:00',
    axes: ['emotion'],
    observedSignal: '분석 결과를 구조화하지 못했어요.',
    rootCause: '응답 형식이 맞지 않았어요. 영상과 의도는 전달됐어요.',
    intentGap: '',
    prescription: '같은 영상으로 다시 분석을 요청하거나, 의도 설명을 더 구체적으로 적어 주세요.',
  },
  nextStep: {
    text: '같은 구간으로 다시 분석해 보기',
    action: 'retake_selected_range',
  },
};

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';

  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;

  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

// L2 종합(Synthesizer): 페르소나 신호 → 배우가 바로 읽을 단일 초점 카드.
// 품질의 대부분이 여기서 갈린다. (SOMA-60 카드 구조 + SOMA-63 톤)
export function buildSynthesisPrompt(input: {
  category: string;
  intent: string;
  signals: string;
}) {
  return `
당신은 수석 연기 코치입니다. 아래는 감정·화술·신체 코치와 관객이 같은 영상을 보고 낸 신호입니다.
이것들을 배우가 바로 읽을 "단일 초점 피드백 카드" 하나로 종합하세요. 한 번에 하나만 짚습니다.

분류: ${input.category}
배우가 밝힌 연기 의도: ${input.intent}

페르소나 신호(JSON):
${input.signals}

카드 구성(반드시 이 4블록):
0. scene_intent — 배우 의도를 한 문장으로 되짚는다. 의도가 주어졌으면 source는 "actor_input".
1. strength — 의도대로 작동한 "잘된 순간" 1개. timecode + 무엇이 보였나(signal) + 왜 좋았나(why).
   - 진짜 실행 강점이 있으면 tier="execution".
   - 실행 강점이 없으면 구체적 시도·선택을 tier="attempt"로, 그것도 없으면 정직한 격려를 tier="encouragement"로.
   - 절대 거짓·추상 칭찬("좋았어요") 금지. 강점은 반드시 1개 채운다.
2. focus — "이번에 딱 하나". root 원인을 1개만 고른다.
   - 고르는 기준: "제일 못한 것"이 아니라 "배우가 하려던 걸 가장 막은 것"(의도 격차 최대).
   - observed_signal(어디서·무엇이) → root_cause(왜, 표면 증상 말고 뿌리) → intent_gap(하려던 것 대비 이렇게 보였다) → prescription(무엇을 어떻게, 당장 해볼 한 줄).
3. next_step — 그 처방을 지금 바로 하게 만드는 행동 1개. 행동·범위만(예: "도입부만 다시"). 처방 문장을 반복하지 않는다.

종합 규칙(반드시 지킬 것):
0. 일부 코치 신호가 비어 있거나 누락될 수 있다. 없는 신호는 지어내지 말고, 주어진 신호만으로 종합한다.
1. 같은 timecode에 여러 페르소나가 몰린 지점을 우선한다(여러 렌즈가 동의 = 중요).
2. 코치 의견과 관객 인상이 갈리는 지점(의도 ≠ 인상)을 focus의 root로 올린다. 배우가 가장 모르는 정보다.
3. 모든 블록은 timecode 또는 대사 인용으로 "어디서"를 박는다. 추상 금지.
4. 배우 언어로 쓴다. 2인칭 존댓말(~했어요, ~해봐요), 제안형(~해보면 어때요). 평가관·심사 톤 금지.
5. 관찰은 단정해도 되지만(굳어 있었어요), 추정은 "~같아요"로 여지를 남긴다.
6. 내부 라벨은 text에 그대로 쓰지 않는다. axis/tier/axes는 분류 필드로만 채우고, signal/why/root_cause/prescription 같은 문장엔 배우 언어로 풀어 쓴다.
7. 추상적·문학적 표현('스며든다','녹아든다') 금지. 카메라에 안 잡힌 부분은 다루지 않는다.

axis/axes 값은 emotion(감정 표현) · speech(대사 전달력) · face(표정·시선) · movement(움직임) 중에서만 고른다.

반드시 아래 JSON만 반환하세요. 마크다운 코드블록은 쓰지 마세요.
{
  "scene_intent": { "text": "이 장면에서 이렇게 하려 하셨죠", "source": "actor_input" },
  "strength": { "timecode": "0:48", "axis": "emotion", "signal": "관찰된 잘된 순간(대사 인용/행동)", "why": "이게 왜 의도대로였나", "tier": "execution" },
  "focus": { "timecode": "0:00-0:15", "axes": ["emotion"], "observed_signal": "어디서 무엇이", "root_cause": "왜(뿌리)", "intent_gap": "하려던 것 대비 이렇게 보였다", "prescription": "무엇을 어떻게(당장 한 줄)" },
  "next_step": { "text": "도입부만 다시", "action": "retake_selected_range" }
}
`.trim();
}

function extractJson(rawText: string) {
  const trimmed = rawText.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);

  return trimmed;
}

function textField(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function enumField<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function axesField(value: unknown): FeedbackAxis[] {
  if (!Array.isArray(value)) return [];
  const axes = value
    .map((item) => (typeof item === 'string' && (FEEDBACK_AXES as readonly string[]).includes(item) ? (item as FeedbackAxis) : null))
    .filter((item): item is FeedbackAxis => item !== null);
  return Array.from(new Set(axes));
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function parseSceneIntent(value: unknown): SceneIntent {
  const data = record(value);
  const text = textField(data.text);
  if (!text) return FALLBACK_FEEDBACK.sceneIntent;
  return {
    text,
    source: enumField(data.source, INTENT_SOURCES, 'actor_input'),
  };
}

function parseStrength(value: unknown): FeedbackStrength {
  const data = record(value);
  const signal = textField(data.signal);
  const why = textField(data.why);
  // 강점은 필수 — 관찰도 이유도 비면 폴백으로 채운다.
  if (!signal && !why) return FALLBACK_FEEDBACK.strength;
  return {
    timecode: textField(data.timecode) || '0:00',
    axis: enumField(data.axis, FEEDBACK_AXES, 'emotion'),
    signal: signal || why,
    why: why || signal,
    tier: enumField(data.tier, STRENGTH_TIERS, 'attempt'),
  };
}

function parseFocus(value: unknown): FeedbackFocus {
  const data = record(value);
  const observedSignal = textField(data.observed_signal);
  const rootCause = textField(data.root_cause);
  const prescription = textField(data.prescription);
  // 진단·처방이 둘 다 비면 카드로서 의미가 없다 → 폴백.
  if (!rootCause && !prescription && !observedSignal) return FALLBACK_FEEDBACK.focus;
  const axes = axesField(data.axes);
  return {
    timecode: textField(data.timecode) || '0:00',
    axes: axes.length > 0 ? axes : ['emotion'],
    observedSignal,
    rootCause,
    intentGap: textField(data.intent_gap),
    prescription,
  };
}

function parseNextStep(value: unknown): FeedbackNextStep {
  const data = record(value);
  const text = textField(data.text);
  if (!text) return FALLBACK_FEEDBACK.nextStep;
  return {
    text,
    action: enumField(data.action, ['retake_selected_range'] as const, 'retake_selected_range'),
  };
}

export function parseGeminiFeedback(rawText: string): CoachFeedback {
  try {
    const parsed = JSON.parse(extractJson(rawText)) as Record<string, unknown>;

    return {
      sceneIntent: parseSceneIntent(parsed.scene_intent),
      strength: parseStrength(parsed.strength),
      focus: parseFocus(parsed.focus),
      nextStep: parseNextStep(parsed.next_step),
    };
  } catch {
    return FALLBACK_FEEDBACK;
  }
}
