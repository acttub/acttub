/**
 * SOMA-79 — coach 피드백 대량 생성 (문장 분해)
 *
 * 목적: acttub.com/coach 가 쓰는 실제 프로덕션 프롬프트(web/src/coach/evaluation.ts 의
 *       buildEvaluationPrompt)를 그대로 Gemini 에 돌려 10개 영상 × N회 피드백을 생성하고,
 *       문장 단위로 분해해 SOMA-80 `라벨링`/`피드백` 시트 포맷 CSV로 출력한다.
 *       (프롬프트는 import 로 실물을 그대로 써서 드리프트 없음.)
 *
 * ⚠ 무료 티어 한도: gemini-3.5-flash 는 free tier 가 하루 20요청(프로젝트/모델당)이다.
 *   70콜(10영상×7회)을 하루에 다 돌리려면 결제(billing) 활성 키가 필요하다. 무료면 매일 20개씩
 *   여러 날 나눠 돌려야 한다 → 그래서 이 스크립트는 APPEND + 중복스킵으로, 재실행 때 이미 만든
 *   feedback 은 건너뛰고 새 것만 누적한다(덮어쓰지 않음).
 *
 * 배치/실행: repos/acttub/web/scripts/ 에서:
 *   cd repos/acttub/web
 *   pnpm exec tsx --env-file=.env.local scripts/soma-79-generate-coach-feedback.ts
 *   (tsx 미설치 시: pnpm dlx tsx ...)
 *
 * 출력(append): scripts/out/labeling.csv, scripts/out/feedback.csv → 구글시트 탭에 붙여넣기.
 *
 * 입력: Gemini YouTube URL 직접 입력(공식 video-understanding). 공개영상·요청당1개.
 *
 * 환경변수(선택): RUNS_PER_VIDEO(기본 7), GEN_TEMPERATURE(기본 1), GEMINI_MODEL(기본 gemini-3.5-flash),
 *               REQUEST_DELAY_MS(기본 4000), MAX_CALLS(이번 실행 최대 호출 수, 기본 무제한).
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import { buildEvaluationPrompt, parseGeminiFeedback, type CoachFeedback } from '../src/coach/evaluation';

type Case = {
  caseId: string;
  youtubeUrl: string;
  category: string;
  intent: string; // ⚠ 임시값 — 영상 보고 현실화 권장
  startSec: number;
  endSec: number;
};

// ⚠ C08·C10 은 "모음" — 단일 장면 구간으로 startSec/endSec 좁혀야 정상 분석.
const CASES: Case[] = [
  { caseId: 'C01', youtubeUrl: 'https://www.youtube.com/watch?v=-fwIbqVsc7E', category: '독백', intent: '불안한 인물의 내면을 떨리는 호흡으로 전달', startSec: 0, endSec: 90 },
  { caseId: 'C02', youtubeUrl: 'https://www.youtube.com/watch?v=E9SBhs_-0CA', category: '감정연기', intent: '상실의 슬픔을 절제해서 표현', startSec: 0, endSec: 90 },
  { caseId: 'C03', youtubeUrl: 'https://www.youtube.com/watch?v=OLltv0ShI9k', category: '즉흥', intent: '기쁨이 차오르는 표정 변화를 보여주기', startSec: 0, endSec: 45 },
  { caseId: 'C04', youtubeUrl: 'https://www.youtube.com/watch?v=bBDpaqI925c', category: '독백', intent: '억눌렀던 분노가 터지는 순간을 대사로', startSec: 0, endSec: 45 },
  { caseId: 'C05', youtubeUrl: 'https://www.youtube.com/watch?v=SIWkn01eSWw', category: '오디션', intent: '불안에 쫓기는 인물을 전신 움직임으로', startSec: 0, endSec: 90 },
  { caseId: 'C06', youtubeUrl: 'https://www.youtube.com/watch?v=6ORGwaewPyU', category: '감정연기', intent: '슬픔을 가까운 사람에게 털어놓는 감정', startSec: 0, endSec: 90 },
  { caseId: 'C07', youtubeUrl: 'https://www.youtube.com/watch?v=8FVK34e5i4s', category: '감정연기', intent: '행복한 순간의 미세한 표정', startSec: 0, endSec: 45 },
  { caseId: 'C08', youtubeUrl: 'https://www.youtube.com/watch?v=Y5G_lJ8XEmI', category: '독백', intent: '공포에 짓눌린 인물의 긴장', startSec: 0, endSec: 90 },
  { caseId: 'C09', youtubeUrl: 'https://www.youtube.com/watch?v=h-Ou-gb7Rjg', category: '대사', intent: '분노를 눌러 담은 위협적 대사', startSec: 0, endSec: 90 },
  { caseId: 'C10', youtubeUrl: 'https://www.youtube.com/watch?v=b_Ht2B9A92A', category: '대사', intent: '깊은 슬픔에서 터지는 눈물 연기', startSec: 0, endSec: 120 },
];

const RUNS_PER_VIDEO = Number(process.env.RUNS_PER_VIDEO ?? 7);
const TEMPERATURE = Number(process.env.GEN_TEMPERATURE ?? 1);
const MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash';
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS ?? 4000);
const MAX_CALLS = Number(process.env.MAX_CALLS ?? Number.POSITIVE_INFINITY);
const PROMPT_VERSION = process.env.PROMPT_VERSION ?? 'v1-prod';
const FALLBACK_SUMMARY_PREFIX = '분석 결과를 구조화하지 못했습니다';
const OUT_DIR = path.join(process.cwd(), 'scripts', 'out');
const LABELING_PATH = path.join(OUT_DIR, process.env.OUT_LABELING ?? 'labeling.csv');
const FEEDBACK_PATH = path.join(OUT_DIR, process.env.OUT_FEEDBACK ?? 'feedback.csv');

const LABELING_HEADERS = ['sentence_id', 'feedback_id', 'case_id', '프롬프트버전', '축', '지표명', '문장', '평가', '나쁨이유주태그', '보조태그', '코멘트', 'kind'];
const FEEDBACK_HEADERS = ['feedback_id', 'case_id', '프롬프트버전', '원문전체(JSON)', '문장수', '강점포함', '다룬축'];

function axisFromLabel(label: string): string {
  if (label.includes('감정')) return '감정';
  if (label.includes('대사')) return '대사';
  if (label.includes('신체')) return '움직임';
  return '기타';
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?。])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function feedbackToRows(caseId: string, feedbackId: string, fb: CoachFeedback): (string | number)[][] {
  const rows: (string | number)[][] = [];
  let n = 0;
  const push = (axis: string, metricLabel: string, sentence: string, kind: string) => {
    if (!sentence.trim()) return;
    n += 1;
    rows.push([`${feedbackId}-s${String(n).padStart(2, '0')}`, feedbackId, caseId, PROMPT_VERSION, axis, metricLabel, sentence.trim(), '', '', '', '', kind]);
  };
  for (const s of splitSentences(fb.summary)) push('기타', '', s, '요약');
  for (const m of fb.evaluationMetrics) push(axisFromLabel(m.label), m.label, m.note, '지표'); // 지표명 = 감정 전달/대사 전달/신체 표현/의도 부합
  for (const w of fb.weaknesses) push('', '', w, '약점');
  for (const a of fb.alignedMoments) push('', '', a, '강점');
  for (const r of fb.practiceRecommendations) push('', '', r, '처방');
  return rows;
}

function csvCell(v: string | number): string {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function rowsToCsv(rows: (string | number)[][]): string {
  return rows.map((r) => r.map(csvCell).join(',')).join('\n');
}

async function readDoneFeedbackIds(): Promise<Set<string>> {
  // labeling.csv 기준으로 완료 판정 — 행이 모두 단일 라인이라 안전.
  // feedback.csv 는 원문 JSON 셀에 줄바꿈이 있어 라인 단위 파싱이 깨지므로 쓰지 않는다.
  try {
    const text = await readFile(LABELING_PATH, 'utf8');
    const ids = text
      .split('\n')
      .slice(1) // header
      .map((line) => line.split(',')[1]?.trim()) // feedback_id = 2번째 컬럼(이 앞 컬럼들은 콤마 없음)
      .filter((id): id is string => Boolean(id));
    return new Set(ids);
  } catch {
    return new Set();
  }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await readFile(p, 'utf8');
    return true;
  } catch {
    return false;
  }
}

async function appendCsv(filePath: string, headers: string[], rows: (string | number)[][]) {
  if (rows.length === 0) return;
  const exists = await fileExists(filePath);
  const chunk = (exists ? '' : `${headers.map(csvCell).join(',')}\n`) + `${rowsToCsv(rows)}\n`;
  const prev = exists ? await readFile(filePath, 'utf8') : '';
  await writeFile(filePath, prev + chunk, 'utf8');
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY 환경변수가 필요합니다 (.env.local 또는 export).');

  await mkdir(OUT_DIR, { recursive: true });
  const done = await readDoneFeedbackIds();
  if (done.size > 0) console.log(`기존 완료 ${done.size}건 → 건너뜀(append 모드)`);

  const ai = new GoogleGenAI({ apiKey });

  const newLabeling: (string | number)[][] = [];
  const newFeedback: (string | number)[][] = [];
  let calls = 0;
  let quotaHit = false;

  outer: for (const c of CASES) {
    for (let run = 1; run <= RUNS_PER_VIDEO; run += 1) {
      const feedbackId = `${c.caseId}-r${String(run).padStart(2, '0')}`;
      if (done.has(feedbackId)) continue;
      if (calls >= MAX_CALLS) {
        console.log(`MAX_CALLS(${MAX_CALLS}) 도달 — 이번 실행 종료`);
        break outer;
      }

      const prompt = buildEvaluationPrompt({
        fileName: c.caseId,
        category: c.category,
        intent: c.intent,
        startTime: c.startSec,
        endTime: c.endSec,
      });

      calls += 1;
      try {
        const result = await ai.models.generateContent({
          model: MODEL,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  fileData: { fileUri: c.youtubeUrl, mimeType: 'video/*' },
                  videoMetadata: { startOffset: `${c.startSec}s`, endOffset: `${c.endSec}s` },
                },
                { text: prompt },
              ],
            },
          ],
          config: { temperature: TEMPERATURE },
        });

        const raw = result.text ?? '';
        const fb = parseGeminiFeedback(raw);
        if (fb.summary.startsWith(FALLBACK_SUMMARY_PREFIX)) {
          console.warn(`[skip] ${feedbackId}: 응답 파싱 실패(fallback)`);
        } else {
          const rows = feedbackToRows(c.caseId, feedbackId, fb);
          newLabeling.push(...rows);
          const axes = [...new Set(fb.evaluationMetrics.map((m) => axisFromLabel(m.label)))].join('|');
          // 원문은 compact JSON(단일 라인)으로 저장 — raw 는 줄바꿈/마크다운이 섞여 CSV를 깨뜨림
          newFeedback.push([feedbackId, c.caseId, PROMPT_VERSION, JSON.stringify(fb), rows.length, fb.alignedMoments.length > 0 ? 'Y' : 'N', axes]);
          console.log(`[ok] ${feedbackId}: ${rows.length} 문장 (이번 실행 누적 ${newLabeling.length})`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[error] ${feedbackId}: ${msg.slice(0, 160)}`);
        if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
          quotaHit = true;
          console.error('→ 일일 quota 소진(무료 20/일 추정). 결제 활성화 또는 다음 날 재실행하면 이어서 누적됨.');
          break outer;
        }
      }

      await sleep(REQUEST_DELAY_MS);
    }
  }

  await appendCsv(LABELING_PATH, LABELING_HEADERS, newLabeling);
  await appendCsv(FEEDBACK_PATH, FEEDBACK_HEADERS, newFeedback);

  console.log(`\n이번 실행: 문장 +${newLabeling.length} / 피드백 +${newFeedback.length}건${quotaHit ? ' (quota 중단)' : ''}`);
  console.log(`누적 파일: ${LABELING_PATH} , ${FEEDBACK_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
