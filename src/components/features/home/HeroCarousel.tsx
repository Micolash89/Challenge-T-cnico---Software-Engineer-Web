'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { HERO_CAROUSEL_IMAGES } from '@/constants/carousel.constants';
import { variantsNormalUpDown } from '@/lib/animation-variants';

interface HeroCarouselProps {
  images?: string[];
}

export function HeroCarousel({
  images = HERO_CAROUSEL_IMAGES,
}: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const count = images.length;

  // Autoplay
  useEffect(() => {
    if (!api || count <= 1) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, count]);

  // Sync active dot
  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // Fallback when there are no images yet
  if (count === 0) {
    return (
      <section className="relative flex h-[400px] w-full items-center justify-center overflow-hidden bg-muted">
        <div className="mx-auto max-w-[1200px] px-5 text-center">
          <h1 className="text-3xl font-bold text-foreground md:text-5xl">
            Yu-Gi-Oh! TCG
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-muted-foreground">
            Las mejores cartas de Trading Card Games al mejor precio. Envíos a
            todo el país.
          </p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      variants={variantsNormalUpDown}
      initial="hidden"
      animate="visible"
      className="relative mb-8"
    >
      <Carousel
        opts={{ loop: true, align: 'start' }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {images.map((src, index) => (
            <CarouselItem key={src} className="pl-0">
              <div className="relative h-[400px] w-full">
                <Image
                  src={src}
                  alt={`Imagen destacada ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {count > 1 && (
          <>
            <CarouselPrevious className="left-4 z-20 size-10 cursor-pointer border-0 bg-background/70 backdrop-blur hover:bg-background" />
            <CarouselNext className="right-4 z-20 size-10 cursor-pointer border-0 bg-background/70 backdrop-blur hover:bg-background" />

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Ir a la imagen ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    index === current
                      ? 'w-6 bg-background'
                      : 'w-2 bg-background/60 hover:bg-background/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </Carousel>
    </motion.section>
  );
}
