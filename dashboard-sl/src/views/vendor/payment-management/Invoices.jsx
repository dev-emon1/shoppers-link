import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, FileText, User, Store, Calendar, DollarSign } from 'lucide-react';

const InvoicesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    // Sample invoices - November 2025
    const invoicesData = [
        { id: "#INV-2025-4891", orderId: "#ORD8921", type: "Customer", recipient: "Fatema Akter", phone: "01711-234567", date: "2025-11-19", dueDate: "2025-11-26", subtotal: 8500, vat: 0, total: 8500, status: "Paid", paidDate: "2025-11-19" },
        { id: "#INV-2025-4890", orderId: "#ORD8919", type: "Customer", recipient: "Ayesha Siddika", phone: "01833-456789", date: "2025-11-18", dueDate: "2025-11-25", subtotal: 18500, vat: 2775, total: 21275, status: "Paid", paidDate: "2025-11-18" },
        { id: "#INV-2025-4889", orderId: "#ORD8915", type: "Customer", recipient: "Tanjila Rahman", phone: "01977-890123", date: "2025-11-18", dueDate: "2025-11-25", subtotal: 12800, vat: 0, total: 12800, status: "Pending", paidDate: null },
        { id: "#INV-2025-4888", orderId: "Payout-Nov18", type: "Vendor", recipient: "Aarong Official", phone: "02-8832777", date: "2025-11-18", dueDate: "2025-11-25", subtotal: 12450000, vat: 0, total: 12450000, status: "Paid", paidDate: "2025-11-20" },
        { id: "#INV-2025-4887", orderId: "#ORD8877", type: "Customer", recipient: "Md. Salman Khan", phone: "01544-567890", date: "2025-11-17", dueDate: "2025-11-24", subtotal: 18900, vat: 2835, total: 21735, status: "Overdue", paidDate: null },
        { id: "#INV-2025-4886", orderId: "Payout-Nov17", type: "Vendor", recipient: "Kay Kraft Dhaka", phone: "017xx-xxxxxx", date: "2025-11-17", dueDate: "2025-11-24", subtotal: 9850000, vat: 0, total: 9850000, status: "Pending", paidDate: null },
    ];

    // Generate more invoices
    const allInvoices = useMemo(() => {
        const extra = [];
        for (let i = 0; i < 8; i++) {
            extra.push(...invoicesData.map((inv, idx) => ({
                ...inv,
                id: `#INV-2025-${4880 - idx - i * 25}`,
                date: `2025-11-${18 - i}`,
                total: Math.floor(inv.total * (0.8 + Math.random() * 1.4))
            })));
        }
        return [...invoicesData, ...extra.slice(0, 120)];
    }, []);

    const filtered = useMemo(() => {
        return allInvoices.filter(inv => {
            const matchesSearch = inv.id.includes(searchTerm) ||
                inv.orderId.includes(searchTerm) ||
                inv.recipient.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'All' || inv.type === typeFilter;
            const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [allInvoices, searchTerm, typeFilter, statusFilter]);

    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
                    <p className="text-gray-600 mt-1">Manage customer invoices & vendor payout bills (MUSHAK 6.3 compliant)</p>
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

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 text-sm">
                <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Invoice ID, Order ID or Name..."
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-main"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>
                <select className="px-4 py-3 border rounded-lg" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
                    <option value="All">All Types</option>
                    <option>Customer</option>
                    <option>Vendor</option>
                </select>
                <select className="px-4 py-3 border rounded-lg" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                    <option value="All">All Status</option>
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                </select>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-4 px-6 text-left">Invoice ID</th>
                                <th className="py-4 px-6 text-left">Type</th>
                                <th className="py-4 px-6 text-left">Recipient</th>
                                <th className="py-4 px-6 text-left">Issue Date</th>
                                <th className="py-4 px-6 text-left">Due Date</th>
                                <th className="py-4 px-6 text-left">Total</th>
                                <th className="py-4 px-6 text-left">VAT</th>
                                <th className="py-4 px-6 text-left">Status</th>
                                <th className="py-4 px-6 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((inv) => (
                                <tr key={inv.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-2 px-2 font-bold text-main">{inv.id}</td>
                                    <td className="py-2 px-2">
                                        <div className="flex items-center gap-2">
                                            {inv.type === "Customer" ? <User size={16} className="text-main" /> : <Store size={16} className="text-green-600" />}
                                            <span className="font-medium">{inv.type}</span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-2">
                                        <div className="font-medium">{inv.recipient}</div>
                                        <div className="text-xs text-gray-500">{inv.phone}</div>
                                    </td>
                                    <td className="py-2 px-2">{inv.date}</td>
                                    <td className="py-2 px-2">{inv.dueDate}</td>
                                    <td className="py-2 px-2 font-bold text-green-600">৳ {inv.total.toLocaleString()}</td>
                                    <td className="py-2 px-2 text-orange-600">৳ {inv.vat.toLocaleString()}</td>
                                    <td className="py-2 px-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inv.status)}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-2">
                                        <div className="flex gap-3">
                                            <button className="text-main hover:underline text-sm flex items-center gap-1">
                                                <FileText size={16} />
                                                View
                                            </button>
                                            <button className="text-secondary hover:underline text-sm flex items-center gap-1">
                                                <Download size={16} />
                                                PDF
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center text-sm">
                    <p className="text-gray-600">
                        Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} invoices
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

export default InvoicesPage;