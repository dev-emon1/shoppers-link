// src/pages/vendor/orders/AllOrdersPage.jsx

import { toast } from "react-toastify";
import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import Pagination from "../../../components/Pagination";
import OrderDetailsModal from "./OrderDetailsModal";
import IconButton from "../../../components/ui/IconButton";
import { TbScanEye } from "react-icons/tb";
import { exportToExcel } from "../../../utils/excelHelper";
import API from "../../../utils/api";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import StatusSelect from "../../../components/ui/StatusSelect";
import { User, Package, CreditCard } from "lucide-react";
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
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        per_page: perPage,
        page: page,
        search: searchTerm.trim() || undefined,
        status: statusFilter === "All" ? undefined : statusFilter.toLowerCase(),
      };

      const res = await API.get("/vendor/order/list", { params });
      const apiData = res.data || {};

      const responseData = apiData?.data || [];

      // Safe meta extraction (handles Laravel's weird array wrapping)
      const meta = apiData?.meta || {};
      const totalP = Array.isArray(meta.last_page) ? meta.last_page[0] || 1 : (meta.last_page || 1);
      const totalI = Array.isArray(meta.total) ? meta.total[0] || 0 : (meta.total || 0);
      const currPage = Array.isArray(meta.current_page) ? meta.current_page[0] || page : (meta.current_page || page);

      setOrders(responseData);
      setTotalPages(totalP);
      setTotalItems(totalI);

      if (currPage !== page) setPage(currPage);
    } catch (err) {
      // console.error(err);
      // toast.error(err.response?.data?.message || "Failed to load orders");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Debounced search (recommended)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "") {   // only reset if there's actual search
        setPage(1);
        fetchOrders();
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // =========================
  // STATUS UPDATE
  // =========================
  const handleStatusChange = async (orderId, newStatus) => {
    if (updatingOrderId === orderId) return;

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const prevStatus = order.status;

    if (newStatus === "cancelled" && prevStatus === "pending") {
      const confirmed = window.confirm(
        "আপনি কি নিশ্চিত এই অর্ডার ক্যান্সেল করতে চান?\nএটি স্টক ফিরিয়ে দেবে এবং আর ফিরিয়ে আনা যাবে না।"
      );
      if (!confirmed) return;
    }

    if (newStatus === "cancelled" && prevStatus !== "pending") {
      toast.error("Confirmed orders cannot be cancelled.");
      return;
    }

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    setUpdatingOrderId(orderId);

    try {
      await API.post(`/vendor/order/${orderId}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: prevStatus } : o))
      );
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns = [
    { key: "no", label: "No", render: (_, index) => (page - 1) * perPage + index + 1, className: "text-center w-12 font-medium" },
    { 
      key: "order_id", 
      label: "Order ID", 
      render: (item) => <span className="font-bold text-main text-sm">{item.unid}</span> 
    },
    {
      key: "customer",
      label: "Customer",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={20} />
          </div>
          <div className="font-medium">{item.order?.customer_name || "Guest"}</div>
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
        <div className="flex justify-center gap-2">
          <Package size={20} />
          <span>{item.item_count || 0}</span>
        </div>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (item) => (
        <div className="text-right font-bold text-green-600">
          ৳ {Number(item.subtotal || 0).toLocaleString()}
        </div>
      ),
    },
    {
      key: "payment",
      label: "Payment",
      render: (item) => (
        <div className="flex items-center gap-2">
          <CreditCard size={20} />
          <span className="uppercase">{item.order?.payment_method || "COD"}</span>
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
              let parsed = {};
              try {
                parsed = item.order?.a_s_a ? JSON.parse(item.order.a_s_a) : {};
              } catch (e) {}
              setSelectedOrder({ ...item, parsedData: parsed });
            }}
          />
        </div>
      ),
    },
  ];

  // Export functions (current page only)
  const exportToPDF = () => {
    if (!orders.length) return toast.info("No data to export");

    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Vendor Orders Report", 14, 20);

    const rows = orders.map((o) => [
      o.unid,
      o.order?.customer_name || "Guest",
      format(new Date(o.created_at), "dd MMM yyyy"),
      o.item_count || 0,
      `৳ ${Number(o.subtotal || 0).toLocaleString()}`,
      o.status.toUpperCase(),
    ]);

    doc.autoTable({ head: [["Order ID", "Customer", "Date", "Items", "Total", "Status"]], body: rows });
    doc.save("vendor_orders.pdf");
  };

  const exportExcel = () => {
    if (!orders.length) return toast.info("No data to export");

    const data = orders.map((o) => ({
      ID: o.unid,
      Customer: o.order?.customer_name || "Guest",
      Date: format(new Date(o.created_at), "dd MMM yyyy"),
      Items: o.item_count || 0,
      Total: o.subtotal || 0,
      Status: o.status,
    }));

    exportToExcel(data, "vendor_orders");
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="px-4">
      <PageHeader
        title={`My Orders (${totalItems})`}
        searchTerm={searchTerm}
        onSearch={(e) => setSearchTerm(e.target.value)}
        // Add status filter and export buttons inside PageHeader if possible
      />

      <Table columns={columns} data={orders} loading={loading} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        perPage={perPage}
        totalItems={totalItems}
        onPageChange={setPage}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage);
          setPage(1);
        }}
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