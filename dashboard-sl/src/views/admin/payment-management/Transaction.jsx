import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, Calendar, CreditCard, Smartphone, Package, AlertCircle, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';

const TransactionHistoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [methodFilter, setMethodFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    // Realistic Transaction Data - November 2025
    const transactions = [
        { id: "TXN8921741", orderId: "#ORD8921", date: "2025-11-19 14:32", customer: "Fatema Akter", method: "bKash", amount: 8500, fee: 157, net: 8343, status: "Success", type: "Payment" },
        { id: "TXN8921739", orderId: "#ORD8919", date: "2025-11-19 13:15", customer: "Ayesha Siddika", method: "Nagad", amount: 21275, fee: 372, net: 20903, status: "Success", type: "Payment" },
        { id: "TXN8921735", orderId: "#ORD8915", date: "2025-11-19 11:08", customer: "Rahim Karim", method: "COD", amount: 12800, fee: 0, net: 12800, status: "Pending", type: "COD" },
        { id: "TXN8921701", orderId: "#ORD8877", date: "2025-11-18 19:44", customer: "Md. Salman Khan", method: "Visa", amount: 21735, fee: 652, net: 21083, status: "Success", type: "Payment" },
        { id: "RFN8921698", orderId: "#ORD8866", date: "2025-11-18 16:22", customer: "Tanjila Rahman", method: "bKash", amount: -12800, fee: 0, net: -12800, status: "Refunded", type: "Refund" },
        { id: "TXN8921682", orderId: "#ORD8855", date: "2025-11-18 10:11", customer: "Arif Hossain", method: "Rocket", amount: 32900, fee: 592, net: 32308, status: "Success", type: "Payment" },
        { id: "TXN8921650", orderId: "#ORD8844", date: "2025-11-17 21:55", customer: "Sumaiya Islam", method: "COD", amount: 6750, fee: 202, net: 6548, status: "Success", type: "Payment" },
        { id: "RFN8921645", orderId: "#ORD8833", date: "2025-11-17 18:30", customer: "Nusrat Jahan", method: "Nagad", amount: -18500, fee: 0, net: -18500, status: "Refunded", type: "Refund" },
    ];

    // Filtering
    const filtered = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch = t.orderId.includes(searchTerm) ||
                t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.id.includes(searchTerm);
            const matchesMethod = methodFilter === 'All' || t.method === methodFilter;
            const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
            return matchesSearch && matchesMethod && matchesStatus;
        });
    }, [searchTerm, methodFilter, statusFilter]);

    // Sorting
    const sorted = useMemo(() => {
        let sortable = [...filtered];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    }, [filtered, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };

    const getMethodIcon = (method) => {
        const icons = {
            "bKash": "text-pink-600",
            "Nagad": "text-red-600",
            "Rocket": "text-purple-600",
            "COD": "text-orange-600",
            "Visa": "text-blue-600",
            "MasterCard": "text-orange-600",
        };
        return icons[method] || "text-gray-600";
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Success": return "bg-green-100 text-green-800 border-green-300";
            case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "Failed": return "bg-red-100 text-red-800 border-red-300";
            case "Refunded": return "bg-purple-100 text-purple-800 border-purple-300";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const totalCollected = transactions.filter(t => t.type !== "Refund").reduce((s, t) => s + t.amount, 0);
    const totalRefunded = Math.abs(transactions.filter(t => t.type === "Refund").reduce((s, t) => s + t.amount, 0));

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Transaction History</h1>
                    <p className="text-gray-600 mt-2">All payments, refunds & COD collections</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-main text-white px-5 py-3 rounded-sm hover:bg-mainHover font-medium shadow-sm">
                        <Download size={18} />
                        Export PDF
                    </button>
                    <button className="flex items-center gap-2 bg-main text-white px-5 py-3 rounded-sm hover:bg-mainHover font-medium shadow-sm">
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
                <div className="bg-main p-4 rounded-2xl shadow-xl text-white">
                    <p className="text-sm opacity-90">Total Collected</p>
                    <p className="text-2xl font-bold mt-2">৳ {(totalCollected / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-main p-4 rounded-2xl shadow-xl text-white">
                    <p className="text-sm opacity-90">Total Refunded</p>
                    <p className="text-2xl font-bold mt-2">৳ {(totalRefunded / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-main p-4 rounded-2xl shadow-xl text-white">
                    <p className="text-sm opacity-90">Net Revenue</p>
                    <p className="text-2xl font-bold mt-2">৳ {((totalCollected - totalRefunded) / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-main p-4 rounded-2xl shadow-xl text-white">
                    <p className="text-sm opacity-90">Total Transactions</p>
                    <p className="text-2xl font-bold mt-2">{transactions.length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-2">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Customer or TXN ID..."
                            className="w-full pl-12 pr-6 py-2 border-2 border-gray-200 rounded-xl focus:border-main focus:outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select className="px-6 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 text-sm" value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
                        <option value="All">All Methods</option>
                        <option>bKash</option>
                        <option>Nagad</option>
                        <option>Rocket</option>
                        <option>COD</option>
                        <option>Visa</option>
                        <option>MasterCard</option>
                    </select>
                    <select className="px-6 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Status</option>
                        <option>Success</option>
                        <option>Pending</option>
                        <option>Refunded</option>
                        <option>Failed</option>
                    </select>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-main text-white">
                            <tr>
                                <th className="py-2 px-4 text-left font-bold cursor-pointer hover:bg-purple-700 flex items-center gap-2" onClick={() => requestSort('date')}>
                                    Date & Time {getSortIcon('date')}
                                </th>
                                <th className="py-2 px-4 text-left font-bold">Order ID</th>
                                <th className="py-2 px-4 text-left font-bold">Customer</th>
                                <th className="py-2 px-4 text-left font-bold">Method</th>
                                <th className="py-2 px-4 text-left font-bold cursor-pointer hover:bg-secondary" onClick={() => requestSort('amount')}>
                                    Amount {getSortIcon('amount')}
                                </th>
                                <th className="py-2 px-4 text-left font-bold">Fee</th>
                                <th className="py-2 px-4 text-left font-bold">Net</th>
                                <th className="py-2 px-4 text-left font-bold">Type</th>
                                <th className="py-2 px-4 text-left font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sorted.map((t) => (
                                <tr key={t.id} className="hover:bg-purple-50 transition duration-200">
                                    <td className="py-2 px-4 font-medium text-gray-800">{t.date}</td>
                                    <td className="py-2 px-4 font-bold text-purple-600">{t.orderId}</td>
                                    <td className="py-2 px-4 text-gray-700">{t.customer}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-3">
                                            {t.method.includes("bKash") || t.method.includes("Nagad") || t.method.includes("Rocket") ? (
                                                <Smartphone size={20} className={getMethodIcon(t.method)} />
                                            ) : (
                                                <CreditCard size={20} className={getMethodIcon(t.method)} />
                                            )}
                                            <span className="font-semibold">{t.method}</span>
                                        </div>
                                    </td>
                                    <td className={`py-2 px-4 font-bold text-sm ${t.amount < 0 ? 'text-red-600' : 'text-green-700'}`}>
                                        {t.amount < 0 ? "-" : ""}৳ {Math.abs(t.amount).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-4 text-gray-600">৳ {t.fee.toLocaleString()}</td>
                                    <td className="py-2 px-4 font-bold text-blue-700">৳ {t.net.toLocaleString()}</td>
                                    <td className="py-2 px-4">
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${t.type === 'Refund' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4">
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusBadge(t.status)}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-t-4 border-purple-300">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm font-semibold">
                        <p className="text-gray-700">
                            Total Collected: <span className="text-green-700 font-bold">৳ {(totalCollected / 100000).toFixed(1)}L</span>
                        </p>
                        <p className="text-gray-700">
                            Total Refunded: <span className="text-red-700 font-bold">৳ {(totalRefunded / 100000).toFixed(1)}L</span>
                        </p>
                        <p className="text-gray-600 text-sm mt-2">Last updated: November 20, 2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistoryPage;