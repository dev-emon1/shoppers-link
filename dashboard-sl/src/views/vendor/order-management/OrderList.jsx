// src/pages/vendor/orders/AllOrdersPage.jsx

import { toast } from "react-toastify";
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

  // =========================
  // STATE MANAGEMENT
  // =========================
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // =========================
  // FETCH ORDERS (API)
  // =========================
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/vendor/order/list");

      // Ensure safe fallback
      setOrders(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // =========================
  // STATUS UPDATE HANDLER
  // =========================
  const handleStatusChange = async (orderId, newStatus) => {
    if (updatingOrderId === orderId) return;

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const prevStatus = order.status;

    // Business rules
    if (newStatus === "cancelled" && prevStatus === "pending") {
      const confirmed = window.confirm(
        "আপনি কি নিশ্চিত এই অর্ডার ক্যান্সেল করতে চান?\nএটি স্টক ফিরিয়ে দেবে এবং আর ফিরিয়ে আনা যাবে না।",
      );
      if (!confirmed) return;
    }

    if (newStatus === "cancelled" && prevStatus !== "pending") {
      toast.error("Confirmed orders cannot be cancelled.");
      return;
    }

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );

    setUpdatingOrderId(orderId);

    try {
      await API.post(`/vendor/order/${orderId}/status`, {
        status: newStatus,
      });

      const statusName = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

      toast.success(`Status updated to ${statusName}`);
    } catch (err) {
      // Rollback on failure
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: prevStatus } : o)),
      );

      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to update status";

      toast.error(msg);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =========================
  // FILTER LOGIC
  // =========================
  const filtered = orders.filter((order) => {
    const matchesSearch =
      order.unid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order?.customer_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(filtered.length / perPage);
  const currentData = filtered.slice((page - 1) * perPage, page * perPage);

  // =========================
  // TABLE CONFIG
  // =========================
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
      render: (item) => (
        <span className="font-bold text-main text-sm">{item.unid}</span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <div className="font-medium">
              {item.order?.customer_name || "Guest"}
            </div>
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
          <div className="text-xs text-gray-500">
            {format(new Date(item.created_at), "hh:mm a")}
          </div>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (item) => (
        <div className="flex justify-center gap-2">
          <Package size={20} />
          <span>{item.item_count}</span>
        </div>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (item) => (
        <div className="text-right font-bold text-green-600">
          ৳ {Number(item.subtotal).toLocaleString()}
        </div>
      ),
    },
    {
      key: "payment",
      label: "Payment",
      render: (item) => (
        <div className="flex items-center gap-2">
          <CreditCard size={20} />
          <span className="uppercase">
            {item.order?.payment_method || "COD"}
          </span>
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
              // Safe JSON parsing (a_s_a fallback support)
              let parsed = {};
              try {
                parsed = item.order?.a_s_a ? JSON.parse(item.order.a_s_a) : {};
              } catch {
                parsed = {};
              }

              setSelectedOrder({
                ...item,
                parsedData: parsed,
              });
            }}
          />
        </div>
      ),
    },
  ];

  // =========================
  // EXPORT PDF
  // =========================
  const exportToPDF = () => {
    if (!currentData.length) return;

    const doc = new jsPDF({ orientation: "landscape" });

    doc.text("My Orders Report", 14, 20);

    const rows = currentData.map((o) => [
      o.unid,
      o.order?.customer_name || "Guest",
      format(new Date(o.created_at), "dd MMM yyyy"),
      o.item_count,
      `৳ ${Number(o.subtotal).toLocaleString()}`,
      o.status.toUpperCase(),
    ]);

    doc.autoTable({
      head: [["Order ID", "Customer", "Date", "Items", "Total", "Status"]],
      body: rows,
    });

    doc.save("orders.pdf");
  };

  // =========================
  // EXPORT EXCEL
  // =========================
  const exportExcel = () => {
    if (!currentData.length) return;

    const data = currentData.map((o) => ({
      ID: o.unid,
      Customer: o.order?.customer_name,
      Total: o.subtotal,
    }));

    exportToExcel(data, "orders");
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="px-4">
      <PageHeader
        title={`My Orders (${filtered.length})`}
        searchTerm={searchTerm}
        onSearch={(e) => setSearchTerm(e.target.value)}
      />

      <Table columns={columns} data={currentData} loading={loading} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

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
