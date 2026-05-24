'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { HelmetProvider } from 'react-helmet-async';
import { initAnalytics, trackPageView } from '../lib/analytics';

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (pathname) trackPageView(pathname);
  }, [pathname]);

  return <HelmetProvider>{children}</HelmetProvider>;
}
