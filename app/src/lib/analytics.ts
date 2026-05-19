const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

type GtagCommand = [command: string, ...args: unknown[]];
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

export function trackPageView(path: string): void {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  const pageUrl = new URL(path, window.location.origin);
  const pagePath = pageUrl.pathname;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
  });
}

export function trackResultAction(action: ResultAction, resultCode: string): void {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', 'result_action_request', {
    action,
    result_code: resultCode,
  });
}
