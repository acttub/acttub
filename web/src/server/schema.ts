import { sql } from 'drizzle-orm';
import {
  boolean,
  bigint,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import type { ActiSurveyAnswers } from './storage';

export const communityPostsTable = pgTable('community_posts', {
  id: text('id').primaryKey(),
  boardId: text('board_id').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  score: integer('score').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  authorId: text('author_id').notNull(),
  authorUsername: text('author_username').notNull(),
  authorDisplayName: text('author_display_name').notNull(),
  authorAvatarUrl: text('author_avatar_url'),
  anonymous: boolean('anonymous').notNull().default(false),
});

export const communityCommentsTable = pgTable('community_comments', {
  id: text('id').primaryKey(),
  postId: text('post_id')
    .notNull()
    .references(() => communityPostsTable.id, { onDelete: 'cascade' }),
  parentId: text('parent_id'),
  body: text('body').notNull(),
  score: integer('score').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  authorId: text('author_id').notNull(),
  authorUsername: text('author_username').notNull(),
  authorDisplayName: text('author_display_name').notNull(),
  authorAvatarUrl: text('author_avatar_url'),
  anonymous: boolean('anonymous').notNull().default(false),
});

export const archiveVideosTable = pgTable('archive_videos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  durationSec: integer('duration_sec'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  viewCount: integer('view_count').notNull().default(0),
  visibility: text('visibility').notNull().default('public'),
  tags: text('tags').array().notNull().default(sql`ARRAY[]::text[]`),
  userUsername: text('user_username').notNull(),
  userDisplayName: text('user_display_name').notNull(),
  userAvatarUrl: text('user_avatar_url'),
  blobUrl: text('blob_url'),
  blobPathname: text('blob_pathname'),
  mimeType: text('mime_type'),
  sizeBytes: bigint('size_bytes', { mode: 'number' }),
});

export const actiSurveyResponsesTable = pgTable('acti_survey_responses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  resultCode: text('result_code').notNull(),
  answers: jsonb('answers').$type<ActiSurveyAnswers>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type CommunityPostRow = typeof communityPostsTable.$inferSelect;
export type CommunityCommentRow = typeof communityCommentsTable.$inferSelect;
export type ArchiveVideoRow = typeof archiveVideosTable.$inferSelect;
export type ActiSurveyResponseRow = typeof actiSurveyResponsesTable.$inferSelect;

export type NewCommunityPostRow = typeof communityPostsTable.$inferInsert;
export type NewCommunityCommentRow = typeof communityCommentsTable.$inferInsert;
export type NewArchiveVideoRow = typeof archiveVideosTable.$inferInsert;
export type NewActiSurveyResponseRow = typeof actiSurveyResponsesTable.$inferInsert;
