"use client";

import type { ElementType } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Drama,
  Heart,
  Home,
  Laugh,
  MapPin,
  Moon,
  Music2,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mood, Companion, Pace } from "@/data/curation";
import type { EnrichedPlay } from "@/lib/kopis";

const moods: Array<{ id: Mood; label: string; icon: ElementType }> = [
  { id: "light", label: "가볍게 웃고 싶어요", icon: Laugh },
  { id: "deep", label: "긴 여운이 좋아요", icon: Moon },
  { id: "romance", label: "관계 이야기가 좋아요", icon: Heart },
  { id: "music", label: "음악이 있으면 좋아요", icon: Music2 },
  { id: "experimental", label: "낯선 형식도 좋아요", icon: Sparkles },
];

const companions: Array<{ id: Companion; label: string; icon: ElementType }> = [
  { id: "alone", label: "혼자", icon: Drama },
  { id: "date", label: "데이트", icon: Heart },
  { id: "friends", label: "친구와", icon: Users },
  { id: "family", label: "가족과", icon: Home },
];

const paceOptions: Array<{ id: Pace; label: string }> = [
  { id: "calm", label: "차분히" },
  { id: "balanced", label: "적당히" },
  { id: "dynamic", label: "빠르게" },
];

function scorePlay(play: EnrichedPlay, mood: Mood, companion: Companion, pace: Pace) {
  let score = 0;
  if (play.moods.includes(mood)) score += 4;
  if (play.companions.includes(companion)) score += 3;
  if (play.pace === pace) score += 2;
  else if (play.pace === "balanced") score += 1;
  if (play.isLive) score += 1;
  if (play.isCurated) score += 2;
  return score;
}

type Props = {
  plays: EnrichedPlay[];
  source: "kopis" | "fallback";
};

export function RecommendationTool({ plays, source }: Props) {
  const [mood, setMood] = useState<Mood>("deep");
  const [companion, setCompanion] = useState<Companion>("date");
  const [pace, setPace] = useState<Pace>("balanced");

  const recommendations = useMemo(
    () =>
      [...plays]
        .sort((a, b) => {
          const diff = scorePlay(b, mood, companion, pace) - scorePlay(a, mood, companion, pace);
          if (diff !== 0) return diff;
          return a.title.localeCompare(b.title, "ko");
        })
        .slice(0, 3),
    [plays, mood, companion, pace],
  );

  return (
    <section id="recommend" className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <Search className="size-4" />
          취향 입력
        </div>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
          오늘 보고 싶은 무대의 느낌을 골라주세요.
        </h2>

        <div className="mt-6 space-y-6">
          <ChoiceGroup title="분위기" items={moods} value={mood} onChange={setMood} />
          <ChoiceGroup title="동행" items={companions} value={companion} onChange={setCompanion} />

          <div>
            <div id="pace-label" className="mb-2 text-sm font-bold">전개 속도</div>
            <div
              role="radiogroup"
              aria-labelledby="pace-label"
              className="grid grid-cols-3 gap-2 rounded-xl bg-secondary p-1"
            >
              {paceOptions.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={pace === id}
                  onClick={() => setPace(id)}
                  className={cn(
                    "h-10 rounded-lg text-sm font-semibold transition",
                    pace === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs leading-5 text-muted-foreground">
          {source === "kopis"
            ? "공연 정보는 KOPIS(공연예술통합전산망) 데이터를 매일 갱신해 반영합니다."
            : "현재 KOPIS 실시간 데이터 연결 전입니다. 큐레이션 작품을 우선 보여드리고 있어요."}
        </p>
      </div>

      <div id="picks" className="space-y-3">
        {recommendations.map((play, index) => (
          <Link
            key={play.id}
            href={`/plays/${play.id}`}
            className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <article>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary">
                    추천 {index + 1}
                    {play.isLive && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                        공연중
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 inline-flex items-center gap-1.5 text-xl font-extrabold tracking-tight">
                    {play.title}
                    <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-primary" />
                  </h3>
                </div>
                <div className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  {play.price}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{play.pitch}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {play.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {play.area ? `${play.area} · ` : ""}{play.venue}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {play.period}
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ChoiceGroup<T extends string>({
  title,
  items,
  value,
  onChange,
}: {
  title: string;
  items: Array<{ id: T; label: string; icon: ElementType }>;
  value: T;
  onChange: (value: T) => void;
}) {
  const labelId = `choice-group-${title}`;

  return (
    <div>
      <div id={labelId} className="mb-2 text-sm font-bold">{title}</div>
      <div role="radiogroup" aria-labelledby={labelId} className="grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = value === item.id;

          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-xl border px-3 text-left text-sm font-semibold transition",
                selected
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
