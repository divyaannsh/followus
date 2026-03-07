import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/img/mainLogo.png" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Followus" />
        <link rel="apple-touch-icon" href="/img/mainLogo.png" />

        {/* SEO */}
        <meta name="description" content="Followus – Your all-in-one bio link page. Share all your links in one place." />
        <meta property="og:title" content="Followus Link" />
        <meta property="og:description" content="Share all your links in one place with Followus." />
        <meta property="og:type" content="website" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
