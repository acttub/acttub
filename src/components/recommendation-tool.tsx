"use client";

import type { ElementType } from "react";
import { useMemo, useState } from "react";
import {
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

type Mood = "light" | "deep" | "romance" | "music" | "experimental";
type Companion = "alone" | "date" | "friends" | "family";
type Pace = "calm" | "balanced" | "dynamic";

type Play = {
  id: string;
  title: string;
  venue: string;
  area: string;
  pitch: string;
  tags: string[];
  moods: Mood[];
  companions: Companion[];
  pace: Pace;
  price: string;
};

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

const plays: Play[] = [
  {
    id: "old-letters-night",
    title: "오래된 편지의 밤",
    venue: "대학로 소극장 봄",
    area: "혜화",
    pitch: "조용한 대화와 섬세한 감정선을 따라가는 2인극. 혼자 봐도 생각할 거리가 남습니다.",
    tags: ["감성", "2인극", "여운"],
    moods: ["deep", "romance"],
    companions: ["alone", "date"],
    pace: "calm",
    price: "3만원대",
  },
  {
    id: "after-work-uproar",
    title: "퇴근 후 대소동",
    venue: "아트원씨어터",
    area: "대학로",
    pitch: "빠른 호흡의 코미디와 직장인 공감 포인트가 강한 작품. 친구와 보기 좋습니다.",
    tags: ["코미디", "직장인", "빠른 전개"],
    moods: ["light"],
    companions: ["friends", "date"],
    pace: "dynamic",
    price: "4만원대",
  },
  {
    id: "blue-room-session",
    title: "블루 룸 세션",
    venue: "서촌 스테이지",
    area: "서촌",
    pitch: "라이브 연주와 독백이 만나는 음악극. 잔잔하지만 무대 밀도가 높습니다.",
    tags: ["음악극", "라이브", "분위기"],
    moods: ["music", "deep", "experimental"],
    companions: ["alone", "date", "friends"],
    pace: "balanced",
    price: "5만원대",
  },
  {
    id: "beyond-the-fourth-wall",
    title: "네 번째 벽 너머",
    venue: "프로젝트박스 씨어터",
    area: "성수",
    pitch: "관객과 배우의 거리를 의도적으로 흔드는 실험적인 무대. 새로운 형식을 찾는 분께 맞습니다.",
    tags: ["실험극", "몰입형", "성수"],
    moods: ["experimental"],
    companions: ["alone", "friends"],
    pace: "dynamic",
    price: "3만원대",
  },
  {
    id: "our-family-table",
    title: "우리 집 식탁",
    venue: "정동극장 스튜디오",
    area: "정동",
    pitch: "세대별 대화가 따뜻하게 이어지는 가족 드라마. 부모님과 함께 보기 편합니다.",
    tags: ["가족", "따뜻함", "드라마"],
    moods: ["deep", "light"],
    companions: ["family", "date"],
    pace: "balanced",
    price: "4만원대",
  },
];

function scorePlay(play: Play, mood: Mood, companion: Companion, pace: Pace) {
  let score = 0;
  if (play.moods.includes(mood)) score += 4;
  if (play.companions.includes(companion)) score += 3;
  if (play.pace === pace) score += 2;
  else if (play.pace === "balanced") score += 1;
  return score;
}

export function RecommendationTool() {
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
    [mood, companion, pace],
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
      </div>

      <div id="picks" className="space-y-3">
        {recommendations.map((play, index) => (
          <article key={play.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-primary">추천 {index + 1}</div>
                <h3 className="mt-1 text-xl font-extrabold tracking-tight">{play.title}</h3>
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
                {play.area} · {play.venue}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                이번 주말 추천
              </span>
            </div>
          </article>
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
