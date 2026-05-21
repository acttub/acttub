import { ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysSince } from "@/lib/utils";

export function LastVerifiedBadge({
  verifiedAt,
  className,
  showWarningCopy = false,
}: {
  verifiedAt: Date | string;
  className?: string;
  showWarningCopy?: boolean;
}) {
  const days = daysSince(verifiedAt);
  // 임계치: 0~30 정상, 31~60 주의, 61+ 경고  (visual-spec §7.4 / VS5)
  const level = days <= 30 ? "ok" : days <= 60 ? "warn" : "danger";

  const Icon = level === "ok" ? ShieldCheck : AlertCircle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs",
        level === "ok" &&
          "bg-card text-muted-foreground border-border",
        level === "warn" &&
          "bg-accent text-accent-foreground border-accent-foreground/20",
        level === "danger" &&
          "bg-destructive/10 text-destructive border-destructive/30",
        className
      )}
    >
      <Icon className="size-3" aria-hidden />
      {days}일 전 확인
      {showWarningCopy && level === "danger" ? (
        <span className="ml-1">— 가격 변동 가능</span>
      ) : null}
    </span>
  );
}
