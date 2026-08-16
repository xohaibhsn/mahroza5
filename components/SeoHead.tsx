import Head from "next/head";
import { publicOgImageUrl, whatsappSafeImageUrl } from "@/lib/ogImage";

export type SiteSeo = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
};

const SITE_URL = "https://qhcare.com.pk";
const SITE_NAME = "QHC - Quality Health Care";

/** Strip fancy dashes/quotes that some crawlers mishandle */
export function plainText(value: string) {
  return String(value || "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export { whatsappSafeImageUrl } from "@/lib/ogImage";

/** Server-rendered Open Graph / Twitter tags for WhatsApp & social link previews */
export default function SeoHead({
  title = "QHC - Quality Health Care | Lahore",
  description = "Professional home healthcare services in Lahore. Nursing, physiotherapy, doctor visits, and more.",
  image = "",
  url = SITE_URL,
  siteName = SITE_NAME,
}: SiteSeo) {
  const safeTitle = plainText(title);
  const safeDescription = plainText(description);
  const safeSiteName = plainText(siteName);
  const hasImage = Boolean(String(image || "").trim());
  const ogImage = publicOgImageUrl(hasImage) || whatsappSafeImageUrl(image);
  const pageUrl = plainText(url) || SITE_URL;

  return (
    <Head>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} key="meta-description" />
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:locale" content="en_US" key="og:locale" />
      <meta property="og:site_name" content={safeSiteName} key="og:site_name" />
      <meta property="og:title" content={safeTitle} key="og:title" />
      <meta property="og:description" content={safeDescription} key="og:description" />
      <meta property="og:url" content={pageUrl} key="og:url" />
      {ogImage ? <meta property="og:image" content={ogImage} key="og:image" /> : null}
      {ogImage ? (
        <meta property="og:image:secure_url" content={ogImage} key="og:image:secure" />
      ) : null}
      {ogImage ? <meta property="og:image:type" content="image/jpeg" key="og:image:type" /> : null}
      {ogImage ? <meta property="og:image:width" content="1200" key="og:image:width" /> : null}
      {ogImage ? <meta property="og:image:height" content="630" key="og:image:height" /> : null}
      {ogImage ? <meta property="og:image:alt" content={safeTitle} key="og:image:alt" /> : null}
      {ogImage ? <link rel="image_src" href={ogImage} key="image_src" /> : null}
      <meta
        name="twitter:card"
        content={ogImage ? "summary_large_image" : "summary"}
        key="twitter:card"
      />
      <meta name="twitter:title" content={safeTitle} key="twitter:title" />
      <meta name="twitter:description" content={safeDescription} key="twitter:description" />
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
    title: plainText(content.site_title || "QHC - Quality Health Care | Lahore"),
    description: plainText(
      content.meta_description ||
        "Professional home healthcare services in Lahore. Nursing, physiotherapy, doctor visits, and more."
    ),
    image: String(content.og_image_url || content.logo_url || "").trim(),
    url: SITE_URL,
    siteName: SITE_NAME,
  };
}
