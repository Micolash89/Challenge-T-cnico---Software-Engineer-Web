const siteUrl = "https://duelist-tcg.vercel.app";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "Duelist-tcg",
    alternateName: "La Rata Duelista",
    url: siteUrl,
    logo: `${siteUrl}/images/page-screem.jpg`, // TODO: idealmente un logo cuadrado dedicado, no el screenshot de OG
    description:
      "Tienda de cartas Yu-Gi-Oh! TCG originales en Argentina. Singles, sobres y mazos con envíos a todo el país.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
      addressLocality: "Buenos Aires",
      addressRegion: "Buenos Aires",
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
