import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { navLinks } from "@/lib/constants";

export default function Navbar() {
  const router = useRouter();
  const { settings } = useSiteSettings();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-primary shadow-soft">
      <div className="container-page flex h-16 items-center justify-between lg:h-[4.25rem]">
        <Link href="/" className="group flex items-center gap-2" aria-label="QHC home">
          {settings.logo_url && settings.logo_url.trim() !== "" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt="QHC logo"
              className="h-10 w-auto max-w-[180px] object-contain sm:h-12"
            />
          ) : (
            <span className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
              QHC{" "}
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-secondary-light sm:text-sm">
                Quality Health Care
              </span>
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-white/10 text-white"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/appointment" className="btn-primary ml-3 !py-2.5">
            Book Appointment
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`border-t border-white/10 bg-primary-dark lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-3 text-base font-medium ${
                isActive(link.href) ? "bg-white/10 text-white" : "text-white/85"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/appointment" className="btn-primary mt-2 text-center">
            Book Appointment
          </Link>
        </nav>
      </div>
    </header>
  );
}
