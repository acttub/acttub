import { Map as MapIcon } from "lucide-react";

export function MapPlaceholder() {
  return (
    <div
      role="img"
      aria-label="지도 미리보기 (개발 중)"
      className="absolute inset-0 bg-[linear-gradient(135deg,#f2f4f6_0%,#fafbfc_100%)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MapIcon className="size-8" />
          <span className="text-sm">지도 영역</span>
        </div>
      </div>
    </div>
  );
}
