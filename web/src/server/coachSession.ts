import { randomUUID } from 'node:crypto';
import { copy, del } from '@vercel/blob';
import type { CoachFeedback } from '../coach/evaluation';
import { createActtubStorage } from './storageFactory';
import type { ActtubStorage, CoachSessionPipeline } from './storage';

/**
 * coachSession — 코치 분석 세션(영상·연기 의도·AI 피드백)을 한 행으로 보관한다.
 *
 * 분석 자체와 분리된 비차단 부수효과: 저장이 실패해도 사용자는 피드백을 그대로 받는다.
 * 영상은 cleanup 크론(coach/ prefix, 24h)이 지우는 임시 업로드본을, 크론이 건드리지 않는
 * coach-sessions/ prefix 로 복사해 보관한다(분석 성공분만 남긴다). 저장 실패 시 복사본은 회수.
 */

// cleanupOldCoachBlobs 는 'coach/' prefix 만 청소한다 — 보관본은 'coach-sessions/' 로 분리한다.
const RETAINED_PREFIX = 'coach-sessions/';

export type PersistCoachSessionInput = {
  pipeline: CoachSessionPipeline;
  feedback: CoachFeedback;
  /** v2(coach-second) 전 단계 분석 기록. v1 은 생략. */
  trace?: unknown;
  category: string;
  intent: string;
  startTime: number;
  endTime: number;
  fileName: string;
  mimeType: string;
  sizeBytes?: number | null;
  /** Vercel Blob URL — 있으면 보관 prefix 로 복사해 영상을 남긴다(blob 경로일 때만). */
  videoUrl?: string | null;
};

export type PersistCoachSessionOptions = {
  storage?: ActtubStorage;
  copyBlob?: typeof copy;
  deleteBlob?: typeof del;
};

function retainedExtension(mimeType: string, fileName: string) {
  const match = fileName.match(/\.[a-z0-9]+$/i);
  if (match) return match[0].toLowerCase();
  if (mimeType.includes('webm')) return '.webm';
  if (mimeType.includes('quicktime')) return '.mov';
  return '.mp4';
}

/**
 * 세션을 저장하고 sessionId 를 돌려준다. 어떤 이유로든 실패하면 null(분석 흐름은 그대로 진행).
 */
export async function persistCoachSession(
  input: PersistCoachSessionInput,
  options: PersistCoachSessionOptions = {},
): Promise<string | null> {
  let retainedUrl: string | null = null;
  let retainedPathname: string | null = null;

  try {
    const storage = options.storage ?? createActtubStorage();

    if (input.videoUrl) {
      const copyBlob = options.copyBlob ?? copy;
      const target = `${RETAINED_PREFIX}${randomUUID()}${retainedExtension(input.mimeType, input.fileName)}`;
      const copied = await copyBlob(input.videoUrl, target, { access: 'public' });
      retainedUrl = copied.url;
      retainedPathname = copied.pathname;
    }

    const session = await storage.createCoachSession({
      pipeline: input.pipeline,
      category: input.category,
      intent: input.intent,
      startTime: input.startTime,
      endTime: input.endTime,
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes ?? null,
      blobUrl: retainedUrl,
      blobPathname: retainedPathname,
      feedback: input.feedback,
      trace: input.trace ?? null,
    });

    return session.id;
  } catch (error) {
    // 민감정보(영상·의도·피드백 본문) 없이 메타만 남긴다.
    console.warn('coach session persist skipped', {
      pipeline: input.pipeline,
      reason: error instanceof Error ? error.name : 'unknown',
    });
    // 복사는 됐는데 DB 저장이 실패했으면, 참조되지 않는 보관본을 회수한다(크론이 청소하지 않는 prefix).
    if (retainedUrl) {
      const deleteBlob = options.deleteBlob ?? del;
      await deleteBlob(retainedUrl).catch(() => undefined);
    }
    return null;
  }
}
