import Head from "next/head";
import AppointmentForm from "@/components/AppointmentForm";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { company, services } from "@/lib/constants";

export default function AppointmentPage() {
  return (
    <Layout>
      <Head>
        <title>Book Appointment | QHC — Quality Health Care</title>
        <meta
          name="description"
          content="Book a QHC home healthcare appointment in Lahore. Nursing, physiotherapy, doctor visits, diagnostics, and more."
        />
      </Head>

      <PageHero
        title="Book an Appointment"
        subtitle="Request a home care visit in Lahore. Share your details and our team will confirm your appointment promptly."
      />

      <section className="py-16 sm:py-20">
        <div className="container-page grid items-start gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="section-title text-3xl sm:text-3xl">Tell us how we can help</h2>
            <p className="section-subtitle">
              Select a service, leave your phone number, and we will arrange a convenient visit.
              For urgent needs, call or WhatsApp us directly.
            </p>

            <div className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-card">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Call / WhatsApp
                </p>
                <a
                  href={`tel:${company.phoneTel}`}
                  className="mt-1 block text-lg font-semibold text-primary hover:text-secondary"
                >
                  {company.phone}
                </a>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Available services
                </p>
                <ul className="mt-3 space-y-1.5">
                  {services.map((service) => (
                    <li key={service.id} className="text-sm text-slate-600">
                      • {service.title}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-slate-100 pt-4 text-sm text-slate-600">
                <p className="font-semibold text-primary">Serving Lahore only</p>
                <p className="mt-1">Gulberg & Defense Road offices · Director {company.director}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <AppointmentForm />
          </div>
        </div>
      </section>
    </Layout>
  );
}
