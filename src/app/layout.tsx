// src/app/layout.tsx
import "../styles/globals.css"; // ✅ Correct relative import
import Navbar from "@/components/layout/Navbar"; // ✅ Updated path
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"), // Replace with your deployed domain
  title: "Kaddu's Portfolio",
  description: "Web Developer | Nautical Science Student | Dreaming Big",
  openGraph: {
    title: "Kaddu's Portfolio",
    description: "Web Developer | Nautical Science Student | Dreaming Big",
    url: "http://localhost:3000",
    type: "website",
    images: [
      {
        url: "/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kaddu's Portfolio Hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaddu's Portfolio",
    description: "Web Developer | Nautical Science Student | Dreaming Big",
    images: ["/hero-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <Navbar />

        <main className="min-h-screen px-4 sm:px-8">{children}</main>

        <footer className="text-center p-4 bg-black/20 mt-10 text-sm">
          © {new Date().getFullYear()} Kaddu's Portfolio. All rights reserved.
        </footer>

        {/* Optional Vercel tools */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
