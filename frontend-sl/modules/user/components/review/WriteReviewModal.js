"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { X, Star } from "lucide-react";
import { makeImageUrl } from "@/lib/utils/image";
import { showToast } from "@/lib/utils/toast";
import { useDispatch } from "react-redux";
import { submitItemReview } from "@/modules/user/store/orderReducer";

import {
  MAX_TEXT_LENGTH,
  MAX_IMAGES,
  MAX_VIDEOS,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  validateText,
  validateMedia,
  validateVideoDuration,
} from "@/modules/user/utils/reviewValidation";

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

export default function WriteReviewModal({ order, vendorOrder, onClose }) {
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  // Per-product states (key = product.id or product.unid)
  const [ratings, setRatings] = useState({});
  const [texts, setTexts] = useState({});
  const [sentiments, setSentiments] = useState({});

  const [media, setMedia] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const effectiveVendorOrder = vendorOrder ?? order?.vendor_orders?.[0];
  const items = effectiveVendorOrder?.items ?? [];
  const isSubmitted = effectiveVendorOrder?.review?.submitted ?? false;

  /* ================== GROUP ITEMS BY PRODUCT ================== */
  const groupedProducts = useMemo(() => {
    const map = new Map();

    items.forEach((it) => {
      const productId = it.product?.id || it.product?.unid;
      if (!productId) return;

      if (!map.has(productId)) {
        map.set(productId, {
          product: it.product,
          items: [],
          totalQuantity: 0,
          totalPrice: 0,
        });
      }

      const group = map.get(productId);
      group.items.push(it);
      group.totalQuantity += it.quantity;
      group.totalPrice += it.total || it.price * it.quantity;
    });

    return Array.from(map.values());
  }, [items]);

  /* ================== EFFECTS ================== */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    return () => {
      media.forEach((m) => URL.revokeObjectURL(m.preview));
    };
  }, [media]);

  useEffect(() => {
    const newSentiments = {};
    groupedProducts.forEach((group) => {
      const productId = group.product?.id || group.product?.unid;
      const text = texts[productId] || "";
      const rating = ratings[productId] || 0;
      newSentiments[productId] = detectSentiment(text, rating);
    });
    setSentiments(newSentiments);
  }, [texts, ratings, groupedProducts]);

  useEffect(() => {
    const div = modalRef.current;
    if (!div) return;

    const onDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(Array.from(e.dataTransfer.files));
    };

    div.addEventListener("dragover", onDragOver);
    div.addEventListener("dragleave", onDragLeave);
    div.addEventListener("drop", onDrop);

    return () => {
      div.removeEventListener("dragover", onDragOver);
      div.removeEventListener("dragleave", onDragLeave);
      div.removeEventListener("drop", onDrop);
    };
  }, []);

  /* ================== MEDIA HANDLING ================== */
  const handleFiles = async (files) => {
    const valid = [];
    let videoCount = media.filter((m) => m.type === "video").length;
    let imageCount = media.filter((m) => m.type === "image").length;

    for (let file of files) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        showToast("Only images and videos allowed", "error");
        continue;
      }

      if (isVideo && videoCount >= MAX_VIDEOS) {
        showToast("Only one video allowed", "error");
        continue;
      }

      if (isImage && imageCount >= MAX_IMAGES) {
        showToast("Only 3 images allowed", "error");
        continue;
      }

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        showToast("Video must be under 10MB", "error");
        continue;
      }

      if (isImage && file.size > MAX_IMAGE_SIZE) {
        showToast("Image must be under 2MB", "error");
        continue;
      }

      if (isVideo) {
        const durationError = await validateVideoDuration(file);
        if (durationError) {
          showToast(durationError, "error");
          continue;
        }
        videoCount++;
      } else {
        imageCount++;
      }

      valid.push({
        file,
        type: isImage ? "image" : "video",
        preview: URL.createObjectURL(file),
      });
    }

    setMedia((prev) => [...prev, ...valid]);
  };

  const removeMedia = (idx) => {
    URL.revokeObjectURL(media[idx].preview);
    setMedia((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ================== STAR RATING (PER PRODUCT) ================== */
  const handleStarClick = (e, productId, index) => {
    if (isSubmitted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const x = clientX - rect.left;
    const half = x < rect.width / 2;

    setRatings((prev) => ({
      ...prev,
      [productId]: index - (half ? 0.5 : 0),
    }));
  };

  const renderStars = (productId) => {
    const rating = ratings[productId] || 0;

    return Array.from({ length: 5 }).map((_, i) => {
      const idx = i + 1;
      const full = rating >= idx;
      const half = rating >= idx - 0.5 && rating < idx;

      return (
        <div
          key={idx}
          onClick={(e) => handleStarClick(e, productId, idx)}
          onTouchEnd={(e) => handleStarClick(e, productId, idx)}
          className={`relative ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
          role="button"
          aria-label={`Rate ${idx} stars`}
        >
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

  /* ================== SUBMIT ================== */
  const handleSubmit = async () => {
    if (isSubmitted) return;

    for (const group of groupedProducts) {
      const productId = group.product?.id || group.product?.unid;

      // 1. Validation
      if (!ratings[productId] || ratings[productId] <= 0) {
        showToast(`Please provide a rating for ${group.product?.name}`, "error");
        return;
      }
      if (!texts[productId]?.trim()) {
        showToast(`Please write a review for ${group.product?.name}`, "error");
        return;
      }

      // 2. Data Preparation
      // Use the specific ID from the vendor_order_item
      const sampleItem = group.items[0];

      try {
        setSubmitting(true);
        await dispatch(
          submitItemReview({
            orderUnid: order.unid ?? order.id,
            vendorOrderId: effectiveVendorOrder.id,
            itemId: sampleItem.id, // This is vendor_order_item_id
            payload: {
              rating: ratings[productId], // This can now be 4.5
              body: texts[productId],
              media: media.map((m) => m.file),
            },
          })
        ).unwrap();
      } catch (err) {
        showToast(`${group.product?.name}: ${err?.message || "Failed"}`, "error");
        setSubmitting(false);
        return; // Stop if one fails
      }
    }

    showToast("Reviews submitted successfully ✅", "success");
    onClose();
    setSubmitting(false);
  };

  /* ================== RENDER ================== */
  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative"
      >
        <div className="sticky top-0 bg-white border-b p-5 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">
              {isSubmitted ? "Your Review" : "Write a Review"}
            </h3>
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
          {groupedProducts.length === 0 ? (
            <p className="text-center text-red-600">
              No products found to review. Please contact support.
            </p>
          ) : (
            groupedProducts.map((group) => {
              const product = group.product;
              const productId = product?.id || product?.unid;
              // console.log(product);


              return (
                <div
                  key={productId}
                  className="border rounded-lg p-4 bg-gray-50 space-y-4"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={makeImageUrl(product?.primary_image)}
                      alt={product?.name}
                      className="w-16 h-16 rounded object-cover border"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{product?.name}</div>
                      <div className="text-xs text-textSecondary">
                        Qty: {group.totalQuantity} • ৳{group.totalPrice}
                      </div>
                      {group.items.length > 1 && (
                        <div className="text-xs text-textSecondary mt-1">
                          ({group.items.length} variants)
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Your Rating</div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">{renderStars(productId)}</div>
                      <span className="text-lg font-semibold text-main">
                        {ratings[productId] || "—"} / 5
                      </span>
                    </div>
                  </div>

                  <div className="text-sm">
                    Sentiment:{" "}
                    <span className="font-medium">
                      {sentiments[productId] === "positive" && "😄 Positive"}
                      {sentiments[productId] === "neutral" && "😐 Neutral"}
                      {sentiments[productId] === "negative" && "😡 Negative"}
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={texts[productId] || ""}
                    onChange={(e) =>
                      !isSubmitted &&
                      setTexts((prev) => ({
                        ...prev,
                        [productId]: e.target.value,
                      }))
                    }
                    placeholder="Share your experience with this product..."
                    className="w-full border rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-main/20"
                    readOnly={isSubmitted}
                  />
                </div>
              );
            })
          )}

          {/* Media Upload Section (shared) */}
          <div>
            <p className="text-sm font-medium mb-2">
              Add Photos / Video (Optional)
            </p>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition ${isDragging
                ? "border-main bg-main/5"
                : "border-gray-300 hover:border-gray-400"
                }`}
            >
              <p className="text-sm text-gray-600 mb-3">
                Drag & drop up to 3 images or 1 video (max 10MB video, 2MB per
                image, 60s video)
              </p>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) =>
                  !isSubmitted && handleFiles(Array.from(e.target.files || []))
                }
                className="hidden"
                id="media-upload"
                disabled={isSubmitted}
              />
              <label
                htmlFor="media-upload"
                className={`inline-block px-5 py-2 bg-main/10 text-main rounded-md ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"
                  } hover:bg-main/20 transition`}
              >
                Select Files
              </label>
            </div>

            {media.length > 0 && (
              <div className="mt-4 flex gap-3 flex-wrap">
                {media.map((m, i) => (
                  <div key={i} className="relative group">
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
                    {!isSubmitted && (
                      <button
                        onClick={() => removeMedia(i)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} className="text-red-500" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isSubmitted && (
            <button
              disabled={submitting || groupedProducts.length === 0}
              onClick={handleSubmit}
              className="w-full py-3 bg-main text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Submitting Reviews..." : "Submit Reviews"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}