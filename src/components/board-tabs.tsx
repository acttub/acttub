import Link from "next/link";
import { BOARDS, HOT_BOARD } from "@/lib/boards";
import { cn } from "@/lib/utils";

type Props = {
  currentBoard: string | null;
};

export function BoardTabs({ currentBoard }: Props) {
  return (
    <div className="border-b border-border lg:hidden">
      <nav className="flex gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Tab href="/" label="홈" active={currentBoard === null} />
        <Tab
          href={`/?board=${HOT_BOARD.slug}`}
          label={`${HOT_BOARD.emoji} ${HOT_BOARD.name}`}
          active={currentBoard === HOT_BOARD.slug}
        />
        {BOARDS.map((b) => (
          <Tab
            key={b.slug}
            href={`/?board=${b.slug}`}
            label={`${b.emoji} ${b.name}`}
            active={currentBoard === b.slug}
          />
        ))}
      </nav>
    </div>
  );
}

function Tab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-foreground text-background"
          : "bg-secondary text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
