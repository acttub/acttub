const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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

/**
 * /coach 한 페이지 안의 단계 진행. 페이지뷰만으론 안 보이는 단계별 이탈(drop-off)을
 * GA4 유입경로(funnel) 탐색으로 보기 위함. 단계당 1회만 발사 — 재입력·재선택으로
 * 수치가 부풀지 않게(`error`는 매번 발사해 어느 시도가 실패했는지 본다).
 */
export type CoachStep =
  | 'video_selected'   // 영상 업로드/녹화 완료
  | 'intent_entered'   // 연기 의도 첫 입력
  | 'analyze_clicked'  // 'AI로 분석' 클릭(검증 통과)
  | 'upload_done'      // blob 업로드 성공
  | 'result_shown'     // 결과 카드 표시
  | 'error';           // 분석 실패 이탈

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: GtagCommand) => void;
  }
}

// 모듈 스코프 — React StrictMode dev의 시뮬레이션된 remount는 컴포넌트 ref를
// 재초기화하므로 dedupe 상태는 컴포넌트 밖에 둬야 한다.
let lastTrackedPath: string | null = null;

// coach funnel은 '도달 여부'가 핵심 — 단계당 1회만 발사해 중복 입력으로 수치가 부풀지 않게.
const trackedCoachSteps = new Set<CoachStep>();

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
  // gtag.js queue consumer expects the native arguments object, not an array — see google's snippet.
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer?.push(arguments); };
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
 * 입력 path를 안전한 pathname으로 정규화.
 * - 결과 URL의 origin이 현재 페이지와 다르면 거부 (`http://evil.com/x`,
 *   `//evil.com/x` 등 외부 origin으로 해석되는 모든 입력).
 * - leading slash 없는 상대 path는 URL 파서가 보정.
 * - `new URL()` 실패는 null.
 */
function normalizePath(path: string): string | null {
  if (path.startsWith('//')) return null;
  try {
    const url = new URL(path, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    return url.pathname;
  } catch {
    return null;
  }
}

/**
 * 클라이언트 페이지뷰 추적. `path`는 `/`로 시작하는 pathname을 기대하지만,
 * 그렇지 않은 입력도 안전하게 처리. 동일 path 연속 호출은 dedupe.
 */
export function trackPageView(path: string): void {
  if (!ensureReady()) return;

  const pagePath = normalizePath(path);
  if (pagePath === null) return;
  if (lastTrackedPath === pagePath) return;
  lastTrackedPath = pagePath;

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

/**
 * /coach 단계 진행 추적. `error`를 뺀 단계는 세션 동안 1회만 발사(중복 dedupe).
 * GA4에는 `coach_<step>` 이벤트로 들어가 단계별로 funnel을 잡을 수 있다.
 */
export function trackCoachStep(step: CoachStep): void {
  if (!ensureReady()) return;
  if (step !== 'error' && trackedCoachSteps.has(step)) return;
  trackedCoachSteps.add(step);

  window.gtag?.('event', `coach_${step}`);
}
