import {
  getCommunityBoard,
  getCommunityPost,
  isWritableCommunityBoard,
  listCommunityPosts,
  parseCommunityParams,
  searchCommunityPosts,
  type CommunityComment,
  type CommunityPost,
} from '../community/communityData';
import { COMMUNITY_FIXTURE_COMMENTS, COMMUNITY_FIXTURE_POSTS } from '../community/fixtures';
import {
  filterArchiveVideos,
  getArchiveVideo,
  type ArchiveFilter,
  type ArchiveVideo,
  type ArchiveVisibility,
} from '../archive/archiveData';
import { ARCHIVE_FIXTURE_VIDEOS } from '../archive/fixtures';

export type CreateCommunityPostInput = {
  title: string;
  body: string;
  boardId?: string;
  anonymous?: boolean;
};

export type CreateCommunityCommentInput = {
  postId: string;
  parentId?: string | null;
  body: string;
  anonymous?: boolean;
};

export type CreateArchiveVideoInput = {
  title: string;
  description?: string | null;
  tags?: string[];
  visibility: ArchiveVisibility;
  blobUrl?: string | null;
  blobPathname?: string | null;
  thumbnailUrl?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  durationSec?: number | null;
};

export type ActiSurveyAnswers = Record<string, string | string[]>;

export type ActiSurveyResponse = {
  id: string;
  userId: string;
  resultCode: string;
  answers: ActiSurveyAnswers;
  createdAt: Date;
};

export type CreateActiSurveyResponseInput = {
  userId: string;
  resultCode: string;
  answers: ActiSurveyAnswers;
};

export type NormalizedArchiveVideoInput = Required<
  Pick<CreateArchiveVideoInput, 'title' | 'description' | 'tags' | 'visibility' | 'thumbnailUrl' | 'durationSec'>
> &
  Pick<CreateArchiveVideoInput, 'blobUrl' | 'blobPathname' | 'mimeType' | 'sizeBytes'>;

export type CommunityPostQuery = {
  id?: string | null;
  q?: string | null;
  board?: string | null;
  sort?: string | null;
};

export type ActtubStorage = {
  listCommunityPosts(query: CommunityPostQuery): Promise<CommunityPost[]>;
  getCommunityPost(id: string): Promise<CommunityPost | null>;
  createCommunityPost(input: CreateCommunityPostInput): Promise<CommunityPost>;
  listCommunityComments(postId?: string | null): Promise<CommunityComment[]>;
  createCommunityComment(input: CreateCommunityCommentInput): Promise<CommunityComment>;
  listArchiveVideos(filter: ArchiveFilter): Promise<ArchiveVideo[]>;
  getArchiveVideo(id: string): Promise<ArchiveVideo | null>;
  createArchiveVideo(input: CreateArchiveVideoInput): Promise<ArchiveVideo>;
  createActiSurveyResponse(input: CreateActiSurveyResponseInput): Promise<ActiSurveyResponse>;
};

const fixtureUser = {
  id: 'local_user',
  username: 'local',
  displayName: '로컬 사용자',
  avatarUrl: null,
};

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function uniqueTrimmed(values: string[] | undefined) {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter(Boolean)));
}

export function normalizeArchiveVideoInput(input: CreateArchiveVideoInput): NormalizedArchiveVideoInput {
  return {
    title: input.title.trim(),
    description: input.description?.trim() || null,
    tags: uniqueTrimmed(input.tags),
    visibility: input.visibility,
    blobUrl: input.blobUrl ?? null,
    blobPathname: input.blobPathname ?? null,
    thumbnailUrl: input.thumbnailUrl ?? null,
    mimeType: input.mimeType ?? null,
    sizeBytes: input.sizeBytes ?? null,
    durationSec: input.durationSec ?? null,
  };
}

export function createMemoryActtubStorage(options: { seedFixtures?: boolean } = {}): ActtubStorage {
  const seedFixtures = options.seedFixtures ?? true;
  const communityPosts: CommunityPost[] = seedFixtures ? [...COMMUNITY_FIXTURE_POSTS] : [];
  const communityComments: CommunityComment[] = seedFixtures ? [...COMMUNITY_FIXTURE_COMMENTS] : [];
  const archiveVideos: ArchiveVideo[] = seedFixtures ? [...ARCHIVE_FIXTURE_VIDEOS] : [];
  const actiSurveyResponses: ActiSurveyResponse[] = [];

  return {
    async listCommunityPosts(query) {
      if (query.id) {
        const item = getCommunityPost(communityPosts, query.id);
        return item ? [item] : [];
      }
      if (query.q?.trim()) return searchCommunityPosts(communityPosts, query.q);
      const params = parseCommunityParams({
        board: query.board ?? undefined,
        sort: query.sort ?? undefined,
      });
      return listCommunityPosts(communityPosts, params);
    },
    async getCommunityPost(id) {
      return getCommunityPost(communityPosts, id);
    },
    async createCommunityPost(input) {
      const boardId = isWritableCommunityBoard(input.boardId) ? input.boardId! : 'free';
      const board = getCommunityBoard(boardId);
      const now = new Date();
      const post: CommunityPost = {
        id: nextId('post'),
        boardId,
        title: input.title.trim(),
        body: input.body.trim(),
        score: 0,
        commentCount: 0,
        createdAt: now,
        updatedAt: now,
        author: fixtureUser,
        anonymous: board?.alwaysAnonymous === true || input.anonymous === true,
        myVote: 0,
        isBookmarked: false,
      };
      communityPosts.unshift(post);
      return post;
    },
    async listCommunityComments(postId) {
      return postId ? communityComments.filter((comment) => comment.postId === postId) : communityComments;
    },
    async createCommunityComment(input) {
      const post = getCommunityPost(communityPosts, input.postId);
      if (!post) throw new Error('post not found');
      if (input.parentId) {
        const parent = communityComments.find((comment) => comment.id === input.parentId);
        if (!parent || parent.postId !== post.id) throw new Error('parent not found');
      }
      const board = getCommunityBoard(post.boardId);
      const comment: CommunityComment = {
        id: nextId('comment'),
        postId: post.id,
        parentId: input.parentId ?? null,
        body: input.body.trim(),
        score: 0,
        createdAt: new Date(),
        deletedAt: null,
        author: fixtureUser,
        anonymous: board?.alwaysAnonymous === true || input.anonymous === true,
        myVote: 0,
      };
      communityComments.push(comment);
      post.commentCount += 1;
      return comment;
    },
    async listArchiveVideos(filter) {
      return filterArchiveVideos(archiveVideos, filter);
    },
    async getArchiveVideo(id) {
      return getArchiveVideo(archiveVideos, id);
    },
    async createArchiveVideo(input) {
      const normalized = normalizeArchiveVideoInput(input);
      const video: ArchiveVideo = {
        id: nextId('video'),
        title: normalized.title,
        description: normalized.description,
        thumbnailUrl: normalized.thumbnailUrl,
        durationSec: normalized.durationSec,
        createdAt: new Date(),
        viewCount: 0,
        visibility: normalized.visibility,
        tags: normalized.tags,
        user: { username: 'local', displayName: '로컬 사용자', avatarUrl: null },
      };
      archiveVideos.unshift(video);
      return video;
    },
    async createActiSurveyResponse(input) {
      const response: ActiSurveyResponse = {
        id: nextId('acti-survey'),
        userId: input.userId.trim(),
        resultCode: input.resultCode.trim().toUpperCase(),
        answers: input.answers,
        createdAt: new Date(),
      };
      actiSurveyResponses.unshift(response);
      return response;
    },
  };
}
