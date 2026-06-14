// 사전 3종 v0 시드 — root 후보 사전 · 처방 라이브러리 · 어휘 사전.
// ⚠️ v0는 SOMA-59 2층 구조·SOMA-63 라벨링 패턴에서 추린 임시 시드다.
// 정식 시드는 코치(우영)+교수 자문이 작성·검수한다(P0, 설계 §8). 갱신 시 DICTIONARY_VERSION bump.
// 카드의 모든 문장은 이 사전에서 나온다 — LLM은 id 선택만 한다(전량 정량화).

import type { FeedbackAxis, OverallAxisKey, OverallBand } from '../coach/evaluation';
import type { Impression } from './types';

export const DICTIONARY_VERSION = 'v0-seed';

export type RootCause = {
  id: string;
  label: string;
  symptom: string; // 진단 LLM이 evidence_refs·misread_as와 대조하는 증상 패턴
  hypothesisText: string; // 카드 focus.rootCause에 그대로 들어가는 표준 문구("~같아요" 톤 내장)
};

export const ROOT_DICTIONARY: RootCause[] = [
  {
    id: 'speech.ending_drop',
    label: '말끝 꺼짐',
    symptom: 'voice.ending=흐려짐|뚝 끊김, 의도는 절제·담담인데 평정·체념·안 잡힘으로 읽힘',
    hypothesisText: '말끝을 누르려다 음량까지 함께 떨어진 것 같아요. 톤과 음량이 같이 내려가면 절제가 아니라 비어 있는 것으로 들려요.',
  },
  {
    id: 'speech.mumble',
    label: '발음 뭉개짐',
    symptom: 'voice.articulation=일부 뭉개짐|대부분 뭉개짐, mumbledWords 존재',
    hypothesisText: '감정을 유지하는 데 집중하느라 입이 덜 열려 발음이 뭉개진 것 같아요. 대사가 안 들리면 감정도 함께 사라져요.',
  },
  {
    id: 'speech.rush',
    label: '말 빨라짐',
    symptom: 'voice.speed>=4, 침묵·호흡 지점 없음',
    hypothesisText: '긴장하면 말이 빨라지면서 감정이 들어갈 틈이 사라지는 것 같아요. 인물이 아니라 대사를 끝내는 데 급해 보여요.',
  },
  {
    id: 'speech.volume_low',
    label: '음량 부족',
    symptom: 'voice.volume<=2가 구간 전반, 의도와 무관하게 전달 자체가 약함',
    hypothesisText: '목소리가 작아 감정 이전에 전달이 끊기는 것 같아요. 절제와 작은 음량은 다른 것이에요.',
  },
  {
    id: 'emotion.flat',
    label: '감정 정체',
    symptom: 'face.steadyRanges=표정 변화 없음이 길고, 관객 인상이 안 잡힘·평정',
    hypothesisText: '감정을 속으로는 유지했지만 표면 변화가 없어 보는 사람에게는 닿지 않은 것 같아요. 안에 있는 것과 보이는 것은 달라요.',
  },
  {
    id: 'face.gaze_avoid',
    label: '시선 이탈',
    symptom: 'face.gazeDirection=아래|좌|우가 지속, 시선 고정 steadyRange',
    hypothesisText: '시선이 상대(카메라)를 피하면서 감정의 방향도 함께 사라진 것 같아요. 시선이 닿아야 감정도 닿아요.',
  },
  {
    id: 'movement.frozen',
    label: '몸 굳음',
    symptom: 'body.steadyRanges=자세 고정이 길고 postureChanges=굳음, 어깨 올라감',
    hypothesisText: '몸이 굳어 있어 긴장이 인물의 것이 아니라 배우의 것으로 보이는 것 같아요. 인물의 긴장과 배우의 긴장은 다르게 보여요.',
  },
  {
    id: 'movement.fidget',
    label: '불필요한 반복 동작',
    symptom: 'body.gesture=만지작거림|반복 동작, gestureRepeat 큼',
    hypothesisText: '남는 에너지가 손으로 새고 있는 것 같아요. 반복 동작은 보는 사람의 시선을 대사 밖으로 끌고 가요.',
  },
];

export type Prescription = {
  id: string;
  rootId: string;
  text: string; // 카드 focus.prescription에 그대로 들어간다
};

