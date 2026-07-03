import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  webpack: (config) => {
    // Suppress Mongoose critical dependency warning
    config.resolve.fallback = { ...config.resolve.fallback, dns: false, net: false, tls: false };
    return config;
  },
  turbopack: {},
};

export default nextConfig;
