// 멀티 페르소나 피드백 파이프라인.
// L0 Observer(영상 1회) → L1 페르소나 4(텍스트, 관찰 위에서 병렬) → L2 Synthesizer(evaluation.ts).
// 영상 토큰은 L0 한 번만 쓰고, 페르소나는 같은 '관찰 기록'을 공유해 사실이 갈리지 않게 한다.

export type PersonaSignal = {
  timecode: string;
  observed: string;
  read: string;
  seen: string;
  tip: string;
  aligned: boolean;
};

export type Persona = {
  key: string;
  role: string;
  lens: string;
  rubric: string;
};

export const PERSONAS: Persona[] = [
  {
    key: 'emotion',
    role: '감정 연기 코치',
    lens: '표현된 감정이 배우 의도·장면 서브텍스트와 맞는지(과하거나 모자란 것 모두).',
    rubric: '의도한 톤(가벼움·절제 등)은 결함이 아니라 선택으로 본다. 상황에 안 맞는 더 큰 감정을 강요하지 않는다.',
  },
  {
    key: 'speech',
    role: '화술(발성·발음) 코치',
    lens: '발음 명료도·음량·말끝 처리·속도·호흡의 안정성.',
    rubric: '소리로 들리는 근거만 쓴다. 말끝이 뭉개진 단어는 해당 대사를 인용한다.',
  },
  {
    key: 'body',
    role: '신체 표현 코치',
    lens: '화면에 보이는 자세·시선·움직임·호흡이 인물·상황에 맞는지.',
    rubric: '카메라 프레임 밖(손동작 등)은 다루지 않는다. 화면에 드러난 것만 평가한다.',
  },
  {
    key: 'audience',
    role: '연기를 처음 보는 관객',
    lens: '연기 지식 없이, 이 장면이 보는 사람에게 어떤 인상·감정으로 닿는지.',
    rubric: '배우 의도를 모른다고 가정하고 첫인상만 말한다. 의도와 인상이 갈리는 지점이 가장 중요하다.',
  },
];

// 공통 few-shot — 톤·형식 고정(프롬프트 주입 학습). 우영이 실제 좋은 예시로 교체 가능.
const PERSONA_SHOT = `예시(형식만 참고):
{ "timecode": "0:14", "observed": "\\"됐어, 그냥 가\\" 대사에서 끝음절을 흐리며 시선을 아래로 내림", "read": "체념을 절제해 담담히 누르려 하신 것 같다", "seen": "담담함보다 대사가 안 들려 감정이 비어 보인다", "tip": "끝음절 '가'를 한 박자 더 받쳐 끌고, 시선은 0.5초 늦게 떨군다", "aligned": false }`;

// L0: 영상을 직접 보는 유일한 단계. 평가 없이 사실만 기록한다.
export function buildObserverPrompt(input: {
  category: string;
  start: string;
  end: string;
}) {
  return `
당신은 영상 관찰 기록자입니다. 평가·해석·칭찬·지적을 하지 마세요. 보이고 들린 사실만 기록합니다.
분류: ${input.category} / 분석 구간: ${input.start} ~ ${input.end}

구간 안에서 의미 있는 순간마다 다음을 기록하세요:
- timecode(0:00), 들린 대사(인용), 목소리 특징(음량·속도·말끝·떨림), 표정, 시선, 자세·움직임.
- "감정이 얕다" 같은 판단은 금지. "0:12에 입꼬리가 한 번 올라갔다 내려옴"처럼 관찰된 사실만.
- 카메라에 안 잡힌 것은 적지 않는다.

반드시 JSON 배열만 반환하세요. 마크다운 코드블록은 쓰지 마세요.
[{ "timecode": "0:00", "line": "들린 대사", "voice": "목소리 특징", "face": "표정", "gaze": "시선", "body": "자세·움직임" }]
`.trim();
}

// L1: 각 페르소나가 같은 관찰(observations) 위에서 자기 렌즈로만 본다. 영상은 보지 않는다.
export function buildPersonaPrompt(persona: Persona, input: {
  category: string;
  intent: string;
  observations: string;
}) {
  return `
당신은 ${persona.role}입니다. 아래 '관찰 기록'은 영상에서 추출된 객관적 사실입니다. 영상을 새로 해석하지 말고 이 관찰만 근거로 삼으세요.
당신의 렌즈: ${persona.lens}
규칙: ${persona.rubric}

분류: ${input.category}
배우가 밝힌 연기 의도: ${input.intent}

관찰 기록(JSON):
${input.observations}

위 관찰 중 당신의 렌즈에 해당하는 순간만 골라, 각 순간을 observed→read→seen→tip 흐름으로 평가하세요.
- read·seen은 배우 의도와 관찰에서만 출발한다. 영상에 없는 설정을 지어내지 않는다.
- 잘 전달된 순간(aligned=true)도 반드시 포함한다. "좋았다"가 아니라 무엇을 어떻게 살렸는지 쓴다.
- 당신 렌즈에 의미 있는 순간 1~3개만. 억지로 채우지 않는다.

${PERSONA_SHOT}

반드시 JSON 배열만 반환하세요. 마크다운 코드블록은 쓰지 마세요.
[{ "timecode": "0:00", "observed": "", "read": "", "seen": "", "tip": "", "aligned": false }]
`.trim();
}
