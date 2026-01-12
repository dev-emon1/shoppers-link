// src/components/modals/VendorDetailsModal.jsx
import React from "react";
import {
    Building2, User, Phone, Mail, MapPin, X, CheckCircle, XCircle, Check, X as RejectIcon, AlertCircle
} from "lucide-react";

const VendorDetailsModal = ({
    vendor,
    isOpen,
    onClose,
    onApprove = () => { },    // ← ডিফল্ট ফাংশন (কিছু না করবে)
    onReject = () => { },     // ← ডিফল্ট ফাংশন (কিছু না করবে)
    getStatusDisplay = () => ({ text: "Unknown", color: "bg-gray-100 text-gray-800", icon: null })
}) => {
    if (!isOpen || !vendor) return null;

    const statusInfo = getStatusDisplay(vendor);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[90] flex items-center justify-center p-4 overflow-y-auto ">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-[95%] p-5 relative overflow-auto max-h-[90vh]">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Partner Information</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={28} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Side */}
                        <div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Building2 size={20} className="text-gray-500" />
                                    <div>
                                        <p className="font-medium">{vendor.shop_name}</p>
                                        <p className="text-sm text-gray-600">Shop ID: V{vendor.id.toString().padStart(4, '0')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <User size={20} className="text-gray-500" />
                                    <div>
                                        <p className="font-medium">{vendor.owner_name}</p>
                                        <p className="text-sm text-gray-600">{vendor.user?.user_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={20} className="text-gray-500" />
                                    <p>{vendor.contact_number}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={20} className="text-gray-500" />
                                    <p>{vendor.user?.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin size={20} className="text-gray-500" />
                                    <p>{vendor.address || "Not provided"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div>
                            <p className="text-md font-bold mb-2">Documents</p>
                            <div className="space-y-4">
                                <div>
                                    <div className="space-y-2 text-sm border p-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-600">Trade License:</span>
                                            <span className="text-gray-900">{vendor.trade_license}</span>
                                        </div>
                                        <div className="flex justify-between border-b">
                                            <span className="font-semibold text-gray-600">eTIN:</span>
                                            <span className="text-gray-900">{vendor.etin}</span>
                                        </div>
                                        <div className="flex justify-between border-b">
                                            <span className="font-semibold text-gray-600">National ID (NID):</span>
                                            <span className="text-gray-900">{vendor.nid}</span>
                                        </div>


                                    </div>
                                </div>

                                <div>
                                    <p className="text-md font-bold mb-2">Current Status</p>
                                    <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-md font-bold ${getStatusDisplay(vendor.user?.status).color}`}>
                                        {getStatusDisplay(vendor.user?.status).icon}
                                        {getStatusDisplay(vendor.user?.status).text}
                                    </div>
                                </div>

                                {/* Approve/Reject Buttons in Modal */}
                                {vendor.user?.status === 0 && (
                                    <div className="flex gap-4 mt-6 text-sm">
                                        <button
                                            onClick={() => onApprove(vendor.id)}
                                            className="flex-1 bg-green text-white py-2 rounded-lg hover:bg-green transition font-medium flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={20} /> Approve Vendor
                                        </button>
                                        <button
                                            onClick={() => onReject(vendor.id)}
                                            className="flex-1 bg-red text-white py-2 rounded-lg hover:bg-red transition font-medium flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={20} /> Reject Vendor
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default VendorDetailsModal;