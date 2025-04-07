import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ThemeProvider from "@/components/ui/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://kaddu.dev"), // ✅ Replace with your domain
  title: "Kaddu's Portfolio",
  description: "Web Developer | Nautical Science Student | Dreaming Big",
  openGraph: {
    title: "Kaddu's Portfolio",
    description: "Web Developer | Nautical Science Student | Dreaming Big",
    url: "https://kaddu.dev",
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
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider>
          <Navbar aria-label="Main Navigation" />
          <main className="min-h-screen px-4 sm:px-8">{children}</main>
          <footer className="text-center p-4 bg-black/10 dark:bg-white/10 mt-10 text-sm">
            © {new Date().getFullYear()} Kaddu's Portfolio. All rights reserved.
          </footer>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
