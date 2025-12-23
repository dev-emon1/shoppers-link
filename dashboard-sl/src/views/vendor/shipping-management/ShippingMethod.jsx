import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Download, Truck } from 'lucide-react';

const AllShippingPartnersPage = () => {
    const [partners, setPartners] = useState([
        { id: 1, name: "Pathao Delivery", logo: "/images/courier/pathao.png", status: "Active", orders: 4123, codCollected: "৳ 8.9 Cr", coverage: "64 Districts" },
        { id: 2, name: "RedX", logo: "/images/courier/redex.png", status: "Active", orders: 3892, codCollected: "৳ 8.2 Cr", coverage: "64 Districts" },
        { id: 3, name: "Sundarban Courier", logo: "/images/courier/sundarban.png", status: "Active", orders: 2987, codCollected: "৳ 5.6 Cr", coverage: "All Bangladesh" },
        { id: 4, name: "eCourier", logo: "/images/courier/ecourier.png", status: "Active", orders: 1876, codCollected: "৳ 3.9 Cr", coverage: "64 Districts" },
        { id: 5, name: "SA Paribahan", logo: "/images/courier/sa.png", status: "Active", orders: 2345, codCollected: "৳ 4.8 Cr", coverage: "Nationwide" },
        // { id: 6, name: "Paperfly", logo: "/images/courier/paper.png", status: "Active", orders: 1987, codCollected: "৳ 4.1 Cr", coverage: "64 Districts" },
        { id: 7, name: "Steadfast Courier", logo: "/images/courier/st.png", status: "Active", orders: 3124, codCollected: "৳ 6.7 Cr", coverage: "All Bangladesh" },
    ]);

    const toggleStatus = (id) => {
        setPartners(prev => prev.map(p =>
            p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p
        ));
    };

    const totalCOD = partners.reduce((sum, p) => {
        const amount = parseFloat(p.codCollected.replace(/[^0-9.]/g, '')) * (p.codCollected.includes('Cr') ? 10000000 : 100000);
        return sum + amount;
    }, 0);

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">All Shipping Partners</h1>
                    <p className="text-gray-600 mt-1">6 Delivery Partners • Nationwide Coverage</p>
                </div>
                {/* <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    <Download size={20} />
                    Export Report
                </button> */}
            </div>

            {/* Real Logos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {partners.map((partner) => (
                    <div
                        key={partner.id}
                        className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center border-2 ${partner.status === "Active" ? "border-green-200" : "border-red-200 opacity-75"
                            }`}
                    >
                        <div className="mb-4">
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="w-28 h-20 mx-auto object-contain"
                            />
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm">{partner.name}</h3>
                        {/* <p className="text-xs text-gray-500 mt-1">{partner.coverage}</p> */}
                        {/* <p className="text-sm font-medium text-green-600 mt-2">{partner.codCollected}</p>
                        <p className="text-xs text-gray-500">{partner.orders.toLocaleString()} orders</p> */}

                        <div className="mt-4">
                            <button
                                onClick={() => toggleStatus(partner.id)}
                                className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-full text-xs font-semibold transition-all ${partner.status === "Active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                    }`}
                            >
                                {partner.status === "Active" ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                {partner.status}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-sm text-gray-500">
                    Last updated: November 20, 2025 • Full coverage across all 64 districts of Bangladesh
                </p>
            </div>
        </div>
    );
};

export default AllShippingPartnersPage;