export function HeroCarousel() {
  return (
    <section className="relative flex h-[80vh] min-h-[500px] w-full items-center justify-center overflow-hidden bg-fog">
      <div className="z-10 mx-auto max-w-[1200px] px-5 text-center">
        <p className="font-heading text-subheading font-semibold text-ink">
          Yu-Gi-Oh! TCG
        </p>
        <h1 className="mt-2 font-heading text-display text-ink max-md:text-heading-lg">
          Cartas originales
        </h1>
        <p className="mx-auto mt-4 max-w-[560px] text-body text-graphite">
          Las mejores cartas de Trading Card Games al mejor precio. Envíos a
          todo el país.
        </p>
      </div>
    </section>
  );
}
