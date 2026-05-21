"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Navigation, Plus, Minus } from "lucide-react";
import { MapPlaceholder } from "./map-placeholder";
import type { Room } from "@/lib/db";
import type { KakaoCustomOverlay, KakaoMap } from "@/types/kakao-maps";

const SEOUL_CITY_HALL = { lat: 37.5663, lng: 126.9779 };
const DEFAULT_LEVEL = 7; // 카카오맵 줌 레벨 (낮을수록 크게)

function pinHtml(active: boolean): string {
  const size = active ? 24 : 18;
  return `
    <div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:#ff7a5c;border:1.5px solid #fff;
      box-shadow:0 1px 3px rgba(0,0,0,0.25);
      ${active ? "outline:4px solid rgba(255,179,158,.55);outline-offset:0;" : ""}
      transition:all 150ms ease-out;
    "></div>
  `;
}

export function MapView({
  rooms,
  appKey,
  activeSlug,
  onActiveChange,
}: {
  rooms: Room[];
  appKey?: string;
  activeSlug?: string | null;
  onActiveChange?: (slug: string | null) => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const overlaysRef = useRef<Map<string, KakaoCustomOverlay>>(new Map());
  const [sdkReady, setSdkReady] = useState(false);

  // SDK load handler
  function handleScriptLoad() {
    if (typeof window === "undefined" || !window.kakao) return;
    window.kakao.maps.load(() => setSdkReady(true));
  }

  // Initialize map once SDK ready
  useEffect(() => {
    if (!sdkReady || !containerRef.current || !window.kakao) return;
    if (mapRef.current) return;
    const kakao = window.kakao.maps;
    mapRef.current = new kakao.Map(containerRef.current, {
      center: new kakao.LatLng(SEOUL_CITY_HALL.lat, SEOUL_CITY_HALL.lng),
      level: DEFAULT_LEVEL,
    });
  }, [sdkReady]);

  // Render / update pins
  useEffect(() => {
    if (!sdkReady || !mapRef.current || !window.kakao) return;
    const kakao = window.kakao.maps;
    const existing = overlaysRef.current;

    // remove stale
    for (const [slug, overlay] of existing.entries()) {
      if (!rooms.find((r) => r.slug === slug)) {
        overlay.setMap(null);
        existing.delete(slug);
      }
    }

    for (const room of rooms) {
      const existingOverlay = existing.get(room.slug);
      const el = document.createElement("div");
      el.innerHTML = pinHtml(activeSlug === room.slug);
      el.style.cursor = "pointer";
      el.addEventListener("mouseenter", () => onActiveChange?.(room.slug));
      el.addEventListener("mouseleave", () => onActiveChange?.(null));
      el.addEventListener("click", () => {
        router.push(`/rooms/${room.slug}`);
      });

      if (existingOverlay) {
        existingOverlay.setMap(null);
      }
      const overlay = new kakao.CustomOverlay({
        position: new kakao.LatLng(room.lat, room.lng),
        content: el,
        yAnchor: 0.5,
        xAnchor: 0.5,
        map: mapRef.current ?? undefined,
      });
      existing.set(room.slug, overlay);
    }
  }, [sdkReady, rooms, activeSlug, onActiveChange, router]);

  if (!appKey) {
    return (
      <div className="absolute inset-0">
        <MapPlaceholder />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-card border border-border text-xs text-muted-foreground shadow-sm">
          NEXT_PUBLIC_KAKAO_MAP_KEY 가 설정되면 지도가 활성화돼요
        </div>
      </div>
    );
  }

  function zoomIn() {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(Math.max(map.getLevel() - 1, 1));
  }
  function zoomOut() {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(Math.min(map.getLevel() + 1, 14));
  }
  function locate() {
    if (!navigator.geolocation || !mapRef.current || !window.kakao) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ll = new window.kakao!.maps.LatLng(
          pos.coords.latitude,
          pos.coords.longitude
        );
        mapRef.current!.setCenter(ll);
        mapRef.current!.setLevel(5);
      },
      () => {
        /* 거부 시 무시. 서울 시청 기본 좌표 유지 */
      }
    );
  }

  const src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;

  return (
    <>
      <Script src={src} strategy="afterInteractive" onLoad={handleScriptLoad} />
      <div
        ref={containerRef}
        className="absolute inset-0 bg-muted"
        role="application"
        aria-label="연습실 지도"
      />
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button
          type="button"
          onClick={locate}
          aria-label="현재 위치로"
          className="size-10 rounded-full bg-background shadow-md hover:bg-secondary flex items-center justify-center text-primary"
        >
          <Navigation className="size-4" />
        </button>
        <div className="rounded-md bg-background shadow-md overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={zoomIn}
            aria-label="줌 인"
            className="size-10 hover:bg-secondary flex items-center justify-center"
          >
            <Plus className="size-4" />
          </button>
          <div className="h-px bg-border" />
          <button
            type="button"
            onClick={zoomOut}
            aria-label="줌 아웃"
            className="size-10 hover:bg-secondary flex items-center justify-center"
          >
            <Minus className="size-4" />
          </button>
        </div>
      </div>
    </>
  );
}
