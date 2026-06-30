import Link from "next/link";
import { HeroCarousel } from '@/components/features/home/HeroCarousel';
import { TopProductsGrid } from '@/components/features/home/TopProductsGrid';
import { FadeInSection } from '@/components/features/layout/FadeInSection';
import { getTopProducts } from '@/services/product.service';

export default async function HomePage() {
  const products = await getTopProducts(4);

  return (
    <div className="flex flex-col">
      <HeroCarousel images={["/images/justice-hunters.webp", "/images/Yu-Gi-Oh_Banner.webp", "/images/digimon-card-banner.jpg"]} />
      <FadeInSection>
        <section className="mx-auto w-full max-w-[1200px] px-5 py-20">
          <h2 className="font-heading text-heading-sm font-semibold text-ink">
            Productos destacados
          </h2>
          <p className="mt-2 text-body text-graphite">
            Las cartas y boxes más buscados de Yu-Gi-Oh!
          </p>
          <div className="mt-10">
            <TopProductsGrid products={products} />
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/yugioh"
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-8 py-3 text-body-sm font-medium text-snow transition-opacity hover:opacity-90"
            >
              Ver más productos
            </Link>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
