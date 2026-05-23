import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'acttub',
  description: '연기하는 사람들의 커뮤니티와 도구들.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
