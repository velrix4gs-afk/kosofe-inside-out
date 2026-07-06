import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Allows any Supabase image URL
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Allows any Unsplash test images
      }
    ],
  },
};

export default nextConfig;