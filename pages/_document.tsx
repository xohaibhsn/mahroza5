import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#1e3a5f" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-surface antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
