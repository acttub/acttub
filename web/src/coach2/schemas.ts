// Gemini structured output responseSchema — 전 단계 스키마 강제(extractJson 정규식 폴백 없음).
// enum·척도·id·인용·필드 경로만 허용하는 전량 정량화 모드의 1차 방어선.
import { Type, type Schema } from '@google/genai';
import { IMPRESSIONS } from './types';

const str: Schema = { type: Type.STRING };
const num: Schema = { type: Type.NUMBER };
const int: Schema = { type: Type.INTEGER };
const boo: Schema = { type: Type.BOOLEAN };

function senum(...values: string[]): Schema {
  return { type: Type.STRING, enum: values };
}

function arr(items: Schema): Schema {
  return { type: Type.ARRAY, items };
}

function obj(properties: Record<string, Schema>): Schema {
  return {
    type: Type.OBJECT,
    properties,
    required: Object.keys(properties),
    propertyOrdering: Object.keys(properties),
  };
}

const range = obj({ start: str, end: str });

export const TRANSCRIPT_SCHEMA = obj({
  events: arr(obj({ timecode: str, line: str, confidence: senum('높음', '중간', '낮음') })),
  silentRanges: arr(range),
});

export const VOICE_SCHEMA = obj({
  events: arr(obj({
    timecode: str,
    volume: int,
    speed: int,
    articulation: senum('또렷함', '일부 뭉개짐', '대부분 뭉개짐'),
    mumbledWords: arr(str),
    ending: senum('유지', '흐려짐', '뚝 끊김'),
    tremor: boo,
    audibleBreath: boo,
    silenceAfterSec: num,
  })),
  steadyRanges: arr(obj({ start: str, end: str, what: senum('음량 일정', '속도 일정') })),
});

export const FACE_SCHEMA = obj({
  events: arr(obj({
    timecode: str,
    faceChanges: arr(obj({
      part: senum('눈썹', '미간', '눈', '입꼬리', '입술', '턱'),
      change: senum('올라감', '내려감', '좁혀짐', '크게 뜸', '감김', '다묾', '벌어짐', '떨림'),
    })),
    gazeDirection: senum('카메라', '좌', '우', '위', '아래', '감음'),
    blink: senum('보통', '잦음', '거의 없음'),
  })),
  steadyRanges: arr(obj({ start: str, end: str, what: senum('표정 변화 없음', '시선 고정') })),
});

export const BODY_SCHEMA = obj({
  events: arr(obj({
    timecode: str,
    postureChanges: arr(obj({
      part: senum('어깨', '몸통', '머리'),
      change: senum('올라감', '내려감', '기울어짐', '돌아감', '굳음', '풀림'),
    })),
    gesture: senum('손짓', '팔짓', '만지작거림', '반복 동작', '없음'),
    gestureRepeat: int,
    movement: senum('제자리', '걸음', '방향 전환'),
  })),
  steadyRanges: arr(obj({ start: str, end: str, what: senum('자세 고정', '제스처 없음') })),
});

// 연기 구간 자동 감지 — 영상 전체에서 실제 연기 시작·끝 timecode. detected=false면 전체 분석으로 폴백.
export const SEGMENT_SCHEMA = obj({
  detected: boo,
  actingStart: str,
  actingEnd: str,
});

export const INTENT_SCHEMA = obj({
  intent_keywords: arr(str),
  intent_summary: str,
  expected_impressions: arr(senum(...IMPRESSIONS)),
  confidence: senum('높음', '낮음'),
});

// anchorId를 입력 목록 enum으로 강제 — 누락·추가가 스키마 단에서 불가능해진다.
export function coachVerdictSchema(anchorIds: string[]): Schema {
  return obj({
    verdicts: arr(obj({
      anchorId: senum(...anchorIds),
      relevant: boo,
      aligned: boo,
      gap_bucket: senum('0', '0.5', '1'),
      misread_as: senum(...IMPRESSIONS, '해당없음'),
      evidence_refs: arr(str),
    })),
  });
}

export function audienceVerdictSchema(anchorIds: string[]): Schema {
  return obj({
    verdicts: arr(obj({
      anchorId: senum(...anchorIds),
      relevant: boo,
      impression: senum(...IMPRESSIONS, '안 잡힘'),
    })),
  });
}

export function diagnosisSchema(rootIds: string[], prescriptionIds: string[]): Schema {
  return obj({
    root_cause_id: senum(...rootIds, 'unlisted'),
    prescription_id: senum(...prescriptionIds, 'none'),
    strength_tier: senum('execution', 'attempt', 'encouragement'),
  });
}
