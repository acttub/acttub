import { del, list, type ListBlobResultBlob } from '@vercel/blob';
import type { ApiResult } from './apiCore';

type ListPage = {
  blobs: ListBlobResultBlob[];
  cursor?: string;
  hasMore: boolean;
};

type CleanupDependencies = {
  listBlobs?: typeof list;
  deleteBlobs?: typeof del;
  now?: Date;
};

type CleanupOptions = CleanupDependencies & {
  retentionHours?: number;
};

const COACH_BLOB_PREFIX = 'coach/';
const DEFAULT_RETENTION_HOURS = 24;

function configuredRetentionHours() {
  const raw = process.env.COACH_BLOB_RETENTION_HOURS;
  if (!raw) return DEFAULT_RETENTION_HOURS;

  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_RETENTION_HOURS;
}

function blobAgeMs(blob: Pick<ListBlobResultBlob, 'uploadedAt'>, now: Date) {
  return now.getTime() - new Date(blob.uploadedAt).getTime();
}

export async function cleanupOldCoachBlobs(options: CleanupOptions = {}) {
  const retentionHours = options.retentionHours ?? configuredRetentionHours();
  const retentionMs = retentionHours * 60 * 60 * 1000;
  const now = options.now ?? new Date();
  const listBlobs = options.listBlobs ?? list;
  const deleteBlobs = options.deleteBlobs ?? del;
  const deletedPathnames: string[] = [];
  let scanned = 0;
  let cursor: string | undefined;

  do {
    const page = await listBlobs({
      prefix: COACH_BLOB_PREFIX,
      cursor,
      limit: 1000,
    }) as ListPage;

    scanned += page.blobs.length;
    const expired = page.blobs.filter((blob) => blobAgeMs(blob, now) >= retentionMs);

    if (expired.length > 0) {
      await deleteBlobs(expired.map((blob) => blob.url));
      deletedPathnames.push(...expired.map((blob) => blob.pathname));
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return {
    scanned,
    deleted: deletedPathnames.length,
    deletedPathnames,
    retentionHours,
  };
}

function unauthorized(): ApiResult {
  return { status: 401, body: { error: 'unauthorized' } };
}

function serverConfigError(): ApiResult {
  return {
    status: 500,
    body: { error: 'cleanup secret is not configured' },
  };
}

export async function handleCoachBlobCleanup(
  request: Request,
  options: CleanupOptions & { cronSecret?: string } = {},
): Promise<ApiResult> {
  if (request.method.toUpperCase() !== 'GET' && request.method.toUpperCase() !== 'POST') {
    return { status: 405, body: { error: 'method not allowed' } };
  }

  const cronSecret = options.cronSecret ?? process.env.CRON_SECRET;
  if (!cronSecret) return serverConfigError();

  const authorization = request.headers.get('authorization') ?? '';
  if (authorization !== `Bearer ${cronSecret}`) return unauthorized();

  const result = await cleanupOldCoachBlobs(options);
  return { status: 200, body: result };
}
