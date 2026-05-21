"use client";

import { ImageOff } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";

export function RoomPhotoCarousel({
  photos,
  alt,
}: {
  photos: string[];
  alt: string;
}) {
  if (photos.length === 0) {
    return (
      <div
        className="aspect-video rounded-2xl bg-muted flex items-center justify-center text-muted-foreground"
        role="img"
        aria-label="사진이 없습니다"
      >
        <ImageOff className="size-10" aria-hidden />
      </div>
    );
  }

  return (
    <Carousel opts={{ loop: photos.length > 1 }} className="rounded-2xl overflow-hidden">
      <CarouselContent>
        {photos.map((src, i) => (
          <CarouselItem key={i}>
            <div className="aspect-video bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} 사진 ${i + 1}`}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots />
      {photos.length > 1 ? (
        <>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </>
      ) : null}
    </Carousel>
  );
}
