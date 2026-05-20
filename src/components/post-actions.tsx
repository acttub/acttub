"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiUrl } from "@/lib/api";

export function PostActions({ postId }: { postId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const handleDelete = () => {
    if (!confirm("정말 삭제할까요? 되돌릴 수 없어요.")) return;
    start(async () => {
      const res = await fetch(apiUrl(`/api/posts/${postId}`), { method: "DELETE" });
      if (!res.ok) {
        toast.error("삭제에 실패했어요");
        return;
      }
      toast.success("삭제했어요");
      router.push("/");
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/p/${postId}/edit`}>수정</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={pending}
          className="text-destructive focus:text-destructive"
        >
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
