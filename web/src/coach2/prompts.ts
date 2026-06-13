// coach-second(v2) 프롬프트 — 정본: Confluence "coach v2 프롬프트 명세"(17334281, v2.0-draft.7).
// 프롬프트를 바꾸면 그 페이지와 PROMPT_VERSION을 함께 올린다. 다양성은 버전 간에, 일관성은 호출 간에.
import type { Anchor } from './types';

export const PROMPT_VERSION = 'v2.0-draft.7';

// §5.6 실측: temp 0 + seed 42 + structured output으로 텍스트·영상 출력 바이트 동일 확인.
export const GENERATION_TEMPERATURE = 0;
export const GENERATION_SEED = 42;

type ClipContext = { category: string; start: string; end: string };

function l0Header(yoso: string, others: string, clip: ClipContext) {
  return `당신은 영상에서 ${yoso}만 기록하는 관찰자입니다. 평가·해석 금지.
${others}는 다른 관찰자가 맡습니다 — 절대 언급하지 마세요.
분류: ${clip.category} / 분석 구간: ${clip.start} ~ ${clip.end}
구간 밖·카메라에 안 잡힌 것·들리지 않은 것은 적지 않습니다.
기록할지 말지 애매한 순간은 적지 않습니다 — 정의에 또렷이 해당할 때만.`;
}

export function buildTranscriptPrompt(clip: ClipContext) {
  return `${l0Header('대사(들리는 말)', '목소리의 소리 특징·표정·몸', clip)}

새 발화가 시작될 때마다 1행.
- line: 들린 대사 그대로. 추측으로 채우지 않는다. 비언어 소리는 [한숨]처럼 대괄호.
- confidence: 높음=또렷이 들림 / 중간=일부 음절 불확실 / 낮음=절반 이상 추측.
- silentRanges: 발화 없는 10초 이상 구간의 시작·끝.`;
}

export function buildVoicePrompt(clip: ClipContext) {
  return `${l0Header('목소리의 소리 특징', '대사의 내용·의미, 표정, 몸', clip)}

발화 1개당 최대 2행, 다음에 해당할 때만:
- 음량·속도가 직전 발화 대비 1단계 이상 달라진 발화
- 끝음절이 흐려지거나 뭉개진 발화 (mumbledWords에 해당 단어를 그대로 인용)
- 떨림·들리는 호흡·직후 1.5초 이상 침묵
척도: volume·speed는 1(매우 작음/느림)~5(매우 큼/빠름). 3이 보통.
서술 문장 금지 — 값과 인용만. steadyRanges: 10초 이상 변화 없는 구간.`;
}

export function buildFacePrompt(clip: ClipContext) {
  return `${l0Header('표정과 시선', '대사·목소리·자세와 몸', clip)}

다음에 해당할 때만 1행:
- 0.5초 이상 지속되는 표정 변화 → faceChanges에 부위+움직임 조합으로 (자유 서술 금지)
- 시선 방향이 바뀌는 순간, 깜빡임이 뚜렷이 달라지는 구간
"긴장한 표정" 같은 해석 단어는 출력 어디에도 쓰지 않는다 — 부위·움직임 enum 조합만.
steadyRanges: 10초 이상 유지된 상태(무변화도 기록이다 — 반드시 적는다).`;
}

// draft.4 보강판 — 무변화 행 금지 + 제스처 크기 기준 (실측 2에서 4↔7행 분산 해소).
// 잔여 분류 경계(팔짓↔손짓)는 다수결 k=3으로 흡수한다(호출부).
export function buildBodyPrompt(clip: ClipContext) {
  return `당신은 영상에서 자세와 몸의 움직임만 기록하는 관찰자입니다. 평가·해석 금지.
대사·목소리·표정과 시선은 다른 관찰자가 맡습니다 — 절대 언급하지 마세요.
분류: ${clip.category} / 분석 구간: ${clip.start} ~ ${clip.end}
구간 밖·카메라에 안 잡힌 것은 적지 않습니다.

이벤트 행을 만드는 조건 — 다음 셋 중 최소 하나가 반드시 있어야 한다:
① 0.5초 이상 지속되는 자세 변화 (postureChanges에 부위+변화, 1개 이상)
② 팔 전체가 움직이는 크기 이상의 제스처 시작·반복 (gesture ≠ 없음)
   — 손가락·손목만 움직이는 작은 동작은 적지 않는다
③ 위치 이동 (movement = 걸음 또는 방향 전환)

금지:
- postureChanges가 비어 있고 gesture=없음, movement=제자리인 행(변화 없음)은 절대 만들지 않는다.
  변화가 없는 구간은 steadyRanges에만 적는다.
- 어떤 움직임을 적을지 말지 망설여지면 적지 않는다.
- 해석 단어("위축된", "불안한") 금지 — enum 조합만.

steadyRanges: 10초 이상 유지된 상태(자세 고정·제스처 없음). 정지도 신호다 — 반드시 적는다.`;
}

