"use client";
import React from "react";
import { smartColor } from "./smartColor";

export default function ColorSwatch({
  value,
  selected = false,
  onClick = () => {},
  size = 30,
}) {
  const bg = smartColor(value);
  const needsBorder = bg === "#000000" || bg === "#101010";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group "
      aria-label={`Select color ${value}`}
    >
      <div
        className={`rounded-full border-2 transition-all duration-200 shadow-sm ${
          selected
            ? "ring-4 ring-main/30 border-main scale-110"
            : "border-gray-300 hover:border-gray-400"
        }`}
        style={{
          width: size,
          height: size,
          backgroundColor: bg,
        }}
      />

      <span
        className={`text-xs font-medium transition-colors ${
          selected ? "text-main" : "text-gray-600 group-hover:text-gray-800"
        }`}
      >
        {value}
      </span>
    </button>
  );
}
