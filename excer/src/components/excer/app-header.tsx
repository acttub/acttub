import Link from "next/link";
import { cn } from "@/lib/utils";

export function AppHeader({ actions }: { actions?: React.ReactNode }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-14 lg:h-16",
        "bg-background/80 backdrop-blur border-b border-border",
        "flex items-center justify-between px-4 lg:px-6"
      )}
    >
      <Link
        href="/"
        className="text-base font-semibold tracking-tight text-foreground"
        aria-label="excer 홈으로"
      >
        excer<span className="text-primary">.</span>
      </Link>
      <div className="flex items-center gap-2">{actions}</div>
    </header>
  );
}
