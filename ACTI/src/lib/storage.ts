/**
 * localStorage 래퍼 — 본인 결과 코드 영속화.
 *
 * 사용처:
 *   - 결과 페이지 진입 시: getMyTypeCode() 로 본인 vs 수신자 모드 판별
 *   - 풀이 완료 시: setMyTypeCode(code) 로 저장
 *   - 다시 풀기 시작 시: clearMyTypeCode() (선택)
 */

import { isTypeCode, type TypeCode } from '../content/schema';

const KEY = 'myTypeCode';

/** SSR/빌드 시 localStorage 부재 대응 */
function isStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

export function getMyTypeCode(): TypeCode | null {
  if (!isStorageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return isTypeCode(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function setMyTypeCode(code: TypeCode): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(KEY, code);
  } catch {
    /* private mode 등 무시 */
  }
}

export function clearMyTypeCode(): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* 무시 */
  }
}
