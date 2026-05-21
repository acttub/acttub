import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { RecommendationTool } from "@/components/recommendation-tool";
import { Button } from "@/components/ui/button";
import { getEnrichedPlays } from "@/lib/kopis";

export default async function HomePage() {
  const { plays, source } = await getEnrichedPlays();

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src="/theater-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,251,252,0.96)_0%,rgba(250,251,252,0.88)_42%,rgba(250,251,252,0.28)_100%)]" />
        </div>

        <div className="relative mx-auto grid min-h-[520px] max-w-6xl items-center px-4 py-14 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 text-xs font-bold text-primary shadow-sm">
              <Sparkles className="size-3.5" />
              acttub theater recommendation
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              취향을 말하면
              <br />
              오늘 볼 연극을 골라드려요.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              분위기, 동행, 전개 속도를 바탕으로 지금 관람하기 좋은 연극을 빠르게 추려주는
              acttub의 하위 프로젝트입니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Button asChild size="lg">
                <Link href="#recommend">
                  취향 입력하기
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#picks">
                  <MessageCircle />
                  추천 예시 보기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <RecommendationTool plays={plays} source={source} />
    </>
  );
}
