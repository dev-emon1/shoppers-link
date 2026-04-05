"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  PauseCircle,
  PlayCircle,
  XCircle,
} from "lucide-react";
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

const SuspendedVendors = () => {
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

    const matchesSearch =
      v.shop_name?.toLowerCase().includes(search) ||
      v.owner_name?.toLowerCase().includes(search) ||
      v.contact_number?.includes(search) ||
      v.user?.email?.toLowerCase().includes(search);

    // 🔥 ONLY SUSPENDED
    const isSuspended = v.user?.status === STATUS.SUSPENDED;

    return matchesSearch && isSuspended;
  });

  // ================= PAGINATION =================
  const paginated = filteredVendors.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  // ================= UPDATE =================
  const updateVendorStatus = (vendorId, newStatus) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, user: { ...v.user, status: newStatus } }
          : v,
      ),
    );

    if (selectedVendor?.id === vendorId) {
      setSelectedVendor((prev) => ({
        ...prev,
        user: { ...prev.user, status: newStatus },
      }));
    }
  };

  // ================= ACTIONS =================

  // 🟢 Activate
  const handleActivate = async (vendorId) => {
    if (!confirm("Activate this vendor?")) return;

    const vendor = vendors.find((v) => v.id === vendorId);

    try {
      await API.post(`/admin/users/${vendor.user.id}/status`, {
        status: "active",
      });

      updateVendorStatus(vendorId, STATUS.ACTIVE);

      toast.success("Vendor activated");
    } catch {
      toast.error("Failed to activate");
    }
  };

  // 🔴 Deactivate
  const handleDeactivate = async (vendorId) => {
    if (!confirm("Deactivate this vendor?")) return;

    const vendor = vendors.find((v) => v.id === vendorId);

    try {
      await API.post(`/admin/users/${vendor.user.id}/status`, {
        status: "inactive",
      });

      updateVendorStatus(vendorId, STATUS.INACTIVE);

      toast.warning("Vendor deactivated");
    } catch {
      toast.error("Failed to deactivate");
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
      <div className="text-center py-32 text-xl text-gray-600">
        Loading data...
      </div>
    );
  }

  return (
    <div className="px-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center my-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Suspended Vendors</h1>
          <p className="text-gray-500 text-sm">
            Vendors temporarily blocked by admin
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by shop, owner, email..."
              className="pl-12 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-main"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-main to-mainHover text-white text-sm">
              <tr>
                <th className="px-4 py-2 text-left">Business</th>
                <th className="px-4 py-2 text-left">Owner</th>
                <th className="px-4 py-2 text-left">Contact</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y text-sm">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No suspended vendors found
                  </td>
                </tr>
              ) : (
                paginated.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    {/* BUSINESS */}
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-center">
                          <Building2 className="text-gray-500 ml-3 mt-3" />
                        </div>
                        <div className="font-bold">{v.shop_name}</div>
                      </div>
                    </td>

                    {/* OWNER */}
                    <td className="px-4 py-2 flex items-center gap-2">
                      <User size={14} /> {v.owner_name}
                    </td>

                    {/* CONTACT */}
                    <td className="px-4 py-2 text-xs">
                      <div className="flex gap-2">
                        <Phone size={12} /> {v.contact_number}
                      </div>
                      <div className="flex gap-2">
                        <Mail size={12} /> {v.user?.email}
                      </div>
                    </td>

                    {/* ADDRESS */}
                    <td className="px-4 py-2 text-xs flex gap-2">
                      <MapPin size={12} /> {v.address || "N/A"}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-2 text-center">
                      <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700 flex items-center justify-center gap-1">
                        <PauseCircle size={12} /> Suspended
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-2 text-center space-y-1">
                      <div className="flex justify-center gap-3">
                        {/* Activate */}
                        <button
                          onClick={() => handleActivate(v.id)}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 text-xs"
                        >
                          <PlayCircle size={14} /> Activate
                        </button>

                        {/* Deactivate */}
                        <button
                          onClick={() => handleDeactivate(v.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs"
                        >
                          <XCircle size={14} /> Deactivate
                        </button>
                      </div>

                      <button
                        onClick={() => openModal(v)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 justify-center text-xs"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-2 bg-gray-50 flex justify-between items-center text-sm">
          <p>
            Showing {(page - 1) * itemsPerPage + 1} to{" "}
            {Math.min(page * itemsPerPage, filteredVendors.length)} of{" "}
            {filteredVendors.length}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 py-1 border rounded"
            >
              Previous
            </button>

            <span className="px-2 py-1 bg-main text-white rounded">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2 py-1 border rounded"
            >
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
      />
    </div>
  );
};

export default SuspendedVendors;
