export type Fortune = {
  oneLiner: string;
  emotion: string;
  condition: { stars: number; comment: string };
  line: string;
  mission: string;
};

export type FortuneSeed = {
  birth: string;
  role: string;
  work: string;
};

export function buildFortunePrompt(seed: FortuneSeed): string {
  return [
    '너는 배우를 위한 "연기 운세"를 봐주는 점술가다. 아래 정보로 연기 운세를 만들어라.',
    `생일: ${seed.birth} (별자리/사주 느낌의 운세 톤)`,
    `배역: ${seed.role}`,
    `작품: ${seed.work}`,
    '',
    '톤: 가볍고 위트있게(MZ 운세 앱). 배역·작품을 살려 개인화. 명대사는 작품 맥락의 유명한 것(애매하면 느낌). 감정은 짧게. 미션은 30초 내 가벼운 연습.',
    '아래 JSON만 출력(설명·코드펜스 없이):',
    '{"oneLiner":"한 줄","emotion":"감정 키워드","condition":{"stars":1에서 5 사이 정수,"comment":"컨디션 한 줄"},"line":"명대사","mission":"미션"}',
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

export function parseFortune(text: string): Fortune {
  const parsed = JSON.parse(extractJson(text)) as Record<string, unknown>;
  const condition = (parsed.condition ?? {}) as Record<string, unknown>;
  const starsNum = Number(condition.stars);
  const stars = Number.isFinite(starsNum) ? Math.min(5, Math.max(1, Math.round(starsNum))) : 3;
  const str = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

  const fortune: Fortune = {
    oneLiner: str(parsed.oneLiner),
    emotion: str(parsed.emotion),
    condition: { stars, comment: str(condition.comment) },
    line: str(parsed.line),
    mission: str(parsed.mission),
  };

  if (!fortune.oneLiner || !fortune.emotion || !fortune.line || !fortune.mission) {
    throw new Error('운세 응답이 비어 있습니다.');
  }

  return fortune;
}
