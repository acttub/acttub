/**
 * 점수 계산 — 답안 배열 → 4축 점수 → 4글자 TypeCode.
 *
 * 입력: 사용자가 선택한 Choice 배열 (각 문항당 1개씩)
 * 출력: 16유형 코드 (예: 'MINB')
 *
 * tie-break 규칙 (각 축 동점 시):
 *   - philosophy (M/T):  T 우선 (분석적 기본값)
 *   - operation  (I/P):  P 우선 (설계 기본값)
 *   - preparation(N/A):  A 우선 (분석 기본값)
 *   - expression (B/S):  S 우선 (내면 기본값)
 *
 * 동점 시 "균형형"이 분석/설계 쪽으로 떨어지는 보수적 기본값.
 */

import type { Axis, Choice, TypeCode } from '../content/schema';
import { isTypeCode } from '../content/schema';

type AxisScore = {
  M: number; T: number;
  I: number; P: number;
  N: number; A: number;
  B: number; S: number;
};

function emptyScore(): AxisScore {
  return { M: 0, T: 0, I: 0, P: 0, N: 0, A: 0, B: 0, S: 0 };
}

/** 선택지 배열을 받아 4축 점수를 누적한다. */
export function tally(choices: Choice[]): AxisScore {
  const score = emptyScore();
  for (const c of choices) {
    score[c.axis] += 1;
  }
  return score;
}

/** 4축 각각의 우세 극을 결정한다. 동점 시 tie-break. */
export function resolveCode(score: AxisScore): TypeCode {
  const philosophy: Axis = score.M > score.T ? 'M' : 'T';
  const operation:  Axis = score.I > score.P ? 'I' : 'P';
  const preparation:Axis = score.N > score.A ? 'N' : 'A';
  const expression: Axis = score.B > score.S ? 'B' : 'S';

  const code = `${philosophy}${operation}${preparation}${expression}`;

  if (!isTypeCode(code)) {
    // 타입 시스템상 도달 불가지만 방어적으로
    throw new Error(`Invalid type code computed: ${code}`);
  }
  return code;
}

/** 답안 배열 → 최종 TypeCode (편의 함수) */
export function computeType(choices: Choice[]): TypeCode {
  return resolveCode(tally(choices));
}
