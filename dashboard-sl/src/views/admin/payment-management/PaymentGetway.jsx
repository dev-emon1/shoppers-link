import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Download } from 'lucide-react';

const AllPaymentSystemsPage = () => {
    const [paymentMethods, setPaymentMethods] = useState([
        { id: 1, name: "Visa", logo: "/images/payment/visa.jpg", status: "Active" },
        { id: 2, name: "MasterCard", logo: "/images/payment/master.png", status: "Active" },
        { id: 3, name: "American Express", logo: "/images/payment/american.jpg", status: "Active" },
        // { id: 4, name: "UnionPay", logo: "/images/payment/union.jpg", status: "Active" },
        { id: 5, name: "DBBL Nexus", logo: "/images/payment/nexus.png", status: "Active" },
        { id: 6, name: "bKash", logo: "/images/payment/bkash.jpg", status: "Active" },
        { id: 7, name: "Nagad", logo: "/images/payment/nagad.png", status: "Active" },
        { id: 8, name: "Rocket", logo: "/images/payment/rocket.png", status: "Active" },
        { id: 9, name: "Upay", logo: "/images/payment/upay.png", status: "Active" },
        { id: 10, name: "Tap", logo: "/images/payment/tap.jpg", status: "Active" },
        { id: 11, name: "OK Wallet", logo: "/images/payment/ok.png", status: "Active" },
        { id: 12, name: "MyCash", logo: "/images/payment/mycash.jpg", status: "Inactive" },
        { id: 13, name: "FastCash", logo: "/images/payment/fastcash.jpg", status: "Active" },
        { id: 14, name: "Citytouch", logo: "/images/payment/city.jpg", status: "Active" },
        // { id: 15, name: "BRAC Bank", logo: "/images/payment/brac.jpg", status: "Active" },
        // { id: 16, name: "AB Bank", logo: "/images/payment/ab.jpg", status: "Active" },
        // { id: 17, name: "MTB", logo: "https://i.ibb.co/4pXj5nQ/mtb.png", status: "Active" },
        // { id: 18, name: "Southeast Bank", logo: "https://i.ibb.co/4pXj5nQ/southeast.png", status: "Active" },
        // { id: 19, name: "Mutual Trust Bank", logo: "https://i.ibb.co/4pXj5nQ/mtb2.png", status: "Active" },
        // { id: 20, name: "Dhaka Bank", logo: "https://i.ibb.co/4pXj5nQ/dhakabank.png", status: "Active" },
        // { id: 21, name: "Islamic Finance", logo: "https://i.ibb.co/4pXj5nQ/islamic.png", status: "Active" },
        { id: 22, name: "iPay", logo: "/images/payment/ipay.jpg", status: "Active" },
    ]);

    const toggleStatus = (id) => {
        setPaymentMethods(prev => prev.map(m =>
            m.id === id ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" } : m
        ));
    };

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 text-xl">All Payment Systems</h1>
                    <p className="text-gray-600 mt-1">14 Payment Methods Available • Fully Integrated</p>
                </div>
                {/* <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    <Download size={20} />
                    Export Report
                </button> */}
            </div>

            {/* Real Logos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-6">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center border-2 ${method.status === "Active" ? "border-green-200" : "border-red-200 opacity-75"
                            }`}
                    >
                        <div className="mb-4">
                            <img
                                src={method.logo}
                                alt={method.name}
                                className="w-24 h-16 mx-auto object-contain"
                            />
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm">{method.name}</h3>
                        <div className="mt-4">
                            <button
                                onClick={() => toggleStatus(method.id)}
                                className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-full text-xs font-semibold transition-all ${method.status === "Active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                    }`}
                            >
                                {method.status === "Active" ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                {method.status}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-sm text-gray-500">
                    Last updated: November 20, 2025 • Supports all major cards, mobile wallets & banks in Bangladesh
                </p>
            </div>
        </div>
    );
};

export default AllPaymentSystemsPage;