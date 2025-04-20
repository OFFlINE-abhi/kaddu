import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ✅ Jitsi Meet External API */}
        <script
          src="https://meet.jit.si/external_api.js"
          async
          defer
        />

        {/* ✅ PWA Manifest & Favicon */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />

        {/* ✅ Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />

        {/* ✅ Adaptive Theme Colors */}
        <meta name="msapplication-TileColor" content="#000000" />

        {/* ✅ Web App Meta Tags */}
        <meta name="application-name" content="Kaddu Portfolio" />
        <meta name="apple-mobile-web-app-title" content="Kaddu Portfolio" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-TileColor" content="#000000" /> {/* Removed duplicate */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <body className="bg-zinc-950 text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
