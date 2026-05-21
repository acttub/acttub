import type { Room } from "@/lib/db";
import {
  type HomeSearchParamsT,
  SIZE_BUCKETS,
} from "./search-params";

export function applyFilters(
  rooms: Room[],
  filters: HomeSearchParamsT
): Room[] {
  return rooms.filter((r) => {
    if (filters.mirror === "1" && !r.mirror) return false;
    if (filters.mirror === "0" && r.mirror) return false;
    if (filters.soundproof && r.soundproof !== filters.soundproof) return false;
    if (filters.size) {
      const b = SIZE_BUCKETS[filters.size];
      if (r.sizePyeong < b.min || r.sizePyeong >= b.max) return false;
    }
    if (typeof filters.price_max === "number" && r.priceHour > filters.price_max) {
      return false;
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const hit =
        r.name.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.subway.some((s) => s.toLowerCase().includes(q));
      if (!hit) return false;
    }
    return true;
  });
}