export const PRESCRIPTION_LIBRARY: Prescription[] = [
  { id: 'p.ending-hold', rootId: 'speech.ending_drop', text: '끝음절을 한 박자 더 받쳐 끌면서, 톤만 낮추고 음량은 유지해 보세요.' },
  { id: 'p.mumble-open', rootId: 'speech.mumble', text: '뭉개진 단어만 골라 입을 크게 열고 세 번 천천히 말한 뒤, 본 속도로 다시 붙여보세요.' },
  { id: 'p.rush-breath', rootId: 'speech.rush', text: '문장 사이 호흡 지점을 하나 정해, 거기서 한 박자 쉬고 다음 문장을 시작해 보세요.' },
  { id: 'p.volume-floor', rootId: 'speech.volume_low', text: '방 반대편 벽에 대사를 보낸다는 느낌으로, 톤은 그대로 두고 음량만 한 단계 올려보세요.' },
  { id: 'p.flat-turn', rootId: 'emotion.flat', text: '감정이 바뀌는 문장을 하나 정해, 그 직전에 표정을 의도적으로 한 번 바꿔보세요.' },
  { id: 'p.gaze-anchor', rootId: 'face.gaze_avoid', text: '카메라 렌즈 바로 옆에 점 하나를 정해두고, 핵심 대사에서만 그 점에 시선을 고정해 보세요.' },
  { id: 'p.frozen-drop', rootId: 'movement.frozen', text: '대사 시작 직전에 호흡과 함께 어깨를 한 번 떨어뜨리고 들어가 보세요.' },
  { id: 'p.fidget-hold', rootId: 'movement.fidget', text: '손의 반복 동작을 멈추고, 그 에너지를 대사의 가장 중요한 한 단어에 실어보세요.' },
];

// 다음 레벨 과제 — 갭이 없는 날의 처방. 덕담 금지: 잘된 축을 한 단계 밀어붙이는,
// 내일 연습실에서 바로 할 수 있는 행동 1개 (시드 유저 피드백 2026-06-12 반영).
// ⚠️ 문구 초안 — SOMA-60 문체가이드·코치(우영) 검수 전.
export type Progression = {
  task: string; // 카드 focus.prescription에 그대로 들어간다
  nextStep: string; // nextStep.text에 그대로 들어간다
};

// 증상 → 보인 인상 다리 — "왜 하필 그 인상으로 읽혔나" 한 문장 (시드 유저 피드백 r2 반영:
// "웅얼거리는 저음은 '시험하는 긴장'이 아니라 '체념'으로 들리니까요" — 이 문장이 카드의 빈 칸).
// root × misread 인상 중 말이 되는 조합만 적는다. 없는 조합은 침묵 — 지어내지 않는다.
// 카드에서는 intentGap 문장 뒤에 그대로 이어 붙는다.
// ⚠️ 문구 초안 — 코치(우영) 검수 전.
export const MISREAD_BRIDGE: Record<string, Partial<Record<Impression, string>>> = {
  'speech.mumble': {
    슬픔: '웅얼거리며 낮아진 소리는 또렷한 긴장보다 가라앉은 슬픔으로 들리거든요.',
    체념: '웅얼거리며 낮아진 소리는 힘을 놓은 체념으로 들리거든요.',
  },
  'speech.volume_low': {
    두려움: '작아진 음량은 눌려 있는 두려움으로 들리기 쉬워요.',
    슬픔: '작아진 음량은 가라앉은 슬픔으로 들리기 쉬워요.',
    체념: '작아진 음량은 싸움을 내려놓은 체념으로 들리기 쉬워요.',
  },
  'speech.ending_drop': {
    슬픔: '말끝이 가라앉으면 문장 전체가 슬픔 쪽으로 기울어 들려요.',
    체념: '말끝이 흐려지면 문장을 끝까지 책임지지 않는 체념으로 들려요.',
  },
  'speech.rush': {
    두려움: '빨라진 말은 쫓기는 두려움으로 읽히기 쉬워요.',
    분노: '빨라진 말은 몰아붙이는 분노로 읽히기 쉬워요.',
  },
  'emotion.flat': {
    평정: '변화 없는 표정과 톤은 절제가 아니라 무덤덤한 평정으로 읽혀요.',
    체념: '변화 없는 표정과 톤은 감정을 놓아버린 체념으로 읽혀요.',
  },
  'face.gaze_avoid': {
    두려움: '피한 시선은 상대를 마주보지 못하는 두려움으로 읽혀요.',
  },
  'movement.frozen': {
    두려움: '굳은 몸은 얼어붙은 두려움으로 읽히기 쉬워요.',
  },
  'movement.fidget': {
    두려움: '반복되는 손 움직임은 초조한 두려움으로 읽혀요.',
  },
};

