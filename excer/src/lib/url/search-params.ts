import { z } from "zod";

/**
 * 홈의 URL 쿼리 스키마. 모든 필터·검색·정렬·지도위치가 여기에.
 * 잘못된 값은 무시 (기본값으로 폴백) — 사용자 에러 페이지 띄우지 않음.
 */
export const HomeSearchParams = z.object({
  q: z.string().trim().min(1).optional(),
  center: z
    .string()
    .regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/)
    .optional(),
  zoom: z.coerce.number().int().min(8).max(20).optional(),
  mirror: z.enum(["1", "0"]).optional(),
  soundproof: z.enum(["strong", "medium", "weak"]).optional(),
  size: z.enum(["s", "m", "l"]).optional(),
  price_max: z.coerce.number().int().min(0).max(1_000_000).optional(),
  sort: z.enum(["near", "price"]).default("near").optional(),
});

export type HomeSearchParamsT = z.infer<typeof HomeSearchParams>;

export const SIZE_BUCKETS = {
  s: { min: 0, max: 10 }, // 10평 이하
  m: { min: 10, max: 20 }, // 10~20평
  l: { min: 20, max: Infinity }, // 20평 이상
} as const;

export function parseHomeSearchParams(
  raw: Record<string, string | string[] | undefined>
): HomeSearchParamsT {
  // 배열 값은 첫번째만 사용
  const flat = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );
  const result = HomeSearchParams.safeParse(flat);
  return result.success ? result.data : {};
}

/**
 * 필터 상태로부터 URL 쿼리 객체를 생성.
 * 기본값/빈값은 제외해서 URL 짧게.
 */
export function toQueryString(params: HomeSearchParamsT): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "" || v === "near") return;
    sp.set(k, String(v));
  });
  return sp.toString();
}
