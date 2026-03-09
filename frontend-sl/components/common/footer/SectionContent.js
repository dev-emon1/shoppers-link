export default function LegalSection({ id, title, children }) {
  return (
    <section
      id={id}
      className="bg-bgSurface border border-border rounded-xl p-6 md:p-8 scroll-mt-28"
    >
      <h2 className="text-xl font-semibold text-secondary mb-4">{title}</h2>

      <div className="text-textSecondary leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}
