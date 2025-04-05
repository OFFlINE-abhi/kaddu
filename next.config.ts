import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"], // For Google profile pics (NextAuth)
  },
  // Don't add `output: "export"` if you're using SSR with Firebase Functions
};

export default nextConfig;
