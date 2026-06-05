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

export type EvaluationMetric = {
  label: string;
  score: number;
  note: string;
};

// 우영 피드백 카드 재설계: 강점/약점/처방을 흩지 않고, 한 순간(moment)을
// observed→read→seen→tip 한 흐름으로 묶는다. (Confluence TSSNN 14024706)
export type FeedbackMoment = {
  timecode: string;   // "0:12" — 어디서 (분석 구간 내)
  observed: string;   // 영상에서 실제로 보이거나 들린 사실 (행동·인용 대사·소리)
  read: string;       // "이 상황에서 이렇게 의도/생각하신 것 같다" — 배우 의도 읽기
  seen: string;       // "보는 입장에선 이렇게 보인다" — 제3자 인상(의도와의 갭/일치)
  tip: string;        // "그래서 이렇게 해보길 추천" — 실행 가능한 처방
  aligned: boolean;   // true=의도대로 전달된 강점 / false=의도-인상 갭
};

export type CoachFeedback = {
  summary: string;
  evaluationMetrics: EvaluationMetric[];
  moments: FeedbackMoment[];
};

const DEFAULT_EVALUATION_METRICS: EvaluationMetric[] = [
  { label: '감정 전달', score: 50, note: '응답 형식이 깨져 감정 전달 점수를 확인하지 못했습니다.' },
  { label: '대사 전달', score: 50, note: '응답 형식이 깨져 대사 전달 점수를 확인하지 못했습니다.' },
  { label: '신체 표현', score: 50, note: '응답 형식이 깨져 신체 표현 점수를 확인하지 못했습니다.' },
  { label: '의도 부합', score: 50, note: '응답 형식이 깨져 의도 부합 점수를 확인하지 못했습니다.' },
];

const FALLBACK_FEEDBACK: CoachFeedback = {
  summary: '분석 결과를 구조화하지 못했습니다. 영상과 의도는 전달됐지만 응답 형식이 맞지 않았습니다.',
  evaluationMetrics: DEFAULT_EVALUATION_METRICS,
  moments: [
    {
      timecode: '0:00',
      observed: '응답 형식이 깨져 구체적인 순간을 분리하지 못했습니다.',
      read: '',
      seen: '',
      tip: '같은 영상으로 다시 분석을 요청하거나, 의도 설명을 더 구체적으로 입력해 주세요.',
      aligned: false,
    },
  ],
};

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';

  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;

  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

