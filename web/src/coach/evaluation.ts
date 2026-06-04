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

export type CoachFeedback = {
  summary: string;
  evaluationMetrics: EvaluationMetric[];
  weaknesses: string[];
  alignedMoments: string[];
  practiceRecommendations: string[];
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
  weaknesses: ['응답 형식이 깨져 구체적인 부족한 부분을 분리하지 못했습니다.'],
  alignedMoments: ['응답 형식이 깨져 의도에 부합한 부분을 분리하지 못했습니다.'],
  practiceRecommendations: ['같은 영상으로 다시 분석을 요청하거나, 의도 설명을 더 구체적으로 입력해 주세요.'],
};

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';

  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;

  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

export function buildEvaluationPrompt(input: EvaluationInput) {
  const start = formatTime(input.startTime);
  const end = formatTime(input.endTime);

  return `
당신은 연기 코치입니다. 업로드된 연기 연습 영상을 보고, 배우가 다음 연습에서 바로 적용할 수 있는 피드백을 한국어로 작성하세요.

분석 대상:
- 파일명: ${input.fileName}
- 분류: ${input.category}
- 배우가 밝힌 연기 의도: ${input.intent}
- 분석 구간: ${start} ~ ${end}

피드백 원칙 (반드시 지킬 것):
1. 근거를 명시한다. 모든 지적·강점·처방에는 "어디서"(분석 구간 내 0:00 형식 타임코드)와 "무엇이 보였는지"(구체적 행동·인용한 대사·소리)를 함께 적는다. "감정이 얕다", "발음이 명확하다"처럼 지점 없는 총평은 금지한다.
2. 배우의 의도와 장면의 서브텍스트를 먼저 존중한다. 위 '연기 의도'와 장면 상황에서 이 인물이 처한 정서의 결을 먼저 추론하고, 그 결에 맞춰 평가한다. 상황에 맞지 않는 더 큰 감정(예: 단순한 투정 장면에 '절박함')을 요구하지 않는다. 배우가 의도적으로 선택한 톤(가벼움·절제 등)은 결함이 아니라 선택으로 보고, 그 선택이 의도를 살렸다면 강점으로 인정한다.
3. 증상이 아니라 원인과 처방을 말한다. "단조롭다"로 끝내지 말고, 무엇 때문에 그렇게 들리는지(원인) → 다음 연습에서 무엇을 바꾸면 되는지(실행 가능한 처방)까지 연결한다.
4. 처방은 이 영상의 촬영 조건에서 실제로 보이거나 들릴 수 있는 것만 제안한다. 화면 프레임(상반신 위주 등)에 잡히지 않는 행동(예: 손가락 움직임)은 화면에 드러난 경우에만 다루고, 카메라에 안 잡히는 부분은 처방하지 않는다.
5. 강점은 반드시 '무엇을' 잘했는지 기술 단위로 적는다. "좋았다"가 아니라, 어떤 선택·기술(호흡 조절, 멈춤, 시선 처리 등)이 의도를 어떻게 살렸는지 구체적으로 서술한다.
6. 추상적·문학적 표현('스며든다', '녹아든다' 등)을 피하고, 관찰 가능한 행동과 소리로 서술한다.

평가 축(evaluationMetrics):
- 감정 전달: 표현된 감정이 의도·장면 서브텍스트와 맞는지 (과하거나 모자란 경우 모두)
- 대사 전달: 발음·음량·말끝 처리·속도가 안정적인지
- 신체 표현: 화면에 보이는 자세·움직임·시선·호흡이 인물과 상황에 맞는지
- 의도 부합: 배우가 밝힌 의도가 실제 연기로 구현됐는지

score 채점 기준 (0~100 정수, 축마다 동일하게 적용):
- 85~100: 해당 축이 의도·장면에 잘 부합하고, 영상에서 근거를 분명히 짚을 수 있으며 보완점이 사소함.
- 70~84: 의도가 대체로 구현됐으나 구체적인 보완점이 1~2개 있음.
- 55~69: 의도가 일부만 구현됐고 보완점이 여럿이거나, 강점과 약점이 비등함.
- 40~54: 핵심 의도가 흐릿하게만 전달되고 기본기 보완이 우선 필요함.
- 0~39: 의도와 어긋나거나 해당 축의 기본기가 거의 드러나지 않음.
점수는 위 기준의 어느 구간에 해당하는지 판단해 정하고, note에 그 점수를 뒷받침하는 근거 지점을 적는다.

반드시 아래 JSON 형식만 반환하세요. 마크다운 코드블록은 쓰지 마세요. evaluationMetrics의 score는 0부터 100까지의 정수입니다. summary를 제외한 모든 문장에는 가능한 한 타임코드(0:00) 또는 인용한 대사를 포함하세요.
{
  "summary": "전체 피드백을 2문장으로 요약",
  "evaluationMetrics": [
    { "label": "감정 전달", "score": 75, "note": "감정 전달 평가 한 문장(근거 지점 포함)" },
    { "label": "대사 전달", "score": 75, "note": "대사 전달 평가 한 문장(근거 지점 포함)" },
    { "label": "신체 표현", "score": 75, "note": "신체 표현 평가 한 문장(근거 지점 포함)" },
    { "label": "의도 부합", "score": 75, "note": "사용자 의도와의 부합 평가 한 문장(근거 지점 포함)" }
  ],
  "weaknesses": ["부족한 부분 1(원인+근거 지점)", "부족한 부분 2", "부족한 부분 3"],
  "alignedMoments": ["잘한 부분 1(무엇을 잘했는지+근거 지점)", "잘한 부분 2"],
  "practiceRecommendations": ["구체적·실행가능 연습 1", "구체적·실행가능 연습 2", "구체적·실행가능 연습 3"]
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

function stringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;

  const items = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  return items.length > 0 ? items : fallback;
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

export function parseGeminiFeedback(rawText: string): CoachFeedback {
  try {
    const parsed = JSON.parse(extractJson(rawText)) as Partial<CoachFeedback>;

    return {
      summary:
        typeof parsed.summary === 'string' && parsed.summary.trim().length > 0
          ? parsed.summary.trim()
          : FALLBACK_FEEDBACK.summary,
      evaluationMetrics: metricArray(parsed.evaluationMetrics),
      weaknesses: stringArray(parsed.weaknesses, FALLBACK_FEEDBACK.weaknesses),
      alignedMoments: stringArray(parsed.alignedMoments, FALLBACK_FEEDBACK.alignedMoments),
      practiceRecommendations: stringArray(
        parsed.practiceRecommendations,
        FALLBACK_FEEDBACK.practiceRecommendations,
      ),
    };
  } catch {
    return FALLBACK_FEEDBACK;
  }
}
