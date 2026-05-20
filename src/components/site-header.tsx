import Link from "next/link";
import { Search } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="게시판 홈"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[15px] font-bold leading-none text-primary-foreground transition-transform group-hover:-rotate-6">
            a
          </span>
          <span className="text-[17px] font-bold tracking-tight text-foreground">
            게시판
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="검색"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button size="sm" variant="ghost">
                로그인
              </Button>
            </SignInButton>
          </Show>
        </div>
      </div>
    </header>
  );
}
