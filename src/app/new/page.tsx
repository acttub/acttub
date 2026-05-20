import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { PostForm } from "@/components/post-form";
import { isValidBoardSlug, DEFAULT_BOARD_SLUG } from "@/lib/boards";

export const metadata = { title: "새 글" };

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { board } = await searchParams;
  const initialBoard = isValidBoardSlug(board) ? (board as string) : DEFAULT_BOARD_SLUG;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="뒤로"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">새 글</h1>
      </div>
      <PostForm initialBoard={initialBoard} />
    </div>
  );
}
