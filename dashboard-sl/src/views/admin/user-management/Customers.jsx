import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import API from '../../../utils/api';
import { useNavigate } from 'react-router-dom';

const AllCustomersTablePage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('All');
    const [segmentFilter, setSegmentFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, last_page: 1 });
    const navigate = useNavigate();
    // Real segment calculation using actual orders
    const getSegment = (customer) => {
        const orders = customer.orders || [];
        const orderCount = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

        if (orderCount >= 20 || totalSpent >= 400000) return 'VIP';
        if (orderCount >= 10 || totalSpent >= 200000) return 'Loyal';
        if (orderCount <= 2 && orderCount > 0) return 'New';
        if (orderCount === 0) return 'Inactive';
        return 'Regular';
    };

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                per_page: 10,
                search: searchTerm || undefined,
                with_orders: true, // This gives us the orders array
            };

            const res = await API.get('/customers', { params });
            setCustomers(res.data.data || []);
            setMeta(res.data.meta);
            // console.log(res.data.meta.total[0]);

        } catch (err) {
            console.error('Failed to load customers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchCustomers(), 300);
        return () => clearTimeout(timer);
    }, [searchTerm, page]);

    // Client-side filtering
    const filtered = useMemo(() => {
        return customers.filter(c => {
            const city = c.shipping_addresses?.[0]?.city || 'Dhaka';
            const cityMatch = cityFilter === 'All' || city === cityFilter;
            const segment = getSegment(c);
            const segmentMatch = segmentFilter === 'All' || segment === segmentFilter;
            return cityMatch && segmentMatch;
        });
    }, [customers, cityFilter, segmentFilter]);

    const formatCurrency = (amount) => `৳ ${Number(amount || 0).toLocaleString()}`;
    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-GB') : '—';

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">All Customers</h1>
                    {/* <p className="text-gray-600">Total: {meta.total.toLocaleString()} customers</p> */}
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-main text-white px-2 py-2 rounded-lg hover:bg-mainHover transition text-xs">
                        <Download size={16} /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-main text-white px-2 py-2 rounded-lg hover:bg-mainHover transition text-xs">
                        <Download size={16} /> Export PDF
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-5 mb-6 flex flex-col md:flex-row gap-4 text-sm">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, phone, email..."
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-main"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <select
                    className="px-4 py-3 border rounded-lg"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                >
                    <option value="All">All Cities</option>
                    <option>Dhaka</option>
                    <option>Chattogram</option>
                    <option>Sylhet</option>
                    <option>Khulna</option>
                    <option>Rajshahi</option>
                </select>

                <select
                    className="px-4 py-3 border rounded-lg"
                    value={segmentFilter}
                    onChange={(e) => setSegmentFilter(e.target.value)}
                >
                    <option value="All">All Segments</option>
                    <option>VIP</option>
                    <option>Loyal</option>
                    <option>New</option>
                    <option>Regular</option>
                    <option>Inactive</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">Name</th>
                                <th className="py-3 px-4 text-left">Contact</th>
                                <th className="py-3 px-4 text-left">City</th>
                                <th className="py-3 px-4 text-left">Joined</th>
                                <th className="py-3 px-4 text-center">Orders</th>
                                <th className="py-3 px-4 text-right">Total Spent</th>
                                <th className="py-3 px-4 text-left">Last Order</th>
                                <th className="py-3 px-4 text-left">Segment</th>
                                <th className="py-3 px-4 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr><td colSpan="9" className="text-center py-12 text-gray-500">Loading customers...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="9" className="text-center py-12 text-gray-500">No customers found</td></tr>
                            ) : (
                                filtered.map((c) => {
                                    const orders = c.orders || [];
                                    const orderCount = orders.length;
                                    const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
                                    const lastOrderDate = orders[0]?.created_at || null;
                                    const segment = getSegment(c);
                                    const city = c.shipping_addresses?.[0]?.city || 'Dhaka';

                                    return (
                                        <tr key={c.id} className="hover:bg-gray-50 transition">
                                            <td className="py-3 px-4 font-bold text-main">#{c.id}</td>
                                            <td className="py-3 px-4 font-medium">{c.full_name}</td>
                                            <td className="py-3 px-4">
                                                <div>{c.contact_number || c.user?.phone || '—'}</div>
                                                <div className="text-xs text-gray-500">{c.user?.email || '—'}</div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">{city}</td>
                                            <td className="py-3 px-4 text-gray-600">{formatDate(c.created_at)}</td>
                                            <td className="py-3 px-4 text-center font-bold text-main">
                                                {orderCount}
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-green-600">
                                                {formatCurrency(totalSpent)}
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">
                                                {lastOrderDate ? formatDate(lastOrderDate) : '—'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                    ${segment === 'VIP' ? 'bg-purple-100 text-purple-800' :
                                                        segment === 'Loyal' ? 'bg-blue-100 text-blue-800' :
                                                            segment === 'New' ? 'bg-green-100 text-green-800' :
                                                                segment === 'Inactive' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'}`}>
                                                    {segment}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => navigate(`/vendor/users/customers/${c.id}`)}
                                                    className="text-main hover:underline text-sm flex items-center gap-1 mx-auto"
                                                >
                                                    <Eye size={16} /> View Details
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
                <div className="px-6 py-4 bg-gray-50 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p className="text-gray-600">
                        Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, meta.total)} of {meta.total} customers
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="px-4 font-medium">
                            Page {page} of {meta.last_page || 1}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(meta.last_page || 1, p + 1))}
                            disabled={page === meta.last_page}
                            className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllCustomersTablePage;