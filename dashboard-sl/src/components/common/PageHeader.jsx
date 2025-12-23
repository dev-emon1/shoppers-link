import React from "react";
import Heading from "./Heading";
import { Search } from "lucide-react";

const PageHeader = ({
  title,
  subtitle = "",
  searchTerm = "",
  onSearch,
  onAddClick,
  addLabel,
  placeholderText,
  showSearch = true,
  showAddButton = true,
  rightActions = null,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 bg-white p-4 rounded-md shadow-sm gap-3">
      {/* ===== Left Section ===== */}
      <div>
        <Heading title={title} />
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      {/* ===== Right Section ===== */}
      <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
        {/* Search */}
        {showSearch && (
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={
                placeholderText ||
                `Search by ${title.toLowerCase().replace(/s$/, "")} name`
              }
              value={searchTerm}
              onChange={onSearch}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-main outline-none placeholder:text-gray-400"
            />
            <Search
              size={16}
              className="absolute left-2.5 top-2.5 text-gray-400"
            />
          </div>
        )}

        {rightActions && (
          <div className="flex items-center gap-2">{rightActions}</div>
        )}

        {showAddButton && addLabel && (
          <button
            onClick={onAddClick}
            className="bg-main hover:bg-mainHover text-white text-sm font-medium py-1.5 px-4 rounded-md transition-all duration-150 whitespace-nowrap"
          >
            {addLabel || `Add ${title}`}
          </button>
        )}

      </div>
    </div>
  );
};

export default PageHeader;
