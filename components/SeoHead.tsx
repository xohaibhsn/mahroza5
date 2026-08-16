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

/** WhatsApp rejects huge PNGs — serve Cloudinary as compact JPG 1200x630 */
export function whatsappSafeImageUrl(url: string) {
  const absolute = absoluteUrl(url);
  if (!absolute) return "";
  const marker = "/image/upload/";
  const idx = absolute.indexOf(marker);
  if (idx === -1) return absolute;
  const before = absolute.slice(0, idx + marker.length);
  const after = absolute.slice(idx + marker.length);
  // Avoid stacking transforms if already present
  if (/^c_fill,w_1200,h_630/.test(after) || after.includes("f_jpg")) {
    return absolute;
  }
  return `${before}c_fill,w_1200,h_630,f_jpg,q_80/${after}`;
}

/** Server-rendered Open Graph / Twitter tags for WhatsApp & social link previews */
export default function SeoHead({
  title = "QHC — Quality Health Care | Lahore",
  description = "Professional home healthcare services in Lahore. Nursing, physiotherapy, doctor visits, and more.",
  image = "",
  url = SITE_URL,
  siteName = SITE_NAME,
}: SiteSeo) {
  const ogImage = whatsappSafeImageUrl(image);

  return (
    <Head>
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:locale" content="en_PK" key="og:locale" />
      <meta property="og:site_name" content={siteName} key="og:site_name" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:url" content={url} key="og:url" />
      {ogImage ? <meta property="og:image" content={ogImage} key="og:image" /> : null}
      {ogImage ? <meta property="og:image:secure_url" content={ogImage} key="og:image:secure" /> : null}
      {ogImage ? <meta property="og:image:type" content="image/jpeg" key="og:image:type" /> : null}
      {ogImage ? <meta property="og:image:width" content="1200" key="og:image:width" /> : null}
      {ogImage ? <meta property="og:image:height" content="630" key="og:image:height" /> : null}
      {ogImage ? <meta property="og:image:alt" content={title} key="og:image:alt" /> : null}
      {ogImage ? <link rel="image_src" href={ogImage} key="image_src" /> : null}
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
