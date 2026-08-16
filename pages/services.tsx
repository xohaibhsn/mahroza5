import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import { company } from "@/lib/constants";
import type { SiteService } from "@/lib/siteTypes";

type ServicesPageProps = {
  services: SiteService[];
};

export default function ServicesPage({ services }: ServicesPageProps) {
  return (
    <Layout>
      <Head>
        <title>Services | QHC — Home Healthcare in Lahore</title>
        <meta
          name="description"
          content="Explore QHC services: home nursing, IV & dressing, physiotherapy, doctor visits, diagnostics, elderly care, mental health support, and baby care in Lahore."
        />
      </Head>

      <PageHero
        title="Our Services"
        subtitle="Professional healthcare services delivered to your home across Lahore — coordinated by the QHC team."
      />

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} href="/appointment" />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page rounded-3xl bg-primary p-8 text-white sm:p-10">
          <h3 className="font-display text-2xl font-semibold text-white">Need help choosing a service?</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90">
            Speak with our team and we will recommend the right support for your family.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/appointment" className="btn-primary">
              Book Appointment
            </Link>
            <a href={`tel:${company.phoneTel}`} className="btn-outline">
              Call Now
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  const { getActiveServices } = await import("@/lib/siteData");
  const services = await getActiveServices();
  return { props: { services } };
}
