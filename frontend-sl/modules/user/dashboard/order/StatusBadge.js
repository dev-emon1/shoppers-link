// modules/user/components/dashboard/order/StatusBadge.jsx
"use client";
import React from "react";

const STATUS_MAP = {
  pending: { label: "Pending", className: "bg-yellow/5 text-yellow" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800" },
  processing: {
    label: "Processing",
    className: "bg-indigo-100 text-indigo-800",
  },
  shipped: { label: "Shipped", className: "bg-sky-100 text-sky-800" },
  delivered: { label: "Delivered", className: "bg-green/10 text-green" },
  cancelled: { label: "Cancelled", className: "bg-red/10 text-red" },
};

export default function StatusBadge({ status }) {
  const key = (status ?? "").toLowerCase();
  const s = STATUS_MAP[key] ?? {
    label: status ?? "Unknown",
    className: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-0.5 text-xs font-medium rounded ${s.className}`}
    >
      {s.label}
    </span>
  );
}
