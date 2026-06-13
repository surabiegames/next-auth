import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi untuk package eksternal (Prisma)
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/client-runtime-utils",
    "@prisma/adapter-pg",
  ],
  
  // Konfigurasi untuk mengizinkan gambar dari Unsplash
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;