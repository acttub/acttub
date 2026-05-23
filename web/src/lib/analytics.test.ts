import { beforeEach, describe, expect, it, vi } from 'vitest';

async function loadAnalytics() {
  vi.resetModules();
  return import('./analytics');
}

function dataLayerEntries() {
  return (window.dataLayer ?? []).map((entry) => Array.from(entry));
}

function expectDataLayerToContain(expected: unknown[]) {
  expect(dataLayerEntries()).toContainEqual(expected);
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
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('/quiz');

    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]')).toHaveLength(0);
    expect(window.gtag).toBeUndefined();
  });

  it('loads the Google tag once and disables automatic page_view', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics } = await loadAnalytics();

    initAnalytics();
    initAnalytics();

    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]')).toHaveLength(1);
    expectDataLayerToContain(['js', expect.any(Date)]);
    expectDataLayerToContain(['config', 'G-TEST123', { send_page_view: false }]);
  });

  it('queues native gtag arguments objects for the Google tag runtime', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics } = await loadAnalytics();

    initAnalytics();

    expect(Array.isArray(window.dataLayer?.[0])).toBe(false);
    expect(Array.from(window.dataLayer?.[0] ?? [])).toEqual(['js', expect.any(Date)]);
  });

  it('tracks explicit SPA page views', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('/result/MINB');

    expectDataLayerToContain([
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/result/MINB',
        page_location: 'http://localhost:3000/result/MINB',
      }),
    ]);
  });

  it('strips query strings and hashes from page views', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('/result/MINB?email=user@example.com#private');

    expectDataLayerToContain([
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/result/MINB',
        page_location: 'http://localhost:3000/result/MINB',
      }),
    ]);
  });

  it('tracks result action requests without personal data', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackResultAction } = await loadAnalytics();

    initAnalytics();
    trackResultAction('email_report', 'MINB');

    expectDataLayerToContain([
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
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { trackPageView } = await loadAnalytics();

    trackPageView('/quiz');

    expect(document.querySelectorAll('script[src*="googletagmanager.com/gtag/js?id=G-TEST123"]')).toHaveLength(1);
    expectDataLayerToContain([
      'event',
      'page_view',
      expect.objectContaining({ page_path: '/quiz' }),
    ]);
  });

  it('lazy-initializes when trackResultAction is called before initAnalytics', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { trackResultAction } = await loadAnalytics();

    trackResultAction('copy_link', 'MINB');

    expect(window.gtag).toBeDefined();
    expectDataLayerToContain([
      'event',
      'result_action_request',
      { action: 'copy_link', result_code: 'MINB' },
    ]);
  });

  it('normalizes paths without a leading slash', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('quiz');

    expectDataLayerToContain([
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/quiz',
        page_location: 'http://localhost:3000/quiz',
      }),
    ]);
  });

  it('rejects protocol-relative paths that would resolve to a foreign origin', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('//evil.com/leak');

    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');
    expect(pageViews).toHaveLength(0);
  });

  it('rejects absolute URLs that point to a foreign origin', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('http://evil.com/leak');
    trackPageView('https://evil.com/leak');

    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');
    expect(pageViews).toHaveLength(0);
  });

  it('dedupes consecutive page views for the same path', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
    const { initAnalytics, trackPageView } = await loadAnalytics();

    initAnalytics();
    trackPageView('/quiz');
    trackPageView('/quiz');
    trackPageView('/result/MINB');
    trackPageView('/result/MINB');

    const pageViews = dataLayerEntries().filter(([cmd, name]) => cmd === 'event' && name === 'page_view');
    expect(pageViews).toHaveLength(2);
    expect(pageViews[0][2]).toMatchObject({ page_path: '/quiz' });
    expect(pageViews[1][2]).toMatchObject({ page_path: '/result/MINB' });
  });
});
