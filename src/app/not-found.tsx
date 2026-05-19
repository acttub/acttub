import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <div className="text-xs font-bold text-primary">404</div>
      <h1 className="text-3xl font-extrabold tracking-tight">
        찾으시는 페이지가 없어요
      </h1>
      <p className="text-sm leading-6 text-muted-foreground">
        주소가 변경되었거나 더 이상 제공되지 않는 페이지입니다.
      </p>
      <Button asChild size="lg">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </section>
  );
}
