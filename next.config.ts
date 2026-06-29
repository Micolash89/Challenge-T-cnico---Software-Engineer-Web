import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      new URL(
        "https://52f4e29a8321344e30ae-0f55c9129972ac85d6b1f4e703468e6b.ssl.cf2.rackcdn.com/products/pictures/**"
      ),
      new URL("https://product-images.tcgplayer.com/**"),
      new URL("https://img.yugioh-card.com/**"),
    ],
  },
};

export default nextConfig;
