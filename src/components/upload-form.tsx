"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { Globe, Link as LinkIcon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatBytes } from "@/lib/utils";

type Visibility = "private" | "unlisted" | "public";

const VIS_OPTIONS: {
  value: Visibility;
  Icon: typeof Globe;
  label: string;
  desc: string;
}[] = [
  {
    value: "private",
    Icon: Lock,
    label: "비공개",
    desc: "나만 볼 수 있어요. 기본값이에요.",
  },
  {
    value: "unlisted",
    Icon: LinkIcon,
    label: "링크 공유",
    desc: "공유 링크를 받은 사람만 볼 수 있어요.",
  },
  {
    value: "public",
    Icon: Globe,
    label: "전체 공개",
    desc: "누구나 검색·피드에서 볼 수 있어요.",
  },
];

async function captureThumbnailAndDuration(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.preload = "metadata";
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("영상 메타데이터를 읽지 못했어요"));
    });
    const duration = isFinite(video.duration) ? video.duration : 0;
    video.currentTime = Math.min(1, Math.max(0.1, duration / 2));
    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
    });
    const w = Math.min(640, video.videoWidth || 640);
    const ratio =
      video.videoHeight && video.videoWidth ? video.videoHeight / video.videoWidth : 9 / 16;
    const h = Math.round(w * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { thumb: null as Blob | null, durationSec: Math.round(duration) };
    ctx.drawImage(video, 0, 0, w, h);
    const thumb = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85);
    });
    return { thumb, durationSec: Math.round(duration) };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "thumb" | "upload" | "save">("idle");
  const busy = status !== "idle";

  function onPickFile(f: File | null) {
    setFile(f);
    if (!title && f) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) {
      toast.error("영상 파일과 제목은 필수예요");
      return;
    }
    try {
      setStatus("thumb");
      const { thumb, durationSec } = await captureThumbnailAndDuration(file);

      let thumbnailUrl: string | null = null;
      if (thumb) {
        const thumbBlob = await upload(`thumbnails/${file.name}.jpg`, thumb, {
          access: "public",
          handleUploadUrl: "/archive/api/upload",
          clientPayload: "thumbnail",
        });
        thumbnailUrl = thumbBlob.url;
      }

      setStatus("upload");
      setProgress(0);
      const blob = await upload(`videos/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/archive/api/upload",
        clientPayload: "video",
        onUploadProgress: (p) => setProgress(Math.round(p.percentage)),
      });

      setStatus("save");
      const tags = tagsInput
        .split(/[,\n]/g)
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/archive/api/videos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          tags,
          visibility,
          blobUrl: blob.url,
          blobPathname: blob.pathname,
          thumbnailUrl,
          mimeType: file.type,
          sizeBytes: file.size,
          durationSec,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "메타데이터 저장에 실패했어요");
      }
      const { id } = (await res.json()) as { id: string };
      toast.success("업로드 완료");
      router.push(`/videos/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "업로드에 실패했어요");
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="file">영상 파일</Label>
        <Input
          id="file"
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/x-msvideo"
          onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
          disabled={busy}
        />
        {file ? (
          <p className="text-xs text-muted-foreground">
            {file.name} · {formatBytes(file.size)}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            mp4, webm, mov, mkv, avi · 최대 500MB
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          disabled={busy}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명 (선택)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={5000}
          placeholder="작품, 배역, 장면, 인상적인 포인트 등"
          disabled={busy}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">태그 (콤마로 구분)</Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="예: 햄릿, 독백, 감정폭발"
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

      {status === "upload" ? (
        <div className="space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">업로드 중… {progress}%</p>
        </div>
      ) : null}

      <Button type="submit" disabled={busy} size="lg" className="w-full">
        {status === "idle"
          ? "업로드"
          : status === "thumb"
            ? "썸네일 생성 중…"
            : status === "upload"
              ? `업로드 중… ${progress}%`
              : "저장 중…"}
      </Button>
    </form>
  );
}
