"use client";
import React from "react";

export default function ProductDescription({ text }) {
  if (!text) return null;

  // Product long_description may contain HTML from backend
  return (
    <div className="bg-white border border-border p-6">
      <h3 className="text-lg font-semibold mb-3">Product Description</h3>
      <div
        className="text-sm leading-relaxed text-muted-foreground prose prose-sm"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}
