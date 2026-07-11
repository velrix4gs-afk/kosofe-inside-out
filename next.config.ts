import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // For future uploads
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com', // For test images
      },
      // ⬇️ ADD YOUR OLD WORDPRESS DOMAIN HERE ⬇️
      {
        protocol: 'https',
        hostname: 'your-old-wordpress-domain.com', // Replace with your actual old domain
      }
    ],
  },
};

export default nextConfig;