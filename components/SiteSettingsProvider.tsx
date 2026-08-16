import Head from "next/head";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SiteContent } from "@/lib/siteTypes";

type SiteSettingsContextValue = {
  settings: SiteContent;
  loading: boolean;
  refresh: () => Promise<void>;
};

const defaultSettings: SiteContent = {
  hero_heading: "Care You Can Trust",
  hero_subheading: "",
  hero_button_text: "Book Appointment",
  about_heading: "Care you can trust, closer to home",
  about_description: "",
  about_text: "",
  why_point_1: "Qualified Healthcare Professionals",
  why_point_2: "24/7 Availability Across Lahore",
  why_point_3: "Patient-Centric Home Care",
  why_point_4: "Seamless Continuum of Care",
  stat_patients: "1000+",
  stat_services: "8",
  stat_availability: "24/7",
  stat_location: "Lahore",
  phone: "+92 3004334065",
  whatsapp: "+92 3004334065",
  address1: "817, Al Hafeez Shopping Mall, Gulberg, Lahore",
  address2: "Office #5, Bismillah Plaza, Defense Road, Lahore",
  email: "info@qhcare.com.pk",
  logo_url: "",
  favicon_url: "",
  site_title: "QHC — Quality Health Care | Lahore",
  meta_description:
    "QHC provides professional home nursing, physiotherapy, doctor visits, diagnostics, elderly care, and baby care across Lahore, Pakistan.",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  tiktok_url: "",
};

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: defaultSettings,
  loading: true,
  refresh: async () => undefined,
});

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export default function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteContent>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/site-content");
      const data = await res.json();
      if (!res.ok) return;

      // Prefer new nested settings shape, fall back to flat data
      const settingsBlock = data.settings || {};
      const flat = data.data || {};
      setSettings((prev) => ({
        ...prev,
        ...flat,
        logo_url: settingsBlock.logo_url ?? flat.logo_url ?? prev.logo_url,
        favicon_url: settingsBlock.favicon_url ?? flat.favicon_url ?? prev.favicon_url,
        phone: settingsBlock.phone ?? flat.phone ?? prev.phone,
        whatsapp: settingsBlock.whatsapp ?? flat.whatsapp ?? prev.whatsapp,
        address1: settingsBlock.address1 ?? flat.address1 ?? prev.address1,
        address2: settingsBlock.address2 ?? flat.address2 ?? prev.address2,
        email: settingsBlock.email ?? flat.email ?? prev.email,
        site_title: settingsBlock.site_title ?? flat.site_title ?? prev.site_title,
        meta_description:
          settingsBlock.meta_description ?? flat.meta_description ?? prev.meta_description,
        facebook_url: settingsBlock.facebook_url ?? flat.facebook_url ?? prev.facebook_url,
        instagram_url: settingsBlock.instagram_url ?? flat.instagram_url ?? prev.instagram_url,
        twitter_url: settingsBlock.twitter_url ?? flat.twitter_url ?? prev.twitter_url,
        tiktok_url: settingsBlock.tiktok_url ?? flat.tiktok_url ?? prev.tiktok_url,
        hero_heading: data.hero?.heading ?? flat.hero_heading ?? prev.hero_heading,
        hero_subheading: data.hero?.subheading ?? flat.hero_subheading ?? prev.hero_subheading,
        hero_button_text: data.hero?.button_text ?? flat.hero_button_text ?? prev.hero_button_text,
        about_heading: data.about?.heading ?? flat.about_heading ?? prev.about_heading,
        about_description:
          data.about?.description ?? flat.about_description ?? prev.about_description,
        about_text: data.about?.description ?? flat.about_text ?? prev.about_text,
        stat_patients: data.stats?.patients ?? flat.stat_patients ?? prev.stat_patients,
        stat_services: data.stats?.services ?? flat.stat_services ?? prev.stat_services,
        stat_availability:
          data.stats?.availability ?? flat.stat_availability ?? prev.stat_availability,
        stat_location: data.stats?.city ?? flat.stat_location ?? prev.stat_location,
      }));
    } catch (error) {
      console.error("Failed to load site settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const faviconHref = String(settings.favicon_url || "").trim() || "/favicon.png";

  useEffect(() => {
    const applyIcon = (rel: string, href: string, type?: string) => {
      let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      if (type) link.type = type;
      // Cache-bust so browsers pick up admin updates
      link.href = href.includes("?") ? `${href}&v=${Date.now()}` : `${href}?v=${Date.now()}`;
    };

    applyIcon("icon", faviconHref, faviconHref.endsWith(".png") || faviconHref.includes("/image/") ? "image/png" : undefined);
    applyIcon("shortcut icon", faviconHref);
    applyIcon("apple-touch-icon", faviconHref);
  }, [faviconHref]);

  const value = useMemo(
    () => ({
      settings,
      loading,
      refresh,
    }),
    [settings, loading, refresh]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      <Head>
        <title>{settings.site_title}</title>
        <meta name="description" content={settings.meta_description} />
        <link rel="icon" type="image/png" href={faviconHref} key={`icon-${faviconHref}`} />
        <link rel="shortcut icon" href={faviconHref} key={`shortcut-${faviconHref}`} />
        <link rel="apple-touch-icon" href={faviconHref} key={`apple-${faviconHref}`} />
      </Head>
      {children}
    </SiteSettingsContext.Provider>
  );
}
