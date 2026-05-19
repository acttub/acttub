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

  it('lazy-initializes when trackPageView is called before initAnalytics', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    const { trackPageView } = await loadAnalytics();

    trackPageView('/quiz');

    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]')).toHaveLength(1);
    expect(window.dataLayer).toContainEqual([
      'event',
      'page_view',
      expect.objectContaining({ page_path: '/quiz' }),
    ]);
  });

  it('lazy-initializes when trackResultAction is called before initAnalytics', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    const { trackResultAction } = await loadAnalytics();

    trackResultAction('copy_link', 'MINB');

    expect(window.gtag).toBeDefined();
    expect(window.dataLayer).toContainEqual([
      'event',
      'result_action_request',
      { action: 'copy_link', result_code: 'MINB' },
    ]);
  });

  it('normalizes paths without a leading slash', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('quiz');

    expect(window.dataLayer).toContainEqual([
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/quiz',
        page_location: 'http://localhost:3000/quiz',
      }),
    ]);
  });
});
