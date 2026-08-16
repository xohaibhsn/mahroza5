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

const whyCards = [
  {
    emoji: "🎓",
    title: "Qualified Healthcare Experts",
    key: "why_point_1" as const,
    bg: "bg-[#1e3a5f]",
  },
  {
    emoji: "🕐",
    title: "Available 24/7",
    key: "why_point_2" as const,
    bg: "bg-[#4a90d9]",
  },
  {
    emoji: "❤️",
    title: "Patient-Centric Approach",
    key: "why_point_3" as const,
    bg: "bg-rose-500",
  },
  {
    emoji: "🏠",
    title: "Home Delivery of Care",
    key: "why_point_4" as const,
    bg: "bg-emerald-600",
  },
];

type HomePageProps = {
  content: SiteContent;
  services: SiteService[];
  testimonials: SiteTestimonial[];
};

export default function HomePage({ content, services, testimonials }: HomePageProps) {
  const stats = [
    {
      value: content.stat_patients,
      label: "Patients",
      icon: "👥",
      border: "border-[#1e3a5f]",
    },
    {
      value: content.stat_services,
      label: "Services",
      icon: "🏥",
      border: "border-[#4a90d9]",
    },
    {
      value: content.stat_availability,
      label: "Available",
      icon: "⏰",
      border: "border-emerald-500",
    },
    {
      value: content.stat_location,
      label: "City",
      icon: "📍",
      border: "border-rose-400",
    },
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80"
              alt="Healthcare Professional"
              className="h-[450px] w-full rounded-2xl object-cover shadow-2xl"
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
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Why Choose Us
            </p>
            <h2 className="section-title mt-2">
              {content.about_heading || "Why families across Lahore trust QHC"}
            </h2>
            <p className="section-subtitle mx-auto">
              {content.about_description || content.about_text}
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-100 bg-surface p-6 shadow-card"
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white ${card.bg}`}
                >
                  {card.emoji}
                </div>
                <h3 className="font-semibold text-primary">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {content[card.key] || card.title}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80"
              alt="QHC care team"
              className="h-64 w-full rounded-2xl object-cover shadow-card sm:h-80"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80"
              alt="Patient receiving care at home"
              className="h-64 w-full rounded-2xl object-cover shadow-card sm:h-80"
            />
          </div>
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="container-page grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border-t-4 bg-white p-6 text-center shadow-card ${stat.border}`}
            >
              <p className="text-3xl" aria-hidden>
                {stat.icon}
              </p>
              <p className="mt-3 font-display text-3xl font-semibold text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-slate-500">
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
                className="relative flex h-full flex-col rounded-2xl bg-white p-6 shadow-card"
              >
                <span className="absolute right-5 top-4 text-4xl leading-none text-secondary/20" aria-hidden>
                  &ldquo;
                </span>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1e3a5f&color=fff&size=60&rounded=true`}
                    alt={item.name}
                    className="h-14 w-14 rounded-full"
                  />
                  <div>
                    <cite className="not-italic font-semibold text-primary">{item.name}</cite>
                    {item.role ? <p className="text-xs text-slate-500">{item.role}</p> : null}
                  </div>
                </div>
                <div className="mt-4 flex gap-1 text-amber-400" aria-hidden>
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
                  {item.quote}
                </p>
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
