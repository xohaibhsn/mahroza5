import { phoneToWhatsApp } from "@/lib/siteDataClient";

type SocialLinksProps = {
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
  whatsapp?: string;
  className?: string;
  iconClassName?: string;
};

const icons = {
  Facebook: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12H16l-.4 3h-2.3v7A10 10 0 0 0 22 12z" />
    </svg>
  ),
  Instagram: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  ),
  Twitter: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M18.2 2H21l-6.6 7.5L22 22h-6.2l-4.9-6.4L5.3 22H2.5l7-8L2 2h6.4l4.4 5.8L18.2 2zm-1.1 18h1.7L7 3.9H5.2L17.1 20z" />
    </svg>
  ),
  TikTok: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M19.6 8.2a6.5 6.5 0 0 1-3.8-1.2v7.1a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 1 0 2 2.8V2h2.8c.2 1.7 1.3 3.2 2.8 4a6.5 6.5 0 0 0 3 .9v1.3z" />
    </svg>
  ),
  WhatsApp: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.7 15l-1.1 4 4.1-1.1A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.7 12.4l.3.5-.4.3a8 8 0 0 1-11.5-1.4l-.4-.5.1-.6.7-2.5-.5-.4A8 8 0 0 1 12 4zm4.3 9.6c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.1-.4 0-.1 0-.3-.1-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 2.3.9 2.3.6 2.7.6.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1-.1-.1-.2-.1-.4-.2z" />
    </svg>
  ),
};

const activeClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-secondary hover:bg-secondary";
const idleClass =
  "flex h-10 w-10 cursor-default items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/35";

export default function SocialLinks({
  facebook_url,
  instagram_url,
  twitter_url,
  tiktok_url,
  whatsapp,
  className = "",
  iconClassName,
}: SocialLinksProps) {
  const whatsappHref = whatsapp ? phoneToWhatsApp(whatsapp) : "";

  const items = [
    { label: "Facebook", href: String(facebook_url || "").trim(), icon: icons.Facebook },
    { label: "Instagram", href: String(instagram_url || "").trim(), icon: icons.Instagram },
    { label: "Twitter", href: String(twitter_url || "").trim(), icon: icons.Twitter },
    { label: "TikTok", href: String(tiktok_url || "").trim(), icon: icons.TikTok },
    { label: "WhatsApp", href: whatsappHref, icon: icons.WhatsApp },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map((item) => {
        const live = Boolean(item.href);
        const base = iconClassName || (live ? activeClass : idleClass);
        const classNameFinal = iconClassName
          ? `${iconClassName} ${live ? "" : "pointer-events-none cursor-default opacity-40"}`.trim()
          : base;

        if (live) {
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className={classNameFinal}
            >
              {item.icon}
            </a>
          );
        }

        return (
          <span
            key={item.label}
            role="img"
            aria-label={`${item.label} (link coming soon)`}
            title={`${item.label} — add link in Admin Settings`}
            className={classNameFinal}
          >
            {item.icon}
          </span>
        );
      })}
    </div>
  );
}
