export type SceneAxis = { score: number; comment: string };

export type SceneResult = {
  title: string; // 칭호 (공유 동력)
  score: number; // 합(케미) 총점 60~99
  oneLiner: string; // 위트 총평 1~2문장 (둘의 합 중심)
  axes: {
    voice: SceneAxis; // 발성: 성량·발음·호흡
    emotion: SceneAxis; // 감정: 톤 변화·진정성·몰입
    delivery: SceneAxis; // 전달력: 리듬·속도·강세
    reaction: SceneAxis; // 합/케미: 상대 큐를 받아치는 타이밍·톤 매칭
  };
  strength: string; // 구체적 강점 1개 (필수)
  tip: string; // 다시 해볼 처방 1개
  bestMoment: string; // 사용자 턴 중 가장 살아있던 한 줄 인용 (공유 유발)
  funFallback: boolean; // 무음/장난/대본 무관 입력 감지
};

export type ScenePromptInput = {
  situation: string; // 장면 상황 설명
  scriptText: string; // 주고받은 대본 (A=상대역, U=사용자)
  userLine: string; // 사용자가 맡은 대사
  cueLine: string; // 사용자가 받아친 직전 상대역 대사(큐)
};

// scene 채점 프롬프트. 사용자가 2인 씬에서 받아친 "음성 한 턴"을 직접 듣고
// 발성·감정·전달력 + 받아치기(합)를 재미용 미니 진단으로 채점한다. (lineshot 프롬프트 확장)
// 설계 정본: soma founder/growth/subprojects/scene.md.
export function buildScenePrompt(input: ScenePromptInput): string {
  const cue = input.cueLine.trim();
  const userLine = input.userLine.trim();
  return [
    '너는 따뜻하고 위트 있는 연기 코치다. 사용자가 2인 씬에서 "상대역 AI"와 대사를 주고받았고,',
    '너는 사용자가 받아 녹음한 "음성 한 턴"을 직접 듣고 재미용 미니 합(케미) 진단 카드를 만든다.',
    '이건 정밀 평가가 아니라, 누구나 기분 좋게 한 번 더 하고 싶게 만드는 가벼운 놀이다.',
    '',
    `[씬] ${input.situation}`,
    '[대본] 아래는 주고받은 대본이다. (A=상대역 AI, U=사용자, 녹음한 건 U 턴이다)',
    input.scriptText,
    '',
    cue
      ? `[사용자가 받아친 큐] 직전 상대역(A) 대사는 "${cue}" 였다. 사용자의 U 대사가 이 큐에 자연스럽게 호응했는지로 reaction(합)을 본다.`
      : '[사용자가 받아친 큐] (상대역 큐 없음. 첫 대사라면 장면 시작을 얼마나 잘 여는지로 reaction을 본다.)',
    userLine
      ? `[사용자가 맡은 대사] "${userLine}"  (의도된 대사. 음성이 이와 다르거나 무음/잡음이면 fun_fallback 처리.)`
      : '[사용자가 맡은 대사] (지정 없음. 무음/잡음이면 fun_fallback 처리.)',
    '',
    '[평가 대상] 오직 음성으로 판단 가능한 4축만 본다. 표정·시선·움직임은 보지 않는다(영상이 아니다).',
    '- voice(발성): 성량, 발음 명료도, 호흡 안정',
    '- emotion(감정): 톤 변화, 진정성, 대사 몰입',
    '- delivery(전달력): 리듬, 속도, 강세, 또렷함',
    '- reaction(합/케미): 직전 상대역 큐를 받아치는 타이밍·톤 매칭·리액션. 큐 맥락에 U 대사가 자연스럽게 호응했는가.',
    '',
    '[채점 규칙 — 반드시 지켜라]',
    '1. 모든 점수는 60~99 사이. 절대 60 미만을 주지 마라. 기죽이면 안 된다.',
    '2. strength는 반드시 1개, 실제 들은 음성 근거로 구체적으로. 무엇이 좋았는지 짚어라. (예: "상대 대사를 듣고 한 박자 삼킨 뒤 뱉는 호흡이 좋았어요")',
    '3. tip은 딱 1개, 다시 해볼 수 있는 것. 부담 주지 마라.',
    '4. title은 합 특성에 맞는 위트 있는 칭호. 예시(이 중 고르거나 비슷하게 새로 지어라): 티키타카 장인 / 받아치기 고수 / 감정 싱크로율 甲 / 느와르 듀오 / 청춘 멜로 듀엣 / 반박불가 받아침 / 첫 큐 암살자 / 합 좋은 신예.',
    '5. one_liner는 1~2문장 위트 총평(둘의 합 중심). best_moment는 사용자 턴 중 가장 살아있던 한 줄 인용.',
    '6. 음성이 무음/잡음/대본과 무관/명백한 장난이면 fun_fallback=true. 에러 내지 말고 재밌게 받아치되 점수는 그래도 60+ 부여하고 "한 번 제대로 가보자" 톤으로 응원.',
    '   ⚠️ 또렷한 발화가 실제로 들리지 않으면(무음·숨소리·잡음만) 절대 들은 척 디테일을 지어내지 마라. 들리지도 않은 발성·감정·합을 칭찬하는 것은 금지다. 이 경우 반드시 fun_fallback=true로 하고, 점수는 60~70대, 멘트는 "소리가 거의 안 담겼어요 / 마이크가 비어 있었어요" 톤으로 다시 한 번을 권한다.',
    '7. 외모·성별·나이·정치·비하 금지. 반드시 응원으로 끝낸다.',
    '',
    '[출력] 아래 JSON만 출력. 설명·마크다운·코드펜스 금지.',
    '{"title":"칭호","score":60에서 99 사이 정수,"one_liner":"위트 총평 1~2문장","axes":{"voice":{"score":정수,"comment":"한 줄"},"emotion":{"score":정수,"comment":"한 줄"},"delivery":{"score":정수,"comment":"한 줄"},"reaction":{"score":정수,"comment":"한 줄"}},"strength":"구체적 강점 1개","tip":"다시 해볼 처방 1개","best_moment":"사용자 턴 중 가장 살아있던 한 줄 인용","fun_fallback":false}',
  ].join('\n');
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('씬 응답을 해석하지 못했습니다.');
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

function parseAxis(value: unknown): SceneAxis {
  const axis = (value ?? {}) as Record<string, unknown>;
  return { score: clampScore(axis.score), comment: str(axis.comment) };
}

export function parseScene(text: string): SceneResult {
  const parsed = JSON.parse(extractJson(text)) as Record<string, unknown>;
  const axes = (parsed.axes ?? {}) as Record<string, unknown>;

  const result: SceneResult = {
    title: str(parsed.title),
    score: clampScore(parsed.score),
    oneLiner: str(parsed.one_liner),
    axes: {
      voice: parseAxis(axes.voice),
      emotion: parseAxis(axes.emotion),
      delivery: parseAxis(axes.delivery),
      reaction: parseAxis(axes.reaction),
    },
    strength: str(parsed.strength),
    tip: str(parsed.tip),
    bestMoment: str(parsed.best_moment),
    funFallback: parsed.fun_fallback === true,
  };

  // 칭호·총평이 비면 카드로 성립하지 않는다.
  if (!result.title || !result.oneLiner) {
    throw new Error('씬 응답이 비어 있습니다.');
  }

  return result;
}

// 무음/빈 녹음일 때 Gemini를 부르지 않고 돌려주는 위트 폴백 카드.
// 들은 적 없는 음성을 칭찬하지 않고, "다시 한 번" 톤으로만 응원한다. (lineshot buildSilentFallback과 동일 정책)
export function buildSilentFallback(): SceneResult {
  return {
    title: '미스터리 파트너',
    score: 65,
    oneLiner: '어라, 소리가 거의 안 담겼어요! 🎤 상대역은 던졌는데 받아치는 소리가 안 들렸네요. 한 줄만 다시 또렷하게 가볼까요?',
    axes: {
      voice: { score: 63, comment: '마이크는 잘 잡혔는데 목소리가 아직 안 들어왔어요.' },
      emotion: { score: 66, comment: '여백의 미는 인정! 다음 판엔 감정을 얹어봐요.' },
      delivery: { score: 64, comment: '딱 한 줄만 또렷하게 들려주면 점수가 확 올라요.' },
      reaction: { score: 65, comment: '상대 대사를 듣고 바로 받아치면 합이 살아나요.' },
    },
    strength: '일단 상대역 앞에서 입을 뗐다는 것 — 합을 맞추는 건 거기서 시작해요.',
    tip: '상대역 대사를 한 번 듣고, 바로 이어서 내 대사를 또렷하게 받아쳐 보세요.',
    bestMoment: '',
    funFallback: true,
  };
}
