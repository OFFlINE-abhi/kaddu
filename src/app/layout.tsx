import "../styles/globals.css"; // ✅ Global styles remain
import Navbar from "@/components/layout/Navbar";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ThemeProvider from "@/components/ui/ThemeProvider"; // ✅ Dark mode sync
import Head from "next/head"; // ✅ Dynamic metadata handling

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"), // ✅ Update for production
  title: "Kaddu's Portfolio",
  description: "Web Developer | Nautical Science Student | Dreaming Big",
  openGraph: {
    title: "Kaddu's Portfolio",
    description: "Web Developer | Nautical Science Student | Dreaming Big",
    url: "http://localhost:3000",
    type: "website",
    images: [
      { url: "/hero-image.jpg", width: 1200, height: 630, alt: "Kaddu's Portfolio Hero" },
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
      <Head>
        {/* ✅ Dynamic Metadata */}
        <title>Kaddu's Portfolio</title>
        <meta name="description" content="Web Developer | Nautical Science Student | Dreaming Big" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ✅ Ensures smooth dark mode sync + no layout shifts */}
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider>  
          {/* ✅ Navbar (Kept as it is) */}
          <Navbar aria-label="Main Navigation" />

          {/* ✅ Main Content (Kept as it is) */}
          <main className="min-h-screen px-4 sm:px-8">{children}</main>

          {/* ✅ Footer (Kept as it is) */}
          <footer className="text-center p-4 bg-black/10 dark:bg-white/10 mt-10 text-sm">
            © {new Date().getFullYear()} Kaddu's Portfolio. All rights reserved.
          </footer>

          {/* ✅ Performance & Analytics (Kept as it is) */}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
