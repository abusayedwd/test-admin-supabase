import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: removed 'output: export' to enable API routes
  images: {
    unoptimized: true
  }
};

export default nextConfig;
