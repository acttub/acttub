/**
 * 공유 액션 — 이미지 저장 / URL 복사 / (카톡은 kakao.ts).
 */

import { toBlob, toPng } from 'html-to-image';
import type { TypeCode } from '../content/schema';

const PNG_OPTIONS = {
  cacheBust: true,
  pixelRatio: 2,
  backgroundColor: '#FAFAF8',
  skipFonts: false,
} as const;

/** CaptureCard DOM을 PNG로 다운로드. */
export async function saveCaptureAsImage(
  node: HTMLElement,
  filename: string
): Promise<void> {
  const dataUrl = await toPng(node, PNG_OPTIONS);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export type InstagramShareResult = 'shared' | 'downloaded' | 'cancelled';

/**
 * 인스타 스토리(또는 OS 공유시트)로 캡처 카드 보내기.
 * - 지원 기기: navigator.share(files) → OS 시트에서 인스타그램 선택
 * - 미지원 기기: PNG 다운로드 폴백 (사용자가 직접 스토리에 업로드)
 */
export async function shareCaptureToInstagram(
  node: HTMLElement,
  filename: string,
  shareText: string
): Promise<InstagramShareResult> {
  const blob = await toBlob(node, PNG_OPTIONS);
  if (!blob) {
    throw new Error('Failed to render capture as image');
  }

  const file = new File([blob], filename, { type: 'image/png' });

  const canShareFiles =
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] });

  if (canShareFiles && typeof navigator.share === 'function') {
    try {
      await navigator.share({ files: [file], text: shareText });
      return 'shared';
    } catch (err) {
      // 사용자가 시트를 닫은 경우엔 다운로드 폴백을 건너뜀
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'cancelled';
      }
      // 그 외 에러는 다운로드 폴백으로
    }
  }

  // 폴백: 다운로드
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
  return 'downloaded';
}

/** 결과 URL을 클립보드에 복사. */
export async function copyResultUrl(code: TypeCode): Promise<void> {
  const url = `${window.location.origin}/result/${code}`;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }
  // 폴백 (구형 브라우저)
  const ta = document.createElement('textarea');
  ta.value = url;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(ta);
  }
}

/** 원본 사이트 URL (OG, 카카오 공유에 사용) */
export function getSiteUrl(): string {
  const env = import.meta.env.VITE_SITE_URL as string | undefined;
  if (env) return env.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}
