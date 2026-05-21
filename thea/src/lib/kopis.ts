import { XMLParser } from "fast-xml-parser";

import {
  curation,
  matchCuration,
  type CurationEntry,
} from "@/data/curation";
import { autoTagShow } from "@/lib/auto-tag";

const KOPIS_ENDPOINT = "https://www.kopis.or.kr/openApi/restful/pblprfr";

export type KopisShow = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  venue: string;
  poster: string;
  area: string;
  genre: string;
  state: string;
};

export type EnrichedPlay = {
  id: string;
  title: string;
  venue: string;
  area: string;
  pitch: string;
  tags: string[];
  moods: CurationEntry["moods"];
  companions: CurationEntry["companions"];
  pace: CurationEntry["pace"];
  price: string;
  period: string;
  poster: string | null;
  isLive: boolean;
  isCurated: boolean;
};

export type KopisDetail = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  venue: string;
  poster: string;
  area: string;
  genre: string;
  state: string;
  cast: string;
  crew: string;
  runtime: string;
  ageGuide: string;
  producer: string;
  priceGuide: string;
  story: string;
  storyImages: string[];
  scheduleGuide: string;
  relatedUrl: string;
  openRun: string;
};

export type PlayDetail = {
  isCurated: boolean;
  entry: CurationEntry | null;
  show: KopisShow | null;
  detail: KopisDetail | null;
  displayPeriod: string;
  title: string;
};

function toHttps(url: string): string {
  if (!url) return url;
  return url.replace(/^http:\/\//i, "https://");
}

function formatKopisDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function formatDisplayDate(input: string): string {
  if (!input) return input;
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(input)) return input;
  if (/^\d{8}$/.test(input)) {
    return `${input.slice(0, 4)}.${input.slice(4, 6)}.${input.slice(6, 8)}`;
  }
  return input;
}

function periodOf(startDate: string, endDate: string): string {
  if (!startDate && !endDate) return "공연 일정 확인 필요";
  return `${formatDisplayDate(startDate)} ~ ${formatDisplayDate(endDate)}`;
}

function pickString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

async function fetchKopisPage(
  apiKey: string,
  stdate: string,
  eddate: string,
  rows: number,
  page: number,
): Promise<KopisShow[]> {
  const url = new URL(KOPIS_ENDPOINT);
  url.searchParams.set("service", apiKey);
  url.searchParams.set("stdate", stdate);
  url.searchParams.set("eddate", eddate);
  url.searchParams.set("rows", String(rows));
  url.searchParams.set("cpage", String(page));
  url.searchParams.set("prfstate", "02");
  url.searchParams.set("signgucode", "11");

  const res = await fetch(url.toString(), {
    next: { revalidate: 86400, tags: ["kopis-shows"] },
  });
  if (!res.ok) return [];

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: true });
  const parsed = parser.parse(xml);

  const items = parsed?.dbs?.db;
  if (!items) return [];

  const list = Array.isArray(items) ? items : [items];
  return list.map((item: Record<string, unknown>) => ({
    id: pickString(item.mt20id),
    title: pickString(item.prfnm),
    startDate: pickString(item.prfpdfrom),
    endDate: pickString(item.prfpdto),
    venue: pickString(item.fcltynm),
    poster: toHttps(pickString(item.poster)),
    area: pickString(item.area),
    genre: pickString(item.genrenm),
    state: pickString(item.prfstate),
  }));
}

async function fetchKopisDetail(mt20id: string): Promise<KopisDetail | null> {
  const apiKey = process.env.KOPIS_API_KEY;
  if (!apiKey || !mt20id) return null;

  const url = new URL(`${KOPIS_ENDPOINT}/${encodeURIComponent(mt20id)}`);
  url.searchParams.set("service", apiKey);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 86400, tags: ["kopis-detail"] },
    });
    if (!res.ok) return null;

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: true });
    const parsed = parser.parse(xml);
    const node = parsed?.dbs?.db;
    if (!node) return null;

    const item: Record<string, unknown> = Array.isArray(node) ? node[0] : node;

    const styurlsNode = item.styurls as Record<string, unknown> | undefined;
    const styurlValue = styurlsNode?.styurl;
    const storyImagesRaw = Array.isArray(styurlValue)
      ? styurlValue
      : styurlValue != null
      ? [styurlValue]
      : [];

    return {
      id: pickString(item.mt20id),
      title: pickString(item.prfnm),
      startDate: pickString(item.prfpdfrom),
      endDate: pickString(item.prfpdto),
      venue: pickString(item.fcltynm),
      poster: toHttps(pickString(item.poster)),
      area: pickString(item.area),
      genre: pickString(item.genrenm),
      state: pickString(item.prfstate),
      cast: pickString(item.prfcast),
      crew: pickString(item.prfcrew),
      runtime: pickString(item.prfruntime),
      ageGuide: pickString(item.prfage),
      producer: pickString(item.entrpsnm),
      priceGuide: pickString(item.pcseguidance),
      story: pickString(item.sty),
      storyImages: storyImagesRaw
        .map((v) => toHttps(pickString(v)))
        .filter((s) => Boolean(s)),
      scheduleGuide: pickString(item.dtguidance),
      relatedUrl: pickString(item.relateurl),
      openRun: pickString(item.openrun),
    };
  } catch {
    return null;
  }
}

