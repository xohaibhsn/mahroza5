import "@/styles/globals.css";
import Head from "next/head";
import NextApp, { type AppContext, type AppProps } from "next/app";
import SiteSettingsProvider from "@/components/SiteSettingsProvider";

export type SiteSeo = {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
};

type AppOwnProps = {
  siteSeo: SiteSeo;
};

const FALLBACK_SEO: SiteSeo = {
  title: "QHC — Quality Health Care | Lahore",
  description:
    "Professional home healthcare services in Lahore. Nursing, physiotherapy, doctor visits, and more.",
  image: "",
  url: "https://qhcare.com.pk",
  siteName: "QHC — Quality Health Care",
};

function absoluteUrl(url: string) {
  const value = String(url || "").trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://qhcare.com.pk${value.startsWith("/") ? value : `/${value}`}`;
}

export default function App({ Component, pageProps, siteSeo }: AppProps & AppOwnProps) {
  const title = siteSeo?.title || FALLBACK_SEO.title;
  const description = siteSeo?.description || FALLBACK_SEO.description;
  const image = absoluteUrl(siteSeo?.image || "");
  const url = siteSeo?.url || FALLBACK_SEO.url;
  const siteName = siteSeo?.siteName || FALLBACK_SEO.siteName;

  return (
    <SiteSettingsProvider>
      <Head>
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:site_name" content={siteName} key="og:site_name" />
        <meta property="og:title" content={title} key="og:title" />
        <meta property="og:description" content={description} key="og:description" />
        <meta property="og:url" content={url} key="og:url" />
        {image ? <meta property="og:image" content={image} key="og:image" /> : null}
        {image ? <meta property="og:image:width" content="1200" key="og:image:width" /> : null}
        {image ? <meta property="og:image:height" content="630" key="og:image:height" /> : null}
        <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} key="twitter:card" />
        <meta name="twitter:title" content={title} key="twitter:title" />
        <meta name="twitter:description" content={description} key="twitter:description" />
        {image ? <meta name="twitter:image" content={image} key="twitter:image" /> : null}
      </Head>
      <Component {...pageProps} />
    </SiteSettingsProvider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);

  let siteSeo: SiteSeo = { ...FALLBACK_SEO };
  try {
    const { getSiteContent } = await import("@/lib/siteData");
    const content = await getSiteContent();
    const image = String(content.og_image_url || content.logo_url || "").trim();
    siteSeo = {
      title: content.site_title || FALLBACK_SEO.title,
      description: content.meta_description || FALLBACK_SEO.description,
      image,
      url: "https://qhcare.com.pk",
      siteName: "QHC — Quality Health Care",
    };
  } catch (error) {
    console.error("App SEO load failed:", error);
  }

  return { ...appProps, siteSeo };
};
