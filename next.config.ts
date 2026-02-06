import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/command-center',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
