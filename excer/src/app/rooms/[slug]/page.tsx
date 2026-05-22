import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft, Clock, MapPin } from "lucide-react";
import { AppHeader } from "@/components/excer/app-header";
import { AttributeTable } from "@/components/excer/attribute-table";
import { LastVerifiedBadge } from "@/components/excer/last-verified-badge";
import { RoomPhotoCarousel } from "@/components/excer/room-photo-carousel";
import { ExternalCTA } from "@/components/excer/external-cta";
import { getRoomBySlug, listAllSlugs } from "@/lib/db/queries";
import { formatPrice, daysSince } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await listAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return { title: "찾을 수 없음" };

  const description = `${room.region} · ${room.sizePyeong}평 · ${formatPrice(room.priceHour)}/시간 · 거울 ${room.mirror ? "있음" : "없음"}`;
  return {
    title: room.name,
    description,
    openGraph: {
      title: `${room.name} | excer`,
      description,
      type: "article",
      images: room.photos[0] ? [room.photos[0]] : undefined,
    },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) notFound();

  const days = daysSince(room.verifiedAt);
  const isStale = days > 60;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: room.name,
    address: { "@type": "PostalAddress", addressLocality: room.region },
    geo: {
      "@type": "GeoCoordinates",
      latitude: room.lat,
      longitude: room.lng,
    },
    telephone: room.phone,
    priceRange: `${formatPrice(room.priceHour)}/h`,
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <AppHeader
        actions={
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ChevronLeft className="size-4" />
            지도로
          </Link>
        }
      />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 pb-32 lg:pb-12">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
          {/* mobile back */}
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-1 text-sm text-muted-foreground mb-3"
          >
            <ChevronLeft className="size-4" />
            뒤로
          </Link>

          <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-10">
            <div className="space-y-6 min-w-0">
              <RoomPhotoCarousel photos={room.photos} alt={room.name} />

              <header className="space-y-1.5">
                <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
                  {room.name}
                </h1>
                <p className="text-sm text-muted-foreground">{room.region}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground pt-2">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-4" />
                    {room.hours.open} ~ {room.hours.close}
                  </span>
                  <a
                    href={`https://map.kakao.com/link/map/${encodeURIComponent(
                      room.name
                    )},${room.lat},${room.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    <MapPin className="size-4" />
                    카카오맵으로 길찾기
                  </a>
                </div>
              </header>

              <section aria-labelledby="attr-heading">
                <h2 id="attr-heading" className="text-base font-semibold mb-3">
                  속성
                </h2>
                <AttributeTable room={room} />
              </section>
            </div>

            {/* Right (desktop) / sticky bottom (mobile) */}
            <aside className="lg:sticky lg:top-24 lg:self-start space-y-4 hidden lg:block">
              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(room.priceHour)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 시간</span>
                </div>
                <LastVerifiedBadge
                  verifiedAt={room.verifiedAt}
                  showWarningCopy
                />
                {isStale ? (
                  <p className="text-xs text-muted-foreground">
                    오래된 정보일 수 있어요. 방문 전 전화로 확인 권장.
                  </p>
                ) : null}
              </div>
              <ExternalCTA
                phone={room.phone}
                bookingUrl={room.bookingUrl}
                className="flex-col"
              />
            </aside>
          </div>

          {/* Mobile inline price + badge */}
          <div className="lg:hidden mt-6 rounded-lg border border-border bg-card p-5 space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(room.priceHour)}
              </span>
              <span className="text-sm text-muted-foreground">/ 시간</span>
            </div>
            <LastVerifiedBadge verifiedAt={room.verifiedAt} showWarningCopy />
          </div>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto">
          <ExternalCTA phone={room.phone} bookingUrl={room.bookingUrl} />
        </div>
      </div>
    </div>
  );
}
