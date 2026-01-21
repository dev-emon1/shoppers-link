// src/pages/admin/vendors/VendordataPage.jsx
import React, { useState, useEffect } from "react";
import {
    Search, Download, CheckCircle, XCircle, Eye, Building2, MapPin,
    Phone, Mail, User, AlertCircle, Check, X
} from "lucide-react";
import API from "../../../utils/api";
import VendorDetailsModal from "../../../components/ui/VendorDetailsModal";

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
        const isActive = v.user?.status === 1;

        return matchesSearch && isActive;
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
                    <h1 className="text-xl font-bold text-gray-800">All Partner</h1>
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

            {/* Table */}
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
                        <tbody className="divide-y divide-gray-200 text-sm">
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
                                                        <Building2 size={24} className="text-gray-500 ml-3 mt-3" />
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
                getStatusDisplay={getStatusDisplay}
            />
        </div >
    );
};

export default VendordataPage;