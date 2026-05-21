"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <div className="text-xs font-bold text-destructive">Error</div>
      <h1 className="text-3xl font-extrabold tracking-tight">
        잠시 문제가 발생했어요
      </h1>
      <p className="text-sm leading-6 text-muted-foreground">
        페이지를 다시 불러오면 보통 해결됩니다.
      </p>
      <Button size="lg" onClick={reset}>
        다시 시도
      </Button>
    </section>
  );
}
