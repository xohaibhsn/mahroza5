import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { company, navLinks } from "@/lib/constants";
import { phoneToTel } from "@/lib/siteDataClient";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [phone, setPhone] = useState(company.phone);
  const [ready, setReady] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);

  useEffect(() => {
    let active = true;
    const loadLogo = async () => {
      try {
        const res = await fetch(`/api/site-content?t=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        const url = String(
          data?.settings?.logo_url || data?.data?.logo_url || data?.logo_url || ""
        ).trim();
        setLogoUrl(url);
        setImgBroken(false);
        setPhone(
          data?.settings?.phone || data?.data?.phone || data?.phone || company.phone
        );
      } catch {
        if (active) setLogoUrl("");
      } finally {
        if (active) setReady(true);
      }
    };
    loadLogo();
    return () => {
      active = false;
    };
  }, [router.asPath]);

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

  const showImage = ready && Boolean(logoUrl) && !imgBroken;

  return (
    <header className="sticky top-0 z-40 bg-primary shadow-soft">
      <div className="container-page flex h-16 items-center justify-between lg:h-[4.25rem]">
        <Link href="/" className="group flex min-h-14 min-w-[140px] items-center gap-2" aria-label="QHC home">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="QHC"
              className="h-14 w-auto max-w-[220px] object-contain"
              onError={() => setImgBroken(true)}
            />
          ) : ready ? (
            <span className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
              QHC{" "}
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-secondary-light sm:text-sm">
                Quality Health Care
              </span>
            </span>
          ) : (
            <span className="inline-block h-8 w-32 animate-pulse rounded bg-white/10" />
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
          <a
            href={`tel:${phoneToTel(phone)}`}
            className="rounded-md px-3 py-3 text-base font-medium text-secondary-light"
          >
            Call {phone}
          </a>
          <Link href="/appointment" className="btn-primary mt-2 text-center">
            Book Appointment
          </Link>
        </nav>
      </div>
    </header>
  );
}
