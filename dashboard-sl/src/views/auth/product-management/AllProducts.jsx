import React, { useState, useMemo, useCallback } from "react";
import PageHeader from "../../../components/common/PageHeader";
import Table from "../../../components/table/Table";
import StatusBadge from "../../../components/common/StatusBadge";
import Pagination from "../../../components/Pagination";
import FilterBar from "../../../components/common/FilterBar";
import ProductQuickView from "../../../components/ui/ProductQuickView";
import IconButton from "../../../components/ui/IconButton";
import { RiFileEditLine } from "react-icons/ri";
import { CiTrash } from "react-icons/ci";
import { TbScanEye } from "react-icons/tb";
import { dummyProducts } from "../../../data/admin/product-management/dummyData";
import { exportToExcel, importFromExcel } from "../../../utils/excelHelper";
import { useNavigate } from "react-router-dom";

const AllProducts = React.memo(() => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterVendor, setFilterVendor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewProduct, setViewProduct] = useState(null);

  const navigate = useNavigate();

  // ===== Handlers =====
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handlePerPageChange = useCallback((e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((type, value) => {
    if (type === "month") setFilterMonth(value);
    if (type === "category") setFilterCategory(value);
    if (type === "vendor") setFilterVendor(value);
    if (type === "status") setFilterStatus(value);
    setPage(1);
  }, []);

  // ===== Filter + Pagination =====
  const { filteredData, currentData, totalPages } = useMemo(() => {
    let filtered = dummyProducts;

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterMonth)
      filtered = filtered.filter((item) => item.month === filterMonth);
    if (filterCategory)
      filtered = filtered.filter((item) => item.category === filterCategory);
    if (filterVendor)
      filtered = filtered.filter((item) => item.vendor === filterVendor);
    if (filterStatus)
      filtered = filtered.filter((item) => item.status === filterStatus);

    const total = Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;
    const current = filtered.slice(start, start + perPage);
    return { filteredData: filtered, currentData: current, totalPages: total };
  }, [
    searchTerm,
    filterMonth,
    filterCategory,
    filterVendor,
    filterStatus,
    perPage,
    page,
  ]);

  // ===== Export / Import =====
  const handleExport = useCallback(() => {
    if (!filteredData.length) return alert("⚠️ No data to export!");
    const exportData = filteredData.map((p) => ({
      Name: p.name,
      SKU: p.sku,
      Category: p.category,
      Brand: p.brand,
      Vendor: p.vendor,
      Price: p.price,
      Discount: p.discount,
      Stock: p.stock,
      Status: p.status,
    }));
    exportToExcel(exportData, "products_export", "Products", "xlsx");
  }, [filteredData]);

  const handleImport = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imported = await importFromExcel(file);
    console.log("📥 Imported Products:", imported);
    alert(`✅ Imported ${imported.length} products successfully!`);
  }, []);

  // ===== Table Columns =====
  const columns = [
    {
      key: "no",
      label: "No",
      render: (item, i, page, perPage) => (page - 1) * perPage + i + 1,
      className: "text-center w-[50px]",
    },
    {
      key: "image",
      label: "Image",
      render: (item) => (
        <img
          src={item.image}
          alt={item.name}
          className="w-10 h-10 rounded object-cover border border-border"
        />
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      className: "font-medium text-gray-800 capitalize",
    },
    { key: "sku", label: "SKU", className: "hidden md:table-cell" },
    { key: "category", label: "Category", className: "hidden md:table-cell" },
    { key: "brand", label: "Brand", className: "hidden lg:table-cell" },
    { key: "vendor", label: "Vendor", className: "hidden lg:table-cell" },
    { key: "price", label: "Price", render: (i) => `$${i.price}` },
    {
      key: "discount",
      label: "Discount",
      render: (i) => `${i.discount || 0}%`,
    },
    { key: "stock", label: "Stock", render: (i) => i.stock },
    {
      key: "status",
      label: "Status",
      render: (i) => <StatusBadge status={i.status} />,
      className: "text-center",
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (item) => (
        <div className="flex justify-center items-center gap-2 md:gap-3">
          <IconButton
            icon={TbScanEye}
            bgColor="bg-green"
            hoverBgColor="bg-deepGreen"
            onClick={() => setViewProduct(item)}
          />
          <IconButton
            icon={RiFileEditLine}
            bgColor="bg-main"
            hoverBgColor="bg-mainHover"
          />
          <IconButton
            icon={CiTrash}
            bgColor="bg-red"
            hoverBgColor="bg-deepRed"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="px-4">
      <PageHeader
        title="All Products"
        searchTerm={searchTerm}
        onSearch={handleSearch}
        addLabel="Add Product"
        onAddClick={() => navigate("/vendor/products/add-product")}
        placeholderText="Search by product name or SKU"
        rightActions={
          <>
            <button
              onClick={handleExport}
              className="border border-border text-gray-700 text-sm px-3 py-1.5 rounded-md hover:bg-gray-50 transition"
            >
              Export Excel
            </button>
            <label className="border border-border text-gray-700 text-sm px-3 py-1.5 rounded-md hover:bg-gray-50 transition cursor-pointer">
              Import Excel
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={handleImport}
              />
            </label>
            <button className="border border-border text-red-600 text-sm px-3 py-1.5 rounded-md hover:bg-red-50 transition">
              Bulk Delete
            </button>
          </>
        }
      />

      {/* ===== FILTER BAR ===== */}
      <div className="mb-4 bg-white p-3 rounded-md shadow-sm">
        <FilterBar
          filterMonth={filterMonth}
          filterCategory={filterCategory}
          filterVendor={filterVendor}
          filterStatus={filterStatus}
          months={[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ]}
          categories={[...new Set(dummyProducts.map((p) => p.category))]}
          vendors={[...new Set(dummyProducts.map((p) => p.vendor))]}
          perPage={perPage}
          onFilterChange={handleFilterChange}
          onPerPageChange={handlePerPageChange}
        />
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white p-4 rounded-md shadow-md overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <Table
          columns={columns}
          data={currentData}
          page={page}
          perPage={perPage}
          enableCheckbox={true}
          showFooter={true}
        />
        <div className="flex justify-end mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* ===== QUICK VIEW ===== */}
      {viewProduct && (
        <ProductQuickView
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}
    </div>
  );
});

export default AllProducts;
