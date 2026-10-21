// coach v2(coach-second) 13콜 input/output 덤프용 — 브라우저/업로드 우회.
//
// dev 서버(corepack pnpm local, 127.0.0.1:4000)가 떠 있는 상태에서 영상 파일을
// /api/coach-second/analyze 에 multipart 로 직접 POST 한다. blob 업로드·content-type
// 허용목록·duration 검증을 전부 건너뛴다. 분석이 끝나면 서버 프로세스가
// web/.coach-trace/coach2-*.json 에 13콜(prompt=input, rawOutput=output)을 떨군다.
//
// 사용:
//   node web/scripts/coach2-dump.mjs <video-path> [category] [intent]
// 예:
//   node web/scripts/coach2-dump.mjs ./sample.mp4 "독백" "분노를 절제해서 표현"
//
// 환경: COACH_BASE 로 서버 주소 변경 가능(기본 http://127.0.0.1:4000).

import { readFile } from 'node:fs/promises';
import { File } from 'node:buffer';
import path from 'node:path';

const [videoPath, category = '자유연기', intent = '로컬 13콜 덤프 테스트'] = process.argv.slice(2);

if (!videoPath) {
  console.error('사용법: node web/scripts/coach2-dump.mjs <video-path> [category] [intent]');
  process.exit(1);
}

const EXT_TO_TYPE = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',
};

const buf = await readFile(videoPath);
const ext = path.extname(videoPath).toLowerCase();
const type = EXT_TO_TYPE[ext] ?? 'video/mp4';

const form = new FormData();
form.set('video', new File([buf], path.basename(videoPath), { type }));
form.set('fileName', path.basename(videoPath));
form.set('category', category);
form.set('intent', intent);
form.set('startTime', '0');
// 실제 연기 구간은 서버의 segment 자동감지가 좁힌다 — 넉넉히 상한(10분)만 준다.
form.set('endTime', '600');

const base = process.env.COACH_BASE ?? 'http://127.0.0.1:4000';
const url = `${base}/api/coach-second/analyze`;

console.log(`POST ${url}`);
console.log(`  file: ${path.basename(videoPath)}  ${(buf.length / 1e6).toFixed(1)}MB  ${type}`);
console.log('  분석 중… (Gemini 영상 업로드+13콜이라 수십 초~수 분 걸릴 수 있음)');

const startedAt = Date.now();
const res = await fetch(url, { method: 'POST', body: form });
const text = await res.text();
const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);

console.log(`\nstatus ${res.status}  (${elapsed}s)`);
console.log(text.slice(0, 800));
console.log(
  res.ok
    ? '\n✅ 13콜 input/output → web/.coach-trace/coach2-*.json (서버 터미널에도 경로 한 줄 찍힘)'
    : '\n⚠️ 분석은 실패했어도 그때까지 호출한 콜은 web/.coach-trace/ 에 덤프됨 — 거기서 input/output 확인',
);
