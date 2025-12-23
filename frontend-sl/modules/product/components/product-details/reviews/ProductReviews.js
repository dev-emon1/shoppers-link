"use client";

import { useState, useEffect } from "react";
import OverallRating from "./OverallRating";
import ReviewCard from "./ReviewCard";
import ReviewSkeleton from "./ReviewSkeleton";

export default function ProductReviews({ product }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const reviews = product?.reviews ?? [];
  const totalReviews = reviews.length;

  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / totalReviews).toFixed(1)
      : 0;

  const ratingDist = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      percent: totalReviews ? Math.round((count / totalReviews) * 100) : 0,
    };
  });

  return (
    <section className="py-12 border-t">
      <h2 className="text-2xl font-light mb-10">Customer Reviews</h2>

      {isLoading ? (
        <div className="grid lg:grid-cols-4 gap-10">
          <ReviewSkeleton />
        </div>
      ) : totalReviews === 0 ? (
        <div className="text-center py-5 text-gray-400">
          <p className="text-lg">No reviews yet</p>
          <p className="text-sm mt-2">
            This product hasn’t received any reviews from customers.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <OverallRating
              average={avgRating}
              total={totalReviews}
              distribution={ratingDist}
            />
          </div>

          <div className="lg:col-span-3 space-y-10">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
