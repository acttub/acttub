// coach-second(v2) 파이프라인 타입 — 전량 정량화: LLM 출력은 enum·척도·id·인용·필드 경로뿐.
// 설계 정본: Confluence "coach AI 파이프라인 v2"(18153475) · 프롬프트 정본: 17334281 (v2.0-draft.7)

export type ConfidenceLevel = '높음' | '중간' | '낮음';

export type TranscriptEvent = {
  timecode: string;
  line: string;
  confidence: ConfidenceLevel;
};

export type VoiceEvent = {
  timecode: string;
  volume: number; // 1~5, 3이 보통
  speed: number; // 1~5
  articulation: '또렷함' | '일부 뭉개짐' | '대부분 뭉개짐';
  mumbledWords: string[];
  ending: '유지' | '흐려짐' | '뚝 끊김';
  tremor: boolean;
  audibleBreath: boolean;
  silenceAfterSec: number;
};

export type FaceChange = {
  part: '눈썹' | '미간' | '눈' | '입꼬리' | '입술' | '턱';
  change: '올라감' | '내려감' | '좁혀짐' | '크게 뜸' | '감김' | '다묾' | '벌어짐' | '떨림';
};

export type FaceEvent = {
  timecode: string;
  faceChanges: FaceChange[];
  gazeDirection: '카메라' | '좌' | '우' | '위' | '아래' | '감음';
  blink: '보통' | '잦음' | '거의 없음';
};

export type PostureChange = {
  part: '어깨' | '몸통' | '머리';
  change: '올라감' | '내려감' | '기울어짐' | '돌아감' | '굳음' | '풀림';
};

export type BodyEvent = {
  timecode: string;
  postureChanges: PostureChange[];
  gesture: '손짓' | '팔짓' | '만지작거림' | '반복 동작' | '없음';
  gestureRepeat: number;
  movement: '제자리' | '걸음' | '방향 전환';
};

export type SteadyRange = { start: string; end: string; what: string };

export type TranscriptResult = { events: TranscriptEvent[]; silentRanges: { start: string; end: string }[] };
export type VoiceResult = { events: VoiceEvent[]; steadyRanges: SteadyRange[] };
export type FaceResult = { events: FaceEvent[]; steadyRanges: SteadyRange[] };
export type BodyResult = { events: BodyEvent[]; steadyRanges: SteadyRange[] };

// 병합 산출물 — anchorId가 L1 판정·집계·trace를 관통하는 키.
export type Anchor = {
  anchorId: string;
  timecode: string;
  line: string;
  confidence: ConfidenceLevel;
  voice: VoiceEvent[];
  face: FaceEvent[];
  body: BodyEvent[];
};

export const IMPRESSIONS = ['분노', '슬픔', '평정', '두려움', '기대', '절망', '기쁨', '체념'] as const;
export type Impression = (typeof IMPRESSIONS)[number];

export type GapBucket = '0' | '0.5' | '1';

export type CoachVerdict = {
  anchorId: string;
  relevant: boolean;
  aligned: boolean;
  gap_bucket: GapBucket;
  misread_as: Impression | '해당없음';
  evidence_refs: string[];
};

export type AudienceVerdict = {
  anchorId: string;
  relevant: boolean;
  impression: Impression | '안 잡힘';
};

export type CoachPersonaKey = 'emotion' | 'speech' | 'body';

export type AllVerdicts = {
  emotion: CoachVerdict[];
  speech: CoachVerdict[];
  body: CoachVerdict[];
  audience: AudienceVerdict[];
};

export type IntentInfo = {
  raw: string;
  keywords: string[];
  summary?: string; // 원문 단어만 발췌·재배열한 한두 줄(보강 LLM) — 원문이 길 때 카드 표시용
  expectedImpressions: Impression[];
  confidence: '높음' | '낮음';
};

// 연기 구간 자동 감지 결과 (L0 앞단). detected=false면 전체 분석.
export type SegmentResult = {
  detected: boolean;
  actingStart: string;
  actingEnd: string;
};

export type Diagnosis = {
  root_cause_id: string;
  prescription_id: string;
  strength_tier: 'execution' | 'attempt' | 'encouragement';
};

export type AggregateRow = {
  anchorId: string;
  coachGap: number;
  agreeCount: number;
  audienceGap: 0 | 1;
  priority: number;
  alignedCount: number;
};

export type AxisProfile = {
  emotion: number | null;
  speech: number | null;
  movement: number | null;
  audienceMismatchRate: number | null;
};

export type Aggregation = {
  rows: AggregateRow[];
  focusAnchorId: string | null;
  strengthAnchorId: string | null;
  axisProfile: AxisProfile;
};

// trace — 모든 중간 산출물(B3 해소). v0는 응답에 동봉, 저장은 후속.
export type AnalysisTrace = {
  promptVersion: string;
  model: string;
  temperature: number;
  seed: number;
  intent: IntentInfo;
  segment: { detected: boolean; start: string; end: string } | null;
  l0: {
    transcript: TranscriptResult | null;
    voice: VoiceResult | null;
    face: FaceResult | null;
    body: BodyResult | null;
    bodyMajority: { candidates: string[]; pickedIndex: number } | null;
  };
  anchors: Anchor[];
  verdicts: AllVerdicts | null;
  aggregation: Aggregation | null;
  diagnosis: Diagnosis | null;
  failures: string[];
};
