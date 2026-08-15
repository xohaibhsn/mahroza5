import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { company, whyChooseUs } from "@/lib/constants";
import type { SiteContent } from "@/lib/siteTypes";

type AboutPageProps = {
  content: SiteContent;
};

export default function AboutPage({ content }: AboutPageProps) {
  return (
    <Layout>
      <Head>
        <title>About Us | QHC — Quality Health Care Lahore</title>
        <meta
          name="description"
          content="Learn about QHC Quality Health Care, directed by Mahroza Rao — trusted home healthcare across Lahore."
        />
      </Head>

      <PageHero
        title="About QHC"
        subtitle="Quality Health Care brings professional medical support into Lahore homes with compassion, skill, and reliability."
      />

      <section className="py-16 sm:py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Our Story
            </p>
            <h2 className="section-title mt-2">
              {content.about_heading || "Care you can trust, closer to home"}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600">
              <p>{content.about_description || content.about_text}</p>
              <p>
                We operate from offices in Gulberg and on Defense Road, and we serve patients across
                Lahore with a single promise: <em className="text-primary">{content.hero_heading}</em>.
              </p>
            </div>
            <Link href="/appointment" className="btn-primary mt-8">
              Book Appointment
            </Link>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://placehold.co/640x520/1e3a5f/ffffff?text=About+QHC"
            alt="About Quality Health Care"
            className="w-full rounded-2xl object-cover shadow-soft"
          />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Our Promise
            </p>
            <h2 className="section-title mt-2">What guides every QHC visit</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-surface p-6">
                <h3 className="font-display text-xl font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page rounded-3xl bg-primary px-6 py-12 text-center text-white sm:px-12">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Meet our director</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            {company.director} leads QHC with a focus on clinical quality, respectful caregiving,
            and making home healthcare simple for Lahore families.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={`tel:${content.phone.replace(/[^\d+]/g, "")}`} className="btn-primary">
              Call {content.phone}
            </a>
            <Link href="/contact" className="btn-outline">
              Contact Offices
            </Link>
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
