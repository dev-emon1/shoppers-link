// modules/product/components/product-details/reviews/ReviewSkeleton.jsx
"use client";

export default function ReviewSkeleton() {
  return (
    <>
      {/* Skeleton for Overall Rating */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-2xl p-8 animate-pulse">
          <div className="h-16 bg-gray-200 rounded-lg w-32 mx-auto mb-4" />
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-6 h-6 bg-gray-200 rounded-full" />
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-40 mx-auto mb-8" />

          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="flex-1 h-3 bg-gray-200 rounded-full" />
                <div className="w-12 h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skeleton for Review Cards */}
      <div className="lg:col-span-3 space-y-10">
        {[1, 2].map((i) => (
          <div key={i} className="border-b border-gray-100 pb-8 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="w-5 h-5 bg-gray-200 rounded" />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-11/12" />
              <div className="h-4 bg-gray-200 rounded w-9/12" />
            </div>

            {/* Media Skeleton */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[1, 2, 3, 4].map((m) => (
                <div key={m} className="aspect-square bg-gray-200 rounded-lg" />
              ))}
            </div>

            <div className="flex gap-6 mt-5">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
