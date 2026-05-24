// @vitest-environment node
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const appDir = path.join(root, 'src/app');

const requiredPages = [
  'page.tsx',
  'team/page.tsx',
  'ACTI/page.tsx',
  'ACTI/quiz/page.tsx',
  'ACTI/survey/page.tsx',
  'ACTI/result/[code]/page.tsx',
  'coach/page.tsx',
  'archive/page.tsx',
  'archive/search/page.tsx',
  'archive/upload/page.tsx',
  'archive/me/page.tsx',
  'archive/videos/[id]/page.tsx',
  'archive/u/[username]/page.tsx',
  'archive/playlists/new/page.tsx',
  'community/page.tsx',
  'community/search/page.tsx',
  'community/new/page.tsx',
  'community/write/page.tsx',
  'community/me/page.tsx',
  'community/posts/[id]/page.tsx',
  'community/p/[id]/page.tsx',
  'excer/page.tsx',
  'excer/rooms/[slug]/page.tsx',
  'thea/page.tsx',
  'thea/plays/[id]/page.tsx',
];

const requiredApiRoutes = [
  'api/health/route.ts',
  'api/send-result/route.ts',
  'api/coach/analyze/route.ts',
  'api/archive/videos/route.ts',
  'api/archive/upload/route.ts',
  'api/community/posts/route.ts',
  'api/community/comments/route.ts',
];

const removedSpaEntrypoints = [
  'index.html',
  'vite.config.ts',
  'src/App.tsx',
  'src/main.tsx',
  'src/lib/router.tsx',
  'src/views/LegacyLandingPage.tsx',
  'public/legacy/landing.html',
];

function findDirsByName(start: string, name: string): string[] {
  const matches: string[] = [];
  const entries = readdirSync(start, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const fullPath = path.join(start, entry.name);
    if (entry.name === name) {
      matches.push(path.relative(root, fullPath));
    }
    matches.push(...findDirsByName(fullPath, name));
  }

  return matches;
}

describe('unified Next app routes', () => {
  it('keeps every active product page inside the web App Router tree', () => {
    const missing = requiredPages.filter((file) => !existsSync(path.join(appDir, file)));

    expect(missing).toEqual([]);
  });

  it('keeps server features in Next route handlers', () => {
    const missing = requiredApiRoutes.filter((file) => !existsSync(path.join(appDir, file)));

    expect(missing).toEqual([]);
  });

  it('does not keep legacy SPA entrypoints in the active web app', () => {
    const existing = removedSpaEntrypoints.filter((file) => existsSync(path.join(root, file)));

    expect(existing).toEqual([]);
  });

  it('does not rely on legacy catch-all compatibility route folders', () => {
    expect(findDirsByName(appDir, '[[...slug]]')).toEqual([]);
  });
});