// 연기 구간 자동 감지 — L0 앞단. 영상 전체에서 실제 연기가 시작·끝나는 시점을 짚는다.
// 준비·인사·정지·이탈을 제외해 심층 분석을 핵심 연기에 집중시킨다(설계 §3-2).
export function buildSegmentPrompt(category: string) {
  return `당신은 영상에서 배우의 실제 연기 구간만 짚는 관찰자입니다. 평가·해석 금지.
분류: ${category}

영상 전체에서 배우의 연기(대사·감정 표현·인물의 동작)가 실제로 시작되는 시점과 끝나는 시점을 timecode(M:SS)로 짚으세요.
- 다음은 연기에 포함하지 않습니다: 시작 전 준비 동작·자세 잡기, 카메라를 향한 인사·슬레이트, 시작 전 정지, 끝난 뒤 멈춤·웃음·긴장 풀기·이탈.
- 연기 시작·끝이 또렷이 식별되면 detected=true, actingStart·actingEnd를 채웁니다.
- 영상 전체가 곧 연기이거나 경계가 모호하면 detected=false (이 경우 영상 전체를 분석합니다).
- 망설여지면 detected=false. 억지로 자르지 않습니다.

JSON만 반환.`;
}

export function buildIntentPrompt(category: string, intentRaw: string) {
  return `배우가 적은 연기 의도를 분류합니다. 새 의도를 지어내지 마세요.

분류: ${category}
배우가 적은 의도: ${intentRaw}

작업:
1. intent_keywords — 의도 원문에서 핵심 단어를 그대로 추출(최대 3개). 바꿔 쓰지 않는다.
2. intent_summary — 원문을 한두 줄(최대 80자)로 압축. 원문에 쓰인 단어를 그대로 살려 쓰고,
   원문에 없는 단어·해석·감정을 더하지 않는다(발췌·재배열만). 원문이 이미 짧으면 그대로 적는다.
3. expected_impressions — 배우가 적은 원문이 직접 가리키는 인상만(최대 2개):
   분노, 슬픔, 평정, 두려움, 기대, 절망, 기쁨, 체념.
   원문 단어에 근거가 있어야 한다(예: "무서움"→두려움). 장면 분위기로 짐작해
   원문에 없는 인상을 더하지 않는다. 확신 없으면 1개만, 그래도 없으면 빈 배열.
4. confidence — 의도가 또렷하면 "높음", 모호하면 "낮음".

JSON만 반환.`;
}

export type CoachPersonaDef = {
  key: 'emotion' | 'speech' | 'body';
  role: string;
  lens: string;
  rubric: string;
  slice: (anchor: Anchor) => Record<string, unknown>;
};

// 입력 슬라이스 고정 — 받는 필드가 명확하면 판정 분산도 줄어든다(프롬프트 명세 §3.1).
export const COACH_PERSONAS: CoachPersonaDef[] = [
  {
    key: 'emotion',
    role: '감정 연기 코치',
    lens: '표현된 감정이 배우 의도·장면 서브텍스트와 맞는지(과하거나 모자란 것 모두).',
    rubric: '의도한 톤(가벼움·절제 등)은 결함이 아니라 선택으로 본다. 상황에 안 맞는 더 큰 감정을 강요하지 않는다.',
    slice: (anchor) => anchor as unknown as Record<string, unknown>,
  },
  {
    key: 'speech',
    role: '화술(발성·발음) 코치',
    lens: '발음 명료도·음량·말끝 처리·속도·호흡의 안정성.',
    rubric: '소리로 들리는 근거만 쓴다. 뭉개진 단어는 해당 대사를 인용한다.',
    slice: ({ anchorId, timecode, line, confidence, voice }) => ({ anchorId, timecode, line, confidence, voice }),
  },
  {
    key: 'body',
    role: '신체 표현 코치',
    lens: '화면에 보이는 자세·시선·움직임·호흡이 인물·상황에 맞는지.',
    rubric: '카메라 프레임 밖은 다루지 않는다. 화면에 드러난 것만 평가한다.',
    slice: ({ anchorId, timecode, face, body }) => ({ anchorId, timecode, face, body }),
  },
];

