import Head from "next/head";

export type SiteSeo = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
};

const SITE_URL = "https://qhcare.com.pk";
const SITE_NAME = "QHC — Quality Health Care";

function absoluteUrl(url: string) {
  const value = String(url || "").trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

/** Server-rendered Open Graph / Twitter tags for WhatsApp & social link previews */
export default function SeoHead({
  title = "QHC — Quality Health Care | Lahore",
  description = "Professional home healthcare services in Lahore. Nursing, physiotherapy, doctor visits, and more.",
  image = "",
  url = SITE_URL,
  siteName = SITE_NAME,
}: SiteSeo) {
  const ogImage = absoluteUrl(image);

  return (
    <Head>
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:site_name" content={siteName} key="og:site_name" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:url" content={url} key="og:url" />
      {ogImage ? <meta property="og:image" content={ogImage} key="og:image" /> : null}
      {ogImage ? <meta property="og:image:width" content="1200" key="og:image:width" /> : null}
      {ogImage ? <meta property="og:image:height" content="630" key="og:image:height" /> : null}
      <meta
        name="twitter:card"
        content={ogImage ? "summary_large_image" : "summary"}
        key="twitter:card"
      />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
      {ogImage ? <meta name="twitter:image" content={ogImage} key="twitter:image" /> : null}
    </Head>
  );
}

export function seoFromContent(content: {
  site_title?: string;
  meta_description?: string;
  og_image_url?: string;
  logo_url?: string;
}) {
  return {
    title: content.site_title || "QHC — Quality Health Care | Lahore",
    description:
      content.meta_description ||
      "Professional home healthcare services in Lahore. Nursing, physiotherapy, doctor visits, and more.",
    image: String(content.og_image_url || content.logo_url || "").trim(),
    url: SITE_URL,
    siteName: SITE_NAME,
  };
}
