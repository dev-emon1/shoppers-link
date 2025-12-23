import React from "react";
import { CiSearch } from "react-icons/ci";

const SearchInput = ({ placeholderText }) => {
  return (
    <div className="flex relative items-center gap-2">
      <input
        type="text"
        placeholder={placeholderText}
        className={`hidden sm:block w-full outline-none p-2 rounded placeholder:text-gray-400 bg-gray-100 focus:border-main transition-colors duration-150 focus:outline-none pr-10`}
      />
      <span className="absolute right-2.5 text-gray-400 cursor-pointer hidden sm:block">
        <CiSearch className="w-6 h-6" />
      </span>
    </div>
  );
};

export default SearchInput;
