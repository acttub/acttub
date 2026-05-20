"use client";

import { useMemo, useState } from "react";
import { MapView } from "./map-view";
import { RoomList } from "./room-list";
import { EmptyState } from "./empty-state";
import { useFilters } from "@/hooks/use-filters";
import { applyFilters } from "@/lib/url/apply-filters";
import { Button } from "@/components/ui/button";
import type { Room } from "@/lib/db";

export function HomeContent({
  rooms,
  kakaoKey,
}: {
  rooms: Room[];
  kakaoKey?: string;
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const { filters, reset, count } = useFilters();

  const filtered = useMemo(
    () => applyFilters(rooms, filters),
    [rooms, filters]
  );

  return (
    <main className="flex-1 relative flex flex-col lg:flex-row min-h-0">
      <div className="relative flex-1 min-h-[40vh] lg:min-h-0">
        <MapView
          rooms={filtered}
          appKey={kakaoKey}
          activeSlug={activeSlug}
          onActiveChange={setActiveSlug}
        />
      </div>
      <aside
        className="lg:w-[400px] xl:w-[440px] lg:border-l border-border bg-background flex-shrink-0
                   h-[55vh] lg:h-auto border-t lg:border-t-0 flex flex-col"
        aria-label="연습실 목록"
      >
        {filtered.length === 0 ? (
          <div className="p-6 flex-1 flex items-center">
            <EmptyState
              title={
                count > 0
                  ? "조건에 맞는 연습실이 없어요"
                  : "표시할 연습실이 없어요"
              }
              description={
                count > 0
                  ? "필터를 풀어보세요."
                  : "DATABASE_URL 을 설정하거나 fixture 가 비어있어요."
              }
              icon={count > 0 ? "search" : "off"}
              actions={
                count > 0 ? (
                  <Button variant="ghost" onClick={reset}>
                    필터 초기화
                  </Button>
                ) : undefined
              }
              className="w-full"
            />
          </div>
        ) : (
          <RoomList rooms={filtered} onActiveChange={setActiveSlug} />
        )}
      </aside>
    </main>
  );
}
