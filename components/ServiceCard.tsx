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

export default function ServiceCard({ service, href }: ServiceCardProps) {
  const linkHref = href || `/services#${service.id}`;
  const hasImage = Boolean(service.image && String(service.image).trim());

  return (
    <article className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1e3a5f] to-[#4a90d9] flex items-center justify-center text-5xl">
            🏥
          </div>
        )}
      </div>
      <div className="p-5 flex flex-1 flex-col">
        {service.short ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4a90d9] mb-1">
            {service.short}
          </p>
        ) : null}
        <h3 className="font-bold text-[#1e3a5f] text-lg mb-2">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-1">{service.description}</p>
        <Link
          href={linkHref}
          className="text-[#4a90d9] font-semibold text-sm hover:underline"
        >
          Know More →
        </Link>
      </div>
    </article>
  );
}
