"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useFilters } from "@/hooks/use-filters";
import { cn, formatPrice } from "@/lib/utils";
import type { HomeSearchParamsT } from "@/lib/url/search-params";

const PRICE_MAX = 30000;
const PRICE_STEP = 1000;

function FilterContent({
  filters,
  onUpdate,
  onReset,
  count,
}: {
  filters: HomeSearchParamsT;
  onUpdate: (patch: Partial<HomeSearchParamsT>) => void;
  onReset: () => void;
  count: number;
}) {
  const [priceMax, setPriceMax] = useState<number>(
    filters.price_max ?? PRICE_MAX
  );
  const isPriceActive = (filters.price_max ?? PRICE_MAX) < PRICE_MAX;

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* 거울 */}
      <section className="space-y-2">
        <label className="text-sm font-medium text-foreground">거울</label>
        <ToggleGroup
          type="single"
          value={filters.mirror ?? ""}
          onValueChange={(v) =>
            onUpdate({ mirror: (v as "1" | "0" | undefined) || undefined })
          }
          className="grid grid-cols-2 gap-2"
          variant="outline"
        >
          <ToggleGroupItem value="1">있음</ToggleGroupItem>
          <ToggleGroupItem value="0">없음</ToggleGroupItem>
        </ToggleGroup>
      </section>

      {/* 방음 */}
      <section className="space-y-2">
        <label className="text-sm font-medium text-foreground">방음</label>
        <ToggleGroup
          type="single"
          value={filters.soundproof ?? ""}
          onValueChange={(v) =>
            onUpdate({
              soundproof:
                (v as "strong" | "medium" | "weak" | undefined) || undefined,
            })
          }
          className="grid grid-cols-3 gap-2"
          variant="outline"
        >
          <ToggleGroupItem value="strong">강</ToggleGroupItem>
          <ToggleGroupItem value="medium">중</ToggleGroupItem>
          <ToggleGroupItem value="weak">약</ToggleGroupItem>
        </ToggleGroup>
      </section>

      {/* 평수 */}
      <section className="space-y-2">
        <label className="text-sm font-medium text-foreground">평수</label>
        <ToggleGroup
          type="single"
          value={filters.size ?? ""}
          onValueChange={(v) =>
            onUpdate({ size: (v as "s" | "m" | "l" | undefined) || undefined })
          }
          className="grid grid-cols-3 gap-2"
          variant="outline"
        >
          <ToggleGroupItem value="s">10평↓</ToggleGroupItem>
          <ToggleGroupItem value="m">10~20</ToggleGroupItem>
          <ToggleGroupItem value="l">20평↑</ToggleGroupItem>
        </ToggleGroup>
      </section>

      <Separator />

      {/* 가격 */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <label className="text-sm font-medium text-foreground">가격대</label>
          <span
            className={cn(
              "text-xs",
              isPriceActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            ~ {formatPrice(priceMax)} / 시간
          </span>
        </div>
        <Slider
          value={[priceMax]}
          min={0}
          max={PRICE_MAX}
          step={PRICE_STEP}
          onValueChange={(v) => setPriceMax(v[0])}
          onValueCommit={(v) =>
            onUpdate({
              price_max: v[0] < PRICE_MAX ? v[0] : undefined,
            })
          }
        />
      </section>

      {/* 액션 */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={onReset}
          disabled={count === 0}
        >
          초기화
        </Button>
        <Button className="flex-[2]">{count > 0 ? `${count}개 필터 적용` : "필터 없음"}</Button>
      </div>
    </div>
  );
}

export function FilterPanel() {
  const { filters, update, reset, count } = useFilters();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile — Drawer */}
      <div className="lg:hidden">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <FilterButton count={count} />
          </DrawerTrigger>
          <DrawerContent>
            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <span className="text-base font-semibold">필터</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="size-8 rounded-md hover:bg-secondary inline-flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[80vh]">
              <FilterContent
                filters={filters}
                onUpdate={update}
                onReset={reset}
                count={count}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop — Popover */}
      <div className="hidden lg:block">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <FilterButton count={count} />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0 overflow-hidden">
            <div className="border-b border-border px-5 py-3 text-sm font-medium">
              필터
            </div>
            <FilterContent
              filters={filters}
              onUpdate={update}
              onReset={reset}
              count={count}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

function FilterButton({ count }: { count: number }) {
  return (
    <button
      type="button"
      aria-label="필터 열기"
      className={cn(
        "relative size-10 rounded-md flex items-center justify-center",
        "hover:bg-secondary transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        count > 0 && "bg-accent text-accent-foreground"
      )}
    >
      <SlidersHorizontal className="size-5" />
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
          {count}
        </span>
      ) : null}
    </button>
  );
}
