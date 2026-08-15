import Link from "next/link";
import type { ServiceItem } from "@/lib/constants";

type ServiceCardProps = {
  service: ServiceItem;
  href?: string;
};

export default function ServiceCard({ service, href = "/services" }: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[3/2] overflow-hidden bg-primary/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
          {service.short}
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold text-primary">{service.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{service.description}</p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary transition group-hover:gap-2"
        >
          Know More
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
