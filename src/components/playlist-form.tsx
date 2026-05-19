"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Globe, Link as LinkIcon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Visibility = "private" | "unlisted" | "public";

const VIS_OPTIONS: {
  value: Visibility;
  Icon: typeof Globe;
  label: string;
  desc: string;
}[] = [
  { value: "private", Icon: Lock, label: "비공개", desc: "나만 볼 수 있어요. 기본값이에요." },
  { value: "unlisted", Icon: LinkIcon, label: "링크 공유", desc: "공유 링크를 받은 사람만 볼 수 있어요." },
  { value: "public", Icon: Globe, label: "전체 공개", desc: "프로필에 공개되고 누구나 볼 수 있어요." },
];

export function PlaylistForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/archive/api/playlists", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          visibility,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { slug } = (await res.json()) as { slug: string };
      toast.success("플레이리스트 생성됨");
      router.push(`/playlists/${slug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "생성 실패");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          required
          disabled={busy}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">설명 (선택)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={2000}
          disabled={busy}
        />
      </div>
      <fieldset className="space-y-2.5">
        <legend className="mb-2 text-sm font-medium">공개 범위</legend>
        <div className="grid gap-2">
          {VIS_OPTIONS.map(({ value, Icon, label, desc }) => {
            const selected = visibility === value;
            return (
              <label
                key={value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-3.5 transition-colors",
                  selected
                    ? "border-primary/60 bg-accent/40 ring-1 ring-primary/30"
                    : "border-border hover:border-primary/30",
                )}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={value}
                  checked={selected}
                  onChange={() => setVisibility(value)}
                  disabled={busy}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                    selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {label}
                    {value === "private" ? (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        기본
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>
      <Button type="submit" disabled={busy} size="lg" className="w-full">
        만들기
      </Button>
    </form>
  );
}
