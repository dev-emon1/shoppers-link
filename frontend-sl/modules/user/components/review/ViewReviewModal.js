"use client";

import React from "react";
import { X, Star } from "lucide-react";
import { makeImageUrl } from "@/lib/utils/image";

/* ================== SENTIMENT ================== */
function detectSentiment(text, rating = 0) {
  const t = text.toLowerCase();
  if (
    rating <= 2 ||
    /(bad|poor|worst|delay|broken|hate|disappoint|issue|problem)/.test(t)
  )
    return "negative";
  if (
    rating >= 4 ||
    /(good|great|excellent|love|perfect|nice|amazing|awesome|recommend)/.test(t)
  )
    return "positive";
  return "neutral";
}

export default function ViewReviewModal({ order, vendorOrder, onClose }) {
  const effectiveVendorOrder = vendorOrder ?? order?.vendor_orders?.[0];
  const items = effectiveVendorOrder?.items ?? [];
  const review = effectiveVendorOrder?.review ?? {}; // Assume review data in vendor_order.review

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const idx = i + 1;
      const full = rating >= idx;
      const half = rating >= idx - 0.5 && rating < idx;

      return (
        <div key={idx} className="relative">
          <Star size={28} className="text-gray-300" />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: full ? "100%" : half ? "50%" : "0%" }}
          >
            <Star size={28} className="text-yellow-400" fill="currentColor" />
          </div>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-5 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">Your Review</h3>
            <p className="text-xs text-textSecondary mt-1">
              Verified purchase • Order #{order.unid}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Products List - View Reviews */}
          {items.map((it, index) => {
            // const itemReview = review.reviews?.[index] ?? {}; // Assume array of reviews per item
            // const sentiment = detectSentiment(
            //   itemReview.text,
            //   itemReview.rating
            // );
            const itemReview = it.review ?? {};
            const sentiment = detectSentiment(
              itemReview.body,
              itemReview.rating
            );
            return (
              <div
                key={it.unid}
                className="border rounded-lg p-4 bg-gray-50 space-y-4"
              >
                {/* Product Info */}
                <div className="flex gap-4 items-center">
                  <img
                    src={makeImageUrl(it.product?.primary_image)}
                    alt={it.product?.name}
                    className="w-16 h-16 rounded object-cover border"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {it.product?.name}
                    </div>
                    <div className="text-xs text-textSecondary">
                      Qty: {it.quantity} • ৳{it.total}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <div className="text-sm font-medium mb-2">Your Rating</div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {renderStars(itemReview.rating || 0)}
                    </div>
                    <span className="text-lg font-semibold text-main">
                      {itemReview.rating || "—"} / 5
                    </span>
                  </div>
                </div>

                {/* Sentiment */}
                <div className="text-sm">
                  Sentiment:{" "}
                  <span className="font-medium">
                    {sentiment === "positive" && "😄 Positive"}
                    {sentiment === "neutral" && "😐 Neutral"}
                    {sentiment === "negative" && "😡 Negative"}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-sm text-textSecondary capitalize">
                  {itemReview.body || "No text provided."}
                </p>
              </div>
            );
          })}

          {/* Media Preview (if any) */}
          {review.media?.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Your Media</p>
              <div className="flex gap-3 flex-wrap">
                {review.media.map((m, i) => (
                  <div key={i} className="relative">
                    {m.type === "image" ? (
                      <img
                        src={m.preview}
                        className="w-24 h-24 rounded-lg object-cover border"
                        alt="Media preview"
                      />
                    ) : (
                      <video
                        src={m.preview}
                        className="w-24 h-24 rounded-lg object-cover border"
                        controls
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
