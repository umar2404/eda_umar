import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Vercel uchun: SQLite o'rniga PostgreSQL ishlatiladi
  experimental: {},
};

export default nextConfig;
