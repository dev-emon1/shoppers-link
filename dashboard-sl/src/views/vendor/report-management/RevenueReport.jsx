import React, { useState, useMemo } from 'react';
import { Search, Download, Calendar, TrendingUp, Filter, ChevronUp, ChevronDown } from 'lucide-react';

const RevenueReportListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [monthFilter, setMonthFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    // Realistic Revenue Data - Jan to Nov 2025
    const revenueData = [
        { id: 1, date: "2025-11-19", month: "November", grossSales: 16250000, discounts: 812500, returns: 487500, netRevenue: 14960000, profit: 5984000, orders: 638, aov: 25470, growth: "+32.4%" },
        { id: 2, date: "2025-10-31", month: "October", grossSales: 13920000, discounts: 696000, returns: 417600, netRevenue: 12806400, profit: 5122560, orders: 548, aov: 25400, growth: "+18.7%" },
        { id: 3, date: "2025-09-30", month: "September", grossSales: 11710000, discounts: 585500, returns: 351300, netRevenue: 10768200, profit: 4307280, orders: 462, aov: 25342, growth: "+11.3%" },
        { id: 4, date: "2025-08-31", month: "August", grossSales: 10510000, discounts: 525500, returns: 315300, netRevenue: 9660200, profit: 3864080, orders: 412, aov: 25510, growth: "+9.8%" },
        { id: 5, date: "2025-07-31", month: "July", grossSales: 9570000, discounts: 478500, returns: 287100, netRevenue: 8804400, profit: 3521760, orders: 378, aov: 25317, growth: "+5.2%" },
        { id: 6, date: "2025-06-30", month: "June", grossSales: 16900000, discounts: 845000, returns: 507000, netRevenue: 15558000, profit: 6845520, orders: 720, aov: 23458, growth: "+68.2%" }, // Eid boost
        { id: 7, date: "2025-05-31", month: "May", grossSales: 14800000, discounts: 740000, returns: 444000, netRevenue: 13612000, profit: 5717040, orders: 612, aov: 24183, growth: "+22.1%" },
        { id: 8, date: "2025-04-30", month: "April", grossSales: 28500000, discounts: 1425000, returns: 855000, netRevenue: 26220000, profit: 11536800, orders: 1180, aov: 24153, growth: "+81.3%" }, // Pohela Boishakh
    ];

    // Filtering
    const filtered = useMemo(() => {
        return revenueData.filter(item =>
            (monthFilter === 'All' || item.month === monthFilter) &&
            (item.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.date.includes(searchTerm))
        );
    }, [searchTerm, monthFilter]);

    // Sorting
    const sorted = useMemo(() => {
        let sortable = [...filtered];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];
                if (typeof aVal === 'string' && aVal.includes('%')) {
                    aVal = parseFloat(aVal);
                    bVal = parseFloat(bVal);
                }
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

    const formatCurrency = (amount) => `৳ ${(amount / 100000).toFixed(1)}L`;

    const totalRevenue = revenueData.reduce((sum, r) => sum + r.netRevenue, 0);
    const totalProfit = revenueData.reduce((sum, r) => sum + r.profit, 0);

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Revenue Reports</h1>
                    <p className="text-gray-600 mt-2">Monthly Financial Performance • Jan - Nov 2025</p>
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
            <div className="bg-white rounded-2xl shadow-lg p-2 mb-2">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-4 text-gray-400" size={22} />
                        <input
                            type="text"
                            placeholder="Search by month or date..."
                            className="w-full pl-12 pr-6 py-2 border-2 border-gray-200 rounded-xl focus:border-main focus:outline-none text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-6 py-2 border-2 border-gray-200 rounded-xl focus:border-main text-lg"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                    >
                        <option value="All">All Months</option>
                        <option>January</option>
                        <option>February</option>
                        <option>March</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                        <option>July</option>
                        <option>August</option>
                        <option>September</option>
                        <option>October</option>
                        <option>November</option>
                    </select>
                </div>
            </div>

            {/* Revenue Table */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-main text-white">
                            <tr>
                                <th className="py-2 px-4 text-left font-bold cursor-pointer hover:bg-purple-700 flex items-center gap-2" onClick={() => requestSort('date')}>
                                    Date {getSortIcon('date')}
                                </th>
                                <th className="py-2 px-4 text-left font-bold">Month</th>
                                <th className="py-2 px-4 text-left font-bold cursor-pointer hover:bg-purple-700" onClick={() => requestSort('grossSales')}>
                                    Gross Sales {getSortIcon('grossSales')}
                                </th>
                                <th className="py-2 px-4 text-left font-bold">Discounts</th>
                                <th className="py-2 px-4 text-left font-bold">Returns</th>
                                <th className="py-2 px-4 text-left font-bold cursor-pointer hover:bg-purple-700" onClick={() => requestSort('netRevenue')}>
                                    Net Revenue {getSortIcon('netRevenue')}
                                </th>
                                <th className="py-2 px-4 text-left font-bold cursor-pointer hover:bg-purple-700" onClick={() => requestSort('profit')}>
                                    Profit {getSortIcon('profit')}
                                </th>
                                <th className="py-2 px-4 text-left font-bold">Orders</th>
                                <th className="py-2 px-4 text-left font-bold">AOV</th>
                                <th className="py-2 px-4 text-left font-bold cursor-pointer hover:bg-purple-700" onClick={() => requestSort('growth')}>
                                    Growth {getSortIcon('growth')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sorted.map((row) => (
                                <tr key={row.id} className="hover:bg-purple-50 transition duration-200">
                                    <td className="py-2 px-4 font-medium text-gray-800">{row.date}</td>
                                    <td className="py-2 px-4 font-semibold text-purple-700">{row.month} 2025</td>
                                    <td className="py-2 px-4 font-bold text-gray-800">{formatCurrency(row.grossSales)}</td>
                                    <td className="py-2 px-4 text-red-600">-{formatCurrency(row.discounts)}</td>
                                    <td className="py-2 px-4 text-red-600">-{formatCurrency(row.returns)}</td>
                                    <td className="py-2 px-4 font-bold text-green-700 text-lg">{formatCurrency(row.netRevenue)}</td>
                                    <td className="py-2 px-4 font-bold text-blue-700 text-lg">{formatCurrency(row.profit)}</td>
                                    <td className="py-2 px-4 text-center font-bold text-purple-600">{row.orders}</td>
                                    <td className="py-2 px-4 font-medium">৳ {row.aov.toLocaleString()}</td>
                                    <td className="py-2 px-4">
                                        <span className={`font-bold flex items-center gap-2 ${row.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                            <TrendingUp size={18} className="rotate-45" />
                                            {row.growth}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-t-4 border-purple-300">
                    <div className="flex flex-col md:flex-row justify-between items-center text-lg font-semibold">
                        <p className="text-gray-700">
                            YTD Net Revenue: <span className="text-green-700">৳ {(totalRevenue / 10000000).toFixed(2)} Cr</span>
                        </p>
                        <p className="text-gray-700">
                            YTD Profit: <span className="text-blue-700">৳ {(totalProfit / 10000000).toFixed(2)} Cr</span>
                        </p>
                        <p className="text-gray-600 text-sm mt-2">Last updated: November 20, 2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueReportListPage;