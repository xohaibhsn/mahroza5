import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { company, navLinks, services } from "@/lib/constants";
import { phoneToTel } from "@/lib/siteDataClient";

export default function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const phone = settings.phone || company.phone;
  const email = settings.email || company.email;
  const address1 = settings.address1 || company.offices[0].address;
  const address2 = settings.address2 || company.offices[1].address;

  return (
    <footer className="bg-primary text-white">
      <div className="border-b border-white/15 bg-primary-dark">
        <div className="container-page flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 text-sm text-white/90">
            <a
              href={`tel:${phoneToTel(phone)}`}
              className="inline-flex items-center gap-2 text-white transition hover:text-white"
            >
              <svg
                className="h-4 w-4 shrink-0 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.3a1 1 0 01.95.68l1.2 3.5a1 1 0 01-.3 1.1L8.9 10.3a11 11 0 005 5l1.9-1.3a1 1 0 011.1-.1l3.5 1.2a1 1 0 01.7.95V19a2 2 0 01-2 2h-.5C9.6 21 3 14.4 3 6.5V6a1 1 0 010-1z"
                />
              </svg>
              <span className="font-semibold text-white">{phone}</span>
            </a>
            <div className="inline-flex items-start gap-2 text-white/90">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.7 16.7A8 8 0 1 0 6.3 16.7L12 22l5.7-5.3z"
                />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <div className="space-y-1 leading-relaxed text-white/90">
                <p>{address1}</p>
                <p>{address2}</p>
              </div>
            </div>
          </div>

          <SocialLinks
            facebook_url={settings.facebook_url}
            instagram_url={settings.instagram_url}
            twitter_url={settings.twitter_url}
            tiktok_url={settings.tiktok_url}
            whatsapp={settings.whatsapp || phone}
          />
        </div>
      </div>

      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            {settings.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logo_url}
                alt="QHC logo"
                className="h-10 w-auto max-w-[160px] object-contain"
              />
            ) : (
              <span className="font-display text-3xl font-semibold text-white">QHC</span>
            )}
          </Link>
          <p className="mt-1 text-sm font-medium uppercase tracking-[0.16em] text-white/80">
            {company.fullName}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85">
            {company.tagline}. Professional home healthcare services across Lahore — nursing,
            diagnostics, elderly care, and more.
          </p>
          <p className="mt-4 text-sm text-white/80">
            Director: <span className="font-semibold text-white">{company.director}</span>
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/85 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Services
          </h3>
          <ul className="mt-4 space-y-2">
            {services.slice(0, 6).map((service) => (
              <li key={service.id}>
                <Link
                  href="/services"
                  className="text-sm text-white/85 transition hover:text-white"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-4 text-sm text-white/85">
            <li>
              <a href={`tel:${phoneToTel(phone)}`} className="text-white transition hover:text-white">
                {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="text-white transition hover:text-white">
                {email}
              </a>
            </li>
            <li>
              <p className="font-semibold text-white">Office 1 — Gulberg</p>
              <p className="mt-1 leading-relaxed text-white/85">{address1}</p>
            </li>
            <li>
              <p className="font-semibold text-white">Office 2 — Defense Road</p>
              <p className="mt-1 leading-relaxed text-white/85">{address2}</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page flex flex-col gap-2 py-5 text-center text-xs text-white/70 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {year} {company.name} — {company.fullName}. All rights reserved.
          </p>
          <p className="text-white/70">{company.website}</p>
        </div>
      </div>
    </footer>
  );
}