export async function fetchCurrentShows(): Promise<KopisShow[]> {
  const apiKey = process.env.KOPIS_API_KEY;
  if (!apiKey) return [];

  const today = new Date();
  const oneWeek = new Date(today);
  oneWeek.setDate(today.getDate() + 7);

  const stdate = formatKopisDate(today);
  const eddate = formatKopisDate(oneWeek);
  const rows = 100;
  const maxPages = 10;
  const seen = new Set<string>();
  const all: KopisShow[] = [];

  try {
    for (let page = 1; page <= maxPages; page++) {
      const items = await fetchKopisPage(apiKey, stdate, eddate, rows, page);
      if (items.length === 0) break;
      let added = 0;
      for (const item of items) {
        if (!item.id || seen.has(item.id)) continue;
        seen.add(item.id);
        all.push(item);
        added++;
      }
      if (items.length < rows) break;
      if (added === 0) break;
    }
  } catch {
    return all;
  }

  return all;
}

function buildCuratedPlay(entry: CurationEntry, show: KopisShow): EnrichedPlay {
  return {
    id: entry.id,
    title: show.title || entry.title,
    venue: show.venue || entry.defaultVenue,
    area: show.area || entry.defaultArea,
    pitch: entry.pitch,
    tags: entry.tags,
    moods: entry.moods,
    companions: entry.companions,
    pace: entry.pace,
    price: entry.priceHint,
    period: periodOf(show.startDate, show.endDate),
    poster: show.poster || null,
    isLive: true,
    isCurated: true,
  };
}

function buildUnmatchedCurationPlay(entry: CurationEntry): EnrichedPlay {
  return {
    id: entry.id,
    title: entry.title,
    venue: entry.defaultVenue,
    area: entry.defaultArea,
    pitch: entry.pitch,
    tags: entry.tags,
    moods: entry.moods,
    companions: entry.companions,
    pace: entry.pace,
    price: entry.priceHint,
    period: "이번 주 공연 없음",
    poster: null,
    isLive: false,
    isCurated: true,
  };
}

function buildAutoTaggedPlay(show: KopisShow): EnrichedPlay {
  const auto = autoTagShow({
    title: show.title,
    genre: show.genre,
    area: show.area,
    venue: show.venue,
  });
  return {
    id: show.id,
    title: show.title,
    venue: show.venue,
    area: show.area,
    pitch: auto.pitch,
    tags: auto.tags,
    moods: auto.moods,
    companions: auto.companions,
    pace: auto.pace,
    price: "예매처 확인",
    period: periodOf(show.startDate, show.endDate),
    poster: show.poster || null,
    isLive: true,
    isCurated: false,
  };
}

export async function getEnrichedPlays(): Promise<{
  plays: EnrichedPlay[];
  source: "kopis" | "fallback";
}> {
  const shows = await fetchCurrentShows();

  if (shows.length === 0) {
    const fallback = curation.map((entry) => buildUnmatchedCurationPlay(entry));
    return { plays: fallback, source: "fallback" };
  }

  const plays: EnrichedPlay[] = [];
  const matchedCurationIds = new Set<string>();

  for (const show of shows) {
    const entry = matchCuration(show.title);
    if (entry && !matchedCurationIds.has(entry.id)) {
      matchedCurationIds.add(entry.id);
      plays.push(buildCuratedPlay(entry, show));
    } else if (!entry) {
      plays.push(buildAutoTaggedPlay(show));
    }
  }

  for (const entry of curation) {
    if (matchedCurationIds.has(entry.id)) continue;
    plays.push(buildUnmatchedCurationPlay(entry));
  }

  return { plays, source: "kopis" };
}

export async function getPlayDetail(id: string): Promise<PlayDetail | null> {
  const entry = curation.find((e) => e.id === id);
  if (entry) {
    const shows = await fetchCurrentShows();
    const show = shows.find((s) => entry.titleMatch.test(s.title)) ?? null;
    const detail = show ? await fetchKopisDetail(show.id) : null;
    return {
      isCurated: true,
      entry,
      show,
      detail,
      displayPeriod: detail
        ? periodOf(detail.startDate, detail.endDate)
        : show
        ? periodOf(show.startDate, show.endDate)
        : "공연 일정 확인 필요",
      title: detail?.title || show?.title || entry.title,
    };
  }

  if (/^PF[A-Z0-9]+$/i.test(id)) {
    const detail = await fetchKopisDetail(id);
    if (!detail) return null;
    return {
      isCurated: false,
      entry: null,
      show: null,
      detail,
      displayPeriod: periodOf(detail.startDate, detail.endDate),
      title: detail.title,
    };
  }

  return null;
}
