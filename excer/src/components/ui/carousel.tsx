"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
  scrollTo: (i: number) => void;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used within Carousel");
  return ctx;
}

type CarouselProps = {
  opts?: CarouselOptions;
  className?: string;
  children?: React.ReactNode;
};

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ opts, className, children }, ref) => {
    const [carouselRef, api] = useEmblaCarousel({ ...opts });
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    const onSelect = React.useCallback((a: CarouselApi) => {
      if (!a) return;
      setSelectedIndex(a.selectedScrollSnap());
      setCanScrollPrev(a.canScrollPrev());
      setCanScrollNext(a.canScrollNext());
    }, []);

    React.useEffect(() => {
      if (!api) return;
      setScrollSnaps(api.scrollSnapList());
      onSelect(api);
      api.on("select", onSelect);
      api.on("reInit", onSelect);
      return () => {
        api.off("select", onSelect);
      };
    }, [api, onSelect]);

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);
    const scrollTo = React.useCallback((i: number) => api?.scrollTo(i), [api]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
          scrollSnaps,
          scrollTo,
        }}
      >
        <div
          ref={ref}
          className={cn("relative", className)}
          aria-roledescription="carousel"
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={cn("flex", className)} {...props} />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    aria-roledescription="slide"
    className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
    {...props}
  />
));
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="이전 사진"
      {...props}
    >
      <ChevronLeft className="size-4" />
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="다음 사진"
      {...props}
    >
      <ChevronRight className="size-4" />
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

function CarouselDots() {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();
  if (scrollSnaps.length <= 1) return null;
  return (
    <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
      {scrollSnaps.map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1}번 사진으로 이동`}
          onClick={() => scrollTo(i)}
          className={cn(
            "size-1.5 rounded-full transition-all",
            i === selectedIndex
              ? "bg-primary w-4"
              : "bg-background/60 hover:bg-background/80"
          )}
        />
      ))}
    </div>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
};
