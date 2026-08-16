import { company } from "@/lib/constants";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { phoneToTel, phoneToWhatsApp } from "@/lib/siteDataClient";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12H16l-.4 3h-2.3v7A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      </svg>
    ),
  },
];

export default function TopBar() {
  const { settings } = useSiteSettings();
  const phone = settings.phone || company.phone;
  const addressLine =
    settings.address1 || settings.address2
      ? [settings.address1, settings.address2].filter(Boolean).join(" · ")
      : "Gulberg & Defense Road, Lahore";

  return (
    <div className="hidden border-b border-slate-200 bg-white text-xs text-slate-600 md:block">
      <div className="container-page flex items-center justify-between py-2.5">
        <div className="flex items-center gap-6">
          <a
            href={`tel:${phoneToTel(phone)}`}
            className="inline-flex items-center gap-2 transition hover:text-primary"
          >
            <svg className="h-3.5 w-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.3a1 1 0 01.95.68l1.2 3.5a1 1 0 01-.3 1.1L8.9 10.3a11 11 0 005 5l1.9-1.3a1 1 0 011.1-.1l3.5 1.2a1 1 0 01.7.95V19a2 2 0 01-2 2h-.5C9.6 21 3 14.4 3 6.5V6a1 1 0 010-1z"
              />
            </svg>
            <span className="font-medium text-primary">{phone}</span>
          </a>

          <div className="inline-flex items-center gap-2">
            <svg className="h-3.5 w-3.5 shrink-0 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.7 16.7A8 8 0 1 0 6.3 16.7L12 22l5.7-5.3z"
              />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="font-medium text-primary">{addressLine}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-secondary transition hover:bg-secondary hover:text-white"
            >
              {item.icon}
            </a>
          ))}
          <a
            href={phoneToWhatsApp(settings.whatsapp || phone)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-secondary transition hover:bg-secondary hover:text-white"
          >
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.7 15l-1.1 4 4.1-1.1A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.7 12.4l.3.5-.4.3a8 8 0 0 1-11.5-1.4l-.4-.5.1-.6.7-2.5-.5-.4A8 8 0 0 1 12 4zm4.3 9.6c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.1-.4 0-.1 0-.3-.1-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 2.3.9 2.3.6 2.7.6.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1-.1-.1-.2-.1-.4-.2z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
