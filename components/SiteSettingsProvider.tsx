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
  about_text: "",
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
      if (res.ok && data.data) {
        setSettings((prev) => ({ ...prev, ...data.data }));
      }
    } catch (error) {
      console.error("Failed to load site settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const href = settings.favicon_url || "/favicon.ico";
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [settings.favicon_url]);

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
        <link rel="icon" href={settings.favicon_url || "/favicon.ico"} />
      </Head>
      {children}
    </SiteSettingsContext.Provider>
  );
}
