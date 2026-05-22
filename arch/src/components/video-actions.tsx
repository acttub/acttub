"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Globe,
  Link as LinkIcon,
  ListPlus,
  Lock,
  Settings2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Visibility = "private" | "unlisted" | "public";

type Props = {
  videoId: string;
  initialBookmarked: boolean;
  initialVisibility: Visibility;
  isOwner: boolean;
  isAuthed: boolean;
  playlists: { id: string; title: string }[];
};

const VIS_OPTIONS: {
  value: Visibility;
  Icon: typeof Globe;
  label: string;
  desc: string;
}[] = [
  { value: "private", Icon: Lock, label: "비공개", desc: "나만 볼 수 있어요." },
  { value: "unlisted", Icon: LinkIcon, label: "링크 공유", desc: "공유 링크를 받은 사람만." },
  { value: "public", Icon: Globe, label: "전체 공개", desc: "누구나 검색·피드에서 볼 수 있어요." },
];

export function VideoActions({
  videoId,
  initialBookmarked,
  initialVisibility,
  isOwner,
  isAuthed,
  playlists,
}: Props) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [visibility, setVisibility] = useState<Visibility>(initialVisibility);
  const [pending, startTransition] = useTransition();
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [visOpen, setVisOpen] = useState(false);
  const [savingVis, setSavingVis] = useState(false);

  function requireAuth() {
    if (!isAuthed) {
      toast.error("로그인이 필요해요");
      return false;
    }
    return true;
  }

  async function toggleBookmark() {
    if (!requireAuth()) return;
    const next = !bookmarked;
    setBookmarked(next);
    startTransition(async () => {
      const res = await fetch("/archive/api/bookmarks", {
        method: next ? "POST" : "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
      if (!res.ok) {
        setBookmarked(!next);
        toast.error("저장에 실패했어요");
      }
    });
  }

  async function createShare() {
    if (!requireAuth()) return;
    const res = await fetch("/archive/api/share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ videoId }),
    });
    if (!res.ok) {
      toast.error("공유 링크 생성 실패");
      return;
    }
    const { token } = (await res.json()) as { token: string };
    const url = `${window.location.origin}/archive/s/${token}`;
    setShareUrl(url);
    setShareOpen(true);
    await navigator.clipboard.writeText(url).catch(() => {});
    toast.success("링크가 복사됐어요");
  }

  async function addToPlaylist(playlistId: string) {
    if (!requireAuth()) return;
    const res = await fetch(`/archive/api/playlists/${playlistId}/videos`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ videoId }),
    });
    if (!res.ok) {
      toast.error("플레이리스트에 추가 실패");
      return;
    }
    toast.success("플레이리스트에 추가됨");
    setPlaylistOpen(false);
  }

  async function saveVisibility(next: Visibility) {
    if (next === visibility) {
      setVisOpen(false);
      return;
    }
    setSavingVis(true);
    const res = await fetch(`/archive/api/videos/${videoId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ visibility: next }),
    });
    setSavingVis(false);
    if (!res.ok) {
      toast.error("변경 실패");
      return;
    }
    setVisibility(next);
    setVisOpen(false);
    toast.success("공개 범위가 바뀌었어요");
    router.refresh();
  }

  async function deleteVideo() {
    if (!confirm("정말 삭제할까요? 되돌릴 수 없어요.")) return;
    const res = await fetch(`/archive/api/videos/${videoId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("삭제 실패");
      return;
    }
    toast.success("삭제됨");
    router.push("/");
    router.refresh();
  }

  const currentVis = VIS_OPTIONS.find((o) => o.value === visibility)!;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Button
        variant={bookmarked ? "default" : "outline"}
        size="sm"
        onClick={toggleBookmark}
        disabled={pending}
      >
        {bookmarked ? <BookmarkCheck /> : <Bookmark />}
        {bookmarked ? "북마크됨" : "북마크"}
      </Button>

      <Dialog open={playlistOpen} onOpenChange={setPlaylistOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => requireAuth() && setPlaylistOpen(true)}
          >
            <ListPlus />
            플레이리스트
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>플레이리스트에 추가</DialogTitle>
            <DialogDescription>이 영상을 어디에 담을까요?</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            {playlists.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                아직 플레이리스트가 없어요.{" "}
                <Link href="/playlists/new" className="underline">
                  새로 만들기
                </Link>
              </p>
            ) : (
              playlists.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addToPlaylist(p.id)}
                  className="block w-full rounded-lg border border-border px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  {p.title}
                </button>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" asChild>
              <Link href="/playlists/new">+ 새 플레이리스트</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="outline" size="sm" onClick={createShare}>
        <LinkIcon />
        공유 링크
      </Button>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공유 링크가 생성됐어요</DialogTitle>
            <DialogDescription>아래 URL을 아는 사람만 볼 수 있어요.</DialogDescription>
          </DialogHeader>
          <input
            readOnly
            value={shareUrl ?? ""}
            className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm"
            onFocus={(e) => e.currentTarget.select()}
          />
        </DialogContent>
      </Dialog>

      {isOwner ? (
        <>
          <Dialog open={visOpen} onOpenChange={setVisOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <currentVis.Icon />
                {currentVis.label}
                <Settings2 className="opacity-60" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>공개 범위 변경</DialogTitle>
                <DialogDescription>누가 이 영상을 볼 수 있을지 골라주세요.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                {VIS_OPTIONS.map(({ value, Icon, label, desc }) => {
                  const selected = visibility === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => saveVisibility(value)}
                      disabled={savingVis}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border bg-card p-3.5 text-left transition-colors",
                        selected
                          ? "border-primary/60 bg-accent/40 ring-1 ring-primary/30"
                          : "border-border hover:border-primary/30",
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold">{label}</div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="destructive" size="sm" onClick={deleteVideo}>
            <Trash2 />
            삭제
          </Button>
        </>
      ) : null}
    </div>
  );
}
