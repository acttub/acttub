export const COL = {
  users: "users",
  posts: "posts",
  comments: "comments",
  postVotes: "post_votes",
  commentVotes: "comment_votes",
} as const;

export type AuthorSnapshot = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

/** Duck-typed compatible with both firebase-admin and firebase web SDK Timestamp. */
export type Timestamplike = { toDate(): Date };

export type UserDoc = {
  clerkId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: Timestamplike;
};

export type PostDoc = {
  id: string;
  authorId: string;
  author: AuthorSnapshot;
  title: string;
  body: string;
  score: number;
  commentCount: number;
  createdAt: Timestamplike;
  updatedAt: Timestamplike;
  deletedAt: Timestamplike | null;
};

export type CommentDoc = {
  postId: string;
  parentId: string | null;
  authorId: string;
  author: AuthorSnapshot;
  body: string;
  score: number;
  createdAt: Timestamplike;
  deletedAt: Timestamplike | null;
};

export function postVoteId(userId: string, postId: string): string {
  return `${userId}_${postId}`;
}

export function commentVoteId(userId: string, commentId: string): string {
  return `${userId}_${commentId}`;
}
