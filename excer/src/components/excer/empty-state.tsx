import { Map as MapIcon, SearchX, MapPinOff, Theater } from "lucide-react";
import { cn } from "@/lib/utils";

type IconKey = "map" | "search" | "off" | "theater";

const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  map: MapIcon,
  search: SearchX,
  off: MapPinOff,
  theater: Theater,
};

export function EmptyState({
  title,
  description,
  icon = "search",
  actions,
  className,
}: {
  title: string;
  description?: string;
  icon?: IconKey;
  actions?: React.ReactNode;
  className?: string;
}) {
  const Icon = ICONS[icon];
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        "rounded-2xl bg-card border border-border shadow-sm",
        "px-6 py-8",
        className
      )}
    >
      <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          {description}
        </p>
      ) : null}
      {actions ? <div className="mt-5 flex flex-col gap-2 w-full">{actions}</div> : null}
    </div>
  );
}
