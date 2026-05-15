/**
 * 콘텐츠 스키마 — 연기 스타일 MBTI
 *
 * 4축 16유형 진단의 도메인 타입을 정의한다.
 * 모든 콘텐츠/로직은 이 모듈의 타입을 공유한다.
 */

/* ===== 4축 정의 ===== */

/** 4축의 8극(極). 각 축은 두 극으로 구성된다. */
export type Axis =
  | 'M' | 'T'   // 접근 철학: 메소드 ↔ 테크닉
  | 'I' | 'P'   // 현장 운영: 즉흥 ↔ 설계
  | 'N' | 'A'   // 준비 사고법: 직관 ↔ 분석
  | 'B' | 'S';  // 표현 통로: 신체 ↔ 내면

export type AxisName = 'philosophy' | 'operation' | 'preparation' | 'expression';

export const AXIS_POLES: Record<AxisName, [Axis, Axis]> = {
  philosophy: ['M', 'T'],
  operation:  ['I', 'P'],
  preparation:['N', 'A'],
  expression: ['B', 'S'],
};

/* ===== 유형 코드 ===== */

/** 16유형 코드 화이트리스트. 4글자 = [M|T][I|P][N|A][B|S] */
export const TYPE_CODES = [
  'MINB', 'MIAS', 'MPNB', 'MPAS',
  'TINB', 'TIAS', 'TPNB', 'TPAS',
  'MINS', 'MIAB', 'MPNS', 'MPAB',
  'TINS', 'TIAB', 'TPNS', 'TPAB',
] as const;

export type TypeCode = (typeof TYPE_CODES)[number];
export type TypeIndex =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

/** TypeCode → TypeIndex 매핑 (선언 순서) */
export function codeToIndex(code: TypeCode): TypeIndex {
  return TYPE_CODES.indexOf(code) as TypeIndex;
}

/** 임의 문자열이 유효한 16유형 코드인지 검증 (런타임 가드) */
export function isTypeCode(value: unknown): value is TypeCode {
  return typeof value === 'string' && (TYPE_CODES as readonly string[]).includes(value);
}

/* ===== 문항 ===== */

import type { LucideIcon } from 'lucide-react';

export type Choice = {
  /** 선택지 카피 (1~2줄) */
  label: string;
  /** 이 선택지가 대표하는 축의 극 */
  axis: Axis;
  /** Lucide 아이콘 컴포넌트 (트리 셰이킹 친화) */
  icon: LucideIcon;
};

/* ===== 4축 메타 (AxisBreakdown 표시용) ===== */

export type AxisMeta = {
  /** 축 식별자 */
  key: AxisName;
  /** 축 한국어 이름 */
  title: string;
  /** 왼쪽 극 (TypeCode의 해당 자리 첫 옵션) */
  left:  { axis: Axis; label: string; desc: string };
  /** 오른쪽 극 */
  right: { axis: Axis; label: string; desc: string };
};

export const AXES: readonly AxisMeta[] = [
  {
    key: 'philosophy', title: '접근 철학',
    left:  { axis: 'M', label: '메소드',  desc: '캐릭터에 잠수해 감정으로 살아본다' },
    right: { axis: 'T', label: '테크닉',  desc: '구조·기교를 분석해 만든다' },
  },
  {
    key: 'operation', title: '현장 운영',
    left:  { axis: 'I', label: '즉흥',    desc: '현장에서 만들어내는 것이 본체' },
    right: { axis: 'P', label: '설계',    desc: '미리 준비된 것을 정확히 펼친다' },
  },
  {
    key: 'preparation', title: '준비 사고법',
    left:  { axis: 'N', label: '직관',    desc: '감으로 캐릭터를 잡는다' },
    right: { axis: 'A', label: '분석',    desc: '근거로 캐릭터를 쌓는다' },
  },
  {
    key: 'expression', title: '표현 통로',
    left:  { axis: 'B', label: '신체',    desc: '몸·동선·표정으로 말한다' },
    right: { axis: 'S', label: '내면',    desc: '시선·호흡·내면으로 말한다' },
  },
] as const;

/** TypeCode 의 i번째 글자가 i번째 축의 어느 극인지 가져온다. */
export function poleOf(code: TypeCode, axisIndex: 0 | 1 | 2 | 3): Axis {
  return code[axisIndex] as Axis;
}

/* ===== 캐릭터 표정 variant ===== */

export type FaceVariant =
  | 'soft'     // 둥근 눈 + 따뜻한 미소 (기본)
  | 'wild'     // 큰 눈 + 입 크게 벌림 (즉흥+신체)
  | 'cool'     // 한쪽 눈 작게 + 한쪽 입 올림 (테크닉+즉흥)
  | 'wink'     // 윙크 + 미소 (능청 천재형)
  | 'dreamy'   // 별빛 눈 + 작은 미소 (직관형)
  | 'zen'      // 눈 감음 + 잔잔한 미소 (내면 침잠)
  | 'sharp'    // 작은 눈 + 일자 입 (분석/정돈)
  | 'intense'; // 큰 동공 + 깊은 미소 (메소드 깊이)

export type Question = {
  /** 안정적 식별자 (1부터) */
  id: number;
  /** 시나리오 설정 (1~3줄) */
  scenario: string;
  /** 질문 (짧게, "너는?" 형식 권장) */
  question: string;
  /** 정확히 4개의 선택지 */
  choices: [Choice, Choice, Choice, Choice];
};

/* ===== 유형 콘텐츠 ===== */

export type TypeContent = {
  code: TypeCode;
  index: TypeIndex;
  /** 위트 네이밍 (예: "비 오는 날 뛰쳐나가는 햄릿형") */
  name: string;
  /** 한 줄 캐치프레이즈 (SNS 캡션용) */
  tagline: string;
  /** 캐릭터 묘사 3~4줄 */
  traits: string[];
  /** 어울리는 역할/장르 3~4개 */
  roles: string[];
  /** 천적 유형 */
  rival: TypeCode;
  /** 베프 유형 */
  bff: TypeCode;
  /** 캐릭터 액세서리 Lucide 아이콘 이름 (CharacterAvatar에 표시) */
  accessory: string;
  /** 캐릭터 표정 variant (성격에 어울리게) */
  face: FaceVariant;
};
