"use client";

export default function ProductSectionSkeleton({ title }) {
  return (
    <section className="py-14 bg-bgPage">
      <div className="container">
        {/* Section title */}
        {title && (
          <h2 className="text-center text-xl font-semibold mb-6">{title}</h2>
        )}

        {/* Skeleton grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-80 rounded-xl bg-main/10 animate-pulse">
              {/* Image placeholder */}
              <div className="h-3/4 bg-main/10 rounded-t-xl" />

              {/* Text placeholder */}
              <div className="p-4 space-y-2">
                <div className="h-4 bg-main/10 rounded w-3/4 mx-auto" />
                <div className="h-4 bg-main/10 rounded w-1/2 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
