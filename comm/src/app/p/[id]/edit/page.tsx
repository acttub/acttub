import { notFound, redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/auth";
import { getPost } from "@/lib/posts";
import { PostForm } from "@/components/post-form";

export const metadata = { title: "글 수정" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await getCurrentDbUser();
  if (!me) redirect("/");

  const post = await getPost(id);
  if (!post) notFound();
  if (post.author.id !== me.id) redirect(`/p/${id}`);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">글 수정</h1>
      <PostForm initial={{ id: post.id, title: post.title, body: post.body }} />
    </div>
  );
}
