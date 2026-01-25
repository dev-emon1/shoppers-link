import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import Pagination from "../../../components/Pagination";
import IconButton from "../../../components/ui/IconButton";
import { TbFileExcel, TbPdf, TbScanEye } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import API, { IMAGE_URL } from "../../../../src/utils/api";
import { toast } from "react-toastify";
import CustomerQuickView from "../../../components/ui/CustomerQuickView";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AllCustomersTablePage = () => {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewCustomer, setViewCustomer] = useState(null);
    // মেটা ডেটা স্টেট
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    // console.log(customers);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);

            // ১. params ডিক্লেয়ার করা হয়েছে (এটি মিসিং ছিল)
            const params = new URLSearchParams();
            if (searchTerm.trim()) params.append("search", searchTerm.trim());
            params.append("page", page.toString());
            params.append("per_page", perPage.toString());
            params.append("with_orders", "true"); // রিলেশন লোড করার জন্য

            const response = await API.get(`/customers?${params.toString()}`);
            const payload = response.data;

            setCustomers(payload.data || []);

            // ২. মেটা ডাটা ফিক্স (অ্যারে চেক এবং নাম্বার কনভার্সন)
            setMeta({
                current_page: Number(Array.isArray(payload.meta?.current_page) ? payload.meta.current_page[0] : (payload.meta?.current_page || 1)),
                last_page: Number(Array.isArray(payload.meta?.last_page) ? payload.meta.last_page[0] : (payload.meta?.last_page || 1)),
                per_page: Number(Array.isArray(payload.meta?.per_page) ? payload.meta.per_page[0] : (payload.meta?.per_page || 10)),
                total: Number(Array.isArray(payload.meta?.total) ? payload.meta.total[0] : (payload.meta?.total || 0)),
            });
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, page, perPage]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // সার্চ করলে পেজ ১ এ সেট হবে
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);
    // ১. Excel Export Function
    const exportToExcel = () => {
        const exportData = customers.map((item, index) => ({
            "SL": index + 1,
            "Name": item.full_name,
            "Phone": item.contact_number,
            "Email": item.user?.email || "N/A",
            "Total Orders": item.orders?.length || 0,
            "Total Spent": item.orders?.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0) || 0,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customers");
        XLSX.writeFile(wb, "Customer_List.xlsx");
    };

    // ২. PDF Export Function
    const exportToPDF = () => {
        const doc = new jsPDF();

        // টাইটেল যোগ করা
        doc.setFontSize(18);
        doc.text("All Customer List", 14, 15);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

        const tableColumn = ["SL", "Name", "Phone", "Email", "Total Orders", "Total Spent"];
        const tableRows = customers.map((item, index) => {
            // প্রতিটি কাস্টমারের জন্য আলাদা টোটাল ক্যালকুলেট করুন
            const totalSpent = item.orders?.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0) || 0;

            return [
                index + 1,
                item.full_name,
                item.contact_number,
                item.user?.email || "—",
                item.orders?.length || 0,
                `TK ${totalSpent.toLocaleString()}`, // কারেন্সি ফরম্যাটসহ
            ];
        });

        // doc.autoTable এর পরিবর্তে সরাসরি autoTable ফাংশনটি ব্যবহার করুন
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30, // টাইটেলের নিচে শুরু হবে
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { fillStyle: 'f', fillColor: [251, 146, 60] }, // Orange color (your theme)
        });

        doc.save("Customer_List.pdf");
    };
    const columns = [
        {
            key: "no",
            label: "NO",
            render: (_, index) => {
                // ৩. প্যাগিনেশন সিরিয়াল ক্যালকুলেশন ফিক্স
                const cp = Number(meta.current_page) || 1;
                const pp = Number(meta.per_page) || 10;
                return (cp - 1) * pp + index + 1;
            },
            className: "text-center w-12 font-medium",
        },
        {
            key: "customer_info",
            label: "CUSTOMER INFO",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                        <img
                            src={item.profile_picture
                                ? `${IMAGE_URL}avatars/${item.profile_picture}`
                                : `https://ui-avatars.com/api/?name=${item.full_name}&background=ffedd5&color=fb923c&bold=true`
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${item.full_name}&background=ffedd5&color=fb923c`;
                            }}
                        />
                    </div>
                    <p className="font-bold text-gray-800 uppercase text-[11px] leading-tight">
                        {item.full_name}
                    </p>
                </div>
            ),
        },
        {
            key: "contact",
            label: "CONTACT",
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-xs">{item.contact_number}</span>
                    <span className="text-[10px] text-gray-400">
                        {item.user?.email || "—"}
                    </span>
                </div>
            ),
        },
        {
            key: "orders",
            label: "ORDERS",
            render: (item) => (
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold text-[12px]">
                    {item.orders?.length || 0}
                </span>
            ),
        },
        {
            key: "total_spent",
            label: "TOTAL SPENT",
            render: (item) => {
                const total = item.orders?.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0) || 0;
                return <span className="font-bold text-xs">৳ {total.toLocaleString()}</span>;
            },
        },
        {
            key: "actions",
            label: "ACTIONS",
            className: "text-left w-12",
            render: (item) => (
                <div className="flex justify-center">
                    <IconButton
                        icon={TbScanEye}
                        bgColor="bg-orange-400"
                        hoverBgColor="bg-orange-500"
                        onClick={() => setViewCustomer(item)} // এখানে মোডাল ওপেন হবে
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="px-4 py-2">
            <PageHeader
                title="All Customers"
                searchTerm={searchTerm}
                onSearch={(e) => setSearchTerm(e.target.value)}
                placeholderText="Search by name or phone..."
                rightActions={
                    <div className="flex gap-2">
                        <button onClick={exportToPDF} className="flex items-center gap-1 px-2 py-1 border border-main text-main rounded text-xs font-medium hover:bg-main hover:text-white transition-colors">
                            <TbPdf size={16} /> PDF
                        </button>
                        <button onClick={exportToExcel} className="flex items-center gap-1 px-2 py-1 border border-main text-main rounded text-xs font-medium hover:bg-main hover:text-white transition-colors">
                            <TbFileExcel size={16} /> Excel
                        </button>
                    </div>
                }
            />

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-4">
                <Table
                    columns={columns}
                    data={customers}
                    loading={loading}
                    enableCheckbox={false}
                    showFooter={false}
                />

                <div className="p-0 border-t">
                    <Pagination
                        currentPage={meta.current_page}
                        totalPages={meta.last_page}
                        perPage={meta.per_page}
                        totalItems={meta.total}
                        onPageChange={(p) => setPage(p)}
                        onPerPageChange={(pp) => setPerPage(pp)}
                    />
                </div>
            </div>
            {/* কাস্টমার ডিটেইলস মোডাল */}
            {viewCustomer && (
                <CustomerQuickView
                    customer={viewCustomer}
                    onClose={() => setViewCustomer(null)}
                />
            )}
        </div>
    );
};

export default AllCustomersTablePage;