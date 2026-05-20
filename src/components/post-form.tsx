"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiUrl } from "@/lib/api";

const schema = z.object({
  title: z.string().min(1, "제목을 입력하세요").max(200, "제목은 200자 이내"),
  body: z.string().min(1, "내용을 입력하세요").max(20000, "내용은 20,000자 이내"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  initial?: { id: string; title: string; body: string };
};

export function PostForm({ initial }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
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
        body: JSON.stringify(values),
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
          rows={14}
          placeholder="무슨 이야기를 나누고 싶나요?"
          className="border-0 px-0 resize-none focus-visible:ring-0 shadow-none text-[15px] leading-relaxed"
          {...register("body")}
        />
        {errors.body && (
          <p className="text-xs text-destructive">{errors.body.message}</p>
        )}
      </div>
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
