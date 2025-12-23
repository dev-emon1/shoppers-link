// src/pages/vendor/orders/AllOrdersPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import Pagination from "../../../components/Pagination";
import OrderDetailsModal from "./OrderDetailsModal";
import IconButton from "../../../components/ui/IconButton";
import { TbScanEye, TbFileExcel, TbPdf } from "react-icons/tb";
import { exportToExcel } from "../../../utils/excelHelper";
import API from "../../../utils/api";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import StatusSelect from "../../../components/ui/StatusSelect";
import { User, Package, CreditCard, CheckCircle } from "lucide-react";
import { useAuth } from "../../../utils/AuthContext";

const AllOrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [toast, setToast] = useState(null);


    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await API.get("/vendor/order/list");
            setOrders(res.data.data || []);
        } catch (err) {
            console.error(err);
            showToast("Failed to load orders", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };
    // console.log(user);
    const handleStatusChange = async (orderId, newStatus) => {
        if (updatingOrderId === orderId) return;

        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const prevStatus = order.status;

        // Optimistic update
        setOrders(prev =>
            prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        setUpdatingOrderId(orderId);

        try {
            const res = await API.post(`/vendor/order/${orderId}/status`, {
                status: newStatus
                // vendor_order_id is optional — URL already has it
            });

            showToast(res.data.message || "Status updated successfully!");

            // Optional: use fresh data
            // setOrders(prev => prev.map(o => o.id === orderId ? res.data.vendor_order : o));
        } catch (err) {
            setOrders(prev =>
                prev.map(o => (o.id === orderId ? { ...o, status: prevStatus } : o))
            );

            const msg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Failed to update status";

            showToast(msg, "error");
        } finally {
            setUpdatingOrderId(null);
        }
    };
    // Filter
    const filtered = orders.filter(order => {
        const matchesSearch =
            order.unid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.order?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || order.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filtered.length / perPage);
    const currentData = filtered.slice((page - 1) * perPage, page * perPage);

    const columns = [
        {
            key: "no",
            label: "No",
            render: (_, index) => (page - 1) * perPage + index + 1,
            className: "text-center w-12 font-medium",
        },
        {
            key: "order_id",
            label: "Order ID",
            render: (item) => <span className="font-bold text-main text-sm">{item.unid}</span>,
        },
        {
            key: "customer",
            label: "Customer",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-600" />
                    </div>
                    <div>
                        <div className="font-medium">{item.order?.customer_name || "Guest"}</div>
                        {item.order?.customer_phone && (
                            <div className="text-sm text-gray-500">{item.order.customer_phone}</div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: "date",
            label: "Date",
            render: (item) => (
                <div>
                    <div>{format(new Date(item.created_at), "dd MMM yyyy")}</div>
                    <div className="text-xs text-gray-500">{format(new Date(item.created_at), "hh:mm a")}</div>
                </div>
            ),
        },
        {
            key: "items",
            label: "Items",
            render: (item) => (
                <div className="flex items-center justify-center gap-2">
                    <Package size={20} />
                    <span className="font-semibold">{item.item_count}</span>
                </div>
            ),
        },
        {
            key: "total",
            label: "Total",
            render: (item) => (
                <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                        ৳ {Number(item.subtotal).toLocaleString()}
                    </div>
                </div>
            ),
        },
        {
            key: "payment",
            label: "Payment",
            render: (item) => (
                <div className="flex items-center gap-2">
                    <CreditCard size={20} />
                    <span className="font-medium uppercase">{item.order?.payment_method || "COD"}</span>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (item) => (
                <StatusSelect
                    currentStatus={item.status}
                    isUpdating={updatingOrderId === item.id}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                />
            ),
            className: "text-center",
        },
        {
            key: "actions",
            label: "Actions",
            render: (item) => (
                <div className="flex justify-center">
                    <IconButton
                        icon={TbScanEye}
                        bgColor="bg-main"
                        hoverBgColor="bg-mainHover"
                        onClick={() => {
                            let parsed = {};
                            try {
                                parsed = item.order?.a_s_a ? JSON.parse(item.order.a_s_a) : {};
                            } catch (e) {
                                console.error(e);
                            }
                            setSelectedOrder({ ...item, parsedData: parsed });
                        }}
                    />
                </div>
            ),
        },
    ];

    const exportToPDF = () => {
        if (!currentData.length) return alert("No data to export!");

        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(20);
        doc.setTextColor("#E07D42");
        doc.text("My Orders Report", 14, 20);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${format(new Date(), "dd MMM yyyy, hh:mm a")}`, 14, 30);
        doc.text(`Total Orders: ${filtered.length}`, 14, 38);

        const rows = currentData.map(o => [
            o.unid,
            o.order?.customer_name || "Guest",
            format(new Date(o.created_at), "dd MMM yyyy"),
            o.item_count,
            `৳ ${Number(o.subtotal).toLocaleString()}`,
            o.order?.payment_method || "COD",
            o.status.toUpperCase(),
            `৳ ${Number(o.vendor_earning).toLocaleString()}`,
        ]);

        doc.autoTable({
            head: [["Order ID", "Customer", "Date", "Items", "Total", "Payment", "Status", "Earning"]],
            body: rows,
            startY: 45,
            theme: "grid",
            headStyles: { fillColor: "#E07D42", textColor: "#fff" },
            styles: { fontSize: 9 },
        });

        doc.save("my-orders.pdf");
    };

    const exportExcel = () => {
        if (!currentData.length) return alert("No data!");

        const data = currentData.map(o => ({
            "Order ID": o.unid,
            Customer: o.order?.customer_name || "Guest",
            Date: format(new Date(o.created_at), "dd MMM yyyy hh:mm a"),
            Items: o.item_count,
            Subtotal: Number(o.subtotal),
            Earning: Number(o.vendor_earning),
            Payment: o.order?.payment_method || "COD",
            Status: o.status.toUpperCase(),
        }));

        exportToExcel(data, "my-orders");
    };

    return (
        <div className="px-4">
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg text-white shadow-lg transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                >
                    <CheckCircle size={20} />
                    <span>{toast.msg}</span>
                </div>
            )}

            <PageHeader
                title={`My Orders (${filtered.length})`}
                searchTerm={searchTerm}
                onSearch={(e) => setSearchTerm(e.target.value)}
                rightActions={
                    <>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition"
                        >
                            <TbPdf size={18} /> PDF
                        </button>
                        <button
                            onClick={exportExcel}
                            className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition"
                        >
                            <TbFileExcel size={18} /> Excel
                        </button>
                    </>
                }
            />

            <div className="bg-white rounded-lg shadow-md overflow-hidden my-6">
                <Table columns={columns} data={currentData} loading={loading} />

                <div className="p-4 border-t bg-gray-50">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        perPage={perPage}
                        totalItems={filtered.length}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </div>
            </div>

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
};

export default AllOrdersPage;