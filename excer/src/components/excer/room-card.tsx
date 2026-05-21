import Link from "next/link";
import { ChevronRight, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import type { Room } from "@/lib/db";

const SOUNDPROOF_SHORT: Record<Room["soundproof"], string> = {
  strong: "방음 강",
  medium: "방음 중",
  weak: "방음 약",
};

export function RoomCard({
  room,
  active = false,
  onHover,
}: {
  room: Room;
  active?: boolean;
  onHover?: (slug: string | null) => void;
}) {
  const chips = [
    `${room.sizePyeong}평`,
    room.mirror ? "🪞 거울" : null,
    SOUNDPROOF_SHORT[room.soundproof],
  ].filter(Boolean) as string[];

  const hasPhoto = room.photos.length > 0;

  return (
    <Link
      href={`/rooms/${room.slug}`}
      data-room-id={room.id}
      data-active={active}
      onMouseEnter={() => onHover?.(room.slug)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "group flex gap-3 p-3 rounded-lg border border-border bg-card",
        "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        active && "ring-2 ring-ring ring-offset-2"
      )}
    >
      <div className="size-20 lg:size-[88px] shrink-0 rounded-md bg-muted overflow-hidden flex items-center justify-center">
        {hasPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={room.photos[0]}
            alt=""
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <ImageOff className="size-5 text-muted-foreground" aria-hidden />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-foreground truncate">
          {room.name}
        </h3>
        <p className="text-xs text-muted-foreground truncate">{room.region}</p>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {chips.slice(0, 3).map((c) => (
            <Badge
              key={c}
              variant="secondary"
              className="text-xs font-normal py-0.5"
            >
              {c}
            </Badge>
          ))}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-base font-bold text-foreground">
            {formatPrice(room.priceHour)}
          </span>
          <span className="text-xs text-muted-foreground">/시간</span>
        </div>
      </div>

      <ChevronRight
        className="size-4 text-muted-foreground self-center shrink-0"
        aria-hidden
      />
    </Link>
  );
}
