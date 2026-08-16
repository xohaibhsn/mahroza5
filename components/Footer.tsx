import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { company, navLinks } from "@/lib/constants";
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
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 lg:py-14">
        {/* Brand + social */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            {settings.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logo_url}
                alt="QHC logo"
                className="h-11 w-auto max-w-[180px] object-contain"
              />
            ) : (
              <span className="text-2xl font-semibold tracking-tight text-white">QHC</span>
            )}
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85">
            {company.fullName} — {company.tagline}. Home healthcare across Lahore under Director{" "}
            {company.director}.
          </p>
          <SocialLinks
            className="mt-6"
            facebook_url={settings.facebook_url}
            instagram_url={settings.instagram_url}
            twitter_url={settings.twitter_url}
            tiktok_url={settings.tiktok_url}
            whatsapp={settings.whatsapp || phone}
            iconClassName="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-secondary hover:bg-secondary"
          />
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
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
            <li>
              <Link
                href="/appointment"
                className="text-sm font-medium text-secondary-light transition hover:text-white"
              >
                Book Appointment
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact (once) */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-4 text-sm text-white/85">
            <li>
              <a
                href={`tel:${phoneToTel(phone)}`}
                className="font-medium text-white transition hover:text-secondary-light"
              >
                {phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${email}`}
                className="text-white/90 transition hover:text-secondary-light"
              >
                {email}
              </a>
            </li>
            <li>
              <p className="font-medium text-white">{company.offices[0].label}</p>
              <p className="mt-1 leading-relaxed text-white/80">{address1}</p>
            </li>
            <li>
              <p className="font-medium text-white">{company.offices[1].label}</p>
              <p className="mt-1 leading-relaxed text-white/80">{address2}</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page flex flex-col gap-2 py-5 text-center text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {year} {company.name} — {company.fullName}. All rights reserved.
          </p>
          <p>{company.website}</p>
        </div>
      </div>
    </footer>
  );
}
