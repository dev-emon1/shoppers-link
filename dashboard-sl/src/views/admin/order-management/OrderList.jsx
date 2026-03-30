import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import Pagination from "../../../components/Pagination";
import IconButton from "../../../components/ui/IconButton";
import { TbFileExcel, TbPdf, TbScanEye } from "react-icons/tb";
import API from "../../../../src/utils/api";
import { useAuth } from "../../../utils/AuthContext";
import { format } from "date-fns";
import OrderDetailsModal from "../../../components/ui/OrderDetailsModal";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AllOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // =============================
  // Parse billing info
  // =============================

  const getBilling = (order) => {
    try {
      const asa = order?.a_s_a;

      if (!asa) return {};

      const parsed = typeof asa === "string" ? JSON.parse(asa) : asa;

      return parsed?.billing || {};
    } catch (e) {
      console.warn("a_s_a parse failed", order.id);
      return {};
    }
  };

  const getCustomer = (order) => {
    if (!order?.customer) return {};

    return {
      name: order.customer.full_name,
      phone: order.customer.contact_number,
      email: order.customer?.user?.email,
    };
  };

  // =============================
  // Fetch Orders
  // =============================

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/order/list?page=${page}&per_page=${perPage}&search=${searchTerm}&status=${filterStatus}`,
      );

      const payload = res.data;

      setOrders(payload.data || []);
      setTotalItems(payload.total || 0);
      setTotalPages(payload.last_page || 1);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, searchTerm, filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatus, perPage]);

  // =============================
  // Table Columns
  // =============================

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
      render: (order) => (
        <span className="font-bold text-blue-600">{order.unid}</span>
      ),
    },

    {
      key: "customer",
      label: "Customer",
      render: (order) => {
        const customer = getCustomer(order);

        return (
          <div className="min-w-[140px]">
            <div className="font-medium">{customer.name || "—"}</div>
            <div className="text-xs text-gray-500">{customer.phone || "—"}</div>
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
        const count =
          order.vendor_orders?.reduce(
            (sum, vo) => sum + (vo.item_count || 0),
            0,
          ) || 0;

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
        <span className="px-3 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium uppercase">
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

  // =============================
  // Export Functions
  // =============================

  const downloadData = async (format) => {
    const data = filteredOrders.map((order) => {
      const customer = getCustomer(order);

      return {
        "Order ID": order.unid,
        Customer: customer.name,
        Phone: customer.phone,
        Date: format(new Date(order.created_at), "dd MMM yyyy"),
        Items: order.total_item,
        Total: order.total_amount,
        Status: order.status,
      };
    });

    if (format === "excel") {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Orders");

      XLSX.writeFile(wb, "orders.xlsx");
    }

    if (format === "pdf") {
      const doc = new jsPDF();

      autoTable(doc, {
        head: [
          ["Order ID", "Customer", "Phone", "Date", "Items", "Total", "Status"],
        ],
        body: data.map((d) => Object.values(d)),
      });

      doc.save("orders.pdf");
    }
  };

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
            >
              <TbPdf size={18} /> PDF
            </button>

            <button
              className="flex items-center gap-1.5 px-3 py-1.5 border border-green-600 text-green-700 rounded hover:bg-green-50 text-sm"
              onClick={() => downloadData("excel")}
            >
              <TbFileExcel size={18} /> Excel
            </button>
          </div>
        }
      />

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <Table
          columns={columns}
          data={orders}
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
            onPerPageChange={(n) => {
              setPerPage(n);
              setPage(1);
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
