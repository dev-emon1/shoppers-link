import React from "react";
import { Link } from "react-router-dom";

const IconButton = ({
  link,
  onClick,
  icon: Icon,
  bgColor = "bg-gray-500",
  hoverBgColor = "bg-gray-600",
  size = "w-8 h-8",
  title = "",
}) => {
  const baseClasses = `flex items-center justify-center rounded-md ${bgColor} hover:${hoverBgColor} transition-colors`;

  // Render as Link if 'link' is provided
  if (link) {
    return (
      <Link to={link} className={`${baseClasses} ${size}`} title={title}>
        <Icon className="text-white" size={20} />
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${size}`} title={title}>
      <Icon className="text-white" size={20} />
    </button>
  );
};

export default IconButton;
