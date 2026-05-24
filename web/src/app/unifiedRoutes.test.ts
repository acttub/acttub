// @vitest-environment node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const repoRoot = path.resolve(root, '..');
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

const rootScriptsExpectedToTargetWeb = [
  'local',
  'local:web',
  'local:lan',
  'prod:web',
  'start',
  'start:lan',
  'lint',
  'test',
];

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf8')) as T;
}

function extractSmokePaths(): string[] {
  const source = readFileSync(path.join(repoRoot, 'scripts/smoke-routes.mjs'), 'utf8');
  return Array.from(source.matchAll(/\['[^']+', '([^']+)'\]/g), (match) => match[1]);
}

function extractReadmeOpenPaths(): string[] {
  const source = readFileSync(path.join(repoRoot, 'README.md'), 'utf8');
  return Array.from(source.matchAll(/http:\/\/localhost:4000([^\s`]*)/g), (match) => match[1] || '/');
}

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

describe('unified Next app workspace', () => {
  it('keeps the pnpm workspace scoped to the single active web app', () => {
    const workspace = readFileSync(path.join(repoRoot, 'pnpm-workspace.yaml'), 'utf8');

    expect(workspace).toContain('- "web"');
    expect(workspace).not.toContain('- "ACTI"');
    expect(workspace).not.toContain('- "thea"');
    expect(workspace).not.toContain('- "comm"');
    expect(workspace).not.toContain('- "arch"');
    expect(workspace).not.toContain('- "excer"');
    expect(workspace).not.toContain('- "coach"');
    expect(workspace).not.toContain('- "acttub-landing"');
  });

  it('keeps root commands pointed at the unified web app on port 4000', () => {
    const pkg = readJson<{ scripts: Record<string, string> }>(path.join(repoRoot, 'package.json'));

    for (const script of rootScriptsExpectedToTargetWeb) {
      expect(pkg.scripts[script]).toContain('--dir web');
    }

    expect(pkg.scripts.local).toContain('--port 4000');
    expect(pkg.scripts['local:web']).toContain('--port 4000');
    expect(pkg.scripts['local:lan']).toContain('--port 4000');
    expect(pkg.scripts.start).toContain('--port 4000');
    expect(pkg.scripts['start:lan']).toContain('--port 4000');
    expect(pkg.scripts.smoke).toBe('node scripts/smoke-routes.mjs');
    expect(existsSync(path.join(repoRoot, 'scripts/smoke-routes.mjs'))).toBe(true);
    expect(pkg.scripts.start).toContain('--hostname 127.0.0.1');
    expect(pkg.scripts['start:lan']).toContain('--hostname 0.0.0.0');
    expect(pkg.scripts.prod).toBe('corepack pnpm prod:web');
    expect(pkg.scripts.build).toBe('corepack pnpm prod');
    expect(pkg.scripts.verify).toBe(
      'corepack pnpm install --frozen-lockfile && corepack pnpm lint && corepack pnpm test && corepack pnpm prod'
    );
  });

  it('keeps the active web app on Next scripts instead of Vite scripts', () => {
    const pkg = readJson<{ dependencies: Record<string, string>; devDependencies: Record<string, string>; scripts: Record<string, string> }>(
      path.join(root, 'package.json')
    );

    expect(pkg.scripts.dev).toBe('next dev');
    expect(pkg.scripts.build).toBe('next build');
    expect(pkg.scripts.start).toBe('next start');
    expect(pkg.dependencies.next).toBeDefined();
    expect(pkg.devDependencies.vite).toBeUndefined();
    expect(pkg.devDependencies['@vitejs/plugin-react']).toBeUndefined();
    expect(pkg.dependencies['react-router-dom']).toBeUndefined();
  });
});

describe('unified Next app deployment', () => {
  it('keeps the active Vercel project configured as one Next app', () => {
    const vercel = readJson<{
      framework?: string;
      buildCommand?: string;
      outputDirectory?: string;
      rewrites?: unknown[];
      routes?: unknown[];
    }>(path.join(root, 'vercel.json'));

    expect(vercel.framework).toBe('nextjs');
    expect(vercel.buildCommand).toBe('pnpm build');
    expect(vercel.outputDirectory).toBeUndefined();
    expect(vercel.rewrites).toBeUndefined();
    expect(vercel.routes).toBeUndefined();
  });
});

describe('unified Next app runtime smoke', () => {
  it('keeps smoke checks aligned with documented local entry points', () => {
    const smokePaths = extractSmokePaths();
    const readmePaths = extractReadmeOpenPaths();

    expect(readmePaths.length).toBeGreaterThan(0);
    for (const readmePath of readmePaths) {
      expect(smokePaths).toContain(readmePath);
    }
    expect(smokePaths).toContain('/ACTI/result/MINB');
    expect(smokePaths).toContain('/api/health');
  });
});
