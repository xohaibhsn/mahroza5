import Link from "next/link";
import { company, navLinks, services } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold">QHC</span>
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
              <a href={`tel:${company.phoneTel}`} className="transition hover:text-white">
                {company.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className="transition hover:text-white">
                {company.email}
              </a>
            </li>
            {company.offices.map((office) => (
              <li key={office.label}>
                <p className="font-medium text-white">{office.label}</p>
                <p className="mt-1 leading-relaxed">{office.address}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-center text-xs text-white/60 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {year} {company.name} — {company.fullName}. All rights reserved.
          </p>
          <p>Serving {company.city}, Pakistan · {company.website}</p>
        </div>
      </div>
    </footer>
  );
}
