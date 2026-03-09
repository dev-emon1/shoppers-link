export default function BrandsPage() {
  return (
    <div className="bg-bgPage py-16 min-h-screen">
      <div className="container max-w-5xl">
        <h1 className="text-3xl font-bold text-secondary mb-8">Brands A-Z</h1>

        <p className="text-textSecondary mb-10">
          Browse all brands available on ShoppersLink marketplace.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
            <div
              key={letter}
              className="border border-border rounded-lg p-4 text-center bg-bgSurface hover:border-main transition"
            >
              <span className="font-semibold text-secondary">{letter}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
