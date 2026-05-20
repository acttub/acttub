import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          <span className="text-muted-foreground">acttub</span>
          <span className="mx-1 text-muted-foreground">/</span>
          <span>커뮤니티</span>
        </Link>
        <div className="flex items-center gap-2">
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
