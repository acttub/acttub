"use client";

import { useState } from "react";
import { RoomCard } from "./room-card";
import { SortControl } from "./sort-control";
import type { Room } from "@/lib/db";

export function RoomList({
  rooms,
  initialSort = "near",
  onActiveChange,
}: {
  rooms: Room[];
  initialSort?: "near" | "price";
  onActiveChange?: (slug: string | null) => void;
}) {
  const [sort, setSort] = useState<"near" | "price">(initialSort);

  const sorted = [...rooms].sort((a, b) => {
    if (sort === "price") return a.priceHour - b.priceHour;
    // "near" — 위치 기반 정렬은 MapView 컨텍스트가 필요. 기본 fixture 순서로.
    return 0;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 lg:px-5">
        <span className="text-sm text-muted-foreground">{rooms.length}곳</span>
        <SortControl value={sort} onChange={setSort} />
      </div>
      <div className="flex-1 overflow-y-auto px-4 lg:px-5 pb-4 space-y-2">
        {sorted.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onHover={onActiveChange}
          />
        ))}
      </div>
    </div>
  );
}
