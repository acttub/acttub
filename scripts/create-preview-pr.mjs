import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const title = 'Unify Acttub into one Next.js web app';
const bodyFile = 'docs/nextjs-preview-pr.md';
const browserUrl = 'https://github.com/acttub/acttub/compare/main...experiment/nextjs-preview?quick_pull=1';
const args = [
  'pr',
  'create',
  '--base',
  'main',
  '--head',
  'experiment/nextjs-preview',
  '--title',
  title,
  '--body-file',
  bodyFile,
];

function printFallback() {
  console.error('GitHub CLI is not authenticated for PR creation.');
  console.error('');
  console.error('Authenticate first:');
  console.error('  gh auth login -h github.com');
  console.error('');
  console.error('Or create the PR in the browser:');
  console.error(`  ${browserUrl}`);
}

if (!existsSync(bodyFile)) {
  console.error(`Missing PR body file: ${bodyFile}`);
  process.exit(1);
}

if (process.argv.includes('--dry-run')) {
  console.log(`gh ${args.join(' ')}`);
  console.log(browserUrl);
  process.exit(0);
}

const auth = spawnSync('gh', ['auth', 'status'], {
  cwd: process.cwd(),
  encoding: 'utf8',
});

if (auth.status !== 0) {
  printFallback();
  process.exit(1);
}

const result = spawnSync('gh', args, {
  cwd: process.cwd(),
  encoding: 'utf8',
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
