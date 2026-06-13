// /coach-second 분석 핸들러 — v2 전량 정량화 파이프라인.
// L0 요소 추출 4종(E4 다수결 k=3) → 코드 병합 → L1 전수 판정 4 → 코드 집계 → 진단(id 선택) → 코드 카드 조립.
// /coach(coachAnalyze.ts)는 건드리지 않는다 — 요청 파싱 헬퍼는 격리를 위해 복제.
// 설계 정본: Confluence 18153475(rev.6) · 프롬프트 정본: 17334281(v2.0-draft.7)
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createPartFromUri, createUserContent, GoogleGenAI, type Schema } from '@google/genai';
import { del } from '@vercel/blob';
import { formatTime, type CoachFeedback } from '../coach/evaluation';
import { PRESCRIPTION_LIBRARY, ROOT_DICTIONARY } from '../coach2/dictionaries';
import { aggregate, assembleCard, mergeToAnchors, pickMajority } from '../coach2/pipeline';
import {
  buildAudienceVerdictPrompt,
  buildBodyPrompt,
  buildCoachVerdictPrompt,
  buildDiagnosisPrompt,
  buildFacePrompt,
  buildIntentPrompt,
  buildSegmentPrompt,
  buildTranscriptPrompt,
  buildVoicePrompt,
  COACH_PERSONAS,
  GENERATION_SEED,
  GENERATION_TEMPERATURE,
  PROMPT_VERSION,
} from '../coach2/prompts';
import {
  audienceVerdictSchema,
  BODY_SCHEMA,
  coachVerdictSchema,
  diagnosisSchema,
  FACE_SCHEMA,
  INTENT_SCHEMA,
  SEGMENT_SCHEMA,
  TRANSCRIPT_SCHEMA,
  VOICE_SCHEMA,
} from '../coach2/schemas';
import type {
  AllVerdicts,
  AnalysisTrace,
  AudienceVerdict,
  BodyResult,
  CoachVerdict,
  Diagnosis,
  FaceResult,
  IntentInfo,
  SegmentResult,
  TranscriptResult,
  VoiceResult,
} from '../coach2/types';
import type { ApiResult } from './apiCore';

type GeminiFileState = {
  name?: string;
  uri?: string;
  mimeType?: string;
  state?: unknown;
};

type CoachSecondInput = {
  video: File;
  fileName: string;
  category: string;
  intent: string;
  startTime: number;
  endTime: number;
  apiKey: string;
};

type CoachSecondResult = { feedback: CoachFeedback; trace: AnalysisTrace };

type CoachSecondOptions = {
  apiKey?: string;
  analyze?: (input: CoachSecondInput) => Promise<CoachSecondResult>;
  fetch?: typeof fetch;
};

type FormValue = string | File;

const ANALYZE_FAILURE_MESSAGE = '분석 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.';
const HONEST_FAILURE_MESSAGE = '영상 분석이 끝까지 되지 않았어요. 같은 영상으로 다시 시도해 주세요.';
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

function numberFromForm(value: FormValue | null) {
  if (typeof value !== 'string') return Number.NaN;
  return Number(value);
}

