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

export type InstagramShareResult = 'shared' | 'cancelled';

/**
 * 현재 환경이 파일을 첨부한 Web Share를 지원하는지(=모바일 인스타로 공유 가능한지)
 * 동기적으로 판정. 데스크탑 브라우저는 false.
 */
export function canShareImageFile(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (typeof navigator.share !== 'function') return false;
  if (typeof navigator.canShare !== 'function') return false;
  try {
    const probe = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'probe.png', {
      type: 'image/png',
    });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

/**
 * 인스타 스토리(또는 OS 공유시트)로 캡처 카드 보내기.
 * 모바일 전용 — 호출 전에 canShareImageFile() 로 환경 확인할 것.
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

  try {
    await navigator.share({ files: [file], text: shareText });
    return 'shared';
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return 'cancelled';
    }
    throw err;
  }
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
