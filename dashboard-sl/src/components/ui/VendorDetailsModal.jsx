"use client";

import React, { useState } from "react";
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  X,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import API from "../../utils/api";
import { toast } from "react-toastify";

const VendorDetailsModal = ({
  vendor,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onSuspend,
  onDeactivate,
  getStatusDisplay,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !vendor) return null;

  const statusInfo = getStatusDisplay
    ? getStatusDisplay(vendor.user?.status)
    : { text: "Unknown", color: "bg-gray-100 text-gray-800", icon: null };

  // 🔥 SAFE STATUS UPDATE (optional)
  const handleStatusChange = async (status) => {
    try {
      setLoading(true);

      await API.post(`/admin/users/${vendor.user.id}/status`, {
        status,
      });

      toast.success("Status updated");

      refreshData?.(); // optional
      onClose?.();
    } catch {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-bgSurface rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-textPrimary">
            Vendor Details
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-5">
            <div className="bg-bgPage border border-border p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-textSecondary mb-3">
                Business Info
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex gap-3">
                  <Building2 />
                  <div>
                    <p className="font-semibold">{vendor.shop_name}</p>
                    <p className="text-xs text-textLight">ID: {vendor.id}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <User />
                  <div>
                    <p>{vendor.owner_name}</p>
                    <p className="text-xs text-textLight">
                      {vendor.user?.user_name}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone />
                  <p>{vendor.contact_number}</p>
                </div>

                <div className="flex gap-3">
                  <Mail />
                  <p>{vendor.user?.email}</p>
                </div>

                <div className="flex gap-3">
                  <MapPin />
                  <p>{vendor.address || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div className="bg-bgSurface border border-border p-4 rounded-xl">
              <h3 className="text-sm font-semibold mb-2">Status</h3>

              <span
                className={`px-3 py-1 rounded-full text-xs ${statusInfo.color}`}
              >
                {statusInfo.text}
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* DOCUMENT */}
            <div className="bg-bgPage border border-border p-4 rounded-xl">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText size={14} /> Documents
              </h3>

              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Trade License</span>
                  <span>{vendor.trade_license}</span>
                </div>

                <div className="flex justify-between">
                  <span>eTIN</span>
                  <span>{vendor.etin}</span>
                </div>

                <div className="flex justify-between">
                  <span>NID</span>
                  <span>{vendor.nid}</span>
                </div>
              </div>
            </div>

            {/* 🔥 ACTIONS (SAFE + FLEXIBLE) */}
            <div className="bg-bgSurface border border-border p-4 rounded-xl">
              <h3 className="text-sm font-semibold mb-3">Actions</h3>

              <div className="flex flex-wrap gap-2">
                {/* EXISTING ACTIONS */}
                {onApprove && (
                  <button
                    onClick={() => onApprove(vendor.id)}
                    className="bg-green text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}

                {onReject && (
                  <button
                    onClick={() => onReject(vendor.id)}
                    className="bg-red text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                )}

                {onSuspend && (
                  <button
                    onClick={() => onSuspend(vendor.id)}
                    className="bg-yellow text-white px-3 py-1 rounded"
                  >
                    Suspend
                  </button>
                )}

                {onDeactivate && (
                  <button
                    onClick={() => onDeactivate(vendor.id)}
                    className="bg-red text-white px-3 py-1 rounded"
                  >
                    Deactivate
                  </button>
                )}

                {/* 🔥 FALLBACK CONTROL */}
                {!onApprove && !onReject && (
                  <>
                    <button
                      onClick={() => handleStatusChange("active")}
                      className="bg-green text-white px-3 py-1 rounded"
                    >
                      Activate
                    </button>

                    <button
                      onClick={() => handleStatusChange("suspended")}
                      className="bg-yellow text-white px-3 py-1 rounded"
                    >
                      Suspend
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;
