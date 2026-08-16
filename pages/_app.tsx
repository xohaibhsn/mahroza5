import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import SiteSettingsProvider from "@/components/SiteSettingsProvider";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/site-content");
        const data = await res.json();
        const faviconUrl = data?.settings?.favicon_url;
        if (faviconUrl) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = faviconUrl;
        }
      } catch {
        // keep default favicon
      }
    })();
  }, []);

  return (
    <SiteSettingsProvider>
      <Component {...pageProps} />
    </SiteSettingsProvider>
  );
}
