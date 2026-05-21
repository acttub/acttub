"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string | null;
  videoId: string;
};

export function VideoPlayer({ src, poster, videoId }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const countedRef = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    function onPlay() {
      if (countedRef.current) return;
      countedRef.current = true;
      fetch(`/archive/api/videos/${videoId}/view`, { method: "POST" }).catch(() => {});
    }
    v.addEventListener("play", onPlay);
    return () => v.removeEventListener("play", onPlay);
  }, [videoId]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster ?? undefined}
      controls
      playsInline
      className="aspect-video w-full rounded-xl bg-black"
    />
  );
}
