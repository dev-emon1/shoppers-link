import React, { useState, useMemo } from "react";

const Table = ({
  columns = [],
  data = [],
  page = 1,
  perPage = 10,
  enableCheckbox = false,
  onSelectAll,
  onSelectRow,
  showFooter = false,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedRows, setSelectedRows] = useState([]);

  // ==== Sorting Logic ====
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [data, sortConfig]);

  // ==== Handle Sorting ====
  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  // ==== Handle Selection ====
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const ids = checked ? data.map((d) => d._id || d.id) : [];
    setSelectedRows(ids);
    onSelectAll && onSelectAll(ids);
  };

  const handleRowSelect = (id) => {
    const updated = selectedRows.includes(id)
      ? selectedRows.filter((r) => r !== id)
      : [...selectedRows, id];
    setSelectedRows(updated);
    onSelectRow && onSelectRow(updated);
  };

  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      <table className="w-full text-xs md:text-sm text-left text-black uppercase">
        {/* ===== Table Head ===== */}
        <thead className="text-sm text-black uppercase border-b border-gray-300">
          <tr>
            {enableCheckbox && (
              <th className="py-3 px-4 w-4">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedRows.length === data.length && data.length > 0
                  }
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3 px-4 cursor-pointer select-none ${
                  col.className || ""
                }`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span className="text-xs text-gray-500">
                      {sortConfig.key === col.key
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : "⇅"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ===== Table Body ===== */}
        <tbody>
          {sortedData.length ? (
            sortedData.map((item, i) => (
              <tr
                key={item._id || i}
                className={`border-b border-gray-200 hover:bg-gray-100 transition-all ${
                  selectedRows.includes(item._id || item.id) ? "bg-main/5" : ""
                }`}
              >
                {enableCheckbox && (
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item._id || item.id)}
                      onChange={() => handleRowSelect(item._id || item.id)}
                    />
                  </td>
                )}

                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-2 px-4 ${col.align || ""} ${
                      col.className || ""
                    }`}
                    style={{ width: col.width || "auto" }}
                  >
                    {col.render
                      ? col.render(item, i, page, perPage)
                      : item[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (enableCheckbox ? 1 : 0)}
                className="text-center py-6 text-gray-500"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>

        {/* ===== Optional Footer ===== */}
        {showFooter && (
          <tfoot>
            <tr>
              <td
                colSpan={columns.length + (enableCheckbox ? 1 : 0)}
                className="text-right py-2 px-4 text-xs text-gray-600 bg-gray-50"
              >
                Showing {data.length} of {page * perPage} items
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default Table;
