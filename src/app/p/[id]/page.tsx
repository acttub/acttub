import Link from "next/link";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { PostActions } from "@/components/post-actions";
import { CommentForm } from "@/components/comment-form";
import { CommentThread } from "@/components/comment-thread";
import { VoteButton } from "@/components/vote-button";
import { getPost } from "@/lib/posts";
import { listComments } from "@/lib/comments";
import { getCurrentDbUser } from "@/lib/auth";
import { formatRelative } from "@/lib/utils";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await getCurrentDbUser();
  const [post, commentList] = await Promise.all([
    getPost(id, me?.id ?? null),
    listComments(id, me?.id ?? null),
  ]);
  if (!post) notFound();

  const isOwner = me?.id === post.author.id;
  const liveCount = commentList.filter((c) => c.deletedAt === null).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <article className="space-y-4">
        <header className="space-y-3">
          <h1 className="text-2xl font-bold leading-tight">{post.title}</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link
              href={`/u/${post.author.username}`}
              className="font-medium text-foreground/80 hover:text-foreground"
            >
              {post.author.displayName}
            </Link>
            <span aria-hidden>·</span>
            <time>{formatRelative(post.createdAt)}</time>
            {isOwner && (
              <div className="ml-auto">
                <PostActions postId={post.id} />
              </div>
            )}
          </div>
        </header>
        <Separator />
        <div className="whitespace-pre-wrap py-2 text-[15px] leading-relaxed text-foreground">
          {post.body}
        </div>
        <div className="flex justify-center pt-2">
          <div className="rounded-full border border-border bg-card px-2 py-1 shadow-sm">
            <VoteButton
              kind="post"
              targetId={post.id}
              initialScore={post.score}
              initialVote={post.myVote}
              signedIn={me !== null}
            />
          </div>
        </div>
      </article>

      <Separator className="my-6" />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          댓글 <span className="text-foreground">{liveCount}</span>
        </h2>

        {me ? (
          <CommentForm postId={post.id} />
        ) : (
          <div className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
            로그인하면 댓글을 남길 수 있어요
          </div>
        )}

        <CommentThread
          postId={post.id}
          initialComments={commentList}
          currentUserId={me?.id ?? null}
        />
      </section>
    </div>
  );
}
