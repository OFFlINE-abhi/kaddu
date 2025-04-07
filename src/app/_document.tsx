import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ✅ Load Jitsi Meet External API for embedding */}
        <script
          src="https://meet.jit.si/external_api.js"
          async
          defer
        />
      </Head>
      <body className="bg-zinc-950 text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
