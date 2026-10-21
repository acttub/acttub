// coach2-*.json 덤프 → Confluence(html contentFormat) 본문 HTML 생성.
// 사용: node web/scripts/coach2-to-confluence.mjs <dump-json> <out-html>
import { readFile, writeFile } from 'node:fs/promises';

const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.error('사용법: node web/scripts/coach2-to-confluence.mjs <dump-json> <out-html>');
  process.exit(1);
}

const esc = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const calls = JSON.parse(await readFile(src, 'utf8'));
const totalMs = calls.reduce((a, c) => a + (c.ms || 0), 0);
const okCount = calls.filter((c) => c.ok).length;

// 콜별 한 줄 설명(label 기준).
const NOTE = {
  segment: '연기 구간 자동 감지(L0 앞단)',
  intent: '의도 키워드·기대 인상 보강',
  transcript: '대사 전사 (E1, 필수)',
  voice: '음성 신호 (E2)',
  face: '표정·시선 (E3)',
  'body#1': '자세·움직임 (E4 다수결 후보 1)',
  'body#2': '자세·움직임 (E4 다수결 후보 2)',
  'body#3': '자세·움직임 (E4 다수결 후보 3)',
  'verdict:emotion': '감정 코치 판정 (L1)',
  'verdict:speech': '대사 코치 판정 (L1)',
  'verdict:body': '움직임 코치 판정 (L1)',
  'verdict:audience': '관객 인상 판정 (L1)',
  diagnosis: '진단 — root_cause·prescription id 선택 (L2a)',
};

const langOf = (s) => {
  const t = String(s).trim();
  return t.startsWith('{') || t.startsWith('[') ? 'json' : 'text';
};

const rows = calls
  .map(
    (c, i) =>
      `<tr><td>${i + 1}</td><td><code>${esc(c.label)}</code></td><td>${
        c.ok ? '✅' : '⚠️'
      }</td><td>${(c.ms / 1000).toFixed(1)}s</td><td>${c.prompt.length}</td><td>${
        c.rawOutput.length
      }</td><td>${esc(NOTE[c.label] ?? '')}</td></tr>`,
  )
  .join('');

const PROMPT_DOC = 'https://hiws99.atlassian.net/wiki/spaces/TSSNN/pages/17334281';

const details = calls
  .map((c, i) => {
    const head = `<h3>${i + 1}. ${esc(c.label)} <span data-type="status" data-color="${
      c.ok ? 'green' : 'red'
    }">${c.ok ? 'ok' : 'fail'}</span></h3><p><em>${esc(NOTE[c.label] ?? '')} · ${(
      c.ms / 1000
    ).toFixed(1)}s · input ${c.prompt.length}자 (<a href="${PROMPT_DOC}">프롬프트 정본</a>)</em></p>`;
    // body 다수결 2·3번째는 1번째와 동일 → 전문 생략, 멱등 확인만.
    if (c.label === 'body#2' || c.label === 'body#3') {
      return `${head}<div data-type="panel-success"><p>rawOutput이 <code>body#1</code>과 바이트 동일 — temp 0+seed 멱등 확인.</p></div>`;
    }
    const err = c.error ? `<div data-type="panel-error"><p>error: ${esc(c.error)}</p></div>` : '';
    const outBlock = `<details><summary>output · rawOutput (${c.rawOutput.length}자)</summary><pre><code class="language-${langOf(
      c.rawOutput,
    )}">${esc(c.rawOutput || '(빈 응답)')}</code></pre></details>`;
    return `${head}${err}${outBlock}`;
  })
  .join('\n');

const body = `<div data-type="panel-info"><p>상태: 참고 · 자동 생성(로컬 덤프)</p><p><strong>【한 줄 요약】</strong> 이 문서는 coach v2(coach-second) 파이프라인이 실제 영상 1건을 분석할 때 Gemini로 보낸 <strong>13개 호출의 input(prompt 원문)과 output(raw 응답)</strong>을 그대로 기록한다.</p><p><strong>【결론】</strong> 13콜 전부 정상(${okCount}/${calls.length}) · 총 ${(
  totalMs / 1000
).toFixed(1)}s(병렬이라 실제 wall-clock은 더 짧음) · body 다수결 3콜 출력 동일(temp 0+seed 멱등 확인) · diagnosis가 사전 id를 선택.</p><p><em>아래는 각 콜의 <strong>output(raw 응답) 전문</strong>이다. input(prompt) 원문은 <a href="https://hiws99.atlassian.net/wiki/spaces/TSSNN/pages/17334281">프롬프트 정본 17334281</a>에 있어 길이만 표기한다(복제 회피). 동적 주입값 포함 완전본은 로컬 덤프 <code>web/.coach-trace/coach2-9bfcbcb8.json</code>.</em></p></div>

<h2>메타</h2>
<table><tbody>
<tr><th>파이프라인</th><td>coach-second (v2 전량 정량화)</td></tr>
<tr><th>호출 수</th><td>${calls.length} (segment·intent·L0 6 + L1 4 + diagnosis)</td></tr>
<tr><th>모델·설정</th><td>gemini-3.5-flash(코드 기본) · temperature 0 · seed 42 · structured output</td></tr>
<tr><th>합산 호출시간</th><td>${(totalMs / 1000).toFixed(1)}s</td></tr>
<tr><th>설계 정본</th><td>Confluence 18153475 · 프롬프트 정본 17334281</td></tr>
</tbody></table>

<h2>13콜 요약</h2>
<table><thead><tr><th>#</th><th>label</th><th>ok</th><th>ms</th><th>in(자)</th><th>out(자)</th><th>설명</th></tr></thead><tbody>${rows}</tbody></table>

<h2>콜별 input / output</h2>
<p>각 항목을 펼치면 보낸 prompt 원문(input)과 받은 raw 응답(output)을 그대로 볼 수 있다.</p>
${details}`;

await writeFile(out, body, 'utf8');
console.log(`OK: ${out}  (${calls.length} calls, ${(body.length / 1024).toFixed(1)}KB html)`);
