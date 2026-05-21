import { Check, Minus, Volume2, Sun, Mic, BookOpenText } from "lucide-react";
import type { Room } from "@/lib/db";
import { cn } from "@/lib/utils";

const SOUNDPROOF_LABEL: Record<Room["soundproof"], string> = {
  strong: "강",
  medium: "중",
  weak: "약",
};

const LIGHTING_LABEL: Record<Room["lighting"], string> = {
  bright: "밝음",
  normal: "보통",
  dim: "어두움",
  none: "없음",
};

type Row = {
  label: string;
  value: React.ReactNode;
  muted?: boolean;
};

function YesNo({ on }: { on: boolean }) {
  if (on)
    return (
      <span className="inline-flex items-center gap-1.5">
        <Check className="size-4 text-primary" aria-hidden />
        있음
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <Minus className="size-4" aria-hidden />
      없음
    </span>
  );
}

export function AttributeTable({ room }: { room: Room }) {
  const rows: Row[] = [
    { label: "거울", value: <YesNo on={room.mirror} />, muted: !room.mirror },
    {
      label: "방음",
      value: (
        <span className="inline-flex items-center gap-1.5">
          <Volume2 className="size-4" aria-hidden />
          {SOUNDPROOF_LABEL[room.soundproof]}
        </span>
      ),
    },
    { label: "평수", value: `${room.sizePyeong}평` },
    {
      label: "조명",
      value: (
        <span className="inline-flex items-center gap-1.5">
          <Sun className="size-4" aria-hidden />
          {LIGHTING_LABEL[room.lighting]}
        </span>
      ),
      muted: room.lighting === "none",
    },
    {
      label: "대본대",
      value: (
        <span className="inline-flex items-center gap-1.5">
          <BookOpenText className="size-4" aria-hidden />
          {room.scriptstand ? "있음" : <span className="text-muted-foreground">없음</span>}
        </span>
      ),
      muted: !room.scriptstand,
    },
    {
      label: "마이크",
      value: (
        <span className="inline-flex items-center gap-1.5">
          <Mic className="size-4" aria-hidden />
          {room.microphone ? "있음" : <span className="text-muted-foreground">없음</span>}
        </span>
      ),
      muted: !room.microphone,
    },
  ];

  return (
    <dl className="grid grid-cols-[80px_1fr] divide-y divide-border rounded-lg border border-border overflow-hidden">
      {rows.map((row, i) => (
        <div key={row.label} className="contents">
          <dt
            className={cn(
              "px-4 py-3 text-sm text-muted-foreground bg-muted/50",
              i > 0 && "border-t border-border"
            )}
          >
            {row.label}
          </dt>
          <dd
            className={cn(
              "px-4 py-3 text-sm font-medium border-l border-border",
              i > 0 && "border-t",
              row.muted ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
