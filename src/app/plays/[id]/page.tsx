import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  ExternalLink,
  MapPin,
  Ticket,
  UserCheck,
  Users,
} from "lucide-react";
import { curation } from "@/data/curation";
import { getPlayDetail } from "@/lib/kopis";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return curation.map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const entry = curation.find((e) => e.id === id);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.pitch,
  };
}

export default async function PlayDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getPlayDetail(id);
  if (!data) notFound();

  const { entry, show, detail, displayPeriod } = data;
  const poster = detail?.poster || show?.poster || null;
  const venue = detail?.venue || show?.venue || entry.defaultVenue;
  const area = detail?.area || show?.area || entry.defaultArea;
  const genre = detail?.genre || "";
  const runtime = detail?.runtime?.trim() ?? "";
  const ageGuide = detail?.ageGuide?.trim() ?? "";
  const producer = detail?.producer?.trim() ?? "";
  const priceGuide = detail?.priceGuide?.trim() ?? "";
  const story = detail?.story?.trim() ?? "";
  const cast = detail?.cast?.trim() ?? "";
  const crew = detail?.crew?.trim() ?? "";
  const relatedUrl = detail?.relatedUrl?.trim() ?? "";
  const isLive = Boolean(show);

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          추천 화면으로
        </Link>
      </div>

      <header className="grid gap-8 md:grid-cols-[260px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-secondary">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt={`${entry.title} 포스터`}
              className="aspect-[2/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center text-xs font-semibold text-muted-foreground">
              포스터 준비 중
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-primary">
            {isLive ? (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] text-primary-foreground">
                공연중
              </span>
            ) : (
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-secondary-foreground">
                큐레이션
              </span>
            )}
            {genre && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] text-accent-foreground">
                {genre}
              </span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {detail?.title || show?.title || entry.title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{entry.pitch}</p>

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <MetaRow icon={MapPin} label="공연장">
              {area ? `${area} · ${venue}` : venue}
            </MetaRow>
            <MetaRow icon={CalendarDays} label="공연 기간">
              {displayPeriod}
            </MetaRow>
            {runtime && (
              <MetaRow icon={Clock} label="러닝타임">
                {runtime}
              </MetaRow>
            )}
            {ageGuide && (
              <MetaRow icon={UserCheck} label="관람 연령">
                {ageGuide}
              </MetaRow>
            )}
            {producer && (
              <MetaRow icon={Users} label="제작">
                {producer}
              </MetaRow>
            )}
            {!detail && (
              <MetaRow icon={Ticket} label="예상 가격대">
                {entry.priceHint}
              </MetaRow>
            )}
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {relatedUrl && (
            <div className="mt-6">
              <Button asChild>
                <a href={relatedUrl} target="_blank" rel="noreferrer">
                  <ExternalLink />
                  예매처 / 공식 정보 보기
                </a>
              </Button>
            </div>
          )}
        </div>
      </header>

      <section className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-extrabold tracking-tight">작품 소개</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-foreground">
              {entry.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {entry.highlights.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {entry.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-semibold text-secondary-foreground"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {story && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-extrabold tracking-tight">줄거리 (KOPIS 등록 기준)</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {story}
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          {(cast || crew) && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-extrabold tracking-tight">출연 / 제작진</h2>
              {cast && (
                <div className="mt-3">
                  <div className="text-xs font-bold text-primary">출연</div>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-foreground">
                    {cast}
                  </p>
                </div>
              )}
              {crew && (
                <div className="mt-4">
                  <div className="text-xs font-bold text-primary">제작진</div>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-foreground">
                    {crew}
                  </p>
                </div>
              )}
            </div>
          )}

          {priceGuide && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-extrabold tracking-tight">가격 안내</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground">
                {priceGuide}
              </p>
            </div>
          )}

          {!detail && (
            <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-sm leading-6 text-muted-foreground">
              현재 이번 주 서울 공연 일정에서 매칭된 회차가 없어 큐레이션 정보로 보여드리고 있어요.
              실시간 일정·캐스팅·가격은 KOPIS에 등록된 시즌이 열리는 시점부터 자동으로 반영됩니다.
            </div>
          )}
        </aside>
      </section>
    </article>
  );
}

function MetaRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-secondary/50 px-3 py-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="text-sm font-semibold text-foreground">{children}</div>
      </div>
    </div>
  );
}
