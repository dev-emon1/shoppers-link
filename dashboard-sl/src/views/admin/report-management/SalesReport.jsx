import React, { useState, useMemo } from 'react';
import { Search, Download, Eye, Calendar, TrendingUp, Filter } from 'lucide-react';

const AllSalesReportsTablePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

    const reports = [
        { id: 1, title: "November 2025 Sales Report", period: "Nov 1 – 19, 2025", generated: "2025-11-19", sales: 184200000, orders: 7824, growth: 32.4, type: "Monthly", status: "Live" },
        { id: 2, title: "October 2025 Full Month", period: "Oct 1 – 31, 2025", generated: "2025-11-01", sales: 139200000, orders: 6098, growth: 18.7, type: "Monthly", status: "Completed" },
        { id: 3, title: "Eid-ul-Adha 2025 Campaign", period: "Jun 10 – Jul 20, 2025", generated: "2025-07-21", sales: 428000000, orders: 18420, growth: 68.2, type: "Campaign", status: "Completed" },
        { id: 4, title: "September 2025 Monthly", period: "Sep 1 – 30, 2025", generated: "2025-10-01", sales: 117100000, orders: 5213, growth: 11.3, type: "Monthly", status: "Completed" },
        { id: 5, title: "Winter Collection Launch", period: "Nov 1 – 15, 2025", generated: "2025-11-16", sales: 142800000, orders: 6123, growth: 45.1, type: "Campaign", status: "Completed" },
        { id: 6, title: "Pohela Boishakh 2025", period: "Apr 1 – 20, 2025", generated: "2025-04-21", sales: 285000000, orders: 13210, growth: 81.3, type: "Festival", status: "Completed" },
        { id: 7, title: "Q3 2025 Summary", period: "Jul 1 – Sep 30, 2025", generated: "2025-10-02", sales: 317900000, orders: 14323, growth: 12.4, type: "Quarterly", status: "Completed" },
        { id: 8, title: "Black Friday 2024", period: "Nov 28 – Dec 1, 2024", generated: "2024-12-02", sales: 221000000, orders: 9876, growth: 112.0, type: "Campaign", status: "Completed" },
        { id: 9, title: "Year End Report 2024", period: "Jan 1 – Dec 31, 2024", generated: "2025-01-05", sales: 1785000000, orders: 78234, growth: 89.3, type: "Annual", status: "Completed" },
    ];

    // Filtering
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.period.includes(searchTerm);
            const matchesType = typeFilter === 'All' || report.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [searchTerm, typeFilter]);

    // Sorting
    const sortedReports = useMemo(() => {
        let sortable = [...filteredReports];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];
                if (sortConfig.key === 'sales') {
                    aVal = a.sales; bVal = b.sales;
                }
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    }, [filteredReports, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const formatCurrency = (amount) => {
        if (amount >= 1000000000) return `৳ ${(amount / 1000000000).toFixed(2)}B`;
        if (amount >= 10000000) return `৳ ${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `৳ ${(amount / 100000).toFixed(1)}L`;
        return `৳ ${amount.toLocaleString()}`;
    };

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">All Sales Reports</h1>
                    <p className="text-gray-600">Complete history of sales performance reports</p>
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

            {/* Search & Filter */}
            <div className="bg-white rounded-lg shadow p-5 mb-6 flex flex-col md:flex-row gap-4 text-sm">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by report name or period..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-main"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Filter size={18} className="text-gray-500" />
                    <select
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option>Monthly</option>
                        <option>Campaign</option>
                        <option>Festival</option>
                        <option>Quarterly</option>
                        <option>Annual</option>
                    </select>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b">
                            <tr>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('id')}>
                                    ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('title')}>
                                    Report Name {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="py-4 px-6 text-left">Period</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('generated')}>
                                    Generated On
                                </th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('sales')}>
                                    Total Sales {sortConfig.key === 'sales' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('orders')}>
                                    Orders
                                </th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('growth')}>
                                    Growth
                                </th>
                                <th className="py-4 px-6 text-left">Type</th>
                                <th className="py-4 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedReports.map((report => (
                                <tr key={report.id} className="hover:bg-gray-50 transition">
                                    <td className="py-2 px-2 font-medium text-main">#{report.id.toString().padStart(3, '0')}</td>
                                    <td className="py-2 px-2 font-medium text-gray-800">{report.title}</td>
                                    <td className="py-2 px-2 text-gray-700">{report.period}</td>
                                    <td className="py-2 px-2 text-gray-600">{report.generated}</td>
                                    <td className="py-2 px-2 font-bold text-green-600">{formatCurrency(report.sales)}</td>
                                    <td className="py-2 px-2 font-semibold text-main">{report.orders.toLocaleString()}</td>
                                    <td className="py-2 px-2">
                                        <span className="text-green-600 font-bold flex items-center gap-1">
                                            <TrendingUp size={16} /> +{report.growth}%
                                        </span>
                                    </td>
                                    <td className="py-2 px-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {report.type}
                                        </span>
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button className="text-main hover:underline flex items-center gap-1 text-sm">
                                                <Eye size={16} /> View
                                            </button>
                                            <button className="text-green-600 hover:underline flex items-center gap-1 text-sm">
                                                <Download size={16} /> Export
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center text-sm text-gray-600">
                    <p>Showing {sortedReports.length} of {reports.length} reports</p>
                    <p>Last updated: November 19, 2025</p>
                </div>
            </div>
        </div>
    );
};

export default AllSalesReportsTablePage;