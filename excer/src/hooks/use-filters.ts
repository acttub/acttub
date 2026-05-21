"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  parseHomeSearchParams,
  toQueryString,
  type HomeSearchParamsT,
} from "@/lib/url/search-params";

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<HomeSearchParamsT>(() => {
    const obj: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      obj[k] = v;
    });
    return parseHomeSearchParams(obj);
  }, [searchParams]);

  const setFilters = useCallback(
    (next: HomeSearchParamsT, { push = false }: { push?: boolean } = {}) => {
      const qs = toQueryString(next);
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (push) router.push(url);
      else router.replace(url);
    },
    [pathname, router]
  );

  const update = useCallback(
    (patch: Partial<HomeSearchParamsT>) => {
      const next = { ...filters, ...patch };
      // 빈 값은 제거
      (Object.keys(next) as (keyof HomeSearchParamsT)[]).forEach((k) => {
        const v = next[k];
        if (v === undefined || v === "" || v === null) {
          delete next[k];
        }
      });
      setFilters(next);
    },
    [filters, setFilters]
  );

  const reset = useCallback(() => setFilters({}), [setFilters]);

  const count = useMemo(() => {
    let n = 0;
    if (filters.mirror) n++;
    if (filters.soundproof) n++;
    if (filters.size) n++;
    if (typeof filters.price_max === "number") n++;
    return n;
  }, [filters]);

  return { filters, update, reset, setFilters, count };
}