function textFromForm(value: FormValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function fileExtension(file: File) {
  if (file.name.includes('.')) return path.extname(file.name);
  if (file.type === 'video/webm') return '.webm';
  if (file.type === 'video/quicktime') return '.mov';
  return '.mp4';
}

function fileStateName(state: unknown) {
  return String(state ?? '').toUpperCase();
}

function isUploadedFile(value: FormValue | null): value is File {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<File>;
  return (
    typeof record.arrayBuffer === 'function'
    && typeof record.size === 'number'
    && typeof record.type === 'string'
  );
}

function methodNotAllowed(): ApiResult {
  return { status: 405, body: { error: 'method not allowed' } };
}

function jsonError(status: number, error: string): ApiResult {
  return { status, body: { error } };
}

function jsonString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function jsonNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  return Number.NaN;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function parseStructured<T>(rawText: string): T {
  // structured output(responseSchema)이 JSON을 보장 — 정규식 추출 폴백 없음(B5 제거).
  return JSON.parse(rawText) as T;
}

async function defaultAnalyze(input: CoachSecondInput): Promise<CoachSecondResult> {
  let tempPath = '';
  let geminiFileName = '';

  try {
    const bytes = Buffer.from(await input.video.arrayBuffer());
    const uploadDir = path.join(tmpdir(), 'acttub-coach-second');
    await mkdir(uploadDir, { recursive: true });
    tempPath = path.join(uploadDir, `${randomUUID()}${fileExtension(input.video)}`);
    await writeFile(tempPath, bytes);

    const ai = new GoogleGenAI({ apiKey: input.apiKey });
    let uploadedFile = await ai.files.upload({
      file: tempPath,
      config: {
        displayName: input.fileName,
        mimeType: input.video.type || 'video/mp4',
      },
    }) as GeminiFileState;

    geminiFileName = uploadedFile.name ?? '';

    for (let attempt = 0; attempt < 12; attempt += 1) {
      if (fileStateName(uploadedFile.state) === 'ACTIVE') break;
      if (!uploadedFile.name) throw new Error('업로드 파일 이름을 확인하지 못했습니다.');
      await sleep(5000);
      uploadedFile = await ai.files.get({ name: uploadedFile.name }) as GeminiFileState;
    }

    if (fileStateName(uploadedFile.state) !== 'ACTIVE') {
      throw new Error('AI 분석 서비스가 영상 처리를 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }

    if (!uploadedFile.uri || !uploadedFile.mimeType) {
      throw new Error('업로드 파일 URI 또는 MIME 타입을 확인하지 못했습니다.');
    }

    const model = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash';
    const videoPart = createPartFromUri(uploadedFile.uri, uploadedFile.mimeType);

    // 멱등성 호출 설정 — temp 0 + seed + structured output (실측 §5.6).
    const generate = (prompt: string, schema: Schema, withVideo: boolean) =>
      ai.models
        .generateContent({
          model,
          contents: createUserContent(withVideo ? [videoPart, prompt] : [prompt]),
          config: {
            temperature: GENERATION_TEMPERATURE,
            seed: GENERATION_SEED,
            responseMimeType: 'application/json',
            responseSchema: schema,
          },
        })
        .then((response) => response.text ?? '');

    const failures: string[] = [];

    // 연기 구간 자동 감지 (L0 앞단) — 영상 전체에서 실제 연기 시작·끝을 AI가 짚는다.
    // 실패·미감지 시 받은 전체 구간으로 폴백(detected=false).
    let segmentInfo = {
      detected: false,
      start: formatTime(input.startTime),
      end: formatTime(input.endTime),
    };
    try {
      const detected = parseStructured<SegmentResult>(
        await generate(buildSegmentPrompt(input.category), SEGMENT_SCHEMA, true),
      );
      if (detected.detected && detected.actingStart && detected.actingEnd) {
        segmentInfo = { detected: true, start: detected.actingStart, end: detected.actingEnd };
      }
    } catch {
      failures.push('segment');
    }

    const clip = {
      category: input.category,
      start: segmentInfo.start,
      end: segmentInfo.end,
    };

    // 의도 보강 — 실패해도 진행(키워드·기대 인상 없이).
    let intentInfo: IntentInfo = {
      raw: input.intent,
      keywords: [],
      expectedImpressions: [],
      confidence: '낮음',
    };
    try {
      const parsed = parseStructured<{
        intent_keywords: string[];
        intent_summary: string;
        expected_impressions: IntentInfo['expectedImpressions'];
        confidence: IntentInfo['confidence'];
      }>(await generate(buildIntentPrompt(input.category, input.intent), INTENT_SCHEMA, false));
      intentInfo = {
        raw: input.intent,
        keywords: parsed.intent_keywords.slice(0, 3),
        summary: (parsed.intent_summary ?? '').trim(),
        expectedImpressions: parsed.expected_impressions.slice(0, 2),
        confidence: parsed.confidence,
      };
    } catch {
      failures.push('intent_enrichment');
    }

    // L0 — E1은 필수(실패 시 1회 재시도 후 정직한 중단), E2·E3 단일, E4는 다수결 k=3.
    const transcriptCall = () =>
      generate(buildTranscriptPrompt(clip), TRANSCRIPT_SCHEMA, true)
        .then((text) => parseStructured<TranscriptResult>(text));

    const settled = await Promise.allSettled([
      transcriptCall(),
      generate(buildVoicePrompt(clip), VOICE_SCHEMA, true).then((text) => parseStructured<VoiceResult>(text)),
      generate(buildFacePrompt(clip), FACE_SCHEMA, true).then((text) => parseStructured<FaceResult>(text)),
      generate(buildBodyPrompt(clip), BODY_SCHEMA, true),
      generate(buildBodyPrompt(clip), BODY_SCHEMA, true),
      generate(buildBodyPrompt(clip), BODY_SCHEMA, true),
    ]);

    let transcript: TranscriptResult | null = settled[0].status === 'fulfilled' ? settled[0].value as TranscriptResult : null;
    if (!transcript) {
      try {
        transcript = await transcriptCall();
      } catch {
        failures.push('transcript');
      }
    }

    // 대사 인용은 카드의 필수 근거 — 전사 없이는 억지 카드보다 정직한 실패.
    if (!transcript) {
      throw new Error(HONEST_FAILURE_MESSAGE);
    }

    const voice: VoiceResult | null = settled[1].status === 'fulfilled' ? settled[1].value as VoiceResult : null;
    if (!voice) failures.push('voice');
    const face: FaceResult | null = settled[2].status === 'fulfilled' ? settled[2].value as FaceResult : null;
    if (!face) failures.push('face');

    const bodyCandidatesRaw = settled.slice(3)
      .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
      .map((result) => result.value);
    let body: BodyResult | null = null;
    let bodyMajority: AnalysisTrace['l0']['bodyMajority'] = null;
    if (bodyCandidatesRaw.length > 0) {
      const parsedCandidates: BodyResult[] = [];
      const serialized: string[] = [];
      for (const raw of bodyCandidatesRaw) {
        try {
          parsedCandidates.push(parseStructured<BodyResult>(raw));
          serialized.push(raw);
        } catch {
          // 파싱 실패 후보는 다수결에서 제외
        }
      }
      if (parsedCandidates.length > 0) {
        const majority = pickMajority(parsedCandidates);
        body = majority.picked;
        bodyMajority = { candidates: serialized, pickedIndex: majority.pickedIndex };
      }
    }
    if (!body) failures.push('body');

    // E2~E4 중 2개 이상 실패 → 관찰 근거가 절반 이하. 정직한 중단.
    const failedExtractors = [voice, face, body].filter((result) => result === null).length;
    if (failedExtractors >= 2) {
      throw new Error(HONEST_FAILURE_MESSAGE);
    }

    const anchors = mergeToAnchors({
      transcript,
      voice: voice?.events ?? [],
      face: face?.events ?? [],
      body: body?.events ?? [],
    });

    if (anchors.length === 0) {
      throw new Error('분석 구간에서 발화나 움직임을 찾지 못했어요. 구간을 다시 선택해 주세요.');
    }

    // L1 — 전수 판정. anchorId는 스키마 enum으로 강제.
    const anchorIds = anchors.map((anchor) => anchor.anchorId);
    const coachSchema = coachVerdictSchema(anchorIds);
    const verdictSettled = await Promise.allSettled([
      ...COACH_PERSONAS.map((persona) =>
        generate(
          buildCoachVerdictPrompt(persona, {
            category: input.category,
            intentRaw: input.intent,
            intentKeywords: intentInfo.keywords,
            anchors,
          }),
          coachSchema,
          false,
        ).then((text) => parseStructured<{ verdicts: CoachVerdict[] }>(text).verdicts)),
      generate(buildAudienceVerdictPrompt({ category: input.category, anchors }), audienceVerdictSchema(anchorIds), false)
        .then((text) => parseStructured<{ verdicts: AudienceVerdict[] }>(text).verdicts),
    ]);

    const verdicts: AllVerdicts = {
      emotion: verdictSettled[0].status === 'fulfilled' ? verdictSettled[0].value as CoachVerdict[] : [],
      speech: verdictSettled[1].status === 'fulfilled' ? verdictSettled[1].value as CoachVerdict[] : [],
      body: verdictSettled[2].status === 'fulfilled' ? verdictSettled[2].value as CoachVerdict[] : [],
      audience: verdictSettled[3].status === 'fulfilled' ? verdictSettled[3].value as AudienceVerdict[] : [],
    };
    (['emotion', 'speech', 'body', 'audience'] as const).forEach((key, index) => {
      if (verdictSettled[index].status === 'rejected') failures.push(`verdict_${key}`);
    });

    if (verdicts.emotion.length === 0 && verdicts.speech.length === 0 && verdicts.body.length === 0) {
      throw new Error(HONEST_FAILURE_MESSAGE);
    }

    // L2a-집계 — 코드. 점수표·선정 근거가 trace에 남는다.
    const aggregation = aggregate(anchors, verdicts, intentInfo.expectedImpressions);

    // L2a-진단 — focus가 있을 때만. 사전에서 id 선택. 실패 시 null → unlisted 표준 카드.
    let diagnosis: Diagnosis | null = null;
    if (aggregation.focusAnchorId) {
      const bundleOf = (anchorId: string | null) => {
        if (!anchorId) return null;
        return {
          anchor: anchors.find((anchor) => anchor.anchorId === anchorId),
          verdicts: {
            emotion: verdicts.emotion.find((verdict) => verdict.anchorId === anchorId) ?? null,
            speech: verdicts.speech.find((verdict) => verdict.anchorId === anchorId) ?? null,
            body: verdicts.body.find((verdict) => verdict.anchorId === anchorId) ?? null,
            audience: verdicts.audience.find((verdict) => verdict.anchorId === anchorId) ?? null,
          },
        };
      };

      try {
        diagnosis = parseStructured<Diagnosis>(await generate(
          buildDiagnosisPrompt({
            category: input.category,
            intentRaw: input.intent,
            focusBundle: bundleOf(aggregation.focusAnchorId),
            strengthBundle: bundleOf(aggregation.strengthAnchorId),
            rootDictionary: ROOT_DICTIONARY.map(({ id, label, symptom }) => ({ id, label, symptom })),
            prescriptionLibrary: PRESCRIPTION_LIBRARY.map(({ id, rootId, text }) => ({ id, rootId, text })),
          }),
          diagnosisSchema(
            ROOT_DICTIONARY.map((root) => root.id),
            PRESCRIPTION_LIBRARY.map((item) => item.id),
          ),
          false,
        ));
      } catch {
        failures.push('diagnosis');
      }
    }

    // 카드 조립 — 코드 + 사람 작성 사전. 같은 판정 → 같은 카드.
    const feedback = assembleCard({ anchors, verdicts, aggregation, diagnosis, intent: intentInfo });

    const trace: AnalysisTrace = {
      promptVersion: PROMPT_VERSION,
      model,
      temperature: GENERATION_TEMPERATURE,
      seed: GENERATION_SEED,
      intent: intentInfo,
      segment: segmentInfo,
      l0: { transcript, voice, face, body, bodyMajority },
      anchors,
      verdicts,
      aggregation,
      diagnosis,
      failures,
    };

    return { feedback, trace };
  } finally {
    if (tempPath) {
      await unlink(tempPath).catch(() => undefined);
    }
    if (geminiFileName) {
      const ai = new GoogleGenAI({ apiKey: input.apiKey });
      await ai.files.delete({ name: geminiFileName }).catch(() => undefined);
    }
  }
}

async function fileFromBlobUrl(input: {
  fetcher: typeof fetch;
  videoUrl: string;
  fileName: string;
  mimeType: string;
}) {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(input.videoUrl);
  } catch {
    throw new Error('invalid video url');
  }

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('invalid video url');
  }

  // SSRF 방어 — 직전에 업로드한 Vercel Blob URL만 다운로드.
  if (!parsedUrl.hostname.endsWith('.vercel-storage.com')) {
    throw new Error('invalid video url');
  }

  const response = await input.fetcher(parsedUrl);
  if (!response.ok) {
    throw new Error('video download failed');
  }

  const declaredSize = Number(response.headers.get('content-length'));
  if (Number.isFinite(declaredSize) && declaredSize > MAX_VIDEO_BYTES) {
    throw new Error('video too large');
  }

  const blob = await response.blob();
  if (blob.size > MAX_VIDEO_BYTES) {
    throw new Error('video too large');
  }
  const mimeType = input.mimeType || response.headers.get('content-type') || blob.type || 'video/mp4';
  return new File([blob], input.fileName, { type: mimeType });
}

function validateAnalyzeFields(fields: {
  category: string;
  intent: string;
  startTime: number;
  endTime: number;
}) {
  if (!fields.category) return '연기 영상 분류를 선택해 주세요.';
  if (!fields.intent) return '이번 연습의 의도나 목표를 입력해 주세요.';
  if (!Number.isFinite(fields.startTime) || !Number.isFinite(fields.endTime) || fields.startTime < 0 || fields.endTime <= fields.startTime) {
    return '분석 시작/끝 시간이 올바르지 않습니다.';
  }
  return '';
}

export async function handleCoachSecondAnalyze(request: Request, options: CoachSecondOptions = {}): Promise<ApiResult> {
  if (request.method.toUpperCase() !== 'POST') return methodNotAllowed();

  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError(500, 'AI 분석 환경변수가 설정되어 있지 않습니다. Vercel 또는 로컬 환경변수를 확인해 주세요.');
  }

  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const payload = await request.json().catch(() => undefined) as Record<string, unknown> | undefined;
      const videoUrl = jsonString(payload?.videoUrl);
      const fileName = jsonString(payload?.fileName) || '연기 연습 영상';
      const mimeType = jsonString(payload?.mimeType);
      const category = jsonString(payload?.category);
      const intent = jsonString(payload?.intent);
      const startTime = jsonNumber(payload?.startTime);
      const endTime = jsonNumber(payload?.endTime);

      if (!videoUrl) {
        return jsonError(400, '분석할 영상 파일이 필요합니다.');
      }

      const validationError = validateAnalyzeFields({ category, intent, startTime, endTime });
      if (validationError) {
        return jsonError(400, validationError);
      }

      try {
        const video = await fileFromBlobUrl({
          fetcher: options.fetch ?? fetch,
          videoUrl,
          fileName,
          mimeType,
        });

        if (video.size <= 0) {
          return jsonError(400, '비어 있는 영상 파일은 분석할 수 없습니다.');
        }

        const result = await (options.analyze ?? defaultAnalyze)({
          video,
          fileName,
          category,
          intent,
          startTime,
          endTime,
          apiKey,
        });

        return { status: 200, body: { feedback: result.feedback, trace: result.trace } };
      } finally {
        await del(videoUrl).catch(() => undefined);
      }
    }

    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
      return jsonError(400, '분석할 영상 파일이 필요합니다.');
    }

    const formData = await request.formData();
    const video = formData.get('video');

    if (!isUploadedFile(video)) {
      return jsonError(400, '분석할 영상 파일이 필요합니다.');
    }

    if (video.size <= 0) {
      return jsonError(400, '비어 있는 영상 파일은 분석할 수 없습니다.');
    }

    const fileName = textFromForm(formData.get('fileName')) || video.name || '연기 연습 영상';
    const category = textFromForm(formData.get('category'));
    const intent = textFromForm(formData.get('intent'));
    const startTime = numberFromForm(formData.get('startTime'));
    const endTime = numberFromForm(formData.get('endTime'));

    const validationError = validateAnalyzeFields({ category, intent, startTime, endTime });
    if (validationError) {
      return jsonError(400, validationError);
    }

    const result = await (options.analyze ?? defaultAnalyze)({
      video,
      fileName,
      category,
      intent,
      startTime,
      endTime,
      apiKey,
    });

    return { status: 200, body: { feedback: result.feedback, trace: result.trace } };
  } catch (error) {
    console.error('Coach second analyze failed', error instanceof Error ? error.message : error);
    const message = error instanceof Error && error.message === HONEST_FAILURE_MESSAGE
      ? HONEST_FAILURE_MESSAGE
      : ANALYZE_FAILURE_MESSAGE;
    return jsonError(500, message);
  }
}
