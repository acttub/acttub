import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const filesCheckedByNextCompiler = [
  'src/app/api/archive/upload/route.ts',
  'src/app/api/archive/videos/route.ts',
  'src/app/api/acti/survey/route.ts',
  'src/app/api/coach/analyze/route.ts',
  'src/app/api/coach/cleanup/route.ts',
  'src/app/api/coach/upload/route.ts',
  'src/app/api/community/comments/route.ts',
  'src/app/api/community/posts/route.ts',
  'src/app/api/send-result/route.ts',
  'src/coach/evaluation.ts',
  'src/archive/fixtures.ts',
  'src/community/fixtures.ts',
  'src/server/apiCore.ts',
  'src/server/coachAnalyze.ts',
  'src/server/coachBlobCleanup.ts',
  'src/server/postgresStorage.ts',
  'src/server/storage.ts',
  'src/server/storageFactory.ts',
  'src/server/webRequest.ts',
];

describe('next function import compatibility', () => {
  it('does not use emitted js extensions for TypeScript source imports reached by Next routes', () => {
    const emittedJsSourceImport = /from ['"]\.{1,2}\/.*\.js['"]/;

    const offenders = filesCheckedByNextCompiler.filter((file) => {
      const source = readFileSync(join(process.cwd(), file), 'utf8');
      return source.split('\n').some((line) => emittedJsSourceImport.test(line));
    });

    expect(offenders).toEqual([]);
  });
});
