// next.config.ts
import type { NextConfig } from "next"
import withPWA from "next-pwa"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google profile pics
      "cdn.weatherapi.com",        // Weather icons
    ],
  },
  // ✅ Do NOT add `output: "export"` (breaks SSR + PWA)
}

export default withPWA({
  dest: "public",            // Required
  register: true,            // Auto-register service worker
  skipWaiting: true,         // Activate updated SW immediately
  disable: process.env.NODE_ENV === "development", // Only enable in prod
})(nextConfig)
