import { describe, it, expect } from 'vitest';
import { QUESTIONS } from './questions';
import { TYPE_CODES, isTypeCode, type Axis } from './schema';
import { getAllTypes, getType } from './types';

describe('content.schema invariants', () => {
  it('TYPE_CODES 는 정확히 16개', () => {
    expect(TYPE_CODES).toHaveLength(16);
  });

  it('TYPE_CODES 는 모두 4글자', () => {
    for (const code of TYPE_CODES) {
      expect(code).toMatch(/^[MT][IP][NA][BS]$/);
    }
  });

  it('TYPE_CODES 는 중복 없음', () => {
    const set = new Set(TYPE_CODES);
    expect(set.size).toBe(TYPE_CODES.length);
  });

  it('isTypeCode 화이트리스트 검증', () => {
    expect(isTypeCode('MINB')).toBe(true);
    expect(isTypeCode('XXXX')).toBe(false);
    expect(isTypeCode('mtnb')).toBe(false); // 대소문자 구분
    expect(isTypeCode(null)).toBe(false);
    expect(isTypeCode(undefined)).toBe(false);
    expect(isTypeCode(123)).toBe(false);
  });
});

describe('content.questions invariants', () => {
  it('문항 개수는 6~14 범위', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(6);
    expect(QUESTIONS.length).toBeLessThanOrEqual(14);
  });

  it('각 문항은 정확히 4개의 선택지', () => {
    for (const q of QUESTIONS) {
      expect(q.choices).toHaveLength(4);
    }
  });

  it('각 문항의 id는 고유', () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('모든 선택지의 axis 는 8극 중 하나', () => {
    const valid: Axis[] = ['M', 'T', 'I', 'P', 'N', 'A', 'B', 'S'];
    for (const q of QUESTIONS) {
      for (const c of q.choices) {
        expect(valid).toContain(c.axis);
      }
    }
  });

  it('각 문항의 시나리오·질문·라벨은 비어있지 않다', () => {
    for (const q of QUESTIONS) {
      expect(q.scenario.trim().length).toBeGreaterThan(0);
      expect(q.question.trim().length).toBeGreaterThan(0);
      for (const c of q.choices) {
        expect(c.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('전체 문항에 걸쳐 8극이 모두 최소 1번 등장 (β 분포 균형)', () => {
    const used = new Set<Axis>();
    for (const q of QUESTIONS) {
      for (const c of q.choices) used.add(c.axis);
    }
    for (const axis of ['M', 'T', 'I', 'P', 'N', 'A', 'B', 'S'] as Axis[]) {
      expect(used.has(axis)).toBe(true);
    }
  });

  it('axis 분포가 일정 범위 안 (각 극 4~10회)', () => {
    const count: Record<Axis, number> = {
      M: 0, T: 0, I: 0, P: 0, N: 0, A: 0, B: 0, S: 0,
    };
    for (const q of QUESTIONS) {
      for (const c of q.choices) count[c.axis] += 1;
    }
    for (const axis of ['M', 'T', 'I', 'P', 'N', 'A', 'B', 'S'] as Axis[]) {
      expect(count[axis]).toBeGreaterThanOrEqual(4);
      expect(count[axis]).toBeLessThanOrEqual(10);
    }
  });

  it('각 4축의 양극 차이가 4 이하 (한쪽 쏠림 방지)', () => {
    const count: Record<Axis, number> = {
      M: 0, T: 0, I: 0, P: 0, N: 0, A: 0, B: 0, S: 0,
    };
    for (const q of QUESTIONS) {
      for (const c of q.choices) count[c.axis] += 1;
    }
    expect(Math.abs(count.M - count.T)).toBeLessThanOrEqual(4);
    expect(Math.abs(count.I - count.P)).toBeLessThanOrEqual(4);
    expect(Math.abs(count.N - count.A)).toBeLessThanOrEqual(4);
    expect(Math.abs(count.B - count.S)).toBeLessThanOrEqual(4);
  });

  it('각 문항의 4 선택지는 모두 다른 axis (한 문항에 같은 극 중복 금지)', () => {
    for (const q of QUESTIONS) {
      const axes = q.choices.map((c) => c.axis);
      expect(new Set(axes).size).toBe(4);
    }
  });
});

describe('content.types invariants', () => {
  it('getAllTypes 는 16유형 반환', () => {
    expect(getAllTypes()).toHaveLength(16);
  });

  it('각 유형의 rival, bff 는 유효한 TypeCode', () => {
    for (const t of getAllTypes()) {
      expect(isTypeCode(t.rival)).toBe(true);
      expect(isTypeCode(t.bff)).toBe(true);
    }
  });

  it('각 유형의 index 는 0~15', () => {
    for (const t of getAllTypes()) {
      expect(t.index).toBeGreaterThanOrEqual(0);
      expect(t.index).toBeLessThanOrEqual(15);
    }
  });

  it('각 유형의 traits 와 roles 는 비어있지 않다', () => {
    for (const t of getAllTypes()) {
      expect(t.traits.length).toBeGreaterThan(0);
      expect(t.roles.length).toBeGreaterThan(0);
    }
  });

  it('getType 는 호출 코드와 같은 code 반환', () => {
    for (const code of TYPE_CODES) {
      expect(getType(code).code).toBe(code);
    }
  });
});
