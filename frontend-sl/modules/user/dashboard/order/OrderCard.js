"use client";
import React, { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import useOrderFromList from "@/modules/user/hooks/useOrderFromList";
import { makeImageUrl } from "@/lib/utils/image";
import { showToast } from "@/lib/utils/toast";
import WriteReviewModal from "../../components/review/WriteReviewModal";
import ViewReviewModal from "../../components/review/ViewReviewModal";
/* timeline steps */
const PROGRESS_STEPS = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function extractTimeline(order, entity = order) {
  const timeline = order?.status_timeline ?? [];
  const entityUnid = entity?.unid ?? entity?.id;
  const changes = timeline.filter((t) => t.unid === entityUnid);
  const map = {};
  const createdAt = entity?.created_at ?? null;
  map.pending = createdAt;
  for (const change of changes) {
    map[change.to.toLowerCase()] = change.date_time;
  }
  // Fallback for pending if not set
  // console.log(order);
  map.pending = map.pending ?? order.created_at ?? null;
  return map;
}

export default function OrderCard({ order }) {
  const router = useRouter();
  const undoTimerRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [optimisticCancelled, setOptimisticCancelled] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [viewReviewOpen, setViewReviewOpen] = useState(false); // New state for view modal
  const primaryItem = order?.vendor_orders?.[0]?.items?.[0];

  // const thumbnail = primaryItem
  //   ? makeImageUrl(primaryItem?.product?.primary_image)
  //   : "/placeholder-image.jpg"; // Fallback to default placeholder if no primary item
  const thumbnail = primaryItem
    ? makeImageUrl(primaryItem?.image?.image_path)
    : "/placeholder-image.jpg"; // Fallback to default placeholder if no primary item
  // console.log(primaryItem);
  const vendorCount = order?.vendor_orders?.length ?? 0;
  const multiVendor = vendorCount > 1;
  const vendorStatuses = (order.vendor_orders ?? []).map((v) =>
    (v.status ?? "pending").toLowerCase()
  );
  const activeStatuses = vendorStatuses.filter((s) => s !== "cancelled");
  const isAllCancelled = activeStatuses.length === 0;
  const statusToIndex = (status) =>
    PROGRESS_STEPS.findIndex((s) => s.key === status) ?? 0; // Default to 0 (pending) for unknown statuses to prevent crash
  const overallIndex = isAllCancelled
    ? -1
    : activeStatuses.length > 0
      ? Math.min(...activeStatuses.map(statusToIndex).filter((i) => i >= 0)) // Safe filter, but since default 0, won't be empty
      : 0;
  const overallStatus = isAllCancelled
    ? "cancelled"
    : activeStatuses.length > 0
      ? PROGRESS_STEPS[overallIndex]?.key ?? "pending"
      : "pending";
  const progressPercent =
    overallIndex < 0
      ? 0
      : Math.round(((overallIndex + 1) / PROGRESS_STEPS.length) * 100);
  /* effective cancelled state (real OR optimistic) */
  const isCancelled = optimisticCancelled || overallStatus === "cancelled";
  const isPartiallyCancelled =
    !isCancelled && vendorStatuses.some((s) => s === "cancelled");
  const hasDelivered = activeStatuses.some((s) => s === "delivered");

  const isPartiallyDelivered =
    !isCancelled &&
    hasDelivered &&
    activeStatuses.some((s) => s !== "delivered");
  const cancelledBy =
    order.cancelled_by === "vendor"
      ? "Cancelled by Vendor"
      : "Cancelled by Customer";
  const cancelReason =
    order.cancel_reason ??
    (order.cancelled_by === "vendor"
      ? "The vendor cancelled this order."
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
  // console.log(hasDelivered);
  const createdAt = new Date(order.created_at ?? Date.now()).toLocaleString();
  const timelineMap = useMemo(() => extractTimeline(order, order), [order]);
  const allSameStatus = new Set(vendorStatuses).size <= 1;
  const canCancel =
    !isCancelled &&
    overallStatus === "pending" &&
    (order.vendor_orders ?? []).every(
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
        if (undoTimerRef.current) {
          clearTimeout(undoTimerRef.current);
          undoTimerRef.current = null;
        }
        setOptimisticCancelled(false);
        showToast("Cancellation undone", "success");
      },
    });
    undoTimerRef.current = setTimeout(async () => {
      try {
        await doCancelSafe({
          reason: "Customer requested cancellation",
        });
        showToast("Order cancellation confirmed ✅", "success");
      } catch (err) {
        setOptimisticCancelled(false);
        showToast(err?.error ?? "Failed to cancel order", "error");
      }
    }, 6000);
  };
  const handleViewDetails = () => {
    try {
      sessionStorage.setItem("selectedOrder", JSON.stringify(order));
    } catch { }
    router.push(
      `/user/dashboard/orders/${encodeURIComponent(order.unid ?? order.id)}`
    );
  };
  // New: Check if review already submitted for the single vendor
  const hasReviewed = order.vendor_orders?.[0]?.review?.submitted ?? false;
  return (
    <article
      className={`rounded-xl shadow-sm p-4 border transition ${isCancelled
        ? "bg-gray-50 text-gray-400 opacity-80"
        : "bg-bgSurface text-textPrimary"
        }`}
    >
      <div className="flex gap-3">
        <img
          src={thumbnail}
          alt={primaryItem?.product?.name ?? "product"}
          className="w-16 h-16 rounded-md object-cover border"
        />
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Order ID: <span className="text-main">{order.unid}</span></h3>
                <StatusBadge
                  status={isCancelled ? "cancelled" : overallStatus}
                />
              </div>
              <p className="text-xs text-textSecondary">{createdAt}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">
                ৳ {order.total_amount}
              </div>
              <div className="text-xs text-textSecondary mt-1">
                {itemCount} item{itemCount !== 1 ? "s" : ""} from {vendorCount}{" "}
                vendor{vendorCount > 1 ? "s" : ""}
              </div>
            </div>
          </div>
          {/* Timeline OR Cancel Info */}
          <div className="mt-3">
            {!isCancelled ? (
              <>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden relative">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      background: "linear-gradient(90deg,#06b6d4,#7c3aed)",
                    }}
                  />
                </div>
                {/* Timeline Steps with Dates - Only show date for completed/current steps */}
                <div className="flex justify-between mt-4">
                  {PROGRESS_STEPS.map((step, idx) => {
                    const isCompleted = idx < overallIndex;
                    const isCurrent = idx === overallIndex;
                    const isActive = idx <= overallIndex;
                    const timestamp = timelineMap[step.key];
                    return (
                      <div key={step.key} className="flex-1 text-center">
                        <div
                          className={`text-xs font-medium transition-colors ${isActive ? "text-textPrimary" : "text-textSecondary"
                            }`}
                        >
                          {step.label}
                        </div>
                        {/* Show date only if the step is completed or current */}
                        {(isCompleted || isCurrent) && (
                          <div className="text-[10px] text-textSecondary mt-1">
                            {timestamp
                              ? new Date(timestamp).toLocaleString()
                              : idx === 0
                                ? createdAt
                                : "-"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {multiVendor && !allSameStatus && (
                  <p className="text-xs mt-3 text-textSecondary text-center">
                    Varied progress across {vendorCount} vendors.{" "}
                    {/* Future: Add per-vendor courier tracking integration here for multi-vendor orders */}
                  </p>
                )}
                {isPartiallyCancelled && (
                  <p className="mt-3 text-xs text-red text-center">
                    Note: Some vendor orders have been cancelled. See details
                    for more.
                  </p>
                )}
                {isPartiallyDelivered && (
                  <p className="mt-3 text-xs text-green text-center">
                    Note: Some vendor orders have been delivered. See details
                    for more.
                  </p>
                )}
              </>
            ) : (
              <div className="mt-2 p-3 rounded-lg bg-red/5 border border-red/15">
                <p className="text-sm font-semibold text-red-700">
                  {cancelledBy}
                </p>
                <p className="text-xs text-red-600 mt-1">{cancelReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded((s) => !s)}
            className="text-xs px-3 py-1 border rounded-md hover:bg-gray-100 transition"
          >
            {expanded ? "Hide" : "Preview"}
          </button>
          <button
            onClick={handleViewDetails}
            className="text-xs px-3 py-1 bg-main text-white rounded-md hover:opacity-90 transition"
          >
            View Details
          </button>
        </div>
        <div className="flex items-center gap-2">
          {canCancel && !isCancelled && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-3 py-1 border rounded-md text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Cancel"}
            </button>
          )}
          {hasDelivered ? (
            showReviewInCard ? (
              hasReviewed ? (
                <button
                  onClick={() => setViewReviewOpen(true)}
                  className="px-3 py-1 border rounded-md text-sm text-main hover:bg-main/10 transition"
                >
                  View Your Review
                </button>
              ) : (
                <button
                  onClick={() => setReviewOpen(true)}
                  className="px-3 py-1 border rounded-md text-sm text-main hover:bg-main/10 transition"
                >
                  Write a Review
                </button>
              )
            ) : (
              <button
                className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 transition"
                onClick={() => (window.location.href = "/support")}
              >
                Contact Support
              </button>
            )
          ) : (
            !canCancel &&
            !isCancelled && (
              <button
                className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 transition"
                onClick={() => (window.location.href = "/support")}
              >
                Contact Support
              </button>
            )
          )}
          {reviewOpen && (
            <WriteReviewModal
              order={order}
              onClose={() => setReviewOpen(false)}
            />
          )}
          {viewReviewOpen && (
            <ViewReviewModal
              order={order}
              onClose={() => setViewReviewOpen(false)}
            />
          )}
        </div>
      </div>
      {/* Expanded Vendor Preview */}
      {expanded && (
        <div className="mt-4 border-t pt-4 text-sm text-textSecondary space-y-3">
          {order.vendor_orders?.map((v) => {
            const vTimeline = extractTimeline(order, v);
            const statusKey = (v.status ?? "pending").toLowerCase();
            const statusTime =
              vTimeline[statusKey] ?? v.updated_at ?? v.created_at ?? null;
            return (
              <div key={v.unid} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="min-w-[60px]">
                    <div className="text-xs font-semibold">Vendor</div>
                    <div className="text-xs text-textSecondary">V#{v.id}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      Subtotal: ৳ {v.subtotal}
                    </div>
                    <div className="text-xs text-textSecondary">
                      Items: {v.item_count ?? v.items?.length ?? 0}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={v.status} />
                  <div className="text-[11px] text-textSecondary mt-1">
                    {statusTime ? new Date(statusTime).toLocaleString() : "-"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
