export type ExcerRoom = {
  id: string;
  slug: string;
  name: string;
  region: string;
  subway: string[];
  lat: number;
  lng: number;
  priceHour: number;
  priceNote: string | null;
  hours: { open: string; close: string; days: number[] };
  phone: string | null;
  bookingUrl: string | null;
  photos: string[];
  mirror: boolean;
  soundproof: 'strong' | 'medium' | 'weak';
  sizePyeong: number;
  lighting: 'bright' | 'normal' | 'dim';
  scriptstand: boolean;
  microphone: boolean;
  verifiedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  active: boolean;
};

export type ExcerSearchParams = {
  q?: string;
  mirror?: '1' | '0';
  soundproof?: 'strong' | 'medium' | 'weak';
  size?: 's' | 'm' | 'l';
  price_max?: number;
  sort?: 'near' | 'price';
};

const SIZE_BUCKETS = {
  s: { min: 0, max: 10 },
  m: { min: 10, max: 20 },
  l: { min: 20, max: Number.POSITIVE_INFINITY },
} as const;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseExcerSearchParams(raw: Record<string, string | string[] | undefined>): ExcerSearchParams {
  const filters: ExcerSearchParams = {};
  const q = firstValue(raw.q)?.trim();
  const mirror = firstValue(raw.mirror);
  const soundproof = firstValue(raw.soundproof);
  const size = firstValue(raw.size);
  const sort = firstValue(raw.sort);
  const priceMax = Number(firstValue(raw.price_max));

  if (q) filters.q = q;
  if (mirror === '1' || mirror === '0') filters.mirror = mirror;
  if (soundproof === 'strong' || soundproof === 'medium' || soundproof === 'weak') {
    filters.soundproof = soundproof;
  }
  if (size === 's' || size === 'm' || size === 'l') filters.size = size;
  if (Number.isInteger(priceMax) && priceMax >= 0 && priceMax <= 1_000_000) {
    filters.price_max = priceMax;
  }
  if (sort === 'near' || sort === 'price') filters.sort = sort;

  return filters;
}

export function applyExcerFilters(rooms: ExcerRoom[], filters: ExcerSearchParams): ExcerRoom[] {
  return rooms.filter((room) => {
    if (filters.mirror === '1' && !room.mirror) return false;
    if (filters.mirror === '0' && room.mirror) return false;
    if (filters.soundproof && room.soundproof !== filters.soundproof) return false;
    if (filters.size) {
      const bucket = SIZE_BUCKETS[filters.size];
      if (room.sizePyeong < bucket.min || room.sizePyeong >= bucket.max) return false;
    }
    if (typeof filters.price_max === 'number' && room.priceHour > filters.price_max) return false;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const hit =
        room.name.toLowerCase().includes(q) ||
        room.region.toLowerCase().includes(q) ||
        room.subway.some((station) => station.toLowerCase().includes(q));
      if (!hit) return false;
    }
    return true;
  });
}

export function toExcerQueryString(params: ExcerSearchParams): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === 'near') return;
    searchParams.set(key, String(value));
  });
  return searchParams.toString();
}
