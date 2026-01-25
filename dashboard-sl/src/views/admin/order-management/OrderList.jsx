import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import StatusBadge from "../../../components/common/StatusBadge";
import Pagination from "../../../components/Pagination";
import IconButton from "../../../components/ui/IconButton";
import { TbFileExcel, TbPdf, TbScanEye } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import API from "../../../../src/utils/api";           // adjust path if needed
import { useAuth } from "../../../utils/AuthContext";
import { format } from "date-fns";
import OrderDetailsModal from "../../../components/ui/OrderDetailsModal";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AllOrders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await API.get(`/order/list?page=${page}&per_page=${perPage}`);
            const payload = res.data;
            // console.log(payload);

            let fetchedOrders = payload.data || [];

            // Optional: filter for vendor (uncomment if needed)
            // if (user?.role !== "admin") {
            //     fetchedOrders = fetchedOrders.filter(o =>
            //         o.vendor_orders?.some(vo => Number(vo.vendor_id) === Number(user.vendor_id))
            //     );
            // }

            setOrders(fetchedOrders);
            setTotalItems(payload.meta?.total || 0);
            setTotalPages(payload.meta?.last_page || 1);
        } catch (err) {
            console.error("Failed to load orders:", err);
        } finally {
            setLoading(false);
        }
    }, [page, perPage, user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Client-side filter (search + status)
    const filteredOrders = orders.filter((order) => {
        // Get first vendor order (most multi-vendor systems show data from first vendor order)
        const vo = order.vendor_orders?.[0];

        // Try to parse billing
        let billing = {};
        try {
            const asa = vo?.order?.a_s_a;
            if (asa) {
                const parsed = typeof asa === "string" ? JSON.parse(asa) : asa;
                billing = parsed?.billing || {};
            }
        } catch (e) {
            console.warn("Failed to parse a_s_a for order", order.id);
        }

        const searchLower = searchTerm.toLowerCase();

        const matchesSearch =
            order.unid?.toLowerCase().includes(searchLower) ||
            billing.fullName?.toLowerCase().includes(searchLower) ||
            billing.phone?.toLowerCase().includes(searchLower);

        const matchesStatus =
            !filterStatus || order.status?.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const getOrderData = (order) => {
        const vo = order.vendor_orders?.[0];
        let billing = {};
        try {
            const asa = vo?.order?.a_s_a;
            if (asa) {
                const parsed = typeof asa === "string" ? JSON.parse(asa) : asa;
                billing = parsed?.billing || {};
            }
        } catch (e) { }

        const customer = `${billing.fullName || order.customer?.full_name || "—"} (${billing.phone || order.customer?.contact_number || "—"})`;
        const date = format(new Date(order.created_at), "dd MMM yyyy");
        const items = order.vendor_orders?.reduce((sum, vo) => sum + (vo.item_count || 0), 0) || 0;
        const total = `৳ ${(order.total_amount || 0).toLocaleString()}`;
        const payment = order.payment_method?.toUpperCase() || "COD";
        const status = order.status;

        return {
            "Order ID": order.unid,
            Customer: customer,
            Date: date,
            Items: items,
            Total: total,
            Payment: payment,
            Status: status,
        };
    };

    const downloadData = async (format) => {
        setLoading(true);
        let allOrders = [];
        try {
            // Fetch all orders in one go by setting a large per_page (assumes API supports it; adjust if needed)
            const res = await API.get(`/order/list?page=1&per_page=${totalItems}`);
            const payload = res.data;

            allOrders = payload.data || [];

            // Optional: vendor filter if needed
            // if (user?.role !== "admin") {
            //     allOrders = allOrders.filter(o =>
            //         o.vendor_orders?.some(vo => Number(vo.vendor_id) === Number(user.vendor_id))
            //     );
            // }
        } catch (err) {
            console.error("Failed to fetch all orders for download:", err);
            setLoading(false);
            return;
        }

        // Apply client-side filters
        const filtered = allOrders.filter((order) => {
            const vo = order.vendor_orders?.[0];
            let billing = {};
            try {
                const asa = vo?.order?.a_s_a;
                if (asa) {
                    const parsed = typeof asa === "string" ? JSON.parse(asa) : asa;
                    billing = parsed?.billing || {};
                }
            } catch (e) {
                console.warn("Failed to parse a_s_a for order", order.id);
            }

            const searchLower = searchTerm.toLowerCase();

            const matchesSearch =
                order.unid?.toLowerCase().includes(searchLower) ||
                billing.fullName?.toLowerCase().includes(searchLower) ||
                billing.phone?.toLowerCase().includes(searchLower);

            const matchesStatus =
                !filterStatus || order.status?.toLowerCase() === filterStatus.toLowerCase();

            return matchesSearch && matchesStatus;
        });

        const data = filtered.map(getOrderData);

        if (format === "excel") {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Orders");
            XLSX.writeFile(wb, "orders.xlsx");
        } else if (format === "pdf") {
            const doc = new jsPDF();
            autoTable(doc, {
                head: [["Order ID", "Customer", "Date", "Items", "Total", "Payment", "Status"]],
                body: data.map((d) => [
                    d["Order ID"],
                    d.Customer,
                    d.Date,
                    d.Items,
                    d.Total,
                    d.Payment,
                    d.Status,
                ]),
            });
            doc.save("orders.pdf");
        }

        setLoading(false);
    };

    const columns = [
        {
            key: "no",
            label: "NO",
            render: (_, index) => (page - 1) * perPage + index + 1,
            className: "text-center w-16 font-bold text-gray-700",
        },
        {
            key: "orderid",
            label: "Order ID",
            render: (order) => <span className="font-bold text-blue-600">{order.unid}</span>,
        },
        {
            key: "customer",
            label: "Customer",
            render: (order) => {
                const vo = order.vendor_orders?.[0];
                let billing = {};
                try {
                    const asa = vo?.order?.a_s_a;
                    if (asa) {
                        const parsed = typeof asa === "string" ? JSON.parse(asa) : asa;
                        billing = parsed?.billing || {};
                    }
                } catch { }

                return (
                    <div className="min-w-[140px]">
                        <div className="font-medium">
                            {billing.fullName || order.customer?.full_name || "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                            {billing.phone || order.customer?.contact_number || "—"}
                        </div>
                    </div>
                );
            },
        },
        {
            key: "date",
            label: "Date",
            render: (order) => format(new Date(order.created_at), "dd MMM yyyy"),
        },
        {
            key: "items",
            label: "Items",
            render: (order) => {
                const count = order.vendor_orders?.reduce((sum, vo) => sum + (vo.item_count || 0), 0) || 0;
                return <div className="font-bold text-center">{count}</div>;
            },
            className: "text-center",
        },
        {
            key: "total",
            label: "Total",
            render: (order) => (
                <div className="font-bold text-green-700 text-right">
                    ৳ {Number(order.total_amount || 0).toLocaleString()}
                </div>
            ),
            className: "text-right",
        },
        {
            key: "payment",
            label: "Payment",
            render: (order) => (
                <span className="px-3 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium uppercase tracking-wide">
                    {order.payment_method?.toUpperCase() || "COD"}
                </span>
            ),
            className: "text-center",
        },
        {
            key: "status",
            label: "Status",
            render: (order) => order.status,
            className: "text-center",
        },
        {
            key: "actions",
            label: "Actions",
            render: (order) => (
                <div className="flex justify-center">
                    <IconButton
                        icon={TbScanEye}
                        bgColor="bg-orange-500 hover:bg-orange-600"
                        className="w-9 h-9"
                        onClick={() => {
                            setSelectedOrder(order);
                            setShowDetails(true);
                        }}
                    />
                </div>
            ),
            className: "text-center",
        },
    ];

    return (
        <div className="px-5 py-6 bg-gray-50 min-h-screen">
            <PageHeader
                title="All Orders"
                searchTerm={searchTerm}
                onSearch={(e) => setSearchTerm(e.target.value)}
                placeholderText="Search by order ID, customer name or phone..."
                rightActions={
                    <div className="flex gap-2">
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500 text-red-600 rounded hover:bg-red-50 text-sm"
                            onClick={() => downloadData("pdf")}
                            disabled={loading}
                        >
                            <TbPdf size={18} /> PDF
                        </button>
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-green-600 text-green-700 rounded hover:bg-green-50 text-sm"
                            onClick={() => downloadData("excel")}
                            disabled={loading}
                        >
                            <TbFileExcel size={18} /> Excel
                        </button>
                    </div>
                }
            />

            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <Table
                    columns={columns}
                    data={filteredOrders}
                    loading={loading}
                    enableCheckbox={false}
                    emptyMessage="No orders found"
                />

                <div className="px-5 py-4 border-t bg-gray-50/70">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        perPage={perPage}
                        totalItems={totalItems}
                        onPageChange={setPage}
                        onPerPageChange={(newPerPage) => {
                            setPerPage(newPerPage);
                            setPage(1); // reset to first page when changing size
                        }}
                    />
                </div>
            </div>

            {showDetails && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </div>
    );
};

export default AllOrders;