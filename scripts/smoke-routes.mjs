const baseUrl = (process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:4000').replace(/\/$/, '');

const checks = [
  ['landing', '/', 'root-landing'],
  ['ACTI home', '/ACTI', 'page-landing'],
  ['ACTI quiz', '/ACTI/quiz', 'page-quiz'],
  ['ACTI survey', '/ACTI/survey', 'data-route="acti-survey"'],
  ['ACTI result', '/ACTI/result/MINB', 'MINB'],
  ['coach', '/coach', 'coach-page'],
  ['archive', '/archive', 'archive-page'],
  ['archive search', '/archive/search?q=%ED%96%84%EB%A6%BF', 'archive-search-page'],
  ['archive upload', '/archive/upload', 'archive-upload-form'],
  ['archive me', '/archive/me', 'archive-me'],
  ['archive playlist new', '/archive/playlists/new', 'archive-page'],
  ['archive user profile', '/archive/u/minseo01', 'archive-page'],
  ['archive video detail', '/archive/videos/hamlet-monologue', '햄릿 3막 독백 연습'],
  ['community', '/community', 'community-page'],
  ['community search', '/community/search?q=%EC%97%B0%EA%B8%B0', 'community-search-block'],
  ['community new', '/community/new', 'community-post-form'],
  ['community write', '/community/write', 'community-post-form'],
  ['community me', '/community/me?tab=posts', 'community-page-title'],
  ['community post detail', '/community/posts/1024', '여러분은 왜 연기를 시작하셨어요?'],
  ['community post alias', '/community/p/1024', '여러분은 왜 연기를 시작하셨어요?'],
  ['excer', '/excer', 'excer-page'],
  ['excer room detail', '/excer/rooms/hyehwa-coral-studio', '혜화 코랄 스튜디오'],
  ['thea', '/thea', 'thea-page'],
  ['thea play detail', '/thea/plays/finding-mr-destiny', '김종욱 찾기'],
  ['team', '/team', 'team-page'],
  ['health API', '/api/health', '"ok":true'],
];

const failures = [];

for (const [label, path, expectedContent] of checks) {
  const url = `${baseUrl}${path}`;
  try {
    const response = await fetch(url, {
      headers: { accept: 'text/html,application/json;q=0.9,*/*;q=0.8' },
      signal: AbortSignal.timeout(5000),
    });
    const body = await response.text();
    const ok = response.status >= 200 && response.status < 400;
    const hasExpectedContent = body.includes(expectedContent);
    const marker = ok && hasExpectedContent ? 'ok' : 'fail';
    console.log(`${marker} ${response.status} ${label} ${path}`);
    if (!ok) failures.push(`${label} ${path} returned ${response.status}`);
    if (ok && !hasExpectedContent) {
      failures.push(`${label} ${path} did not include expected content: ${expectedContent}`);
    }
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
