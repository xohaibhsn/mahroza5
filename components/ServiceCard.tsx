import Link from "next/link";
import type { SiteService } from "@/lib/siteTypes";

type ServiceCardProps = {
  service: SiteService | {
    id: string;
    title: string;
    short: string;
    description: string;
    image: string;
    icon?: string;
  };
  href?: string;
};

export default function ServiceCard({ service, href = "/services" }: ServiceCardProps) {
  const hasImage = Boolean(service.image && String(service.image).trim());

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#4a90d9]">
            <span className="text-6xl">🏥</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold tracking-tight text-[#1e3a5f]">
          {service.title}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-500">{service.description}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#4a90d9] hover:underline"
        >
          Know More →
        </Link>
      </div>
    </article>
  );
}
