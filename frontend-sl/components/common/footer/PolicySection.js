export default function PolicySection({ title, description, sections }) {
  return (
    <section className="bg-bgPage py-16">
      <div className="container max-w-4xl">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-secondary mb-4">
            {title}
          </h1>

          {description && (
            <p className="text-textSecondary leading-relaxed">{description}</p>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-10">
          {sections.map((item, index) => (
            <div
              key={index}
              className="bg-bgSurface border border-border rounded-xl p-6 md:p-8 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-secondary mb-3">
                {item.heading}
              </h2>

              {item.text && (
                <p className="text-textSecondary leading-relaxed mb-3">
                  {item.text}
                </p>
              )}

              {item.list && (
                <ul className="list-disc pl-5 space-y-2 text-textSecondary">
                  {item.list.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
