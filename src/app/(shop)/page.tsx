import { HeroCarousel } from '@/components/features/home/HeroCarousel';
import { TopProductsGrid } from '@/components/features/home/TopProductsGrid';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroCarousel images={["/images/justice-hunters.webp", "/images/Yu-Gi-Oh_Banner.webp", "/images/digimon-card-banner.jpg"]} />
      <section className="mx-auto w-full max-w-[1200px] px-5 py-20">
        <h2 className="font-heading text-heading-sm font-semibold text-ink">
          Productos destacados
        </h2>
        <p className="mt-2 text-body text-graphite">
          Las cartas y boxes más buscados de Yu-Gi-Oh!
        </p>
        <div className="mt-10">
          <TopProductsGrid />
        </div>
      </section>
    </div>
  );
}
