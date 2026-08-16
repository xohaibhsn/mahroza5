type PageHeroProps = {
  title: string;
  subtitle?: string;
};

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-hero-glow py-16 text-white sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="container-page relative">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
          QHC · Quality Health Care
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