export function buildCoachVerdictPrompt(persona: CoachPersonaDef, input: {
  category: string;
  intentRaw: string;
  intentKeywords: string[];
  anchors: Anchor[];
}) {
  const slices = input.anchors.map((anchor) => persona.slice(anchor));

  return `당신은 ${persona.role}입니다. 아래 anchor 목록은 영상에서 추출된 정량 관찰입니다.
당신의 렌즈: ${persona.lens}
규칙: ${persona.rubric}

분류: ${input.category}
배우가 밝힌 연기 의도: ${input.intentRaw}${input.intentKeywords.length > 0 ? ` (핵심: ${input.intentKeywords.join(', ')})` : ''}

anchor 목록(JSON — 당신 렌즈 필드만 제공):
${JSON.stringify(slices)}

모든 anchor에 빠짐없이 1행씩 판정값만 적으세요. 문장을 쓰지 않습니다.
- relevant: 내 렌즈로 판정할 관찰이 있으면 true. 애매하면 false.
- aligned: 관찰이 의도대로 작동했으면 true.
  aligned=true의 근거(evidence_refs)는 배우가 밝힌 의도와 직접 연결되는 신호만 쓴다.
  의도와 무관하게 좋아 보이는 신호(예: 의도문에 시선 얘기가 없는데 시선 처리)는
  칭찬 근거로 쓰지 않는다 — 그런 신호만 있으면 aligned=false.
- gap_bucket: 1.0=의도와 반대 인상 / 0.5=방향은 같으나 미달 / 0=의도대로(aligned=true).
  0.5와 1.0 사이에서 망설여지면 1.0.
- misread_as: 의도 대신 어떤 인상으로 보였나 — 분노, 슬픔, 평정, 두려움, 기대, 절망,
  기쁨, 체념, 해당없음(aligned=true이거나 특정 불가).
- evidence_refs: 근거가 된 anchor 필드 경로(예: ["voice[0].ending"]).
  입력 JSON에 실제로 존재해야 한다. 최소 1개.`;
}

export function buildAudienceVerdictPrompt(input: { category: string; anchors: Anchor[] }) {
  return `당신은 연기를 처음 보는 관객입니다. 배우의 의도를 모릅니다.
분류: ${input.category}
(의도는 제공되지 않습니다)

anchor 목록(JSON):
${JSON.stringify(input.anchors)}

모든 anchor에 1행씩, 판정값만:
- relevant: 인상이라 할 만한 것이 있으면 true. 애매하면 false.
- impression: 분노, 슬픔, 평정, 두려움, 기대, 절망, 기쁨, 체념, 안 잡힘.
  두 감정 사이에서 망설여지면 "안 잡힘"(망설임 = 인상이 안 잡힌 것이다).`;
}

export function buildDiagnosisPrompt(input: {
  category: string;
  intentRaw: string;
  focusBundle: unknown;
  strengthBundle: unknown;
  rootDictionary: unknown;
  prescriptionLibrary: unknown;
}) {
  return `당신은 수석 연기 코치입니다. focus anchor는 코드가 이미 확정했습니다.
당신은 아래 사전에서 고르기만 합니다. 문장을 쓰지 않습니다.

분류: ${input.category} / 의도: ${input.intentRaw}
focus anchor와 판정들(JSON): ${JSON.stringify(input.focusBundle)}
강점 anchor와 판정들(JSON): ${input.strengthBundle ? JSON.stringify(input.strengthBundle) : '"없음"'}
root 후보 사전(JSON): ${JSON.stringify(input.rootDictionary)}
처방 라이브러리(JSON): ${JSON.stringify(input.prescriptionLibrary)}

작업:
1. root_cause_id — evidence_refs·misread_as와 증상 패턴이 맞는 항목 1개.
   둘 이상 맞으면 사전에서 먼저 나오는 항목. 없으면 "unlisted".
2. prescription_id — root_id 일치 처방 1개(여럿이면 첫 항목). unlisted면 "none".
3. strength_tier — 실행 또렷=execution / 시도=attempt / 강점 없음=encouragement.
   망설여지면 낮은 쪽.

JSON만 반환. 문장 생성 금지.`;
}
