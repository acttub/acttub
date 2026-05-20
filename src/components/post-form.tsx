"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiUrl } from "@/lib/api";
import { BOARDS, DEFAULT_BOARD_SLUG } from "@/lib/boards";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "제목을 입력하세요").max(200, "제목은 200자 이내"),
  body: z.string().min(1, "내용을 입력하세요").max(20000, "내용은 20,000자 이내"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  initial?: { id: string; title: string; body: string; boardId?: string; anonymous?: boolean };
  initialBoard?: string;
};

export function PostForm({ initial, initialBoard }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [boardId, setBoardId] = useState<string>(
    initial?.boardId ?? initialBoard ?? DEFAULT_BOARD_SLUG,
  );
  const [anonymous, setAnonymous] = useState<boolean>(initial?.anonymous ?? false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: initial?.title ?? "", body: initial?.body ?? "" },
  });

  const onSubmit = handleSubmit((values) => {
    const url = initial ? apiUrl(`/api/posts/${initial.id}`) : apiUrl("/api/posts");
    const method = initial ? "PATCH" : "POST";

    start(async () => {
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, boardId, anonymous }),
      });
      if (!res.ok) {
        toast.error("저장에 실패했어요");
        return;
      }
      const data = initial ? { id: initial.id } : ((await res.json()) as { id: string });
      router.push(`/p/${data.id}`);
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Board selector */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          게시판
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {BOARDS.map((b) => (
            <button
              key={b.slug}
              type="button"
              onClick={() => setBoardId(b.slug)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                boardId === b.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {b.emoji} {b.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Input
          placeholder="제목을 입력하세요"
          className="border-0 border-b border-border rounded-none px-0 text-xl font-semibold focus-visible:ring-0 focus-visible:border-primary shadow-none"
          autoFocus
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Textarea
          rows={12}
          placeholder="무슨 이야기를 나누고 싶나요?"
          className="border-0 px-0 resize-none focus-visible:ring-0 shadow-none text-[15px] leading-relaxed"
          {...register("body")}
        />
        {errors.body && (
          <p className="text-xs text-destructive">{errors.body.message}</p>
        )}
      </div>

      {/* Anonymous toggle */}
      <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        <span>익명으로 작성</span>
        <span className="text-xs text-muted-foreground/70">
          (작성자가 ‘익명’으로 표시됩니다)
        </span>
      </label>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={pending}
        >
          취소
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중..." : initial ? "수정 완료" : "올리기"}
        </Button>
      </div>
    </form>
  );
}
