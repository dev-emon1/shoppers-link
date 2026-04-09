export default function LegalHero({ title, description }) {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="text-center mb-14">
      <span className="inline-block bg-mainSoft text-main px-4 py-1 rounded-full text-xs font-medium mb-4">
        LEGAL FRAMEWORK
      </span>

      <h1 className="text-3xl md:text-4xl font-semibold text-secondary mb-4">
        {title}
      </h1>

      <p className="text-textSecondary max-w-2xl mx-auto">{description}</p>

      <div className="flex justify-center gap-6 mt-6 text-sm text-textLight">
        <span>Effective Date: {formattedDate}</span>
        <span>Version 2.4.0</span>
      </div>
    </div>
  );
}
