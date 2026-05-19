const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

type GtagCommand = [command: string, ...args: unknown[]];

/**
 * 결과 페이지의 사용자 액션. 발사 시점은 액션마다 다름:
 * - `email_report`: 서버 발송 성공 후 (확정)
 * - `instagram_story`: Web Share API가 `'shared'` 반환 시 (확정)
 * - `copy_link`: 클립보드 쓰기 성공 후 (확정)
 * - `kakao_share`: Kakao SDK 호출 후 (의도) — SDK가 완료 콜백을 제공하지 않아
 *   팝업 오픈 = 추적. 사용자가 팝업을 닫아도 이벤트는 발사됨.
 */
export type ResultAction = 'email_report' | 'instagram_story' | 'kakao_share' | 'copy_link';

declare global {
  interface Window {
    dataLayer?: GtagCommand[];
    gtag?: (...args: GtagCommand) => void;
  }
}

export function initAnalytics(): void {
  const measurementId = GA_MEASUREMENT_ID;
  if (!measurementId) return;

  const existingScript = document.querySelector(
    `script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`
  );
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: GtagCommand) => {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });
}

/** ID는 설정됐는데 gtag가 아직 없으면 self-init 시도. */
function ensureReady(): boolean {
  if (!GA_MEASUREMENT_ID) return false;
  if (!window.gtag) initAnalytics();
  return Boolean(window.gtag);
}

/**
 * SPA 페이지뷰 추적. `path`는 `/`로 시작하는 pathname을 기대하지만,
 * 그렇지 않은 입력도 안전하게 처리.
 */
export function trackPageView(path: string): void {
  if (!ensureReady()) return;

  const safePath = path.startsWith('/') ? path : `/${path}`;
  let pagePath: string;
  try {
    pagePath = new URL(safePath, window.location.origin).pathname;
  } catch {
    return;
  }

  window.gtag?.('event', 'page_view', {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
  });
}

export function trackResultAction(action: ResultAction, resultCode: string): void {
  if (!ensureReady()) return;

  window.gtag?.('event', 'result_action_request', {
    action,
    result_code: resultCode,
  });
}
