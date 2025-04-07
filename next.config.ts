import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google profile pics
      "cdn.weatherapi.com",        // ✅ Weather icons
    ],
  },
  // Don't add `output: "export"` if you're using SSR with Firebase Functions
};

export default nextConfig;
