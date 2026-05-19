import { beforeEach, describe, expect, it, vi } from 'vitest';

async function loadAnalytics() {
  vi.resetModules();
  return import('./analytics');
}

describe('analytics', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    document.head.innerHTML = '';
    delete window.dataLayer;
    delete window.gtag;
    vi.resetModules();
  });

  it('does not load Google Analytics when the measurement ID is missing', async () => {
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('/quiz');

    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')).toHaveLength(0);
    expect(window.gtag).toBeUndefined();
  });

  it('loads the Google tag once and disables automatic page_view', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics } = await loadAnalytics();

    initAnalytics();
    initAnalytics();

    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]')).toHaveLength(1);
    expect(window.dataLayer).toContainEqual(['js', expect.any(Date)]);
    expect(window.dataLayer).toContainEqual(['config', 'G-TEST123', { send_page_view: false }]);
  });

  it('tracks explicit SPA page views', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('/result/MINB');

    expect(window.dataLayer).toContainEqual([
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/result/MINB',
        page_location: 'http://localhost:3000/result/MINB',
      }),
    ]);
  });

  it('strips query strings and hashes from page views', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('/result/MINB?email=user@example.com#private');

    expect(window.dataLayer).toContainEqual([
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/result/MINB',
        page_location: 'http://localhost:3000/result/MINB',
      }),
    ]);
  });

  it('tracks result action requests without personal data', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackResultAction } = await loadAnalytics();

    initAnalytics();
    trackResultAction('email_report', 'MINB');

    expect(window.dataLayer).toContainEqual([
      'event',
      'result_action_request',
      {
        action: 'email_report',
        result_code: 'MINB',
      },
    ]);
    expect(JSON.stringify(window.dataLayer)).not.toContain('@');
  });
});
