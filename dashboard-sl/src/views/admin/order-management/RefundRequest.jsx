import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

const RefundRequestsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    // Realistic refund requests - November 2025
    const refundRequests = [
        { id: "#REF781", orderId: "#ORD8919", customer: "Ayesha Siddika", phone: "01833-456789", date: "2025-11-19", amount: 18500, reason: "Wrong size received (ordered L, got M)", status: "Pending", paymentMethod: "bKash", city: "Sylhet" },
        { id: "#REF780", orderId: "#ORD8915", customer: "Tanjila Rahman", phone: "01977-890123", date: "2025-11-18", amount: 12800, reason: "Color not as shown in picture", status: "Pending", paymentMethod: "COD", city: "Khulna" },
        { id: "#REF779", orderId: "#ORD8905", customer: "Sumaiya Islam", phone: "01712-345678", date: "2025-11-18", amount: 6750, reason: "Stitching defect in Salwar Kameez", status: "Approved", paymentMethod: "Nagad", city: "Dhaka" },
        { id: "#REF778", orderId: "#ORD8888", customer: "Rahim Karim", phone: "01922-345678", date: "2025-11-17", amount: 4200, reason: "Changed mind - wants different Panjabi", status: "Rejected", paymentMethod: "bKash", city: "Chattogram" },
        { id: "#REF777", orderId: "#ORD8877", customer: "Fatema Akter", phone: "01711-234567", date: "2025-11-17", amount: 2850, reason: "Received damaged packaging", status: "Processed", paymentMethod: "Rocket", city: "Dhaka" },
        { id: "#REF776", orderId: "#ORD8866", customer: "Md. Salman Khan", phone: "01544-567890", date: "2025-11-16", amount: 18900, reason: "Benarasi Saree has loose threads", status: "Pending", paymentMethod: "Card", city: "Dhaka" },
        { id: "#REF775", orderId: "#ORD8855", customer: "Nusrat Jahan", phone: "01655-678901", date: "2025-11-16", amount: 18500, reason: "Does not like the fabric feel", status: "Pending", paymentMethod: "bKash", city: "Dhaka" },
    ];

    // Add more for demo
    const allRefunds = useMemo(() => {
        const extended = [];
        for (let i = 0; i < 5; i++) {
            extended.push(...refundRequests.map((r, idx) => ({
                ...r,
                id: `#REF${770 - idx - i * 20}`,
                date: `2025-11-${15 - i - (idx % 3)}`,
                amount: Math.floor(r.amount * (0.8 + Math.random() * 0.6))
            })));
        }
        return [...refundRequests, ...extended.slice(0, 80)];
    }, []);

    const filtered = useMemo(() => {
        return allRefunds.filter(r => {
            const matchesSearch = r.id.includes(searchTerm) ||
                r.orderId.includes(searchTerm) ||
                r.customer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [allRefunds, searchTerm, statusFilter]);

    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const getStatusIconAndColor = (status) => {
        switch (status) {
            case 'Pending': return { icon: Clock, color: 'bg-yellow-100 text-yellow-800' };
            case 'Approved': return { icon: CheckCircle, color: 'bg-green-100 text-green-800' };
            case 'Rejected': return { icon: XCircle, color: 'bg-red-100 text-red-800' };
            case 'Processed': return { icon: CheckCircle, color: 'bg-blue-100 text-blue-800' };
            default: return { icon: Clock, color: 'bg-gray-100 text-gray-800' };
        }
    };

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Refund Requests</h1>
                    <p className="text-gray-600 mt-1">Manage customer return & refund requests</p>
                </div>
                <div className='flex gap-3'>
                    <button className="flex items-center gap-2 bg-main text-white px-2 py-2 rounded-lg hover:bg-mainHover transition text-sm">
                        <Download size={16} />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-main text-white px-2 py-2 rounded-lg hover:bg-mainHover transition text-sm">
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <div className="bg-white rounded-lg shadow p-5 border-l-4 border-main">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-main">24</p>
                </div>
                <div className="bg-white rounded-lg shadow p-5 border-l-4 border-main">
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-main">18</p>
                </div>
                <div className="bg-white rounded-lg shadow p-5 border-l-4 border-main">
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-main">9</p>
                </div>
                <div className="bg-white rounded-lg shadow p-5 border-l-4 border-main">
                    <p className="text-sm text-gray-600">Total This Month</p>
                    <p className="text-2xl font-bold text-main">৳ 4,82,500</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 text-sm">
                <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Refund ID, Order ID or Customer..."
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-main"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>

                <select
                    className="px-4 py-3 border rounded-lg focus:outline-none"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                >
                    <option value="All">All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                    <option>Processed</option>
                </select>
            </div>

            {/* Refund Requests Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-2 px-2 text-left">Refund ID</th>
                                <th className="py-2 px-2 text-left">Order ID</th>
                                <th className="py-2 px-2 text-left">Customer</th>
                                <th className="py-2 px-2 text-left">Date</th>
                                <th className="py-2 px-2 text-left">Amount</th>
                                <th className="py-2 px-2 text-left">Reason</th>
                                <th className="py-2 px-2 text-left">Status</th>
                                <th className="py-2 px-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((r) => {
                                const { icon: Icon, color } = getStatusIconAndColor(r.status);
                                return (
                                    <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="py-2 px-2 font-bold text-main">{r.id}</td>
                                        <td className="py-2 px-2 font-medium text-secondary cursor-pointer hover:underline">{r.orderId}</td>
                                        <td className="py-2 px-2">
                                            <div className="font-medium">{r.customer}</div>
                                            <div className="text-xs text-gray-500">{r.phone}</div>
                                        </td>
                                        <td className="py-2 px-2">{r.date}</td>
                                        <td className="py-2 px-2 font-bold text-main">-৳ {r.amount.toLocaleString()}</td>
                                        <td className="py-2 px-2 text-gray-700 max-w-xs truncate" title={r.reason}>
                                            {r.reason}
                                        </td>
                                        <td className="py-2 px-2">
                                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                                                <Icon size={14} />
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-2">
                                            <div className="flex items-center gap-3">
                                                {r.status === 'Pending' && (
                                                    <>
                                                        <button className="text-main hover:underline text-sm font-medium">Approve</button>
                                                        <span className="text-gray-300">|</span>
                                                        <button className="text-mainHover hover:underline text-sm font-medium">Reject</button>
                                                    </>
                                                )}
                                                <button className="text-main hover:underline text-sm flex items-center gap-1">
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} requests
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100">
                            Previous
                        </button>
                        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundRequestsPage;