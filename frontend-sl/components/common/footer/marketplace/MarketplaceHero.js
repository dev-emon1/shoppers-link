export default function MarketplaceHero({ badge, title, description }) {
  return (
    <section className="py-20 border-b border-border bg-bgSurface">
      <div className="container text-center max-w-3xl">
        <span className="inline-block bg-mainSoft text-main px-4 py-1 rounded-full text-xs font-semibold mb-4">
          {badge}
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
          {title}
        </h1>

        <p className="text-textSecondary leading-relaxed">{description}</p>
      </div>
    </section>
  );
}
