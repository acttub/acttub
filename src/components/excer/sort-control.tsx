"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function SortControl({
  value,
  onChange,
}: {
  value: "near" | "price";
  onChange: (v: "near" | "price") => void;
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as "near" | "price")}
      className="h-8 rounded-full bg-muted p-0.5 gap-0"
      aria-label="정렬 방식"
    >
      <ToggleGroupItem
        value="near"
        className="h-7 px-3 text-xs rounded-full data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm hover:bg-transparent"
      >
        거리순
      </ToggleGroupItem>
      <ToggleGroupItem
        value="price"
        className="h-7 px-3 text-xs rounded-full data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm hover:bg-transparent"
      >
        가격순
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
