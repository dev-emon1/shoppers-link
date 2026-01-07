import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Download, Eye, TrendingUp, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import API from '../../../utils/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AllSalesTable = () => {
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, total: 0, per_page: 20 });
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [productId, setProductId] = useState('');
    const [vendorId, setVendorId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // For sorting (client-side on current page)
    const [sortConfig, setSortConfig] = useState({ key: 'order_date', direction: 'desc' });

    // You might fetch these separately or include in another API
    // For demo, we'll leave as manual input or future enhancement
    const isAdmin = true; // Replace with actual auth check: Auth.user().type === 'admin'

    const fetchData = useCallback(async (page = 1) => {
        try {
            setLoading(true);

            const params = {
                page,
                ...(startDate && { start_date: startDate.toISOString().split('T')[0] }),
                ...(endDate && { end_date: endDate.toISOString().split('T')[0] }),
                ...(productId && { product_id: productId }),
                ...(vendorId && isAdmin && { vendor_id: vendorId }),
            };

            const res = await API.get("/reports/sales", { params });

            const { data = [], summary = null, meta: responseMeta = {} } = res.data || {};

            setOrders(Array.isArray(data) ? data : []);
            setSummary(summary);
            setMeta({
                current_page: responseMeta.current_page || 1,
                total: responseMeta.total || 0,
                per_page: responseMeta.per_page || 20,
            });
            setCurrentPage(responseMeta.current_page || 1);
        } catch (error) {
            console.error("Failed to fetch sales data:", error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, productId, vendorId, isAdmin]);

    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 when filters change
        fetchData(1);
    }, [startDate, endDate, productId, vendorId]);

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    // Client-side search & sort
    const filteredOrders = useMemo(() => {
        if (!searchTerm) return orders;
        const term = searchTerm.toLowerCase();
        return orders.filter(order =>
            order.order_id?.toLowerCase().includes(term) ||
            order.product_name?.toLowerCase().includes(term) ||
            order.customer_name?.toLowerCase().includes(term) ||
            order.shop_name?.toLowerCase().includes(term)
        );
    }, [orders, searchTerm]);

    const sortedOrders = useMemo(() => {
        if (!sortConfig.key) return filteredOrders;
        return [...filteredOrders].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (['quantity', 'price', 'total'].includes(sortConfig.key)) {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            }
            if (sortConfig.key === 'order_date') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredOrders, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const formatCurrency = (value) => {
        if (!value) return '৳ 0.00';
        if (typeof value === 'string' && value.startsWith('৳')) return value;
        const num = parseFloat(value);
        return `৳ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const totalPages = Math.ceil(meta.total / meta.per_page);

    const clearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setProductId('');
        setVendorId('');
        setSearchTerm('');
    };

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">All Sales Reports</h1>
                        <p className="text-gray-600 mt-1">
                            {summary?.date_range || 'Delivered orders history'}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-main text-white px-4 py-2.5 rounded-lg hover:bg-mainHover transition text-sm font-medium">
                            <Download size={18} />
                            Export CSV
                        </button>
                        <button className="flex items-center gap-2 bg-main text-white px-4 py-2.5 rounded-lg hover:bg-mainHover transition text-sm font-medium">
                            <Download size={18} />
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-4">
                        {/* ... (same as before) */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <p className="text-sm text-gray-600">Total Sales</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{summary.total_sales || '৳0.00'}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{summary.total_orders?.toLocaleString() || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <p className="text-sm text-gray-600">Items Sold</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{summary.total_quantity_sold?.toLocaleString() || 0}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <p className="text-sm text-gray-600">Avg Order Value</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{summary.average_order_value || '৳0.00'}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <p className="text-sm text-gray-600">Growth</p>
                            <div className="flex items-end gap-2 mt-2">
                                <TrendingUp size={28} className="text-green-600" />
                                <p className="text-3xl font-bold text-green-600">{summary.growth || '0%'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters & Search */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Date Range */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Calendar size={16} /> Start Date
                            </label>
                            <DatePicker
                                selected={startDate}
                                onChange={setStartDate}
                                dateFormat="dd MMM yyyy"
                                placeholderText="Select start date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-main"
                                isClearable
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Calendar size={16} /> End Date
                            </label>
                            <DatePicker
                                selected={endDate}
                                onChange={setEndDate}
                                dateFormat="dd MMM yyyy"
                                placeholderText="Select end date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-main"
                                isClearable
                            />
                        </div>

                        {/* Product Filter (optional enhancement: fetch products list) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Product ID</label>
                            <input
                                type="text"
                                placeholder="e.g. 123"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-main"
                            />
                        </div>

                        {/* Vendor Filter - Admin Only */}
                        {isAdmin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Vendor ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 45"
                                    value={vendorId}
                                    onChange={(e) => setVendorId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-main"
                                />
                            </div>
                        )}
                    </div>

                    {/* Search + Clear */}
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                            <input
                                type="text"
                                placeholder="Search orders locally..."
                                className="w-full pl-12 pr-5 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-main"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={clearFilters}
                            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* ... table same as before ... */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            {/* thead and tbody same as previous version */}
                            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-700 border-b border-gray-200">
                                <tr>
                                    <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('order_id')}>
                                        Order ID {sortConfig.key === 'order_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-4 px-6 text-left">Product</th>
                                    <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('customer_name')}>
                                        Customer
                                    </th>
                                    <th className="py-4 px-6 text-left">Shop</th>
                                    <th className="py-4 px-6 text-right cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('quantity')}>
                                        Qty
                                    </th>
                                    <th className="py-4 px-6 text-right cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('price')}>
                                        Unit Price
                                    </th>
                                    <th className="py-4 px-6 text-right cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('total')}>
                                        Total
                                    </th>
                                    <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('order_date')}>
                                        Order Date {sortConfig.key === 'order_date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="9" className="py-16 text-center text-gray-500">Loading...</td></tr>
                                ) : sortedOrders.length === 0 ? (
                                    <tr><td colSpan="9" className="py-16 text-center text-gray-500">No orders found</td></tr>
                                ) : (
                                    sortedOrders.map((order) => (
                                        <tr key={order.order_id} className="hover:bg-gray-50 transition">
                                            <td className="py-5 px-6 font-medium text-main">#{order.order_id}</td>
                                            <td className="py-5 px-6"><p className="font-medium text-gray-900">{order.product_name}</p></td>
                                            <td className="py-5 px-6 text-gray-700">{order.customer_name || 'Guest'}</td>
                                            <td className="py-5 px-6 text-gray-600">{order.shop_name}</td>
                                            <td className="py-5 px-6 text-right font-semibold">{order.quantity}</td>
                                            <td className="py-5 px-6 text-right text-gray-700">{formatCurrency(order.price)}</td>
                                            <td className="py-5 px-6 text-right font-bold text-green-600">{formatCurrency(order.total)}</td>
                                            <td className="py-5 px-6 text-gray-600 text-sm">{formatDate(order.order_date)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                        <div>
                            Showing {(currentPage - 1) * meta.per_page + 1} to {Math.min(currentPage * meta.per_page, meta.total)} of {meta.total.toLocaleString()} orders
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                                <ChevronLeft size={18} />
                            </button>
                            <span className="px-4 py-2 bg-white rounded-lg border font-medium">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllSalesTable;