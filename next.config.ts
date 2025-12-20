import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      html2canvas: './node_modules/html2canvas-pro',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
};

export default nextConfig;
