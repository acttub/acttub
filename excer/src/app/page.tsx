import { Suspense } from "react";
import { AppHeader } from "@/components/excer/app-header";
import { SearchBar } from "@/components/excer/search-bar";
import { HomeContent } from "@/components/excer/home-content";
import { FilterPanel } from "@/components/excer/filter-panel";
import { listActiveRooms } from "@/lib/db/queries";

export const revalidate = 3600;

export default async function HomePage() {
  const rooms = await listActiveRooms();
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  return (
    <div className="flex flex-col h-dvh">
      <Suspense fallback={null}>
        <AppHeader actions={<FilterPanel />} />
      </Suspense>
      <SearchBar />
      <Suspense fallback={<div className="flex-1" />}>
        <HomeContent rooms={rooms} kakaoKey={kakaoKey} />
      </Suspense>
    </div>
  );
}
