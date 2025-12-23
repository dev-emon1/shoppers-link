import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Package, Truck, Warehouse, CheckCircle, XCircle, Camera } from 'lucide-react';

const ReturnManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    const returnsData = [
        {
            id: "#RET891",
            orderId: "#ORD8919",
            customer: "Ayesha Siddika",
            phone: "01833-456789",
            date: "2025-11-19",
            product: "Hand-Embroidered Salwar Kameez - Pink",
            amount: 18500,
            reason: "Color faded after first wash",
            status: "Picked Up",
            courier: "Pathao",
            tracking: "PTH-784512-BD",
            photos: true,
        },
        {
            id: "#RET890",
            orderId: "#ORD8905",
            customer: "Sumaiya Islam",
            phone: "01712-345678",
            date: "2025-11-18",
            product: "Cotton Panjabi - Navy Blue",
            amount: 2850,
            reason: "Size too small (ordered XL, feels like L)",
            status: "Received at Warehouse",
            courier: "RedX",
            tracking: "RDX-452178",
            photos: true,
        },
        {
            id: "#RET889",
            orderId: "#ORD8888",
            customer: "Rahim Karim",
            phone: "01922-345678",
            date: "2025-11-17",
            product: "Tangail Sharee - Red & Gold",
            amount: 4200,
            reason: "Border thread coming out",
            status: "Quality Check Passed → Refunded",
            courier: "Pathao",
            photos: true,
        },
        {
            id: "#RET888",
            orderId: "#ORD8877",
            customer: "Fatema Akter",
            phone: "01711-234567",
            date: "2025-11-17",
            product: "Leather Nagra Sandals - Size 41",
            amount: 1990,
            reason: "Sole detached after 3 days",
            status: "Quality Check Failed → Return to Customer",
            courier: "",
            photos: true,
        },
        {
            id: "#RET887",
            orderId: "#ORD8866",
            customer: "Md. Salman Khan",
            phone: "01544-567890",
            date: "2025-11-16",
            product: "Katan Benarasi Saree",
            amount: 18500,
            reason: "Not as shiny as shown",
            status: "Requested",
            courier: "",
            photos: false,
        },
    ];

    // Generate more returns
    const allReturns = useMemo(() => {
        const extended = [];
        const statuses = ["Requested", "Scheduled for Pickup", "Picked Up", "Received at Warehouse", "Quality Check Passed → Refunded", "Quality Check Failed → Return to Customer", "Replaced & Shipped"];
        for (let i = 0; i < 7; i++) {
            extended.push(...returnsData.map((r, idx) => ({
                ...r,
                id: `#RET${880 - idx - i * 15}`,
                date: `2025-11-${15 - i}`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                amount: Math.floor(r.amount * (0.7 + Math.random() * 1.3))
            })));
        }
        return [...returnsData, ...extended.slice(0, 85)];
    }, []);

    const filtered = useMemo(() => {
        return allReturns.filter(r => {
            const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.customer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || r.status.includes(statusFilter);
            return matchesSearch && matchesStatus;
        });
    }, [allReturns, searchTerm, statusFilter]);

    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const getStatusBadge = (status) => {
        const map = {
            "Requested": "bg-orange-100 text-orange-800",
            "Scheduled for Pickup": "bg-indigo-100 text-indigo-800",
            "Picked Up": "bg-purple-100 text-purple-800",
            "Received at Warehouse": "bg-blue-100 text-blue-800",
            "Quality Check Passed → Refunded": "bg-green-100 text-green-800",
            "Quality Check Failed → Return to Customer": "bg-red-100 text-red-800",
            "Replaced & Shipped": "bg-teal-100 text-teal-800",
        };
        return map[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Return Management</h1>
                    <p className="text-gray-600 mt-1">Track and process product returns & replacements</p>
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

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-2">
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending Pickup</p>
                            <p className="text-2xl font-bold text-main">18</p>
                        </div>
                        <Truck className="text-main" size={32} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">At Warehouse</p>
                            <p className="text-2xl font-bold text-main">12</p>
                        </div>
                        <Warehouse className="text-main" size={32} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Refunded (Nov)</p>
                            <p className="text-2xl font-bold text-main">৳ 3,48,700</p>
                        </div>
                        <CheckCircle className="text-main" size={32} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Return Rate</p>
                            <p className="text-2xl font-bold text-main">6.8%</p>
                        </div>
                        <Package className="text-main" size={32} />
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 text-sm">
                <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Return ID, Order ID or Customer..."
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-main"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>
                <select
                    className="px-4 py-3 border rounded-lg"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                >
                    <option value="All">All Status</option>
                    <option>Requested</option>
                    <option>Scheduled for Pickup</option>
                    <option>Picked Up</option>
                    <option>Received at Warehouse</option>
                    <option>Quality Check Passed → Refunded</option>
                    <option>Quality Check Failed</option>
                    <option>Replaced & Shipped</option>
                </select>
            </div>

            {/* Returns Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-2 px-2 text-left">Return ID</th>
                                <th className="py-2 px-2 text-left">Order ID</th>
                                <th className="py-2 px-2 text-left">Customer</th>
                                <th className="py-2 px-2 text-left">Product</th>
                                <th className="py-2 px-2 text-left">Amount</th>
                                <th className="py-2 px-2 text-left">Reason</th>
                                <th className="py-2 px-2 text-left">Status</th>
                                <th className="py-2 px-2 text-left">Courier / Tracking</th>
                                <th className="py-2 px-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((r) => (
                                <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-2 px-2 font-bold text-main">{r.id}</td>
                                    <td className="py-2 px-2 text-secondary cursor-pointer hover:underline">{r.orderId}</td>
                                    <td className="py-2 px-2">
                                        <div className="font-medium">{r.customer}</div>
                                        <div className="text-xs text-gray-500">{r.phone}</div>
                                    </td>
                                    <td className="py-2 px-2 max-w-xs">
                                        <div className="truncate font-medium">{r.product}</div>
                                        {r.photos && <span className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Camera size={12} /> Photos attached</span>}
                                    </td>
                                    <td className="py-2 px-2 font-bold text-main">-৳ {r.amount.toLocaleString()}</td>
                                    <td className="py-2 px-2 text-gray-700">{r.reason}</td>
                                    <td className="py-2 px-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(r.status)}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-2 text-sm">
                                        {r.courier ? <div>{r.courier}<br /><span className="text-main">{r.tracking}</span></div> : "-"}
                                    </td>
                                    <td className="py-2 px-2">
                                        <button className="text-main hover:underline text-sm font-medium">
                                            Manage →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center text-sm">
                    <p className="text-gray-600">
                        Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} returns
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100">Previous</button>
                        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnManagementPage;