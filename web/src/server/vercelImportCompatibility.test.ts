import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const filesCheckedByVercelFunctionCompiler = [
  'api/archive/upload.ts',
  'api/archive/videos.ts',
  'api/coach/analyze.ts',
  'api/community/comments.ts',
  'api/community/posts.ts',
  'src/coach/evaluation.ts',
  'src/archive/fixtures.ts',
  'src/community/fixtures.ts',
  'src/server/apiCore.ts',
  'src/server/coachAnalyze.ts',
  'src/server/postgresStorage.ts',
  'src/server/storage.ts',
  'src/server/storageFactory.ts',
  'src/server/webRequest.ts',
];

describe('vercel function import compatibility', () => {
  it('uses explicit js extensions for relative imports reached by serverless functions', () => {
    const extensionlessRelativeImport = /from ['"]\.{1,2}\/(?!.*\.(?:js|json|css|png|svg)['"])/;

    const offenders = filesCheckedByVercelFunctionCompiler.filter((file) => {
      const source = readFileSync(join(process.cwd(), file), 'utf8');
      return source.split('\n').some((line) => extensionlessRelativeImport.test(line));
    });

    expect(offenders).toEqual([]);
  });
});
