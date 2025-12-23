import React from "react";

const Badge = ({ data }) => {
  return (
    <>
      {data?.badge && (
        <span
          className={`absolute top-3 left-3 z-20 text-xs font-semibold text-white px-3 py-1 rounded-md ${
            product.badge === "New" ? "bg-green" : "bg-red"
          }`}
        >
          {product.badge}
        </span>
      )}
    </>
  );
};

export default Badge;
