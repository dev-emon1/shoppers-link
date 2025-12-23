import React from "react";

const FilterBar = ({
  // ====== Props ======
  filterMonth,
  filterCategory,
  filterSubcategory,
  filterVendor,
  filterStatus,
  perPage,

  // ====== Options ======
  months,
  categories,
  subcategories,
  vendors,

  // ====== Handlers ======
  onFilterChange,
  onPerPageChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700">
      {/* ===== Month Filter ===== */}
      {months && months.length > 0 && (
        <select
          value={filterMonth || ""}
          onChange={(e) => onFilterChange("month", e.target.value)}
          className="border border-border rounded-md outline-none px-2 py-1.5 cursor-pointer bg-white"
        >
          <option value="">All Months</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      )}

      {/* ===== Category Filter ===== */}
      {categories && categories.length > 0 && (
        <select
          value={filterCategory || ""}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="border border-border rounded-md outline-none px-2 py-1.5 cursor-pointer bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      )}

      {/* ===== Subcategory Filter ===== */}
      {subcategories && subcategories.length > 0 && (
        <select
          value={filterSubcategory || ""}
          onChange={(e) => onFilterChange("subcategory", e.target.value)}
          className="border border-border rounded-md outline-none px-2 py-1.5 cursor-pointer bg-white"
        >
          <option value="">All Subcategories</option>
          {subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      )}

      {/* ===== Vendor Filter ===== */}
      {vendors && vendors.length > 0 && (
        <select
          value={filterVendor || ""}
          onChange={(e) => onFilterChange("vendor", e.target.value)}
          className="border border-border rounded-md outline-none px-2 py-1.5 cursor-pointer bg-white"
        >
          <option value="">All Vendors</option>
          {vendors.map((vendor) => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>
      )}

      {/* ===== Status Filter ===== */}
      {typeof filterStatus !== "undefined" && (
        <select
          value={filterStatus || ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="border border-border rounded-md outline-none px-2 py-1.5 cursor-pointer bg-white"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      )}

      {/* ===== Per Page Selector ===== */}
      <select
        value={perPage}
        onChange={onPerPageChange}
        className="border border-border rounded-md outline-none px-2 py-1.5 cursor-pointer bg-white"
      >
        {[5, 10, 20, 50].map((num) => (
          <option key={num} value={num}>
            Show {num}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
