const baseUrl = (process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:4000').replace(/\/$/, '');

const checks = [
  ['landing', '/'],
  ['ACTI home', '/ACTI'],
  ['ACTI result', '/ACTI/result/MINB'],
  ['coach', '/coach'],
  ['archive', '/archive'],
  ['community', '/community'],
  ['excer', '/excer'],
  ['thea', '/thea'],
  ['team', '/team'],
  ['health API', '/api/health'],
];

const failures = [];

for (const [label, path] of checks) {
  const url = `${baseUrl}${path}`;
  try {
    const response = await fetch(url, {
      headers: { accept: 'text/html,application/json;q=0.9,*/*;q=0.8' },
      signal: AbortSignal.timeout(5000),
    });
    const ok = response.status >= 200 && response.status < 400;
    const marker = ok ? 'ok' : 'fail';
    console.log(`${marker} ${response.status} ${label} ${path}`);
    if (!ok) failures.push(`${label} ${path} returned ${response.status}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`fail ERR ${label} ${path}`);
    failures.push(`${label} ${path} failed: ${message}`);
  }
}

if (failures.length > 0) {
  console.error('\nSmoke check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`\nSmoke check passed for ${checks.length} routes at ${baseUrl}`);
