import Link from "next/link";
import { AppHeader } from "@/components/excer/app-header";

export default function NotFound() {
  return (
    <div className="flex flex-col h-dvh">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4" aria-hidden>
            🎭
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            요청하신 연습실을 찾을 수 없어요
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            잠깐 사라졌거나, 등록이 해제됐을 수 있어요.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center mt-6 h-11 px-5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
          >
            지도로 돌아가기 →
          </Link>
        </div>
      </main>
    </div>
  );
}
