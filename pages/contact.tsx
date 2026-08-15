import Head from "next/head";
import ContactForm from "@/components/ContactForm";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import type { SiteContent } from "@/lib/siteTypes";

function phoneToTel(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function phoneToWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "https://wa.me/923004334065";
  return `https://wa.me/${digits.startsWith("0") ? `92${digits.slice(1)}` : digits}`;
}

type ContactPageProps = {
  content: SiteContent;
};

export default function ContactPage({ content }: ContactPageProps) {
  return (
    <Layout>
      <Head>
        <title>Contact | QHC — Quality Health Care Lahore</title>
        <meta
          name="description"
          content={`Contact QHC Quality Health Care in Lahore. Call ${content.phone} or visit our Gulberg and Defense Road offices.`}
        />
      </Head>

      <PageHero
        title="Contact Us"
        subtitle="Reach QHC by phone, WhatsApp, or visit either of our Lahore offices. We are here 24/7 for home care queries."
      />

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          <a
            href={`tel:${phoneToTel(content.phone)}`}
            className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <h2 className="font-display text-xl font-semibold text-primary">Phone</h2>
            <p className="mt-2 text-sm text-slate-600">{content.phone}</p>
          </a>
          <a
            href={phoneToWhatsApp(content.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <h2 className="font-display text-xl font-semibold text-primary">WhatsApp</h2>
            <p className="mt-2 text-sm text-slate-600">{content.whatsapp}</p>
          </a>
          <a
            href={`mailto:${content.email}`}
            className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <h2 className="font-display text-xl font-semibold text-primary">Email</h2>
            <p className="mt-2 text-sm text-slate-600">{content.email}</p>
          </a>
        </div>

        <div className="container-page mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-primary">Office 1 — Gulberg</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{content.address1}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-primary">
              Office 2 — Defense Road
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{content.address2}</p>
          </div>
        </div>

        <div className="container-page mt-10 grid gap-8 lg:grid-cols-2">
          <ContactForm />
          <div className="overflow-hidden rounded-2xl bg-slate-200 shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://placehold.co/1200x420/1e3a5f/ffffff?text=QHC+Lahore+Offices+Map"
              alt="Map placeholder for QHC Lahore offices"
              className="h-full min-h-64 w-full object-cover"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  const { getSiteContent } = await import("@/lib/siteData");
  const content = await getSiteContent();
  return { props: { content } };
}
