"use client";

import { Search, Navigation } from "lucide-react";

export function SearchBar() {
  return (
    <div className="sticky top-14 lg:top-16 z-30 bg-background/80 backdrop-blur border-b border-border px-4 py-2 lg:px-6">
      <div className="flex gap-2 max-w-3xl mx-auto">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="동·역 검색 (예: 혜화, 대학로역)"
            className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="동 또는 지하철역으로 검색"
          />
        </div>
        <button
          type="button"
          className="h-10 px-3 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="현재 위치로 이동"
        >
          <Navigation className="size-4" />
          내 주변
        </button>
      </div>
    </div>
  );
}
