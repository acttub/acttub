import { neon } from '@neondatabase/serverless';
import { and, desc, eq, gte, ilike, or, sql } from 'drizzle-orm';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { HOT_BOARD, HOT_THRESHOLD, getCommunityBoard, isWritableCommunityBoard } from '../community/communityData';
import type { ArchiveVisibility } from '../archive/archiveData';
import {
  archiveVideosTable,
  communityCommentsTable,
  communityPostsTable,
  type ArchiveVideoRow,
  type CommunityCommentRow,
  type CommunityPostRow,
} from './schema';
import {
  normalizeArchiveVideoInput,
  type ActtubStorage,
  type CreateArchiveVideoInput,
  type CreateCommunityCommentInput,
  type CreateCommunityPostInput,
} from './storage';

const schema = {
  archiveVideosTable,
  communityCommentsTable,
  communityPostsTable,
};

type Database = NeonHttpDatabase<typeof schema>;

const fixtureUser = {
  id: 'local_user',
  username: 'local',
  displayName: '로컬 사용자',
  avatarUrl: null,
};

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function selectStorageBackend(env: { DATABASE_URL?: string }) {
  return env.DATABASE_URL ? 'postgres' : 'memory';
}

export function createDb(databaseUrl: string): Database {
  return drizzle(neon(databaseUrl), { schema });
}

export function communityPostRowToDomain(row: CommunityPostRow) {
  return {
    id: row.id,
    boardId: row.boardId,
    title: row.title,
    body: row.body,
    score: row.score,
    commentCount: row.commentCount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    author: {
      id: row.authorId,
      username: row.authorUsername,
      displayName: row.authorDisplayName,
      avatarUrl: row.authorAvatarUrl,
    },
    anonymous: row.anonymous,
    myVote: 0,
    isBookmarked: false,
  };
}

export function communityCommentRowToDomain(row: CommunityCommentRow) {
  return {
    id: row.id,
    postId: row.postId,
    parentId: row.parentId,
    body: row.body,
    score: row.score,
    createdAt: row.createdAt,
    deletedAt: row.deletedAt,
    author: {
      id: row.authorId,
      username: row.authorUsername,
      displayName: row.authorDisplayName,
      avatarUrl: row.authorAvatarUrl,
    },
    anonymous: row.anonymous,
    myVote: 0,
  };
}

export function archiveVideoRowToDomain(row: ArchiveVideoRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    thumbnailUrl: row.thumbnailUrl,
    durationSec: row.durationSec,
    createdAt: row.createdAt,
    viewCount: row.viewCount,
    visibility: row.visibility as ArchiveVisibility,
    tags: row.tags,
    user: {
      username: row.userUsername,
      displayName: row.userDisplayName,
      avatarUrl: row.userAvatarUrl,
    },
  };
}

