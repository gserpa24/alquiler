import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/terms',
        destination: '/legal/terminos',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/legal/privacidad',
        permanent: true,
      },
      {
        source: '/libro-de-reclamaciones',
        destination: '/reclamaciones',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
