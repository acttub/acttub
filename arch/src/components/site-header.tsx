import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Library, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="group flex items-baseline gap-1.5">
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            act<span className="text-primary">tub</span>
          </span>
          <span className="hidden text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:inline">
            archive
          </span>
        </Link>

        <form action="/search" className="ml-3 flex max-w-md flex-1 items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              placeholder="제목·태그·배역으로 검색"
              className="h-10 w-full rounded-full border border-input bg-secondary/60 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <SignedIn>
            <Button size="sm" variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/me">
                <Library />
                내 보관함
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/upload">
                <Plus />
                <span className="hidden sm:inline">업로드</span>
              </Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm" variant="outline">
                로그인
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
