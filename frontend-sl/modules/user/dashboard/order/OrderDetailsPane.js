// OrderDetailsPane.jsx
"use client";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import React, { useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import { cancelVendorOrderApi } from "@/modules/user/services/orderService";
import { useDispatch } from "react-redux";
import { updateOrderLocally } from "@/modules/user/store/orderReducer";
import {
  Clock,
  CircleCheckBig,
  TriangleAlert,
  Truck,
  Package,
  Store,
  PackageSearch,
  Download,
} from "lucide-react";
import { showToast } from "@/lib/utils/toast";
import { makeImageUrl } from "@/lib/utils/image";
import WriteReviewModal from "../../components/review/WriteReviewModal";
import ViewReviewModal from "../../components/review/ViewReviewModal";
import jsPDF from "jspdf";
import OrderInvoiceTemplate from "./OrderInvoiceTemplate";

function safeParse(str) {
  if (!str) return null;
  try {
    return typeof str === "string" ? JSON.parse(str) : str;
  } catch {
    return null;
  }
}

// Desktop Step (unchanged)
function Step({ active, completed, label, time, icon }) {
  return (
    <div className="flex flex-col items-center text-center relative">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${completed
          ? "bg-green text-white"
          : active
            ? "bg-main text-white"
            : "bg-gray-200 text-gray-400"
          }`}
      >
        {icon}
      </div>
      <div
        className={`mt-3 text-sm font-medium transition-colors ${completed || active ? "text-textPrimary" : "text-textSecondary"
          }`}
      >
        {label}
      </div>
      <div className="text-xs text-textSecondary mt-1">
        {time ? new Date(time).toLocaleString() : "—"}
      </div>
    </div>
  );
}

// Mobile vertical timeline (new)
function MobileTimeline({ steps, currentIndex, timelineMap }) {
  return (
    <div className="space-y-4">
      {steps.map((s, idx) => {
        const completed = idx < currentIndex;
        const active = idx === currentIndex;
        return (
          <div key={s.key} className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${completed
                ? "bg-green text-white"
                : active
                  ? "bg-main text-white"
                  : "bg-gray-200 text-gray-400"
                }`}
            >
              {s.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-textPrimary">
                {s.label}
              </div>
              <div className="text-xs text-textSecondary mt-0.5">
                {timelineMap[s.key]
                  ? new Date(timelineMap[s.key]).toLocaleString()
                  : "—"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const PROGRESS_STEPS = [
  { key: "pending", label: "Pending", icon: <Clock size={20} /> },
  { key: "confirmed", label: "Confirmed", icon: <CircleCheckBig size={20} /> },
  { key: "processing", label: "Processing", icon: <TriangleAlert size={20} /> },
  { key: "shipped", label: "Shipped", icon: <Truck size={20} /> },
  { key: "delivered", label: "Delivered", icon: <Package size={20} /> },
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
  map.pending = map.pending ?? order.created_at ?? null;
  return map;
}
export default function OrderDetailsPane({ order }) {
  const dispatch = useDispatch();
  const [processingVendorCancel, setProcessingVendorCancel] = useState(null);
  const [reviewVendorId, setReviewVendorId] = useState(null);
  const [viewReviewVendorId, setViewReviewVendorId] = useState(null);

  if (!order)
    return (
      <div className="p-6 bg-bgSurface rounded-2xl border">
        Select an order to view details
      </div>
    );

  const vendorStatuses = (order.vendor_orders ?? []).map((v) =>
    (v.status ?? "pending").toLowerCase()
  );
  const activeStatuses = vendorStatuses.filter((s) => s !== "cancelled");
  const isAllCancelled = activeStatuses.length === 0;

  const statusToIndex = (status) =>
    PROGRESS_STEPS.findIndex((s) => s.key === status) ?? 0;

  const overallIndex = isAllCancelled
    ? -1
    : activeStatuses.length > 0
      ? Math.min(...activeStatuses.map(statusToIndex).filter((i) => i >= 0))
      : 0;

  const overallStatus = isAllCancelled
    ? "cancelled"
    : activeStatuses.length > 0
      ? PROGRESS_STEPS[overallIndex]?.key ?? "pending"
      : "pending";

  const isCancelled = overallStatus === "cancelled";
  const isDelivered = overallStatus === "delivered";

  const hasDelivered = activeStatuses.some((s) => s === "delivered");
  const isPartiallyDelivered =
    !isCancelled &&
    hasDelivered &&
    activeStatuses.some((s) => s !== "delivered");

  const timelineMap = useMemo(() => extractTimeline(order, order), [order]);

  const primaryVendorOrder = order.vendor_orders?.[0] ?? null;
  const a_s_a_raw =
    primaryVendorOrder?.order?.a_s_a ?? primaryVendorOrder?.order ?? null;
  // console.log(order);
  let parsedASA = null;
  if (typeof a_s_a_raw === "string") {
    parsedASA = safeParse(a_s_a_raw);
  } else if (typeof a_s_a_raw === "object" && a_s_a_raw) {
    parsedASA = safeParse(a_s_a_raw.a_s_a) ?? safeParse(a_s_a_raw) ?? a_s_a_raw;
  } else {
    parsedASA = null;
  }

  const billing = parsedASA?.billing ?? null;
  const totals = parsedASA?.totals ?? null;

  const handleVendorCancel = async (vendorOrder) => {
    if (!vendorOrder || !vendorOrder.id) return;
    const voId = vendorOrder.id;
    const orderKey = order.unid ?? order.id;

    const ok = window.confirm(
      "Do you want to request cancellation for this vendor order? This will attempt to release reserved stock and notify the vendor."
    );
    if (!ok) return;

    try {
      dispatch(
        updateOrderLocally({
          orderUnidOrId: orderKey,
          patch: {
            vendor_orders: (order.vendor_orders ?? []).map((v) =>
              v.id === voId
                ? { ...v, status: "cancelled", cancelled_by: "customer" }
                : v
            ),
            status: (order.vendor_orders ?? []).every(
              (v) => (v.id === voId ? "cancelled" : v.status) === "cancelled"
            )
              ? "cancelled"
              : order.status,
          },
        })
      );

      setProcessingVendorCancel(voId);
      await cancelVendorOrderApi(voId, {
        reason: "Customer requested vendor-order cancellation",
      });
      setProcessingVendorCancel(null);
      showToast?.("Cancellation requested successfully.");
    } catch (err) {
      setProcessingVendorCancel(null);
      showToast?.("Failed to request cancellation. Please contact support.");
      console.error("Vendor cancel error", err);
    }
  };

  const generateInvoice = async () => {
    const activeVendorOrders =
      order.vendor_orders?.filter(
        (v) => (v.status ?? "").toLowerCase() !== "cancelled"
      ) ?? [];

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(
      <OrderInvoiceTemplate
        order={order}
        billing={billing}
        activeVendorOrders={activeVendorOrders}
        totals={totals}
      />
    );

    setTimeout(async () => {
      const element = document.getElementById("invoice-template");
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice_${order.unid}.pdf`);
      document.body.removeChild(container);
    }, 500);
  };

  return (
    <div
      className={`p-4 md:p-6 bg-bgSurface rounded-lg border ${isCancelled ? "opacity-70 grayscale" : ""
        }`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold text-textPrimary">
            Order ID: <span className="text-main">{order.unid}</span>
          </h2>
          <p className="text-sm text-textSecondary mt-1">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <div className="w-full lg:w-72 text-right">
          <StatusBadge status={overallStatus} />
          <div className="text-xl md:text-2xl font-semibold mt-3">
            ৳ {order.total_amount}
          </div>
        </div>
      </div>

      {/* Billing + Totals */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 p-4 border rounded-lg bg-white">
          <h4 className="font-medium mb-2">Shipping / Billing Address</h4>
          {billing ? (
            <div className="text-sm text-textSecondary space-y-1">
              <div className="font-medium">
                {billing.fullName ?? billing.fullname ?? billing.name}
              </div>
              <div>{billing.phone ?? billing.phoneNumber ?? ""}</div>
              <div>
                {billing.line1 ?? billing.addressLine ?? billing.address}
              </div>
              <div>
                {[billing.city, billing.area, billing.postalCode]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
          ) : (
            <div className="text-sm text-textSecondary">
              No address available
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <h4 className="font-medium mb-2">Order Totals</h4>
          <div className="text-sm text-textSecondary space-y-1">
            <div>Subtotal: ৳ {totals?.subtotal ?? order.total_amount}</div>
            <div>Shipping: ৳ {totals?.shipping ?? "—"}</div>
            <div className="font-semibold mt-2">
              Grand Total: ৳ {totals?.grandTotal ?? order.total_amount}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline (FIXED) */}
      <div className="mt-6 p-6 bg-white rounded-xl border shadow-sm">
        {/* Mobile: vertical */}
        <div className="md:hidden">
          <MobileTimeline
            steps={PROGRESS_STEPS}
            currentIndex={overallIndex}
            timelineMap={timelineMap}
          />
        </div>

        {/* Desktop: original horizontal */}
        <div className="hidden md:block relative">
          <div className="absolute top-6 left-0 w-full h-1">
            {PROGRESS_STEPS.map((_, idx) => {
              if (idx === PROGRESS_STEPS.length - 1) return null;
              const lineCompleted = idx < overallIndex;
              return (
                <div
                  key={`line-${idx}`}
                  className={`absolute h-1 ${lineCompleted ? "bg-green" : "bg-gray-200"
                    }`}
                  style={{
                    left: `${(idx / (PROGRESS_STEPS.length - 1)) * 100}%`,
                    width: `${100 / (PROGRESS_STEPS.length - 1)}%`,
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between relative">
            {PROGRESS_STEPS.map((s, idx) => {
              const completed = idx < overallIndex;
              const active = idx === overallIndex;
              const ts = timelineMap[s.key];

              return (
                <Step
                  key={s.key}
                  icon={s.icon}
                  label={s.label}
                  time={ts}
                  active={active}
                  completed={completed}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Shipment Details */}
      {(order.courier_name ||
        order.tracking_number ||
        order.tracking_url ||
        order.estimated_delivery) && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Shipment Details</h4>
            <div className="text-sm text-blue-800 space-y-1">
              {order.courier_name && <div>Courier: {order.courier_name}</div>}
              {order.tracking_number && (
                <div>Tracking #: {order.tracking_number}</div>
              )}
              {order.estimated_delivery && (
                <div>
                  Estimated Delivery:{" "}
                  {new Date(order.estimated_delivery).toLocaleDateString()}
                </div>
              )}
              {order.tracking_url && (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-main hover:underline"
                >
                  <PackageSearch size={14} /> Track Shipment
                </a>
              )}
              {order.vendor_orders?.length > 1 && (
                <p className="text-xs mt-2">
                  Note: Check vendor sections for individual tracking if multiple
                  couriers are used.
                </p>
              )}
            </div>
          </div>
        )}

      {/* Vendor orders list */}
      <div className="mt-6 space-y-4">
        {(order.vendor_orders ?? []).map((v) => {
          const vTimeline = extractTimeline(order, v);
          const vStatus = (v.status ?? "").toLowerCase();
          const isPending = vStatus === "pending";
          const isDelivered = vStatus === "delivered";
          const isVendorCancelled =
            vStatus === "cancelled" && v.cancelled_by === "vendor";

          const vendorImage = makeImageUrl(v.vendor?.logo ?? v.vendor?.image);
          const hasVendorImage =
            vendorImage && vendorImage !== "null" && vendorImage !== "";
          const vendorName =
            v.vendor?.shop_name ?? v.vendor?.business_name ?? "Unknown Vendor";

          const hasReviewed = (v.items ?? []).some((item) => !!item.review);

          return (
            <div
              key={v.unid}
              className={`p-4 bg-white rounded-lg border flex flex-col md:flex-row md:justify-between gap-4 ${vStatus === "cancelled" ? "opacity-70 grayscale" : ""
                }`}
            >
              <div className="flex gap-4 items-start">
                {hasVendorImage ? (
                  <img
                    src={vendorImage}
                    alt={vendorName}
                    className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}

                <div
                  className={`w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg border shadow-sm ${hasVendorImage ? "hidden" : "flex"
                    }`}
                >
                  <Store size={36} className="text-gray-400" />
                </div>

                <div>
                  <div className="text-sm font-semibold">{vendorName}</div>
                  <div className="text-xs text-textSecondary mt-1">
                    Items: {v.item_count}
                  </div>
                  <div className="text-xs text-textSecondary mt-1">
                    Subtotal: ৳ {v.subtotal}
                  </div>
                  <div className="mt-2 space-y-1">
                    {(v.items ?? []).map((it) => (
                      <div
                        key={it.unid}
                        className="text-xs text-textSecondary flex items-center gap-2"
                      >
                        <img
                          src={makeImageUrl(it.image?.image_path)}
                          alt={it.product?.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <div>
                          <p>{it.product?.name}</p>
                          <span className="text-xs">
                            {it.variant?.sku} • Qty: {it.quantity} • ৳{" "}
                            {it.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <div className="text-right">
                  <StatusBadge status={v.status} />
                  <div className="text-xs text-textSecondary mt-2">
                    {vTimeline[vStatus] || v.updated_at || v.created_at
                      ? new Date(
                        vTimeline[vStatus] || v.updated_at || v.created_at
                      ).toLocaleString()
                      : ""}
                  </div>
                </div>

                <div className="mt-3 flex flex-col items-end gap-2">
                  {(v.tracking_number || v.tracking_url) && (
                    <button
                      onClick={() =>
                        v.tracking_url
                          ? window.open(v.tracking_url, "_blank")
                          : showToast(`Tracking #: ${v.tracking_number}`)
                      }
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-md hover:bg-blue-200 transition flex items-center gap-1"
                    >
                      <PackageSearch size={14} /> Track
                    </button>
                  )}

                  {vStatus === "cancelled" ? (
                    <>
                      {isVendorCancelled && v.cancel_reason && (
                        <p className="text-xs text-red-600 mb-2">
                          Reason: {v.cancel_reason}
                        </p>
                      )}
                      <button
                        onClick={() => (window.location.href = "/support")}
                        className="px-3 py-1 border rounded-md text-xs hover:bg-gray-100 transition"
                      >
                        Contact Support
                      </button>
                    </>
                  ) : isPending ? (
                    <button
                      onClick={() => handleVendorCancel(v)}
                      disabled={processingVendorCancel === v.id}
                      className="px-3 py-1 bg-main/10 text-main text-xs border border-main rounded-md hover:bg-main/5 transition disabled:opacity-50"
                    >
                      {processingVendorCancel === v.id
                        ? "Processing..."
                        : "Cancel Order"}
                    </button>
                  ) : isDelivered ? (
                    hasReviewed ? (
                      <button
                        onClick={() => setViewReviewVendorId(v.id)}
                        className="px-3 py-1 bg-main/10 text-main text-xs border border-main rounded-md hover:bg-main/5 transition"
                      >
                        View Your Review
                      </button>
                    ) : (
                      <button
                        onClick={() => setReviewVendorId(v.id)}
                        className="px-3 py-1 bg-main/10 text-main text-xs border border-main rounded-md hover:bg-main/5 transition"
                      >
                        Write Review
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => (window.location.href = "/support")}
                      className="px-3 py-1 border rounded-md text-xs hover:bg-gray-100 transition"
                    >
                      Contact Support
                    </button>
                  )}
                </div>
              </div>

              {reviewVendorId === v.id && (
                <WriteReviewModal
                  order={order}
                  vendorOrder={v}
                  onClose={() => setReviewVendorId(null)}
                />
              )}
              {viewReviewVendorId === v.id && (
                <ViewReviewModal
                  order={order}
                  vendorOrder={v}
                  onClose={() => setViewReviewVendorId(null)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 justify-end">
          {!isCancelled && (
            <button
              onClick={generateInvoice}
              className="px-5 py-2 bg-main text-white rounded-md hover:opacity-90 transition flex items-center gap-2"
            >
              <Download size={18} /> Download Invoice
            </button>
          )}
          {!isCancelled &&
            !isDelivered &&
            order.payment_status === "unpaid" && (
              <>
                <button className="px-5 py-2 bg-main text-white rounded-md hover:opacity-90 transition">
                  Pay Now
                </button>
                {isPartiallyDelivered && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Note: Partial delivery detected. Confirm before paying.
                  </p>
                )}
              </>
            )}

          {!isCancelled &&
            !isDelivered &&
            order.payment_status !== "unpaid" && (
              <div className="px-5 py-2 bg-green/10 text-green rounded-md font-semibold">
                Paid
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
