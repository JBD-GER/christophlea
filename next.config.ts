import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
    qualities: [84, 85, 86, 88, 90, 92],
  },
  poweredByHeader: false,
};

export default nextConfig;
