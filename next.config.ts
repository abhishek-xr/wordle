import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/api/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
