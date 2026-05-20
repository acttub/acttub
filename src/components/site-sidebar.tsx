import Link from "next/link";
import { Home } from "lucide-react";
import { BOARDS, HOT_BOARD } from "@/lib/boards";
import { cn } from "@/lib/utils";

type Props = {
  currentBoard: string | null;
};

export function SiteSidebar({ currentBoard }: Props) {
  return (
    <aside className="hidden w-56 flex-shrink-0 lg:block">
      <nav className="sticky top-20 space-y-6 pr-4">
        <div className="space-y-0.5">
          <SidebarLink
            href="/"
            icon={<Home className="h-4 w-4" />}
            label="홈"
            active={currentBoard === null}
          />
          <SidebarLink
            href={`/?board=${HOT_BOARD.slug}`}
            icon={<span aria-hidden>{HOT_BOARD.emoji}</span>}
            label={HOT_BOARD.name}
            active={currentBoard === HOT_BOARD.slug}
          />
        </div>
        <div className="space-y-0.5">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            게시판
          </p>
          {BOARDS.map((b) => (
            <SidebarLink
              key={b.slug}
              href={`/?board=${b.slug}`}
              icon={<span aria-hidden>{b.emoji}</span>}
              label={b.name}
              active={currentBoard === b.slug}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-secondary font-semibold text-foreground"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
      )}
    >
      <span className="flex h-5 w-5 items-center justify-center text-[15px]">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
