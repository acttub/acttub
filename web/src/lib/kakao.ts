/**
 * Kakao JS SDK v2 래퍼.
 *
 * - index.html 의 외부 스크립트로 window.Kakao 가 로드되어 있음
 * - 앱 키는 .env.local 의 NEXT_PUBLIC_KAKAO_APP_KEY (미설정 시 공유 비활성)
 */

import type { TypeContent } from '../content/schema';
import { BASE_PATH } from './share';

type KakaoSDK = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: {
    sendDefault: (params: unknown) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;

/** 멱등 초기화. 호출 시 SDK 사용 가능 여부 반환. */
export function ensureKakaoReady(): boolean {
  if (typeof window === 'undefined' || !window.Kakao) return false;
  if (!APP_KEY) return false;
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(APP_KEY);
  }
  return window.Kakao.isInitialized();
}

/** 카카오톡 공유 (피드 카드 형식). */
export function shareToKakao(type: TypeContent, siteUrl: string): void {
  if (!ensureKakaoReady() || !window.Kakao) {
    console.warn('Kakao SDK not ready');
    return;
  }
  const appUrl = `${siteUrl}${BASE_PATH}`;
  const resultUrl = `${appUrl}/result/${type.code}`;
  const imageUrl = `${appUrl}/og/${type.code}.png`;

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `[${type.code}] ${type.name}`,
      description: type.tagline,
      imageUrl,
      link: { mobileWebUrl: resultUrl, webUrl: resultUrl },
    },
    buttons: [
      {
        title: '나도 풀어보기',
        link: { mobileWebUrl: appUrl, webUrl: appUrl },
      },
    ],
  });
}
