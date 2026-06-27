import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["10.10.8.253", "10.10.10.56"],
  devIndicators: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb", // Set this to '2mb', '5mb', '10mb', etc.
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/images/:filename",
        destination: `${process.env.IMAGE_API_URL}/:filename`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
