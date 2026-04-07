import { Tag } from "lucide-react";

export default function OffersPage() {
  return (
    <div className="bg-bgPage min-h-screen py-16">
      <div className="container max-w-5xl">
        <h1 className="text-3xl font-bold text-secondary mb-8">
          Deals & Offers
        </h1>

        <p className="text-textSecondary mb-10">
          Discover exclusive discounts and limited-time deals from our sellers.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-6 bg-bgSurface border border-border rounded-xl"
            >
              <Tag className="text-main mb-4" size={24} />

              <h3 className="font-semibold text-secondary mb-2">
                Special Discount
              </h3>

              <p className="text-sm text-textSecondary">
                Get up to 30% off on selected products this week.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
