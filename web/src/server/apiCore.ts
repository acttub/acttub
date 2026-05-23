import { z } from 'zod';
import { COMMUNITY_BOARDS } from '../community/communityData.js';
import { ARCHIVE_VIDEO_CONTENT_TYPES } from './blobUpload.js';
import { createActtubStorage } from './storageFactory.js';
import type { ActtubStorage } from './storage.js';

export type ApiRequestInput = {
  method: string;
  url: string;
  body?: unknown;
};

export type ApiResult = {
  status: number;
  body: unknown;
};

let sharedStorage: ActtubStorage | undefined;

const createPostSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20000),
  boardId: z.string().trim().optional(),
  anonymous: z.boolean().optional(),
});

const createCommentSchema = z.object({
  postId: z.string().trim().min(1),
  parentId: z.string().trim().nullable().optional(),
  body: z.string().trim().min(1).max(10000),
  anonymous: z.boolean().optional(),
});

const createVideoSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).optional().nullable(),
  tags: z.array(z.string()).max(20).default([]),
  visibility: z.enum(['public', 'unlisted', 'private']),
  blobUrl: z.string().url().optional(),
  blobPathname: z.string().min(1).optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
  mimeType: z.string().optional().nullable(),
  sizeBytes: z.number().int().nonnegative().optional().nullable(),
  durationSec: z.number().int().nonnegative().optional().nullable(),
});

function requestUrl(input: ApiRequestInput) {
  return new URL(input.url, 'http://localhost');
}

function methodNotAllowed() {
  return { status: 405, body: { error: 'method not allowed' } };
}

function badRequest(error: unknown) {
  return { status: 400, body: { error } };
}

function storageOrDefault(storage?: ActtubStorage) {
  sharedStorage ??= createActtubStorage();
  return storage ?? sharedStorage;
}

export async function handleCommunityPosts(input: ApiRequestInput, storage?: ActtubStorage): Promise<ApiResult> {
  const method = input.method.toUpperCase();
  const url = requestUrl(input);
  const store = storageOrDefault(storage);

  if (method === 'GET') {
    const id = url.searchParams.get('id');
    if (id) {
      const item = await store.getCommunityPost(id);
      return item ? { status: 200, body: { item } } : { status: 404, body: { error: 'post not found' } };
    }

    const items = await store.listCommunityPosts({
      q: url.searchParams.get('q'),
      board: url.searchParams.get('board'),
      sort: url.searchParams.get('sort'),
    });
    return { status: 200, body: { items } };
  }

  if (method === 'POST') {
    const parsed = createPostSchema.safeParse(input.body);
    if (!parsed.success) return badRequest(parsed.error.issues);

    const post = await store.createCommunityPost(parsed.data);
    return { status: 201, body: { id: post.id, item: post } };
  }

  return methodNotAllowed();
}

export async function handleCommunityComments(input: ApiRequestInput, storage?: ActtubStorage): Promise<ApiResult> {
  const method = input.method.toUpperCase();
  const url = requestUrl(input);
  const store = storageOrDefault(storage);

  if (method === 'GET') {
    const postId = url.searchParams.get('postId');
    const items = await store.listCommunityComments(postId);
    return { status: 200, body: { items } };
  }

  if (method === 'POST') {
    const parsed = createCommentSchema.safeParse(input.body);
    if (!parsed.success) return badRequest(parsed.error.issues);

    try {
      const comment = await store.createCommunityComment(parsed.data);
      return { status: 201, body: { id: comment.id, item: comment } };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'comment creation failed';
      return {
        status: message === 'post not found' ? 404 : 400,
        body: { error: message },
      };
    }
  }

  return methodNotAllowed();
}

export async function handleArchiveVideos(input: ApiRequestInput, storage?: ActtubStorage): Promise<ApiResult> {
  const method = input.method.toUpperCase();
  const url = requestUrl(input);
  const store = storageOrDefault(storage);

  if (method === 'GET') {
    const id = url.searchParams.get('id');
    if (id) {
      const item = await store.getArchiveVideo(id);
      return item ? { status: 200, body: { item } } : { status: 404, body: { error: 'video not found' } };
    }
    const items = await store.listArchiveVideos({
      query: url.searchParams.get('q'),
      tag: url.searchParams.get('tag'),
      includePrivate: url.searchParams.get('includePrivate') === '1',
    });
    return { status: 200, body: { items } };
  }

  if (method === 'POST') {
    const parsed = createVideoSchema.safeParse(input.body);
    if (!parsed.success) return badRequest(parsed.error.issues);
    const video = await store.createArchiveVideo(parsed.data);
    return { status: 201, body: { id: video.id, item: video } };
  }

  return methodNotAllowed();
}

export async function handleArchiveUpload(input: ApiRequestInput): Promise<ApiResult> {
  if (input.method.toUpperCase() !== 'POST') return methodNotAllowed();
  return {
    status: 501,
    body: {
      error: 'blob upload token is not configured in the unified web app yet',
      next: 'Set BLOB_READ_WRITE_TOKEN in Vercel to enable direct uploads.',
      allowedContentTypes: ARCHIVE_VIDEO_CONTENT_TYPES,
      maximumSizeInBytes: null,
    },
  };
}

export function communityBoardOptions() {
  return COMMUNITY_BOARDS;
}
