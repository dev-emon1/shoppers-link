"use client";

import React, { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Eye, Building2 } from "lucide-react";
import API from "../../../utils/api";
import VendorDetailsModal from "../../../components/ui/VendorDetailsModal";
import { toast } from "react-toastify";

<<<<<<< HEAD
const VendordataPage = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;
    // Modal State
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // console.log(vendors);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const res = await API.get("/vendors");
                setVendors(res.data.data || res.data || []);
            } catch (err) {
                alert("Failed to load vendors");
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(v => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            v.shop_name?.toLowerCase().includes(search) ||
            v.owner_name?.toLowerCase().includes(search) ||
            v.contact_number?.includes(search) ||
            v.user?.email?.toLowerCase().includes(search);
        const userStatusCondition = v.user?.status === 0;
        const vendorStatusCondition = v.status === 1;
        return matchesSearch && userStatusCondition && vendorStatusCondition;
    });

    const paginated = filteredVendors.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

    // Status Badge + Text
    const getStatusDisplay = (status) => {
        if (status === 1) {
            return { text: "Active", color: "text-green", icon: <Check size={16} /> };
        } else if (status === 0) {
            return { text: "Pending", color: "text-yellow", icon: <AlertCircle size={16} /> };
        } else {
            return { text: "Rejected", color: "bg-red text-red", icon: <X size={16} /> };
        }
    };

    const updateVendorStatus = (vendorId, newStatus) => {
        setVendors(prev => prev.map(v =>
            v.id === vendorId ? { ...v, user: { ...v.user, status: newStatus } } : v
        ));

        if (selectedVendor?.id === vendorId) {
            setSelectedVendor(prev => ({
                ...prev,
                user: { ...prev.user, status: newStatus }
            }));
        }
        toast.success("Vendor status updated");
    };

    const handleApprove = async (vendorId) => {
        if (!confirm("Approve this vendor?")) return;
        try {
            await API.patch(`/vendor/${vendors.find(v => v.id === vendorId)?.user?.id}/approve`);
            updateVendorStatus(vendorId, 1);
            toast.success("Vendor approved!");
        } catch (err) {
            toast.error("Failed to approve");
        }
    };

    const handleReject = async (vendorId) => {
        if (!confirm("Reject this vendor? This action cannot be undone.")) return;

        const vendor = vendors.find(v => v.id === vendorId);
        if (!vendor?.user?.id) return;

        try {
            await API.patch(`/vendor/${vendor.user.id}/reject`);

            // এই লাইনটা চেঞ্জ করো — লিস্ট থেকে সরিয়ে ফেলো!
            setVendors(prev => prev.filter(v => v.id !== vendorId));

            // যদি মডাল খোলা থাকে — সেটাও বন্ধ করে দাও
            if (selectedVendor?.id === vendorId) {
                closeModal();
            }

            toast.warning("Vendor rejected and removed from list.");
        } catch (err) {
            toast.error("Failed to reject vendor");
        }
    };
    const openModal = (vendor) => {
        setSelectedVendor(vendor);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVendor(null);
    };
    if (loading) {
        return <div className="text-center py-32 text-xl text-gray-600">Loading data...</div>;
    }

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-4 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Partner Onboarding Requests</h1>
                    <p className="text-gray-600 mt-1">Review and manage partner applications</p>
                </div>
                <div className="flex justify-between gap-4">
                    <div className="flex-1 w-2xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by shop, owner, email, phone..."
                                className="pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-main"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            />
                        </div>
                    </div>
                    {/* <button className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:bg-mainHover transition">
                        <Download size={20} /> Export CSV
                    </button> */}
                </div>
            </div>
            {/* {/* Table  */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-main to-mainHover text-white text-sm">
                            <tr>
                                <th className="px-4 py-2 text-left">Business Name</th>
                                <th className="px-4 py-2 text-left">Owner</th>
                                <th className="px-4 py-2 text-left">Contact</th>
                                <th className="px-4 py-2 text-left">Address</th>
                                <th className="px-4 py-2 text-center">Status</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginated.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-2 text-gray-500">No vendors found</td></tr>
                            ) : (
                                paginated.map((v) => {
                                    const statusInfo = getStatusDisplay(v.user?.status);

                                    return (
                                        <tr key={v.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-center">
                                                        <Building2 size={24} className="text-gray-500 ml-2.5 mt-2.5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{v.shop_name}</div>
                                                        {/* <div className="text-sm text-gray-500">ID: V{v.id.toString().padStart(4, '0')}</div> */}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-gray-500" />
                                                    <span className="font-medium">{v.owner_name}</span>
                                                </div>
                                                {/* <div className="text-sm text-gray-600">{v.user?.user_name}</div> */}
                                            </td>

                                            <td className="px-4 py-2 text-sm">
                                                <div className="flex items-center gap-2"><Phone size={14} /> {v.contact_number}</div>
                                                <div className="flex items-center gap-2"><Mail size={14} /> {v.user?.email}</div>
                                            </td>

                                            <td className="px-4 py-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-gray-500" />
                                                    {v.address || "Not provided"}
                                                </div>
                                            </td>

                                            <td className="px-4 py-2 text-center">
                                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${statusInfo.color}`}>
                                                    {statusInfo.icon} {statusInfo.text}
                                                </span>
                                            </td>

                                            <td className="px-4 py-2 text-center">
                                                {v.user?.status === 0 ? (
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            onClick={() => handleApprove(v.id)}
                                                            className="text-green hover:text-green font-medium flex items-center gap-1"
                                                        >
                                                            <CheckCircle size={18} /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(v.id)}
                                                            className="text-red hover:text-red font-medium flex items-center gap-1"
                                                        >
                                                            <XCircle size={18} /> Reject
                                                        </button>
                                                    </div>
                                                ) : v.user?.status === 1 ? (
                                                    <span className="text-green font-medium flex items-center gap-1">
                                                        <Check size={18} /> Approved
                                                    </span>
                                                ) : (
                                                    <span className="text-red font-medium flex items-center gap-1">
                                                        <X size={18} /> Rejected
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => openModal(v)}
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    <Eye size={18} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-2 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
                    <p className="text-gray-600">
                        Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredVendors.length)} of {filteredVendors.length}
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-2 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100">Previous</button>
                        <span className="px-2 py-1 bg-main text-white rounded-lg">{page} / {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className="px-2 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100">Next</button>
                    </div>
                </div>
            </div>
            {/* Modal */}
            <VendorDetailsModal
                vendor={selectedVendor}
                isOpen={isModalOpen}
                onClose={closeModal}
                onApprove={handleApprove}
                onReject={handleReject}
                getStatusDisplay={getStatusDisplay}
            />
        </div >
    );
=======
const STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  PENDING: 2,
  SUSPENDED: 3,
  REJECTED: 4,
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
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
