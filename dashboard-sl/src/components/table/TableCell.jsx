import React, { memo } from "react";

const TableCell = memo(({ children, className = "" }) => {
  return (
    <td className={`py-3 px-4 whitespace-nowrap ${className}`}>{children}</td>
  );
});

export default TableCell;
