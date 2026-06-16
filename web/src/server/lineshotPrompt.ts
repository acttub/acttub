export type LineshotAxis = { score: number; comment: string };

export type Lineshot = {
  title: string; // 칭호 (공유 동력)
  score: number; // 총점 60~99
  oneLiner: string; // 위트 총평 1~2문장
  axes: {
    voice: LineshotAxis; // 발성: 성량·발음·호흡
    emotion: LineshotAxis; // 감정: 톤 변화·진정성·몰입
    delivery: LineshotAxis; // 전달력: 리듬·속도·강세·또렷함
  };
  strength: string; // 구체적 강점 1개 (필수)
  tip: string; // 10초 안에 해볼 처방 1개
  actorVibe: string; // "○○ 같은 톤" (공유 유발)
  funFallback: boolean; // 무음/장난/대사 무관 입력 감지
};

// 라인샷 채점 프롬프트. 음성을 직접 듣고 발성·감정·전달력을 재미용 미니 진단으로 채점한다.
// 설계 정본: soma founder/growth/subprojects/lineshot.md, Confluence TSSNN page 20054028.
export function buildLineshotPrompt(line: string): string {
  const target = line.trim();
  return [
    '너는 따뜻하고 위트 있는 연기 코치다. 사용자가 대사 한 줄을 녹음했고, 너는 그 "음성"을 직접 듣고',
    '재미용 미니 진단 카드를 만든다. 이건 정밀 평가가 아니라, 누구나 기분 좋게 한 번 더 하고 싶게 만드는 가벼운 놀이다.',
    '',
    '[평가 대상] 오직 음성으로 판단 가능한 3축만 본다. 표정·움직임은 보지 않는다(영상이 아니다).',
    '- voice(발성): 성량, 발음 명료도, 호흡 안정',
    '- emotion(감정): 톤 변화, 진정성, 대사 몰입',
    '- delivery(전달력): 리듬, 속도, 강세, 또렷함',
    '',
    target
      ? `[제시 대사] "${target}"  (의도된 대사. 음성이 이와 다르거나 무음/잡음이면 fun_fallback 처리.)`
      : '[제시 대사] (지정 없음. 사용자가 자유롭게 연기했다. 무음/잡음이면 fun_fallback 처리.)',
    '',
    '[채점 규칙 — 반드시 지켜라]',
    '1. 모든 점수는 60~99 사이. 절대 60 미만을 주지 마라. 기죽이면 안 된다.',
    '2. strength는 반드시 1개, 실제 들은 음성 근거로 구체적으로. (예: "두 번째 음절에서 숨을 참았다가 터뜨리는 호흡이 좋았어요")',
    '3. tip은 딱 1개, 10초 안에 다시 해볼 수 있는 것. 부담 주지 마라.',
    '4. title은 음성 특성에 맞는 위트 있는 칭호. 예시(이 중 고르거나 비슷하게 새로 지어라): 신스틸러 / 발음 장인 / 감정 폭격기 / 느와르 보이스 / 청춘 멜로 / 따뜻한 라디오 보이스 / 무대 장악형 / 잠재력 원석 / 반전 매력 / 첫 줄 암살자.',
    '5. one_liner는 1~2문장 위트 총평. actor_vibe는 "○○ 같은 톤" 한 줄(공유 유발용, 가벼운 비유).',
    '6. 음성이 무음/잡음/대사와 무관/명백한 장난이면 fun_fallback=true. 에러 내지 말고 재밌게 받아치되 점수는 그래도 60+ 부여하고 "한 번 제대로 가보자" 톤으로 응원.',
    '7. 외모·성별·나이·정치·비하 금지. 반드시 응원으로 끝낸다.',
    '',
    '[출력] 아래 JSON만 출력. 설명·마크다운·코드펜스 금지.',
    '{"title":"칭호","score":60에서 99 사이 정수,"one_liner":"위트 총평 1~2문장","axes":{"voice":{"score":정수,"comment":"한 줄"},"emotion":{"score":정수,"comment":"한 줄"},"delivery":{"score":정수,"comment":"한 줄"}},"strength":"구체적 강점 1개","tip":"10초 안에 해볼 처방 1개","actor_vibe":"○○ 같은 톤","fun_fallback":false}',
  ].join('\n');
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('라인샷 응답을 해석하지 못했습니다.');
  }
  return raw.slice(start, end + 1);
}

// 재미용 진단이라 점수 하한은 60. 절대 기죽이지 않는다.
function clampScore(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? Math.min(99, Math.max(60, Math.round(num))) : 75;
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseAxis(value: unknown): LineshotAxis {
  const axis = (value ?? {}) as Record<string, unknown>;
  return { score: clampScore(axis.score), comment: str(axis.comment) };
}

export function parseLineshot(text: string): Lineshot {
  const parsed = JSON.parse(extractJson(text)) as Record<string, unknown>;
  const axes = (parsed.axes ?? {}) as Record<string, unknown>;

  const result: Lineshot = {
    title: str(parsed.title),
    score: clampScore(parsed.score),
    oneLiner: str(parsed.one_liner),
    axes: {
      voice: parseAxis(axes.voice),
      emotion: parseAxis(axes.emotion),
      delivery: parseAxis(axes.delivery),
    },
    strength: str(parsed.strength),
    tip: str(parsed.tip),
    actorVibe: str(parsed.actor_vibe),
    funFallback: parsed.fun_fallback === true,
  };

  // 칭호·총평이 비면 카드로 성립하지 않는다.
  if (!result.title || !result.oneLiner) {
    throw new Error('라인샷 응답이 비어 있습니다.');
  }

  return result;
}
