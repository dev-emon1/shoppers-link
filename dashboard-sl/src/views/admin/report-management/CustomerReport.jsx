import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Download, Users, Star, DollarSign, Calendar, ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';
import API from '../../../utils/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TbCoinTaka } from 'react-icons/tb';

// CSV Export Logic
const downloadCSV = (data, filename = 'customer-report.csv') => {
    const headers = ['Name', 'Phone', 'Email', 'Total Orders', 'Lifetime Value', 'Avg Order Value', 'First Purchase', 'Last Purchase'];
    const rows = data.map(item => [
        item.user_name,
        item.phone,
        item.email,
        item.total_orders,
        `৳${parseFloat(item.lifetime_value).toFixed(2)}`,
        `৳${parseFloat(item.avg_order_value).toFixed(2)}`,
        item.first_purchase,
        item.last_purchase
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

// PDF Export Logic
const downloadPDF = (customers, summary) => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Performance Report', 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 14, yPos);
    doc.text(`Range: ${summary?.date_range || 'All time'}`, 14, yPos + 5);
    yPos += 15;

    // Summary Section
    if (summary) {
        autoTable(doc, {
            head: [['Metric', 'Value']],
            body: [
                ['Total Customers', summary.total_customers],
                ['Top Customer', summary.top_customer],
                ['Highest LTV', summary.highest_ltv],
                ['Average LTV', summary.average_ltv],
                ['Total Lifetime Value', summary.total_lifetime_value],
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

    // Detailed Data Table
    const tableData = customers.map(c => [
        c.user_name,
        c.phone,
        c.email,
        c.total_orders.toString(),
        `৳${parseFloat(c.lifetime_value).toLocaleString()}`,
        `৳${parseFloat(c.avg_order_value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
        new Date(c.first_purchase).toLocaleDateString('en-GB'),
        new Date(c.last_purchase).toLocaleDateString('en-GB')
    ]);

    autoTable(doc, {
        head: [['Customer Name', 'Phone', 'Email', 'Orders', 'LTV', 'Avg Order', 'First Buy', 'Last Buy']],
        body: tableData,
        startY: yPos,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 8 },
        margin: { left: 14, right: 14 }
    });

    doc.save(`customer-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

const CustomerReportPage = () => {
    const [customers, setCustomers] = useState([]);
    const [summary, setSummary] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, total: 0, per_page: 20 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const res = await API.get("/reports/customer", { params: { page } });
            const { data = [], summary = null, meta: responseMeta = {} } = res.data || {};
            setCustomers(data);
            setSummary(summary);
            setMeta(responseMeta);
        } catch (error) {
            console.error("Failed to fetch customer report:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(currentPage); }, [currentPage, fetchData]);

    const filteredCustomers = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return customers.filter(c =>
            c.user_name.toLowerCase().includes(term) ||
            c.phone.includes(term) ||
            c.email.toLowerCase().includes(term)
        );
    }, [customers, searchTerm]);

    const formatCurrency = (val) => `৳ ${parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    if (loading) return <div className="p-20 text-center text-gray-500">Loading Customer Insights...</div>;

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Customer Report</h1>
                        <p className="text-gray-500 text-sm">Analyze customer lifetime value and purchase behavior</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => downloadCSV(filteredCustomers)} className="flex items-center gap-2 bg-white border px-4 py-1.5 rounded-lg hover:bg-gray-50 transition text-xs font-medium">
                            <Download size={16} /> CSV
                        </button>
                        <button onClick={() => downloadPDF(filteredCustomers, summary)} className="flex items-center gap-2 bg-main text-white px-4 py-1.5 rounded-lg hover:bg-mainHover transition text-xs font-medium">
                            <Download size={16} /> PDF
                        </button>
                    </div>
                </div>

                {/* Summary Grid */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                        <SummaryCard icon={<Users className="text-blue-600" />} label="Total Customers" value={summary.total_customers} />
                        <SummaryCard icon={<Star className="text-yellow-600" />} label="Top Customer" value={summary.top_customer} subValue={`LTV: ${summary.highest_ltv}`} />
                        <SummaryCard icon={<TbCoinTaka className="text-green-600" />} label="Total Revenue" value={summary.total_lifetime_value} />
                        <SummaryCard icon={<Calendar className="text-purple-600" />} label="Avg. Order Value" value={summary.average_ltv} />
                    </div>
                )}

                {/* Search & Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, phone or email..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-main outline-none text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-4 text-left">Customer Details</th>
                                    <th className="px-6 py-4 text-center">Orders</th>
                                    <th className="px-6 py-4 text-right">LTV</th>
                                    <th className="px-6 py-4 text-right">Avg Order</th>
                                    <th className="px-6 py-4 text-left">First Purchase</th>
                                    <th className="px-6 py-4 text-left">Last Purchase</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.customer_id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{customer.user_name}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Mail size={10} /> {customer.email}
                                                </div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <Phone size={10} /> {customer.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium">{customer.total_orders}</td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(customer.lifetime_value)}</td>
                                            <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(customer.avg_order_value)}</td>
                                            <td className="px-6 py-4 text-xs text-gray-500">{customer.first_purchase}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                    {customer.last_purchase}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-center text-gray-400">No customers found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-xs text-gray-500">
                        <span>Showing {filteredCustomers.length} of {meta.total} results</span>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border rounded bg-white disabled:opacity-50 hover:bg-gray-50">
                                <ChevronLeft size={14} />
                            </button>
                            <span className="flex items-center px-2 font-medium">Page {currentPage}</span>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= Math.ceil(meta.total / meta.per_page)} className="p-2 border rounded bg-white disabled:opacity-50 hover:bg-gray-50">
                                <ChevronRight size={14} />
                            </button>
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
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-gray-900">{value}</p>
            {subValue && <p className="text-xs text-indigo-500 font-medium mt-0.5">{subValue}</p>}
        </div>
    </div>
);

export default CustomerReportPage;