export function createPostgresActtubStorage(db: Database): ActtubStorage {
  return {
    async listCommunityPosts(query) {
      if (query.id) {
        const row = await db.query.communityPostsTable.findFirst({
          where: eq(communityPostsTable.id, query.id),
        });
        return row ? [communityPostRowToDomain(row)] : [];
      }

      const conditions = [];
      if (query.q?.trim()) {
        const term = `%${query.q.trim()}%`;
        conditions.push(or(ilike(communityPostsTable.title, term), ilike(communityPostsTable.body, term)));
      }
      if (query.board === HOT_BOARD.slug) conditions.push(gte(communityPostsTable.score, HOT_THRESHOLD));
      else if (query.board && isWritableCommunityBoard(query.board)) conditions.push(eq(communityPostsTable.boardId, query.board));

      const order =
        query.board === HOT_BOARD.slug || query.sort === 'top'
          ? [desc(communityPostsTable.score), desc(communityPostsTable.createdAt)]
          : [desc(communityPostsTable.createdAt)];

      const rows = await db.query.communityPostsTable.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: order,
      });
      return rows.map(communityPostRowToDomain);
    },
    async getCommunityPost(id) {
      const row = await db.query.communityPostsTable.findFirst({
        where: eq(communityPostsTable.id, id),
      });
      return row ? communityPostRowToDomain(row) : null;
    },
    async createCommunityPost(input: CreateCommunityPostInput) {
      const boardId = isWritableCommunityBoard(input.boardId) ? input.boardId! : 'free';
      const board = getCommunityBoard(boardId);
      const now = new Date();
      const [row] = await db
        .insert(communityPostsTable)
        .values({
          id: nextId('post'),
          boardId,
          title: input.title.trim(),
          body: input.body.trim(),
          score: 0,
          commentCount: 0,
          createdAt: now,
          updatedAt: now,
          authorId: fixtureUser.id,
          authorUsername: fixtureUser.username,
          authorDisplayName: fixtureUser.displayName,
          authorAvatarUrl: fixtureUser.avatarUrl,
          anonymous: board?.alwaysAnonymous === true || input.anonymous === true,
        })
        .returning();
      return communityPostRowToDomain(row);
    },
    async listCommunityComments(postId) {
      const rows = await db.query.communityCommentsTable.findMany({
        where: postId ? eq(communityCommentsTable.postId, postId) : undefined,
        orderBy: [communityCommentsTable.createdAt],
      });
      return rows.map(communityCommentRowToDomain);
    },
    async createCommunityComment(input: CreateCommunityCommentInput) {
      const post = await this.getCommunityPost(input.postId);
      if (!post) throw new Error('post not found');
      if (input.parentId) {
        const parent = await db.query.communityCommentsTable.findFirst({
          where: and(eq(communityCommentsTable.id, input.parentId), eq(communityCommentsTable.postId, post.id)),
        });
        if (!parent) throw new Error('parent not found');
      }

      const board = getCommunityBoard(post.boardId);
      const [row] = await db
        .insert(communityCommentsTable)
        .values({
          id: nextId('comment'),
          postId: post.id,
          parentId: input.parentId ?? null,
          body: input.body.trim(),
          score: 0,
          createdAt: new Date(),
          deletedAt: null,
          authorId: fixtureUser.id,
          authorUsername: fixtureUser.username,
          authorDisplayName: fixtureUser.displayName,
          authorAvatarUrl: fixtureUser.avatarUrl,
          anonymous: board?.alwaysAnonymous === true || input.anonymous === true,
        })
        .returning();
      await db
        .update(communityPostsTable)
        .set({ commentCount: sql`${communityPostsTable.commentCount} + 1`, updatedAt: new Date() })
        .where(eq(communityPostsTable.id, post.id));
      return communityCommentRowToDomain(row);
    },
    async listArchiveVideos(filter) {
      const conditions = [];
      if (!filter.includePrivate) conditions.push(eq(archiveVideosTable.visibility, 'public'));
      if (filter.query?.trim()) {
        const term = `%${filter.query.trim()}%`;
        conditions.push(or(ilike(archiveVideosTable.title, term), ilike(archiveVideosTable.description, term)));
      }
      if (filter.tag?.trim()) {
        conditions.push(sql`${filter.tag.trim()} = ANY(${archiveVideosTable.tags})`);
      }
      const rows = await db.query.archiveVideosTable.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [desc(archiveVideosTable.createdAt)],
      });
      return rows.map(archiveVideoRowToDomain);
    },
    async getArchiveVideo(id) {
      const row = await db.query.archiveVideosTable.findFirst({
        where: eq(archiveVideosTable.id, id),
      });
      return row ? archiveVideoRowToDomain(row) : null;
    },
    async createArchiveVideo(input: CreateArchiveVideoInput) {
      const normalized = normalizeArchiveVideoInput(input);
      const [row] = await db
        .insert(archiveVideosTable)
        .values({
          id: nextId('video'),
          title: normalized.title,
          description: normalized.description,
          thumbnailUrl: normalized.thumbnailUrl,
          durationSec: normalized.durationSec,
          createdAt: new Date(),
          viewCount: 0,
          visibility: normalized.visibility,
          tags: normalized.tags,
          userUsername: fixtureUser.username,
          userDisplayName: fixtureUser.displayName,
          userAvatarUrl: fixtureUser.avatarUrl,
          blobUrl: normalized.blobUrl,
          blobPathname: normalized.blobPathname,
          mimeType: normalized.mimeType,
          sizeBytes: normalized.sizeBytes,
        })
        .returning();
      return archiveVideoRowToDomain(row);
    },
  };
}
