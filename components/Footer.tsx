import Link from "next/link";
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
              <span className="font-display text-3xl font-bold">QHC</span>
            )}
          </Link>
          <p className="mt-1 text-sm font-medium uppercase tracking-[0.16em] text-secondary-light">
            {company.fullName}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
            {company.tagline}. Professional home healthcare services across Lahore — nursing,
            diagnostics, elderly care, and more.
          </p>
          <p className="mt-4 text-sm text-white/70">
            Director: <span className="font-medium text-white">{company.director}</span>
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-light">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-light">
            Services
          </h3>
          <ul className="mt-4 space-y-2">
            {services.slice(0, 6).map((service) => (
              <li key={service.id}>
                <Link
                  href="/services"
                  className="text-sm text-white/80 transition hover:text-white"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-light">
            Contact
          </h3>
          <ul className="mt-4 space-y-4 text-sm text-white/80">
            <li>
              <a href={`tel:${phoneToTel(phone)}`} className="transition hover:text-white">
                {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="transition hover:text-white">
                {email}
              </a>
            </li>
            <li>
              <p className="font-medium text-white">Office 1 — Gulberg</p>
              <p className="mt-1 leading-relaxed">{address1}</p>
            </li>
            <li>
              <p className="font-medium text-white">Office 2 — Defense Road</p>
              <p className="mt-1 leading-relaxed">{address2}</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-center text-xs text-white/60 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {year} {company.name} — {company.fullName}. All rights reserved.
          </p>
          <p>{company.website}</p>
        </div>
      </div>
    </footer>
  );
}