export const PROGRESSION_LIBRARY: Record<FeedbackAxis, Progression> = {
  emotion: {
    task: '같은 장면을 감정 강도 절반으로 한 번, 1.5배로 한 번 더 찍어 셋을 나란히 보세요. 지금 강도가 우연이 아니라 선택이었는지 확인할 수 있어요.',
    nextStep: '같은 장면을 강도 절반·1.5배로 두 번 더 찍어보기',
  },
  speech: {
    task: '같은 대사를 상대가 두 배 멀리 있다고 생각하고 다시 해보세요. 만들어둔 인상은 그대로 두고 전달 거리만 늘리는 연습이 돼요.',
    nextStep: '두 배 거리의 상대에게 보내듯 같은 대사 다시 찍어보기',
  },
  face: {
    task: '같은 장면을 대사 없이 표정만으로 한 번 찍어보세요. 어떤 표정이 실제로 일하고 있었는지 분리해서 볼 수 있어요.',
    nextStep: '대사 없이 표정만으로 같은 장면 찍어보기',
  },
  movement: {
    task: '같은 장면을 움직임 절반으로 줄여 다시 찍어보세요. 남은 에너지가 시선과 호흡 어디로 가는지 보이면 다음 단계가 잡혀요.',
    nextStep: '움직임을 절반으로 줄여 같은 장면 다시 찍어보기',
  },
};

// 「축×밴드 문구」 사전 — 다축 전경(rev.7)의 4축 상태 문구. 축별 평균 갭 밴드 → 이 칸의 문구.
// 코드는 밴드만 고르고 문장은 여기서 — 같은 밴드면 같은 문구(멱등). 수치·내부 키는 표면에 안 쓴다.
// misread: mid/weak일 때 "의도 대신 어떤 인상으로 보였나"({x}=최빈 misread 인상)를 넣어 구체화한다.
//   감정·표정처럼 인상으로 환산되는 축만 둔다. 데이터가 없으면 bands 일반 문구로 폴백.
// ⚠️ v0 초안 — SOMA-60 문체가이드·코치(우영)+자문 검수 전(설계 §3-1.4 P0). 검수 후 정본 교체.
// 표정은 현재 body(신체) 코치가 흡수 판정 → movement 칸에 "표정·몸짓"으로 함께 노출.
// 표정 독립 축은 L1 표정 코치 분리(후속) 이후 키를 추가한다.
export const AXIS_BAND_PHRASES: Record<OverallAxisKey, {
  label: string;
  bands: Record<OverallBand, string>;
  misread?: Partial<Record<'mid' | 'weak', string>>; // {x} = 의도 대신 보인 인상
}> = {
  emotion: {
    label: '감정',
    bands: {
      good: '감정이 의도대로 안정적으로 흘러갔어요.',
      mid: '감정은 전해졌지만 중간중간 흔들리는 순간이 있었어요.',
      weak: '감정이 의도와 어긋나 보이는 순간이 잦았어요.',
    },
    misread: {
      mid: '감정이 의도보다 {x} 쪽으로 보인 순간이 있었어요.',
      weak: '감정이 의도보다 {x}에 가깝게 보인 순간이 잦았어요.',
    },
  },
  speech: {
    label: '대사 전달',
    bands: {
      good: '대사가 끝까지 또렷하게 전달됐어요.',
      mid: '대사는 대체로 전달됐지만 흐려지는 순간이 있었어요.',
      weak: '대사 전달이 흔들려 의도를 자주 가렸어요.',
    },
  },
  movement: {
    label: '표정·몸짓',
    bands: {
      good: '표정과 몸이 인물에 맞게 자연스럽게 따라왔어요.',
      mid: '표정·몸짓은 대체로 맞았지만 어색하게 비는 순간이 있었어요.',
      weak: '표정·몸짓이 인물과 어긋나 보이는 순간이 잦았어요.',
    },
    misread: {
      mid: '표정·몸짓이 의도보다 {x} 쪽으로 읽힌 순간이 있었어요.',
      weak: '표정·몸짓이 의도보다 {x}에 가깝게 읽힌 순간이 잦았어요.',
    },
  },
  audience: {
    label: '관객 반응',
    bands: {
      good: '처음 보는 사람 눈에도 노린 인상이 그대로 잡혔어요.',
      mid: '처음 보는 사람 눈에는 한두 군데서 다른 인상으로 잡혔어요.',
      weak: '처음 보는 사람 눈에는 노린 인상이 절반 넘게 다르게 잡혔어요.',
    },
  },
};

