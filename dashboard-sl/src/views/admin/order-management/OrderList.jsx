import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import StatusBadge from "../../../components/common/StatusBadge";
import Pagination from "../../../components/Pagination";
import IconButton from "../../../components/ui/IconButton";
import { TbFileExcel, TbPdf, TbScanEye } from "react-icons/tb";
import { exportToExcel } from "../../../utils/excelHelper";
import { useNavigate } from "react-router-dom";
import API from "../../../../src/utils/api";
import { useAuth } from "../../../utils/AuthContext";
import { format } from "date-fns";
import OrderDetailsModal from "../../../components/ui/OrderDetailsModal";

const Allorders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);


    // Pagination state
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    // Fetch Orders with Laravel Pagination
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await API.get(`/order/list?page=${page}&per_page=${perPage}`);
            const payload = res.data;
            console.log(orders);
            let allOrders = payload.data || [];

            // Vendor হলে শুধু নিজের অর্ডার
            // if (user?.role !== "admin") {
            //     allOrders = allOrders.filter(order =>
            //         order.vendor_orders?.some(vo => Number(vo.vendor_id) === Number(user.vendor_id || user.id))
            //     );
            // }

            setOrders(allOrders);

            // Laravel থেকে পেজিনেশন ডাটা
            setTotalItems(payload.total || 0);
            setTotalPages(payload.last_page || 1);

        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
        }
    }, [user, page, perPage]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Search + Status Filter
    const filteredOrders = orders.filter(order => {
        let billing = {};
        try {
            if (order.a_s_a) {
                const parsed = typeof order.a_s_a === "string" ? JSON.parse(order.a_s_a) : order.a_s_a;
                billing = parsed?.billing || {};
            }
        } catch (e) {
            console.warn("a_s_a parse error:", e);
        }

        const matchesSearch =
            order.unid.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (billing?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "" || order.status === filterStatus.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    // Table Columns
    const columns = [
        {
            key: "no",
            label: "NO",
            render: (_, i) => (page - 1) * perPage + i + 1,
            className: "text-center w-16 font-bold text-gray-700",
        },
        {
            key: "orderid",
            label: "Order ID",
            render: (order) => <span className="font-bold text-main">{order.unid}</span>,
        },
        {
            key: "customer",
            label: "Customer",
            render: (order) => {
                let billing = {};
                try {
                    if (order.a_s_a) {
                        const parsed = typeof order.a_s_a === "string" ? JSON.parse(order.a_s_a) : order.a_s_a;
                        billing = parsed?.billing || {};
                    }
                } catch (e) { }
                return (
                    <div>
                        <div className="font-medium">{billing?.fullName || "Guest Customer"}</div>
                        {billing?.phone && <div className="text-xs text-gray-500">{billing.phone}</div>}
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
            key: "item",
            label: "Items",
            render: (order) => <span className="font-bold text-center block">{order.total_item}</span>,
            className: "text-center",
        },
        {
            key: "total",
            label: "total",
            render: (order) => (
                <span className="font-bold text-green-600 block text-right">
                    ৳ {Number(order.total_amount).toLocaleString()}
                </span>
            ),
            className: "text-right",
        },
        {
            key: "payment",
            label: "payment",
            render: (order) => (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium uppercase">
                    {order.payment_method || "COD"}
                </span>
            ),
        },
        {
            key: "status",
            label: "status",
        },
        {
            key: "actions",
            label: "ACTIONS",
            render: (order) => (
                <div className="flex justify-center">
                    <IconButton
                        icon={TbScanEye}
                        bgColor="bg-orange-500"
                        hoverBgColor="bg-orange-600"
                        className="w-10 h-10"
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
        <div className="px-4 py-6 bg-gray-50 min-h-screen">
            <PageHeader
                title="Orders Management"
                searchTerm={searchTerm}
                onSearch={(e) => setSearchTerm(e.target.value)}
                placeholderText="Search by order ID or customer name..."
                rightActions={
                    <>
                        <button className="flex items-center gap-2 px-2 py-1.5 border border-main text-orange-600 rounded-lg hover:border-mainHover transition font-medium text-xs">
                            <TbPdf size={20} /> PDF
                        </button>
                        <button className="flex items-center gap-2 px-2 py-1.5 border border-main text-main rounded-lg hover:border-mainHover transition font-medium text-xs">
                            <TbFileExcel size={20} /> Excel
                        </button>
                    </>
                }
            />

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <Table
                    columns={columns}
                    data={filteredOrders}
                    loading={loading}
                    enableCheckbox={false}
                    showFooter={false}
                    className="text-sm"
                />

                {/* আপনার Pagination কম্পোনেন্টের সাথে ১০০% মিল */}
                <div className="p-4 border-t bg-gray-50">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        perPage={perPage}
                        totalItems={totalItems}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </div>
            </div>
            {/* Order Details Modal */}
            {showDetails && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </div>
    );
};

export default Allorders;