"use client";
import React, { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import useOrderFromList from "@/modules/user/hooks/useOrderFromList";
import { makeImageUrl } from "@/lib/utils/image";
import { showToast } from "@/lib/utils/toast";
import WriteReviewModal from "../../components/review/WriteReviewModal";
import ViewReviewModal from "../../components/review/ViewReviewModal";

const PROGRESS_STEPS = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function extractTimeline(order) {
  const timeline = order?.status_timeline ?? [];
  const map = {};
  map.pending = order?.created_at ?? null;

  for (const change of timeline) {
    if (change.to) map[change.to.toLowerCase()] = change.date_time;
  }
  return map;
}

export default function OrderCard({ order }) {
  const router = useRouter();
  const undoTimerRef = useRef(null);
  const [optimisticCancelled, setOptimisticCancelled] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [viewReviewOpen, setViewReviewOpen] = useState(false);

  const primaryItem = order?.vendor_orders?.[0]?.items?.[0];
  const thumbnail = primaryItem
    ? makeImageUrl(
        primaryItem?.image?.image_path ?? primaryItem?.product?.primary_image
      )
    : "/images/placeholder-square.jpg";

  const vendorCount = order?.vendor_orders?.length ?? 0;
  const vendorStatuses = (order.vendor_orders ?? []).map((v) =>
    (v.status ?? "pending").toLowerCase()
  );

  const activeStatuses = vendorStatuses.filter((s) => s !== "cancelled");
  const isAllCancelled = activeStatuses.length === 0;

  const statusToIndex = (status) =>
    PROGRESS_STEPS.findIndex((s) => s.key === status) ?? 0;

  const overallIndex = isAllCancelled
    ? -1
    : Math.min(...activeStatuses.map(statusToIndex));

  const overallStatus = isAllCancelled
    ? "cancelled"
    : PROGRESS_STEPS[overallIndex]?.key ?? "pending";

  const progressPercent =
    overallIndex < 0
      ? 0
      : Math.round(((overallIndex + 1) / PROGRESS_STEPS.length) * 100);

  const isCancelled = optimisticCancelled || overallStatus === "cancelled";
  const hasDelivered = activeStatuses.some((s) => s === "delivered");

  const cancelledBy =
    order.cancelled_by === "vendor"
      ? "Cancelled by Vendor"
      : "Cancelled by You";

  const cancelReason =
    order.cancel_reason ??
    (order.cancelled_by === "vendor"
      ? "Vendor cancelled this order."
      : "You cancelled this order.");

  const itemCount =
    order.vendor_orders?.reduce(
      (sum, vo) => sum + (vo.item_count ?? vo.items?.length ?? 0),
      0
    ) ?? 0;

  const isSingleItemSingleVendor =
    vendorCount === 1 &&
    (order.vendor_orders[0]?.item_count ??
      order.vendor_orders[0]?.items?.length ??
      0) === 1;

  const showReviewInCard = hasDelivered && isSingleItemSingleVendor;

  const reviewedItemCount = (order.vendor_orders?.[0]?.items ?? []).filter(
    (i) => i.review
  ).length;
  const hasReviewed =
    reviewedItemCount === (order.vendor_orders?.[0]?.items?.length ?? 0);

  const createdAt = new Date(order.created_at ?? Date.now()).toLocaleString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const timelineMap = useMemo(() => extractTimeline(order), [order]);

  const canCancel =
    !isCancelled &&
    overallStatus === "pending" &&
    order.vendor_orders?.every(
      (vo) => (vo.status ?? "pending").toLowerCase() === "pending"
    );

  const { doCancelSafe, cancelling } = useOrderFromList(order.unid ?? order.id);

  const handleCancel = () => {
    if (!canCancel) return;
    setOptimisticCancelled(true);
    showToast("Order cancelled", "warning", {
      actionText: "Undo",
      duration: 6000,
      onAction: () => {
        clearTimeout(undoTimerRef.current);
        setOptimisticCancelled(false);
        showToast("Cancellation undone", "success");
      },
    });

    undoTimerRef.current = setTimeout(async () => {
      try {
        await doCancelSafe({ reason: "Customer requested cancellation" });
        showToast("Order cancellation confirmed", "success");
      } catch (err) {
        setOptimisticCancelled(false);
        showToast(err?.error ?? "Failed to cancel order", "error");
      }
    }, 6000);
  };

  const handleViewDetails = () => {
    router.push(
      `/user/dashboard/orders/${encodeURIComponent(order.unid ?? order.id)}`
    );
  };

  return (
    <article
      className={`rounded-xl border bg-white transition-all duration-200 ${
        isCancelled ? "opacity-70 bg-gray-50" : ""
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img
              src={thumbnail}
              alt="Product"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-base sm:text-lg">
                    Order <span className="text-main">#{order.unid}</span>
                  </h3>
                  <StatusBadge
                    status={isCancelled ? "cancelled" : overallStatus}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{createdAt}</p>
              </div>

              <div className="text-right">
                <div className="font-bold text-xl sm:text-2xl">
                  ৳{Number(order.total_amount).toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {itemCount} item{itemCount > 1 ? "s" : ""} • {vendorCount}{" "}
                  vendor{vendorCount > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section with dates */}
        <div className="mt-5">
          {!isCancelled ? (
            <>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPercent}%`,
                    background: "linear-gradient(90deg, #10b981, #3b82f6)",
                  }}
                />
              </div>

              <div className="grid grid-cols-5 gap-1 mt-3 text-center">
                {PROGRESS_STEPS.map((step, idx) => {
                  const isActive = idx <= overallIndex;
                  const timestamp = timelineMap[step.key];
                  return (
                    <div key={step.key} className="text-center">
                      <div
                        className={`text-[11px] sm:text-xs font-medium ${
                          isActive ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </div>
                      {isActive && timestamp && (
                        <div className="text-[9px] text-gray-500 mt-0.5 hidden sm:block">
                          {new Date(timestamp).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {vendorCount > 1 && new Set(vendorStatuses).size > 1 && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  Different progress across vendors
                </p>
              )}
            </>
          ) : (
            <div className="mt-4 p-3.5 bg-red/80 border border-red/40 rounded-lg text-sm">
              <p className="font-semibold text-red">{cancelledBy}</p>
              <p className="text-red mt-1 leading-snug">{cancelReason}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2.5">
          <button
            onClick={handleViewDetails}
            className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-medium bg-main text-white rounded-md hover:opacity-90 transition"
          >
            View Details
          </button>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:justify-end w-full sm:w-auto">
            {canCancel && !isCancelled && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-medium bg-main text-white rounded-md hover:opacity-90 disabled:opacity-50 transition"
              >
                {cancelling ? "Cancelling..." : "Cancel"}
              </button>
            )}

            {hasDelivered && showReviewInCard ? (
              hasReviewed ? (
                <button
                  onClick={() => setViewReviewOpen(true)}
                  className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-medium bg-white text-main rounded-md hover:opacity-90 transition border border-main hover:bg-main/5"
                >
                  View Review
                </button>
              ) : (
                <button
                  onClick={() => setReviewOpen(true)}
                  className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-medium bg-white text-main rounded-md hover:opacity-90 transition border border-main hover:bg-main/5"
                >
                  Write Review
                </button>
              )
            ) : (
              (hasDelivered || (!canCancel && !isCancelled)) && (
                <button
                  onClick={() => (window.location.href = "/support")}
                  className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-medium bg-white text-main rounded-md hover:opacity-90 transition border border-main hover:bg-main/5"
                >
                  Contact Support
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {reviewOpen && (
        <WriteReviewModal order={order} onClose={() => setReviewOpen(false)} />
      )}
      {viewReviewOpen && (
        <ViewReviewModal
          order={order}
          onClose={() => setViewReviewOpen(false)}
        />
      )}
    </article>
  );
}
