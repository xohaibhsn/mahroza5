import Head from "next/head";
import Link from "next/link";
import AppointmentForm from "@/components/AppointmentForm";
import Layout from "@/components/Layout";
import ServiceCard from "@/components/ServiceCard";
import type { SiteContent, SiteService, SiteTestimonial } from "@/lib/siteTypes";

function phoneToTel(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function phoneToWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "https://wa.me/923004334065";
  return `https://wa.me/${digits.startsWith("0") ? `92${digits.slice(1)}` : digits}`;
}

const whyIcons = [
  (
    <svg key="1" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.6-1A9 9 0 1 1 12 3a9 9 0 0 1 8.6 6z" />
    </svg>
  ),
  (
    <svg key="2" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  ),
  (
    <svg key="3" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.3 12a8 8 0 0 1 15.4 0M12 12v8m-4 0h8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  ),
  (
    <svg key="4" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
];

type HomePageProps = {
  content: SiteContent;
  services: SiteService[];
  testimonials: SiteTestimonial[];
};

export default function HomePage({ content, services, testimonials }: HomePageProps) {
  const stats = [
    { value: content.stat_patients, label: "Happy Patients" },
    { value: content.stat_services, label: "Services" },
    { value: content.stat_availability, label: "Available" },
    { value: content.stat_location, label: "Based" },
  ];

  return (
    <Layout>
      <Head>
        <title>QHC — Quality Health Care | {content.hero_heading} | Lahore</title>
        <meta
          name="description"
          content="QHC provides professional home nursing, physiotherapy, doctor visits, diagnostics, elderly care, and baby care across Lahore, Pakistan."
        />
      </Head>

      <section className="relative overflow-hidden bg-hero-glow text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container-page relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-secondary-light">
              Home Healthcare · Lahore
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              QHC
            </h1>
            <p className="mt-2 font-display text-2xl font-medium text-white/95 sm:text-3xl">
              {content.hero_heading}
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {content.hero_subheading}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/appointment" className="btn-primary">
                {content.hero_button_text || "Book Appointment"}
              </Link>
              <Link href="/services" className="btn-outline">
                Explore Services
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-secondary/20 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600"
              alt="Healthcare professional providing care"
              className="relative w-full rounded-[1.5rem] object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                Our Services
              </p>
              <h2 className="section-title mt-2">Complete Home Care in Lahore</h2>
              <p className="section-subtitle">
                Professional healthcare services delivered by trained QHC staff to your home.
              </p>
            </div>
            <Link href="/services" className="btn-primary shrink-0 self-start sm:self-auto">
              View All
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Why Choose Us
            </p>
            <h2 className="section-title mt-2">
              {content.about_heading || "Why families across Lahore trust QHC"}
            </h2>
            <p className="section-subtitle">
              {content.about_description || content.about_text}
            </p>

            <ul className="mt-8 space-y-5">
              {[
                content.why_point_1,
                content.why_point_2,
                content.why_point_3,
                content.why_point_4,
              ].map((point, index) => (
                <li key={`${index}-${point}`} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    {whyIcons[index]}
                  </span>
                  <div>
                    <p className="font-semibold text-primary">{point}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://placehold.co/400x480/1e3a5f/ffffff?text=Care+Team"
              alt="QHC care team"
              className="h-full w-full rounded-2xl object-cover shadow-card sm:mt-8"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://placehold.co/400x480/4a90d9/ffffff?text=Patient+Care"
              alt="Patient receiving care at home"
              className="h-full w-full rounded-2xl object-cover shadow-card"
            />
          </div>
        </div>
      </section>

      <section className="bg-primary py-14 text-white">
        <div className="container-page grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl font-semibold text-secondary-light sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Testimonials
            </p>
            <h2 className="section-title mt-2">What our patients say</h2>
            <p className="section-subtitle mx-auto">
              Families in Lahore share how QHC made home healthcare simple and trustworthy.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={`${item.name}-${item.role}`}
                className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-card"
              >
                <div className="flex gap-1 text-secondary" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < (item.rating || 5) ? "fill-current" : "fill-slate-200"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15.3l-5.9 3.5 1.6-6.5L.5 7.5l6.7-.5L10 1l2.8 6 6.7.5-5.2 4.8 1.6 6.5z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-5 border-t border-slate-100 pt-4">
                  <cite className="not-italic font-semibold text-primary">{item.name}</cite>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Appointment
            </p>
            <h2 className="section-title mt-2">We are just a call away</h2>
            <p className="section-subtitle">
              Tell us what you need and we will arrange a visit across Lahore.
            </p>
            <div className="mt-8 space-y-4 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-primary">Phone:</span>{" "}
                <a href={`tel:${phoneToTel(content.phone)}`} className="text-secondary hover:underline">
                  {content.phone}
                </a>
              </p>
              <p>
                <span className="font-semibold text-primary">WhatsApp:</span>{" "}
                <a
                  href={phoneToWhatsApp(content.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline"
                >
                  {content.whatsapp}
                </a>
              </p>
              <p className="leading-relaxed">
                <span className="font-semibold text-primary">Offices:</span> {content.address1} ·{" "}
                {content.address2}
              </p>
            </div>
          </div>
          <AppointmentForm />
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  const { getActiveServices, getActiveTestimonials, getSiteContent } = await import(
    "@/lib/siteData"
  );
  const [content, services, testimonials] = await Promise.all([
    getSiteContent(),
    getActiveServices(),
    getActiveTestimonials(),
  ]);

  return {
    props: {
      content,
      services,
      testimonials,
    },
  };
}
