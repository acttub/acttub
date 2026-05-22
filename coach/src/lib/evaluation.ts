export const ACTING_CATEGORIES = [
  "독백",
  "대사",
  "오디션",
  "감정연기",
  "발성/발음",
  "즉흥",
] as const;

export type ActingCategory = (typeof ACTING_CATEGORIES)[number];

export type EvaluationInput = {
  fileName: string;
  category: string;
  intent: string;
  startTime: number;
  endTime: number;
};

export type CoachFeedback = {
  summary: string;
  weaknesses: string[];
  alignedMoments: string[];
  practiceRecommendations: string[];
};

const FALLBACK_FEEDBACK: CoachFeedback = {
  summary: "분석 결과를 구조화하지 못했습니다. 영상과 의도는 전달됐지만 응답 형식이 맞지 않았습니다.",
  weaknesses: ["응답 형식이 깨져 구체적인 부족한 부분을 분리하지 못했습니다."],
  alignedMoments: ["응답 형식이 깨져 의도에 부합한 부분을 분리하지 못했습니다."],
  practiceRecommendations: ["같은 영상으로 다시 분석을 요청하거나, 의도 설명을 더 구체적으로 입력해 주세요."],
};

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;

  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

export function buildEvaluationPrompt(input: EvaluationInput) {
  const start = formatTime(input.startTime);
  const end = formatTime(input.endTime);

  return `
당신은 연기 코치입니다. 업로드된 연기 연습 영상을 보고 사용자가 다음 연습에서 바로 적용할 수 있는 피드백을 한국어로 작성하세요.

분석 대상:
- 파일명: ${input.fileName}
- 분류: ${input.category}
- 사용자의 연기 의도: ${input.intent}
- 사용자가 선택한 분석 구간: ${start}부터 ${end}까지

평가 기준:
- 감정 전달이 장면의 목표와 맞는지
- 대사 전달력, 발음, 음량, 말의 끝처리가 안정적인지
- 시선, 호흡, 멈춤이 의도적으로 쓰였는지
- 몸 사용, 자세, 움직임이 인물과 상황에 맞는지
- 리듬, 속도, 침묵이 장면을 살리는지
- 사용자가 입력한 의도에 실제 연기가 부합하는지

반드시 아래 JSON 형식만 반환하세요. 마크다운 코드블록은 쓰지 마세요.
{
  "summary": "전체 피드백을 2문장으로 요약",
  "weaknesses": ["부족한 부분 1", "부족한 부분 2", "부족한 부분 3"],
  "alignedMoments": ["의도에 부합한 부분 1", "의도에 부합한 부분 2"],
  "practiceRecommendations": ["구체적인 연습 방식 1", "구체적인 연습 방식 2", "구체적인 연습 방식 3"]
}
`.trim();
}

function extractJson(rawText: string) {
  const trimmed = rawText.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);

  return trimmed;
}

function stringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;

  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return items.length > 0 ? items : fallback;
}

export function parseGeminiFeedback(rawText: string): CoachFeedback {
  try {
    const parsed = JSON.parse(extractJson(rawText)) as Partial<CoachFeedback>;

    return {
      summary:
        typeof parsed.summary === "string" && parsed.summary.trim().length > 0
          ? parsed.summary.trim()
          : FALLBACK_FEEDBACK.summary,
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
