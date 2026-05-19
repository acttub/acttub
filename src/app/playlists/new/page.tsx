import { PlaylistForm } from "@/components/playlist-form";

export default function NewPlaylistPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">새 플레이리스트</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        모은 영상을 한 주제로 묶어두면 다시 찾기 쉬워요.
      </p>
      <PlaylistForm />
    </div>
  );
}
