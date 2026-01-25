import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Download, TrendingUp, Users, DollarSign, ShoppingCart, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import API from '../../../utils/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TbCoinTaka } from 'react-icons/tb';

// CSV Export Helper
const downloadCSV = (data, filename = 'vendor-performance-report.csv') => {
    const headers = ['Shop Name', 'Owner', 'Contact', 'Orders', 'Units Sold', 'Gross Revenue', 'Net Earning', 'Unique Products'];
    const rows = data.map(item => [
        item.shop_name,
        item.owner_name,
        item.contact_number,
        item.total_orders,
        item.units_sold,
        `৳${parseFloat(item.gross_revenue).toFixed(2)}`,
        `৳${parseFloat(item.net_earning).toFixed(2)}`,
        item.unique_products_sold
    ]);

    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

// PDF Export Helper
const downloadPDF = (vendors, summary) => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for more space

    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Vendor Performance Report', 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 14, yPos);
    doc.text(`Period: ${summary?.date_range || 'All time'}`, 14, yPos + 5);
    yPos += 15;

    // Summary Table
    if (summary) {
        autoTable(doc, {
            head: [['Metric', 'Value']],
            body: [
                ['Active Vendors', summary.total_vendors_active],
                ['Top Vendor', summary.top_vendor],
                ['Top Revenue', summary.top_revenue],
                ['Total Platform Revenue', summary.total_platform_earning],
            ],
            startY: yPos,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 10 },
            tableWidth: 100,
            margin: { left: 14 }
        });
        yPos = doc.lastAutoTable.finalY + 15;
    }

    // Detailed Table
    const tableData = vendors.map(v => [
        v.shop_name,
        v.owner_name,
        v.contact_number,
        v.total_orders.toString(),
        v.units_sold.toString(),
        `৳${parseFloat(v.gross_revenue).toLocaleString()}`,
        `৳${parseFloat(v.net_earning).toLocaleString()}`,
        v.unique_products_sold.toString()
    ]);

    autoTable(doc, {
        head: [['Shop Name', 'Owner', 'Contact', 'Orders', 'Units', 'Gross Revenue', 'Net Earning', 'Unique Products']],
        body: tableData,
        startY: yPos,
        theme: 'striped',
        headStyles: { fillColor: [41, 98, 255] },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 }
    });

    doc.save(`vendor-performance-${new Date().toISOString().split('T')[0]}.pdf`);
};

const VendorPerformanceReportPage = () => {
    const [vendors, setVendors] = useState([]);
    const [summary, setSummary] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, total: 0, per_page: 20 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const res = await API.get("/reports/vendor-performance", { params: { page } });
            const { data = [], summary = null, meta: responseMeta = {} } = res.data || {};
            setVendors(data);
            setSummary(summary);
            setMeta(responseMeta);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(currentPage); }, [currentPage, fetchData]);

    const filteredVendors = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return vendors.filter(v =>
            v.shop_name.toLowerCase().includes(term) ||
            v.owner_name.toLowerCase().includes(term)
        );
    }, [vendors, searchTerm]);

    if (loading) return <div className="p-10 text-center">Loading Report...</div>;

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Vendor Performance</h1>
                        <p className="text-gray-500 text-sm">Review vendor sales and platform revenue</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => downloadCSV(filteredVendors)} className="flex items-center gap-2 bg-white border px-4 py-1.5 rounded-lg hover:bg-gray-50 transition text-xs font-medium">
                            <Download size={16} /> CSV
                        </button>
                        <button onClick={() => downloadPDF(filteredVendors, summary)} className="flex items-center gap-2 bg-main text-white px-4 py-1.5 rounded-lg hover:bg-mainHover transition text-xs font-medium">
                            <Download size={16} /> PDF
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                        <SummaryCard icon={<Users className="text-blue-600" />} label="Active Vendors" value={summary.total_vendors_active} />
                        <SummaryCard icon={<TrendingUp className="text-purple-600" />} label="Top Vendor" value={summary.top_vendor} subValue={summary.top_revenue} />
                        <SummaryCard icon={<TbCoinTaka className="text-green-600" />} label="Platform Earnings" value={summary.total_platform_earning} />
                        <SummaryCard icon={<ShoppingCart className="text-orange-600" />} label="Range" value={summary.date_range} />
                    </div>
                )}

                {/* Search & Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-2 border-b border-gray-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search shop or owner..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-main outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-4 text-left">Shop Details</th>
                                    <th className="px-6 py-4 text-center">Orders</th>
                                    <th className="px-6 py-4 text-center">Units</th>
                                    <th className="px-6 py-4 text-right">Gross Revenue</th>
                                    <th className="px-6 py-4 text-right">Net Earning</th>
                                    <th className="px-6 py-4 text-center">Unique Prod.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredVendors.map((vendor) => (
                                    <tr key={vendor.vendor_id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{vendor.shop_name}</div>
                                            <div className="text-xs text-gray-500 capitalize">{vendor.owner_name}</div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                <Phone size={10} /> {vendor.contact_number}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">{vendor.total_orders}</td>
                                        <td className="px-6 py-4 text-center">{vendor.units_sold}</td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">৳{parseFloat(vendor.gross_revenue).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-bold text-main">৳{parseFloat(vendor.net_earning).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center text-gray-600">{vendor.unique_products_sold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-xs text-gray-500">
                        <span>Page {meta.current_page} of {Math.ceil(meta.total / meta.per_page)}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border rounded bg-white disabled:opacity-50"><ChevronLeft size={14} /></button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= Math.ceil(meta.total / meta.per_page)} className="p-2 border rounded bg-white disabled:opacity-50"><ChevronRight size={14} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ icon, label, value, subValue }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
        <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-gray-900">{value}</p>
            {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
        </div>
    </div>
);

export default VendorPerformanceReportPage;