"use client";

import React, { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Eye, Building2 } from "lucide-react";
import API from "../../../utils/api";
import VendorDetailsModal from "../../../components/ui/VendorDetailsModal";
import { toast } from "react-toastify";

const STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  PENDING: 2,
  SUSPENDED: 3,
  REJECTED: 4,
};

export default function VendordataPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await API.get("/vendors");
        setVendors(res.data.data || res.data || []);
      } catch {
        toast.error("Failed to load vendors");
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  // ================= FILTER =================
  const filteredVendors = vendors.filter((v) => {
    const search = searchTerm.toLowerCase();

    const matches =
      v.shop_name?.toLowerCase().includes(search) ||
      v.owner_name?.toLowerCase().includes(search) ||
      v.contact_number?.includes(search) ||
      v.user?.email?.toLowerCase().includes(search);

    return matches && v.user?.status === STATUS.PENDING;
  });

  // ================= PAGINATION =================
  const paginated = filteredVendors.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  // ================= STATUS =================
  const getStatusDisplay = (status) => {
    switch (status) {
      case STATUS.PENDING:
        return {
          text: "Pending",
          color: "bg-yellow-100 text-yellow-700",
        };
      case STATUS.ACTIVE:
        return {
          text: "Active",
          color: "bg-green-100 text-green-700",
        };
      case STATUS.REJECTED:
        return {
          text: "Rejected",
          color: "bg-red-100 text-red-700",
        };
      default:
        return {
          text: "Unknown",
          color: "bg-gray-100 text-gray-600",
        };
    }
  };

  // ================= UPDATE =================
  const updateVendorStatus = (vendorId, newStatus) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, user: { ...v.user, status: newStatus } }
          : v,
      ),
    );
  };

  // ================= ACTIONS =================
  const handleApprove = async (vendorId) => {
    if (!confirm("Approve this vendor?")) return;

    const vendor = vendors.find((v) => v.id === vendorId);

    try {
      await API.post(`/admin/users/${vendor.user.id}/status`, {
        status: "active",
      });

      updateVendorStatus(vendorId, STATUS.ACTIVE);
      toast.success("Vendor approved");
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (vendorId) => {
    if (!confirm("Reject this vendor?")) return;

    const vendor = vendors.find((v) => v.id === vendorId);

    try {
      await API.post(`/admin/users/${vendor.user.id}/status`, {
        status: "rejected",
      });

      updateVendorStatus(vendorId, STATUS.REJECTED);
      toast.warning("Vendor rejected");
    } catch {
      toast.error("Failed to reject");
    }
  };

  // ================= MODAL =================
  const openModal = (vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVendor(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="text-center py-32 text-gray-500">Loading vendors...</div>
    );
  }

  return (
    <div className="px-6 py-4 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Partner Onboarding
          </h1>
          <p className="text-gray-500 text-sm">
            Review and approve vendor applications
          </p>
        </div>

        {/* SEARCH */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search vendors..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-main/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Business</th>
              <th className="px-6 py-4 text-left">Owner</th>
              <th className="px-6 py-4 text-left">Contact</th>
              <th className="px-6 py-4 text-left">Address</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No vendors found
                </td>
              </tr>
            ) : (
              paginated.map((v) => {
                const status = getStatusDisplay(v.user?.status);

                return (
                  <tr key={v.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Building2 size={16} />
                        </div>
                        <span className="font-medium">{v.shop_name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">{v.owner_name}</td>

                    <td className="px-6 py-4 text-xs">
                      <div>{v.contact_number}</div>
                      <div className="text-gray-400">{v.user?.email}</div>
                    </td>

                    <td className="px-6 py-4 text-xs">{v.address || "N/A"}</td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleApprove(v.id)}
                          className="text-green hover:text-green/60 text-xs flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>

                        <button
                          onClick={() => handleReject(v.id)}
                          className="text-red hover:text-red/60 text-xs flex items-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>

                        <button
                          onClick={() => openModal(v)}
                          className="text-gray-500 hover:text-gray-800 text-xs flex items-center gap-1"
                        >
                          <Eye size={14} /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* FOOTER */}
        <div className="px-6 py-3 flex justify-between text-xs text-gray-500 bg-gray-50">
          <span>{filteredVendors.length} results</span>

          <div className="flex gap-3">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <VendorDetailsModal
        vendor={selectedVendor}
        isOpen={isModalOpen}
        onClose={closeModal}
        getStatusDisplay={getStatusDisplay}
      />
    </div>
  );
}