// 어휘 사전 — evidence_refs(필드 경로+값) → 배우 언어 문구.
// v1 AI 피드백 Flow §6.8 "측정 신호 → 도메인 어휘 번역 사전" 계승. 수치·내부 라벨은 표면에 노출하지 않는다.
const VOCAB: Record<string, string> = {
  'ending=흐려짐': '말끝이 흐려짐',
  'ending=뚝 끊김': '말끝이 뚝 끊김',
  'ending=유지': '말끝이 끝까지 유지됨',
  'articulation=일부 뭉개짐': '일부 발음이 뭉개짐',
  'articulation=대부분 뭉개짐': '발음이 대부분 뭉개짐',
  'articulation=또렷함': '발음이 또렷함',
  'tremor=true': '목소리에 떨림이 잡힘',
  'audibleBreath=true': '호흡 소리가 들림',
  'gazeDirection=카메라': '시선이 카메라에 닿음',
  'gazeDirection=아래': '시선이 아래로 떨어짐',
  'gazeDirection=좌': '시선이 옆으로 빠짐',
  'gazeDirection=우': '시선이 옆으로 빠짐',
  'gazeDirection=위': '시선이 위로 뜸',
  'gazeDirection=감음': '눈을 감음',
  'blink=잦음': '깜빡임이 잦아짐',
  'blink=거의 없음': '깜빡임이 거의 없음',
  'gesture=손짓': '손짓이 보임',
  'gesture=팔짓': '팔 동작이 보임',
  'gesture=만지작거림': '손을 만지작거림',
  'gesture=반복 동작': '같은 동작이 반복됨',
  'movement=걸음': '자리를 옮김',
  'movement=방향 전환': '몸의 방향을 바꿈',
};

function bucketPhrase(field: string, value: number): string {
  if (field === 'volume') {
    if (value <= 2) return '음량이 작음';
    if (value >= 4) return '음량이 큼';
    return '음량이 보통';
  }
  if (field === 'speed') {
    if (value <= 2) return '말이 느림';
    if (value >= 4) return '말이 빠름';
    return '속도가 보통';
  }
  if (field === 'silenceAfterSec') {
    return value >= 1.5 ? '직후에 긴 침묵' : '짧은 멈춤';
  }
  return '';
}

function changePhrase(part: string, change: string): string {
  return `${part} ${change}`;
}

// evidence ref(예: "voice[0].ending") → anchor 값 조회 → 배우 언어 문구.
// 경로가 깨졌거나 사전에 없으면 빈 문자열 — 없는 근거를 지어내지 않는다.
export function translateEvidenceRef(anchor: Record<string, unknown>, ref: string): string {
  const segments = ref.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
  let cursor: unknown = anchor;
  for (const segment of segments) {
    if (cursor === null || typeof cursor !== 'object') return '';
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  if (cursor === undefined || cursor === null) return '';

  const field = segments[segments.length - 1];

  if (typeof cursor === 'number') return bucketPhrase(field, cursor);
  if (typeof cursor === 'boolean') return VOCAB[`${field}=${cursor}`] ?? '';
  if (typeof cursor === 'string') return VOCAB[`${field}=${cursor}`] ?? '';
  if (Array.isArray(cursor)) {
    if (field === 'mumbledWords' && cursor.length > 0) return `'${cursor[0]}' 발음이 뭉개짐`;
    if (field === 'faceChanges' || field === 'postureChanges') {
      return cursor
        .map((item) => (item && typeof item === 'object' ? changePhrase(String((item as Record<string, unknown>).part ?? ''), String((item as Record<string, unknown>).change ?? '')) : ''))
        .filter(Boolean)
        .join(' · ');
    }
  }
  if (typeof cursor === 'object') {
    const record = cursor as Record<string, unknown>;
    if ('part' in record && 'change' in record) return changePhrase(String(record.part), String(record.change));
  }
  return '';
}

export function findRoot(id: string): RootCause | null {
  return ROOT_DICTIONARY.find((root) => root.id === id) ?? null;
}

export function findPrescription(id: string): Prescription | null {
  return PRESCRIPTION_LIBRARY.find((item) => item.id === id) ?? null;
}
