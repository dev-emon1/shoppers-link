import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import StatusBadge from "../../../components/common/StatusBadge";
import Pagination from "../../../components/Pagination";
import ProductQuickView from "../../../components/ui/ProductQuickView";
import ProductEditModal from "../../../components/ui/ProductEditModal";
import IconButton from "../../../components/ui/IconButton";
import { RiFileEditLine } from "react-icons/ri";
import { TbFileExcel, TbPdf, TbScanEye } from "react-icons/tb";
import { exportToExcel } from "../../../utils/excelHelper";
import { useNavigate } from "react-router-dom";
import API from "../../../../src/utils/api";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { useAuth } from "../../../utils/AuthContext";

const AllProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  // console.log(meta);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterVendor, setFilterVendor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

  // Fetch products - এটাই এখন ১০০% সঠিক
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      if (filterCategory) params.append("category", filterCategory);
      if (filterVendor) params.append("vendor", filterVendor);
      if (filterStatus !== "" && filterStatus !== null) params.append("status", filterStatus);
      params.append("page", page.toString());
      params.append("per_page", perPage.toString());

      const response = await API.get(`/products?${params.toString()}`);

      // এটাই আপনার বর্তমান সঠিক API রেসপন্স স্ট্রাকচার
      const payload = response.data; // { data: [...], meta: { ... } }
      // console.log(payload);

      setProducts(payload.data || []);
      setMeta({
        current_page: payload.meta?.current_page || 1,
        last_page: payload.meta?.last_page || 1,
        per_page: payload.meta?.per_page || 10,
        total: payload.meta?.total || 0,
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setMeta({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategory, filterVendor, filterStatus, page, perPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterCategory, filterVendor, filterStatus]);

  // Export functions (এগুলো ঠিক আছে)
  const handleExport = () => {
    if (!products.length) return alert("No data to export!");

    const exportData = products.map((p, index) => {
      const variantList = p.variants
        ?.map((v) => {
          const attrs = JSON.parse(v.attributes || "{}");
          const attrString = Object.entries(attrs)
            .map(([key, val]) => `${key}: ${val}`)
            .join(", ");
          return `SKU: ${v.sku} | Price: ${v.price} | Stock: ${v.stock} | ${attrString}`;
        })
        .join("\n");

      return {
        SN: (meta.current_page - 1) * meta.per_page + index + 1, // পেজিনেশন সহ সিরিয়াল
        Name: p.name,
        SKU: p.sku,
        Category: p.category?.name || "",
        SubCategory: p.sub_category?.name || "",
        ChildCategory: p.child_category?.name || "",
        TotalStock: p.variants?.reduce((t, v) => t + Number(v.stock || 0), 0) || 0,
        Variants: variantList || "No variants",
      };
    });

    exportToExcel(exportData, "products_export", "Products", "xlsx");
  };

  const exportToPDF = () => {
    if (!products.length) return alert("No data to export!");

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // Header
    doc.setFontSize(20);
    doc.setTextColor('#E07D42');
    doc.text("Products Export Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total Products: ${meta.total}`, 14, 35);

    // Table Data
    const tableData = products.map((p, index) => {
      const variantList = p.variants
        ?.map((v) => {
          const attrs = JSON.parse(v.attributes || "{}");
          const attrString = Object.entries(attrs)
            .map(([key, val]) => `${key}: ${val}`)
            .join(", ");
          return `SKU: ${v.sku} | Price: ${v.price} | Stock: ${v.stock} | ${attrString}`;
        })
        .join("\n") || "No variants";

      const categoryPath = [p.category?.name, p.sub_category?.name, p.child_category?.name]
        .filter(Boolean)
        .join(" > ") || "Uncategorized";

      const totalStock = p.variants?.reduce((t, v) => t + Number(v.stock || 0), 0) || 0;

      return {
        SN: (meta.current_page - 1) * meta.per_page + index + 1, // পেজিনেশন সহ সিরিয়াল
        Name: p.name,
        SKU: p.sku,
        Category: categoryPath,
        TotalStock: totalStock,
        Variants: variantList,
      };
    });

    // PDF Table
    autoTable(doc, {
      head: [["SN", "Product Name", "Product SKU", "Category Path", "Total Stock", "Variants Details"]],
      body: tableData.map(row => [
        row.SN,
        row.Name.length > 35 ? row.Name.substring(0, 35) + "..." : row.Name,
        row.SKU,
        row.Category,
        row.TotalStock,
        row.Variants,
      ]),
      startY: 40,
      theme: "grid",
      headStyles: {
        fillColor: "#E07D42",
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
        halign: "center",
      },
      styles: {
        fontSize: 9,
        cellPadding: 5,
        overflow: "linebreak",
        lineHeight: 1.4,
        minCellHeight: 15,
      },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },     // SN
        1: { cellWidth: 50 },                       // Name
        2: { cellWidth: 35, halign: "center" },     // SKU
        3: { cellWidth: 50 },                       // Category
        4: { cellWidth: 22, halign: "center" },     // Total Stock
        5: { cellWidth: 90 },                       // Variants
      },
      margin: { top: 40, left: 10, right: 10 },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      },
    });

    doc.save(`products-export-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Table Columns - No কলামে label যোগ করা হয়েছে
  const columns = [
    {
      key: "no",
      label: "No",
      render: (_, index) => {
        if (meta.total === 0) return "—";
        return (meta.current_page - 1) * meta.per_page + index + 1;
      },
      className: "text-center w-12 font-medium",
    },
    {
      key: "image",
      label: "Image",
      render: (item) => {
        const primary = item.images?.find((img) => img.is_primary);
        return (
          <img
            src={primary ? `${IMAGE_URL}/${primary.image_path}` : "/placeholder.png"}
            alt={item.name}
            className="w-10 h-10 rounded object-cover border"
          />
        );
      },
    },
    { key: "name", label: "Name", className: "font-medium" },
    { key: "sku", label: "SKU", className: "hidden md:table-cell" },
    {
      key: "category",
      label: "Category",
      className: "hidden lg:table-cell",
      render: (i) =>
        [i.category?.name, i.sub_category?.name, i.child_category?.name]
          .filter(Boolean)
          .join(" > "),
    },
    {
      key: "stock",
      label: "Stock",
      render: (item) => {
        // Check if category ID is 8 (Software/License)
        // Note: Use == instead of === if one is a string and other is a number
        if (item.category_id == 8 || item.category?.id == 8) {
          return <span className="text-green-600 font-bold">In-stock</span>;
        }

        // Default behavior for other categories
        return item.variants?.reduce((t, v) => t + Number(v.stock || 0), 0) || 0;
      },
      className: "text-center",
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <StatusBadge status={item.status === 1 ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (item) => (
        <div className="flex justify-center gap-2">
          <IconButton
            icon={TbScanEye}
            bgColor="bg-main"
            hoverBgColor="bg-mainHover"
            onClick={() => setViewProduct(item)}
          />
          <IconButton
            icon={RiFileEditLine}
            bgColor="bg-main"
            hoverBgColor="bg-mainHover"
            onClick={() => setEditProduct(item)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 py-6">
      <PageHeader
        title="All Products"
        searchTerm={searchTerm}
        onSearch={(e) => setSearchTerm(e.target.value)}
        addLabel="Add Product"
        onAddClick={() => navigate("/vendor/products/add-product")}
        placeholderText="Search by name or SKU..."
        rightActions={
          <>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 border border-main text-main rounded-md hover:bg-orange-50"
            >
              <TbPdf className="text-xl" />
              <span className="font-medium">PDF</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-main text-main rounded-md hover:bg-orange-50"
            >
              <TbFileExcel className="text-xl" />
              <span className="font-medium">Excel</span>
            </button>
          </>
        }
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table
          columns={columns}
          data={products}
          loading={loading}
          enableCheckbox={false}
          showFooter={false}
        />

        <div className="p-4 border-t bg-gray-50">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            perPage={meta.per_page}
            totalItems={meta.total}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </div>
      </div>

      {viewProduct && (
        <ProductQuickView product={viewProduct} onClose={() => setViewProduct(null)} />
      )}
      {editProduct && (
        <ProductEditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={() => {
            fetchProducts();
            setEditProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default AllProducts;