import Link from "next/link";
import { Sparkles, Theater } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="group flex items-baseline gap-1.5">
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            act<span className="text-primary">tub</span>
          </span>
          <span className="text-[11px] font-medium uppercase text-muted-foreground">
            thea
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="#recommend">
              <Sparkles />
              추천 받기
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="#picks">
              <Theater />
              오늘의 연극
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
