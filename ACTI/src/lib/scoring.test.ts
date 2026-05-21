import { describe, it, expect } from 'vitest';
import { computeType, resolveCode, tally } from './scoring';
import type { Choice } from '../content/schema';
import { Circle } from 'lucide-react';

/** 테스트용 Choice 헬퍼 — 라벨/아이콘은 무관, axis만 의미 */
function c(axis: Choice['axis']): Choice {
  return { label: `axis-${axis}`, axis, icon: Circle };
}

describe('scoring.tally', () => {
  it('각 축 빈도를 정확히 누적한다', () => {
    const score = tally([c('M'), c('M'), c('T'), c('I')]);
    expect(score).toMatchObject({ M: 2, T: 1, I: 1, P: 0, N: 0, A: 0, B: 0, S: 0 });
  });

  it('빈 배열은 0 점수', () => {
    expect(tally([])).toMatchObject({ M: 0, T: 0, I: 0, P: 0, N: 0, A: 0, B: 0, S: 0 });
  });
});

describe('scoring.resolveCode', () => {
  it('모든 축 우세가 분명할 때 정확한 코드', () => {
    const code = resolveCode({ M: 5, T: 1, I: 5, P: 1, N: 5, A: 1, B: 5, S: 1 });
    expect(code).toBe('MINB');
  });

  it('반대 극이 우세할 때', () => {
    const code = resolveCode({ M: 0, T: 5, I: 0, P: 5, N: 0, A: 5, B: 0, S: 5 });
    expect(code).toBe('TPAS');
  });

  it('philosophy 동점 → T (tie-break)', () => {
    const code = resolveCode({ M: 2, T: 2, I: 5, P: 0, N: 5, A: 0, B: 5, S: 0 });
    expect(code).toBe('TINB');
  });

  it('operation 동점 → P', () => {
    const code = resolveCode({ M: 5, T: 0, I: 2, P: 2, N: 5, A: 0, B: 5, S: 0 });
    expect(code).toBe('MPNB');
  });

  it('preparation 동점 → A', () => {
    const code = resolveCode({ M: 5, T: 0, I: 5, P: 0, N: 2, A: 2, B: 5, S: 0 });
    expect(code).toBe('MIAB');
  });

  it('expression 동점 → S', () => {
    const code = resolveCode({ M: 5, T: 0, I: 5, P: 0, N: 5, A: 0, B: 2, S: 2 });
    expect(code).toBe('MINS');
  });

  it('모든 축 동점 → tie-break 기본값(TPAS)', () => {
    const code = resolveCode({ M: 1, T: 1, I: 1, P: 1, N: 1, A: 1, B: 1, S: 1 });
    expect(code).toBe('TPAS');
  });
});

describe('scoring.computeType', () => {
  it('답안 배열 → 정확한 16유형 코드 (편의 함수)', () => {
    const choices = [
      c('M'), c('M'), c('M'),
      c('I'), c('I'),
      c('N'), c('N'), c('N'),
      c('B'), c('B'),
    ];
    expect(computeType(choices)).toBe('MINB');
  });

  it('결정적: 같은 입력에 항상 같은 결과', () => {
    const choices = [c('T'), c('P'), c('A'), c('S')];
    expect(computeType(choices)).toBe(computeType(choices));
  });
});
