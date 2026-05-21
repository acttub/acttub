import { Phone, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExternalCTA({
  phone,
  bookingUrl,
  className,
}: {
  phone: string;
  bookingUrl?: string | null;
  className?: string;
}) {
  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  return (
    <div className={cn("flex gap-2", className)}>
      <a
        href={telHref}
        className={cn(
          "h-12 rounded-md bg-primary text-primary-foreground text-sm font-semibold",
          "inline-flex items-center justify-center gap-2 active:bg-primary/85 transition",
          bookingUrl ? "flex-[2]" : "flex-1"
        )}
      >
        <Phone className="size-4" />
        전화하기
      </a>
      {bookingUrl ? (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[3] h-12 rounded-md border border-primary text-primary text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-accent/50 transition"
        >
          <ExternalLink className="size-4" />
          예약 페이지로 이동
        </a>
      ) : null}
    </div>
  );
}
