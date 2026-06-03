import { describe, it, expect, beforeEach } from 'vitest';
import { clearMyTypeCode, getActiUserId, getMyTypeCode, setMyTypeCode } from './storage';

describe('storage.myTypeCode', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('초기 상태는 null', () => {
    expect(getMyTypeCode()).toBeNull();
  });

  it('set → get round-trip', () => {
    setMyTypeCode('MINB');
    expect(getMyTypeCode()).toBe('MINB');
  });

  it('clear 후 null', () => {
    setMyTypeCode('TPAS');
    clearMyTypeCode();
    expect(getMyTypeCode()).toBeNull();
  });

  it('유효하지 않은 값이 저장돼있으면 null 반환', () => {
    window.localStorage.setItem('myTypeCode', 'ABCD'); // 화이트리스트 밖
    expect(getMyTypeCode()).toBeNull();
  });

  it('덮어쓰기 동작', () => {
    setMyTypeCode('MINB');
    setMyTypeCode('TPAS');
    expect(getMyTypeCode()).toBe('TPAS');
  });

  it('ACTI 사용자 ID는 한 번 생성되면 같은 브라우저에서 유지된다', () => {
    const first = getActiUserId();
    const second = getActiUserId();

    expect(first).toMatch(/^acti-user-/);
    expect(second).toBe(first);
  });
});
