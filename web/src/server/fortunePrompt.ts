export type FortuneAspect = { stars: number; comment: string };

export type Fortune = {
  overall: { stars: number; summary: string };
  aspects: {
    emotion: FortuneAspect; // 감정 연기운
    delivery: FortuneAspect; // 대사·발성운
    focus: FortuneAspect; // 현장·집중운
    rapport: FortuneAspect; // 호흡·관계운
  };
  lucky: {
    emotion: string; // 행운의 감정 키워드
    warmup: string; // 행운의 워밍업
    mood: string; // 행운의 무드(색/분위기)
  };
  line: { quote: string; note: string }; // 명대사 + 연기 조언
  mission: string; // 30초 미션
  caution: string; // 주의 한마디
};

export type FortuneSeed = {
  birth: string;
  role: string;
  work: string;
};

export function buildFortunePrompt(seed: FortuneSeed): string {
  return [
    '너는 배우를 위한 "연기 운세"를 봐주는 점술가다. 아래 정보로 풍성한 하루치 연기 운세를 만들어라.',
    `생일: ${seed.birth} (별자리/사주 느낌의 운세 톤)`,
    `배역: ${seed.role}`,
    `작품: ${seed.work}`,
    '',
    '톤: 가볍고 위트있게(MZ 운세 앱). 진지하게 가르치지 말고 점괘처럼. 배역·작품·생일을 반드시 살려 "내 얘기" 같게 개인화.',
    '내용 규칙:',
    '- overall.summary: 2~3문장. 별자리/사주 톤으로 배역·작품의 성격을 엮은 오늘의 총평.',
    '- aspects: 4개 항목 각각 stars(1~5 정수)와 한 줄 comment. emotion=감정 연기운, delivery=대사·발성운, focus=현장·집중운(무대/카메라), rapport=상대 배우와의 호흡·관계운.',
    '- lucky.emotion: 오늘 살리면 좋은 감정 키워드. lucky.warmup: 30초 워밍업 한 줄. lucky.mood: 어울리는 색이나 분위기 한 줄.',
    '- line.quote: 작품 맥락의 유명한 명대사(애매하면 느낌으로). line.note: 그 대사를 오늘 어떻게 칠지 한 줄 조언.',
    '- mission: 30초 안에 할 수 있는 가벼운 연습. caution: 오늘 조심할 점 한 줄.',
    '아래 JSON만 출력(설명·코드펜스 없이):',
    '{"overall":{"stars":1에서 5 사이 정수,"summary":"2~3문장 총평"},"aspects":{"emotion":{"stars":정수,"comment":"한 줄"},"delivery":{"stars":정수,"comment":"한 줄"},"focus":{"stars":정수,"comment":"한 줄"},"rapport":{"stars":정수,"comment":"한 줄"}},"lucky":{"emotion":"감정 키워드","warmup":"워밍업 한 줄","mood":"색/분위기 한 줄"},"line":{"quote":"명대사","note":"연기 조언 한 줄"},"mission":"미션","caution":"주의 한 줄"}',
  ].join('\n');
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('운세 응답을 해석하지 못했습니다.');
  }
  return raw.slice(start, end + 1);
}

function clampStars(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? Math.min(5, Math.max(1, Math.round(num))) : 3;
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseAspect(value: unknown): FortuneAspect {
  const aspect = (value ?? {}) as Record<string, unknown>;
  return { stars: clampStars(aspect.stars), comment: str(aspect.comment) };
}

export function parseFortune(text: string): Fortune {
  const parsed = JSON.parse(extractJson(text)) as Record<string, unknown>;
  const overall = (parsed.overall ?? {}) as Record<string, unknown>;
  const aspects = (parsed.aspects ?? {}) as Record<string, unknown>;
  const lucky = (parsed.lucky ?? {}) as Record<string, unknown>;
  const line = (parsed.line ?? {}) as Record<string, unknown>;

  const fortune: Fortune = {
    overall: { stars: clampStars(overall.stars), summary: str(overall.summary) },
    aspects: {
      emotion: parseAspect(aspects.emotion),
      delivery: parseAspect(aspects.delivery),
      focus: parseAspect(aspects.focus),
      rapport: parseAspect(aspects.rapport),
    },
    lucky: { emotion: str(lucky.emotion), warmup: str(lucky.warmup), mood: str(lucky.mood) },
    line: { quote: str(line.quote), note: str(line.note) },
    mission: str(parsed.mission),
    caution: str(parsed.caution),
  };

  // 핵심 필드가 비면 운세로 성립하지 않는다.
  if (!fortune.overall.summary || !fortune.line.quote || !fortune.mission) {
    throw new Error('운세 응답이 비어 있습니다.');
  }

  return fortune;
}