// L2 종합(Synthesizer): 페르소나 신호 → 배우가 바로 읽을 하나의 피드백.
// 품질의 대부분이 여기서 갈린다.
export function buildSynthesisPrompt(input: {
  category: string;
  intent: string;
  signals: string;
}) {
  return `
당신은 수석 연기 코치입니다. 아래는 감정·화술·신체 코치와 관객이 같은 영상을 보고 낸 신호입니다.
이것들을 배우가 바로 읽을 하나의 피드백으로 종합하세요.

분류: ${input.category}
배우가 밝힌 연기 의도: ${input.intent}

페르소나 신호(JSON):
${input.signals}

종합 규칙(반드시 지킬 것):
0. 일부 코치 신호가 비어 있거나 누락될 수 있다. 없는 신호는 지어내지 말고, 주어진 신호만으로 종합한다.
1. 같은 timecode에 여러 페르소나가 몰린 지점을 우선한다(여러 렌즈가 동의 = 중요). 한 페르소나만 짚은 사소한 건 버린다.
2. 코치 의견과 관객 인상이 갈리는 지점(의도 ≠ 인상)을 핵심 moment로 올린다. 배우가 가장 모르는 정보다.
3. moment는 3~4개만. 각 필드는 1~2문장. 길면 배우가 읽지 않는다. 상세하되 간결하게.
4. moments의 최소 절반은 aligned=true(의도대로 전달된 강점)로 채운다. 배우가 "맞아"라고 수긍할 내용이 절반을 넘어야 한다.
5. 각 moment는 observed(관찰된 사실)→read(의도 읽기)→seen(보는 입장의 인상)→tip(실행 가능한 처방) 흐름을 끊지 않는다.
6. 추상적·문학적 표현('스며든다', '녹아든다' 등) 금지. 관찰 가능한 행동과 소리로 쓴다. 카메라에 안 잡힌 부분은 다루지 않는다.

evaluationMetrics 점수 기준(0~100 정수): 85+ 의도·장면에 잘 부합·근거 분명·보완 사소 / 70~84 대체로 구현·보완 1~2개 / 55~69 일부 구현·강약 비등 / 40~54 핵심 흐릿·기본기 우선 / 0~39 의도 어긋남.

반드시 아래 JSON만 반환하세요. 마크다운 코드블록은 쓰지 마세요.
{
  "summary": "가장 중요한 한 가지를 중심으로 2문장 이내",
  "evaluationMetrics": [
    { "label": "감정 전달", "score": 75, "note": "짧은 근거 한 구절" },
    { "label": "대사 전달", "score": 75, "note": "짧은 근거 한 구절" },
    { "label": "신체 표현", "score": 75, "note": "짧은 근거 한 구절" },
    { "label": "의도 부합", "score": 75, "note": "짧은 근거 한 구절" }
  ],
  "moments": [
    { "timecode": "0:12", "observed": "관찰된 사실(대사 인용/행동)", "read": "이렇게 의도하신 듯", "seen": "보는 입장에선 이렇게 보임", "tip": "이렇게 해보길 추천", "aligned": false }
  ]
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

function scoreFromValue(value: unknown) {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) return 50;

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function metricArray(value: unknown) {
  if (!Array.isArray(value)) return FALLBACK_FEEDBACK.evaluationMetrics;

  const metrics = value
    .map((item, index): EvaluationMetric | null => {
      if (!item || typeof item !== 'object') return null;

      const record = item as Record<string, unknown>;
      const fallback = DEFAULT_EVALUATION_METRICS[index] ?? DEFAULT_EVALUATION_METRICS[0];
      const label = typeof record.label === 'string' && record.label.trim().length > 0 ? record.label.trim() : fallback.label;
      const note = typeof record.note === 'string' && record.note.trim().length > 0 ? record.note.trim() : fallback.note;

      return {
        label,
        score: scoreFromValue(record.score),
        note,
      };
    })
    .filter((item): item is EvaluationMetric => item !== null);

  if (metrics.length === 0) return FALLBACK_FEEDBACK.evaluationMetrics;

  return DEFAULT_EVALUATION_METRICS.map((fallback, index) => metrics[index] ?? fallback);
}

function textField(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

// 모델이 boolean 대신 "true"/"false" 문자열을 줄 수 있어 느슨하게 해석한다.
function booleanField(value: unknown) {
  return value === true || (typeof value === 'string' && value.trim().toLowerCase() === 'true');
}

function momentArray(value: unknown): FeedbackMoment[] {
  if (!Array.isArray(value)) return FALLBACK_FEEDBACK.moments;

  const moments = value
    .map((item): FeedbackMoment | null => {
      if (!item || typeof item !== 'object') return null;

      const record = item as Record<string, unknown>;
      const observed = textField(record.observed);
      const tip = textField(record.tip);
      // 관찰도 처방도 없는 빈 카드는 버린다.
      if (!observed && !tip) return null;

      return {
        timecode: textField(record.timecode) || '0:00',
        observed,
        read: textField(record.read),
        seen: textField(record.seen),
        tip,
        aligned: booleanField(record.aligned),
      };
    })
    .filter((item): item is FeedbackMoment => item !== null);

  return moments.length > 0 ? moments : FALLBACK_FEEDBACK.moments;
}

export function parseGeminiFeedback(rawText: string): CoachFeedback {
  try {
    const parsed = JSON.parse(extractJson(rawText)) as Partial<CoachFeedback>;

    return {
      summary:
        typeof parsed.summary === 'string' && parsed.summary.trim().length > 0
          ? parsed.summary.trim()
          : FALLBACK_FEEDBACK.summary,
      evaluationMetrics: metricArray(parsed.evaluationMetrics),
      moments: momentArray(parsed.moments),
    };
  } catch {
    return FALLBACK_FEEDBACK;
  }
}
