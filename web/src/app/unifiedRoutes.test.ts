// @vitest-environment node
import { execFileSync } from 'node:child_process';
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
  'db:generate',
  'db:migrate',
  'db:push',
];

const legacyRootScripts = [
  'local:acti',
  'local:thea',
  'local:comm',
  'local:arch',
  'local:excer',
  'local:coach',
];

const legacyLocalOrigins = [
  'localhost:3000',
  'localhost:3001',
  'localhost:3002',
  'localhost:3003',
  'localhost:3004',
  'localhost:4001',
  'localhost:4002',
  'localhost:5173',
  'localhost:5174',
];

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf8')) as T;
}

function extractSmokePaths(): string[] {
  const source = readFileSync(path.join(repoRoot, 'scripts/smoke-routes.mjs'), 'utf8');
  return Array.from(source.matchAll(/\['[^']+', '([^']+)'/g), (match) => match[1]);
}

function readSmokeSource() {
  return readFileSync(path.join(repoRoot, 'scripts/smoke-routes.mjs'), 'utf8');
}

function extractReadmeOpenPaths(): string[] {
  const source = readFileSync(path.join(repoRoot, 'README.md'), 'utf8');
  return Array.from(source.matchAll(/http:\/\/localhost:4000([^\s`]*)/g), (match) => match[1] || '/');
}

function trackedManifests(): string[] {
  return execFileSync('git', ['ls-files', '*package.json', '*vercel.json'], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim().split('\n').filter(Boolean).sort();
}

function sourceEnvNames(): string[] {
  const sourceFiles = execFileSync('git', ['ls-files', 'web/src', 'web/drizzle.config.ts'], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim().split('\n').filter(Boolean);
  const names = new Set<string>();

  for (const file of sourceFiles) {
    const source = readFileSync(path.join(repoRoot, file), 'utf8');
    for (const match of source.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
      names.add(match[1]);
    }
  }

  return [...names].sort();
}

function envExampleNames(): string[] {
  const source = readFileSync(path.join(root, '.env.example'), 'utf8');
  return source
    .split('\n')
    .map((line) => line.match(/^([A-Z0-9_]+)=/)?.[1])
    .filter((name): name is string => Boolean(name))
    .sort();
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

  it('keeps tracked app and deploy manifests limited to the unified web project', () => {
    expect(trackedManifests()).toEqual([
      'package.json',
      'web/package.json',
      'web/vercel.json',
    ]);
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
    expect(pkg.scripts['db:generate']).toBe('corepack pnpm --dir web db:generate');
    expect(pkg.scripts['db:migrate']).toBe('corepack pnpm --dir web db:migrate');
    expect(pkg.scripts['db:push']).toBe('corepack pnpm --dir web db:push');
    expect(pkg.scripts.verify).toBe(
      'corepack pnpm install --frozen-lockfile && corepack pnpm lint && corepack pnpm test && corepack pnpm prod'
    );
    expect(pkg.scripts['verify:runtime']).toBe('corepack pnpm smoke');
    expect(pkg.scripts['verify:prod-runtime']).toBe('node scripts/verify-prod-runtime.mjs');
    expect(pkg.scripts['verify:preview']).toBe(
      'corepack pnpm verify && PROD_VERIFY_PORT=4010 corepack pnpm verify:prod-runtime'
    );
    expect(pkg.scripts['pr:preview']).toBe('node scripts/create-preview-pr.mjs');
  });

  it('does not reintroduce legacy per-app local commands or ports', () => {
    const pkg = readJson<{ scripts: Record<string, string> }>(path.join(repoRoot, 'package.json'));
    const rootDocs = [
      readFileSync(path.join(repoRoot, 'README.md'), 'utf8'),
      readFileSync(path.join(repoRoot, 'AGENTS.md'), 'utf8'),
    ].join('\n');

    for (const script of legacyRootScripts) {
      expect(pkg.scripts[script]).toBeUndefined();
      expect(rootDocs).not.toContain(`corepack pnpm ${script}`);
    }

    const rootScriptBody = Object.values(pkg.scripts).join('\n');
    expect(rootScriptBody).not.toMatch(/--filter\s+(ACTI|thea|comm|arch|excer|coach|acttub-landing)\b/);
    expect(rootScriptBody).not.toMatch(/--dir\s+(ACTI|thea|comm|arch|excer|coach|acttub-landing)\b/);

    for (const origin of legacyLocalOrigins) {
      expect(rootScriptBody).not.toContain(origin);
      expect(rootDocs).not.toContain(origin);
    }
  });

  it('documents the runtime verification command for the running unified app', () => {
    const readme = readFileSync(path.join(repoRoot, 'README.md'), 'utf8');
    const agents = readFileSync(path.join(repoRoot, 'AGENTS.md'), 'utf8');
    const prodRuntimeScript = readFileSync(path.join(repoRoot, 'scripts/verify-prod-runtime.mjs'), 'utf8');
    const previewPrScript = readFileSync(path.join(repoRoot, 'scripts/create-preview-pr.mjs'), 'utf8');

    expect(readme).toContain('corepack pnpm verify:runtime');
    expect(readme).toContain('Run the smoke checks against the currently running app');
    expect(readme).toContain('corepack pnpm verify:prod-runtime');
    expect(readme).toContain('Build `web`, start it on port 4000, run smoke checks, and stop it');
    expect(readme).toContain('corepack pnpm verify:preview');
    expect(readme).toContain('Full preview branch check');
    expect(agents).toContain('corepack pnpm verify:preview');
    expect(readme).toContain('PROD_VERIFY_PORT=4010 corepack pnpm verify:prod-runtime');
    expect(existsSync(path.join(repoRoot, 'scripts/verify-prod-runtime.mjs'))).toBe(true);
    expect(prodRuntimeScript).toContain('assertNoExistingServer');
    expect(prodRuntimeScript).toContain('already serving the app');
    expect(previewPrScript).toContain('gh auth login -h github.com');
    expect(previewPrScript).toContain('gh');
    expect(previewPrScript).toContain('experiment/nextjs-preview');
  });

  it('keeps browser-like tests on the unified local origin', () => {
    const vitestConfig = readFileSync(path.join(root, 'vitest.config.ts'), 'utf8');

    expect(vitestConfig).toContain("url: 'http://localhost:4000/'");
    expect(vitestConfig).not.toContain('localhost:3000');
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

  it('keeps deployment docs aligned with the single web Vercel project', () => {
    const rootReadme = readFileSync(path.join(repoRoot, 'README.md'), 'utf8');
    const webReadme = readFileSync(path.join(root, 'README.md'), 'utf8');
    const readiness = readFileSync(path.join(repoRoot, 'docs/nextjs-preview-readiness.md'), 'utf8');
    const prDraft = readFileSync(path.join(repoRoot, 'docs/nextjs-preview-pr.md'), 'utf8');

    expect(rootReadme).toContain('| `web` | `web` |');
    expect(rootReadme).toContain('docs/nextjs-preview-readiness.md');
    expect(webReadme).toContain('Vercel project root directory: `web`');
    expect(webReadme).toContain('pnpm build');
    expect(webReadme).toContain('Leave unset. Vercel detects the Next.js output automatically.');
    expect(webReadme).not.toContain('```txt\n.next\n```');
    expect(webReadme).toContain('corepack pnpm verify:preview');
    expect(readiness).toContain('Branch: `experiment/nextjs-preview`');
    expect(readiness).toContain('corepack pnpm verify:preview');
    expect(readiness).toContain('Vercel root directory: `web`');
    expect(readiness).toContain('Output directory: leave unset');
    expect(readiness).toContain('docs/nextjs-preview-pr.md');
    expect(prDraft).toContain('gh pr create --base main --head experiment/nextjs-preview');
    expect(prDraft).toContain('corepack pnpm pr:preview');
    expect(prDraft).toContain('https://github.com/acttub/acttub/compare/main...experiment/nextjs-preview?quick_pull=1');
    expect(prDraft).toContain('corepack pnpm verify:preview');
    expect(prDraft).toContain('Vercel root directory: `web`');
  });

  it('keeps local Vercel metadata and env files ignored', () => {
    const rootIgnore = readFileSync(path.join(repoRoot, '.gitignore'), 'utf8');
    const webIgnore = readFileSync(path.join(root, '.gitignore'), 'utf8');

    expect(rootIgnore).toMatch(/(^|\n)\.vercel\/?(\n|$)/);
    expect(rootIgnore).toMatch(/(^|\n)\.env\.local(\n|$)/);
    expect(rootIgnore).toMatch(/(^|\n)\.env\.\*\.local(\n|$)/);
    expect(webIgnore).toMatch(/(^|\n)\.vercel\/?(\n|$)/);
    expect(webIgnore).toMatch(/(^|\n)\.env\*/);
    expect(webIgnore).toMatch(/(^|\n)!\.env\.example(\n|$)/);
  });

  it('keeps public coach docs from naming the analysis provider or model', () => {
    const publicDocs = [
      path.join(repoRoot, 'README.md'),
      path.join(root, 'README.md'),
      path.join(root, '.env.example'),
    ];

    for (const file of publicDocs) {
      const source = readFileSync(file, 'utf8');
      expect(source).not.toMatch(/Gemini (acting|coach|analysis)|GEMINI_MODEL|gemini-3\.5/i);
    }
  });

  it('documents every public or required environment variable except hidden provider internals', () => {
    const documented = envExampleNames();
    const hiddenInternals = new Set(['GEMINI_MODEL']);
    const missing = sourceEnvNames().filter((name) => !hiddenInternals.has(name) && !documented.includes(name));

    expect(missing).toEqual([]);
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
    expect(smokePaths).toContain('/ACTI/quiz');
    expect(smokePaths).toContain('/ACTI/survey');
    expect(smokePaths).toContain('/ACTI/result/MINB');
    expect(smokePaths).toContain('/archive/search?q=%ED%96%84%EB%A6%BF');
    expect(smokePaths).toContain('/archive/upload');
    expect(smokePaths).toContain('/archive/me');
    expect(smokePaths).toContain('/archive/playlists/new');
    expect(smokePaths).toContain('/archive/u/minseo01');
    expect(smokePaths).toContain('/archive/videos/hamlet-monologue');
    expect(smokePaths).toContain('/community/search?q=%EC%97%B0%EA%B8%B0');
    expect(smokePaths).toContain('/community/new');
    expect(smokePaths).toContain('/community/write');
    expect(smokePaths).toContain('/community/me?tab=posts');
    expect(smokePaths).toContain('/community/posts/1024');
    expect(smokePaths).toContain('/community/p/1024');
    expect(smokePaths).toContain('/excer/rooms/hyehwa-coral-studio');
    expect(smokePaths).toContain('/thea/plays/finding-mr-destiny');
    expect(smokePaths).toContain('/api/health');
    expect(smokePaths).toContain('/api/archive/videos?q=%ED%96%84%EB%A6%BF');
    expect(smokePaths).toContain('/api/community/posts?board=free');
    expect(smokePaths).toContain('/api/community/comments?postId=1024');
    expect(smokePaths).toContain('/api/coach/analyze');
  });

  it('requires API smoke checks to parse JSON responses', () => {
    const smoke = readSmokeSource();

    expect(smoke).toContain('expectJson: true');
    expect(smoke).toContain('JSON.parse(body)');
    expect(smoke).toContain("contentType.includes('application/json')");
  });

  it('requires coach smoke checks to reject provider and model leaks', () => {
    const smoke = readSmokeSource();

    expect(smoke).toContain('forbiddenContent');
    expect(smoke).toContain('leakedContent');
    expect(smoke).toContain('Request Entity Too Large');
    expect(smoke).toContain("['Gemini', 'gemini', 'GEMINI_MODEL'");
    expect(smoke).toContain("['Gemini', 'gemini', 'GEMINI_MODEL', 'model'");
  });
});
