"use client";

import { useEffect, useState, useMemo } from "react";
import { FaStar, FaCheckCircle, FaTimes } from "react-icons/fa";
import ReviewMediaGrid from "./ReviewMediaGrid";

// Helper to ensure URLs are absolute if coming from Laravel Storage
const getMediaUrl = (url) => {
  if (!url) return "";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  return url.startsWith("http") ? url : `${backendUrl}${url}`;
};

const ReviewCard = ({ review }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  // 1. Process Media Data from the backend structure
  const processedMedia = useMemo(() => {
    try {
      const raw = typeof review.media === "string" ? JSON.parse(review.media) : (review.media || []);
      return {
        images: raw.filter(m => m.type === "image").map(m => getMediaUrl(m.url)),
        video: raw.find(m => m.type === "video") ? getMediaUrl(raw.find(m => m.type === "video").url) : null,
      };
    } catch (e) {
      console.error("Media parsing error:", e);
      return { images: [], video: null };
    }
  }, [review.media]);

  const isVerified = !!(review.is_verified || review.vendor_order_item_id);

  const openMedia = (url) => {
    setSelectedMedia(url);
    document.body.style.overflow = "hidden";
  };

  const closeMedia = () => {
    setSelectedMedia(null);
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && closeMedia();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div className="border-b border-border pb-6 last:border-0 last:pb-0 group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={review.customer?.profile_picture || "/default-avatar.png"}
              alt={review.customer?.full_name || "User"}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-border shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-textPrimary text-sm">
                  {review.customer?.full_name || "Anonymous User"}
                </h4>
                {isVerified && (
                  <FaCheckCircle className="text-green text-[10px]" title="Verified Purchase" />
                )}
              </div>
              <p className="text-[11px] text-textSecondary uppercase tracking-wider">
                {new Date(review.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={12}
                className={i < review.rating ? "text-yellow fill-yellow" : "text-gray-200"}
              />
            ))}
          </div>
        </div>

        {/* Review Body */}
        <p className="text-textSecondary text-[14px] leading-relaxed mb-4 italic text-gray-700">
          "{review.body}"
        </p>

        {/* Media Grid */}
        {(processedMedia.images.length > 0 || processedMedia.video) && (
          <ReviewMediaGrid
            images={processedMedia.images}
            video={processedMedia.video}
            onClick={openMedia}
          />
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 mt-4 pt-2">
          <button className="text-[11px] font-medium text-gray-400 hover:text-main flex items-center gap-1 transition-colors">
            Helpful ({review.helpful_count || 0})
          </button>
          <button className="text-[11px] font-medium text-gray-400 hover:text-red-500 transition-colors">
            Report
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={closeMedia}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            <button
              onClick={closeMedia}
              className="absolute -top-12 right-0 text-white text-4xl hover:scale-110 transition-transform"
            >
              <FaTimes />
            </button>

            {selectedMedia.match(/\.(mp4|webm|ogg)$/) || selectedMedia.includes("video") ? (
              <video
                src={selectedMedia}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
              />
            ) : (
              <img
                src={selectedMedia}
                alt="Enlarged review"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCard;